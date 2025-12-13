// Background service worker for Kintsugi Security Scanner - Deep Scanning

let scanStatus = {
  isScanning: false,
  progress: 0,
  currentZap: '',
  results: null,
  error: null
};

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startScan') {
    startDeepScan().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }

  if (request.action === 'getScanStatus') {
    sendResponse({
      status: scanStatus.isScanning ? 'scanning' :
              scanStatus.error ? 'error' :
              scanStatus.results ? 'complete' : 'idle',
      progress: scanStatus.progress,
      currentZap: scanStatus.currentZap,
      results: scanStatus.results,
      error: scanStatus.error
    });
    return true;
  }
});

// Start deep scan process
async function startDeepScan() {
  scanStatus = {
    isScanning: true,
    progress: 0,
    currentZap: 'Initializing...',
    results: null,
    error: null
  };

  try {
    // Get current tab (should be Zapier dashboard)
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url.includes('zapier.com/app')) {
      throw new Error('Please navigate to your Zapier dashboard');
    }

    // Step 1: Extract all Zap links from dashboard
    scanStatus.currentZap = 'Finding Zaps...';
    const zapList = await extractZapList(tab.id);

    if (!zapList || zapList.length === 0) {
      scanStatus.results = {
        zapsScanned: 0,
        issues: [{
          severity: 'INFO',
          category: 'Scan Status',
          title: 'No Zaps Found',
          description: 'No Zaps found on dashboard. Make sure you have Zaps created.',
          zapName: 'N/A'
        }]
      };
      scanStatus.isScanning = false;
      return;
    }

    // Step 2: Scan each Zap
    const allIssues = [];
    let scannedCount = 0;

    for (let i = 0; i < zapList.length; i++) {
      const zap = zapList[i];
      scanStatus.progress = Math.round((i / zapList.length) * 100);
      scanStatus.currentZap = `Scanning: ${zap.name}`;

      try {
        const zapIssues = await scanZap(zap);
        allIssues.push(...zapIssues);
        scannedCount++;
      } catch (error) {
        console.error(`Error scanning zap ${zap.name}:`, error);
        allIssues.push({
          severity: 'INFO',
          category: 'Scan Error',
          title: 'Could Not Scan Zap',
          description: `Error scanning this Zap: ${error.message}`,
          zapName: zap.name
        });
      }

      // Small delay between Zaps
      await sleep(500);
    }

    // Step 3: Return results
    scanStatus.results = {
      zapsScanned: scannedCount,
      issues: allIssues,
      timestamp: new Date().toISOString()
    };
    scanStatus.isScanning = false;
    scanStatus.progress = 100;

  } catch (error) {
    scanStatus.isScanning = false;
    scanStatus.error = error.message;
    throw error;
  }
}

// Extract list of Zaps from dashboard
async function extractZapList(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    function: () => {
      const zaps = [];

      // Find all Zap cards
      const zapCards = document.querySelectorAll('[data-testid="AssetItem-title"]');

      zapCards.forEach((card, index) => {
        const zapName = card.innerText || card.textContent || `Zap ${index + 1}`;

        // Find the edit link for this Zap
        const parent = card.closest('a') ||
                      card.closest('div')?.querySelector('a[href*="/edit"]') ||
                      card.parentElement?.querySelector('a[href*="/edit"]');

        let editUrl = null;
        if (parent && parent.href && parent.href.includes('/edit')) {
          editUrl = parent.href;
        } else {
          // Try to find any link in the parent row
          const row = card.closest('tr') || card.closest('[class*="row"]') || card.closest('div[class*="AssetItem"]');
          const link = row?.querySelector('a[href*="/edit"]');
          if (link) editUrl = link.href;
        }

        zaps.push({
          name: zapName.trim(),
          editUrl: editUrl,
          index: index
        });
      });

      return zaps;
    }
  });

  return results[0]?.result || [];
}

// Scan an individual Zap
async function scanZap(zap) {
  // If no edit URL found, just check the name for PII
  if (!zap.editUrl) {
    return checkZapNameOnly(zap.name);
  }

  try {
    // Open Zap in new tab
    const tab = await chrome.tabs.create({
      url: zap.editUrl,
      active: false // Open in background
    });

    // Wait for page to load
    await waitForTabLoad(tab.id);

    // Give page extra time to render
    await sleep(2000);

    // Scan the Zap editor page
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scanZapEditor,
      args: [zap.name]
    });

    // Close the tab
    await chrome.tabs.remove(tab.id);

    return results[0]?.result || [];

  } catch (error) {
    console.error('Error scanning zap:', error);
    return checkZapNameOnly(zap.name);
  }
}

// Scan Zap editor page - This runs in the context of the Zap editor
function scanZapEditor(zapName) {
  const issues = [];
  const foundIssues = new Set(); // Track unique issues to avoid duplicates

  try {
    // Check for Catch Hook webhooks - use correct selector
    const stepNodes = document.querySelectorAll('[data-testid^="step-node-"], [class*="step"]');

    stepNodes.forEach(element => {
      const text = element.innerText || element.textContent || '';

      // Look for Catch Hook
      if ((text.toLowerCase().includes('catch hook') && text.toLowerCase().includes('webhooks by zapier')) ||
          text.toLowerCase().includes('catch hook')) {

        // Check if there's authentication configured
        const hasAuth = checkWebhookAuth(element);

        if (!hasAuth) {
          // Create unique key to avoid duplicate reporting
          const issueKey = 'webhook-no-auth';
          if (!foundIssues.has(issueKey)) {
            foundIssues.add(issueKey);
            issues.push({
              severity: 'HIGH',
              category: 'Insecure Webhook',
              title: 'Catch Hook Without Authentication',
              description: 'This Zap uses a Catch Hook webhook with no authentication. Anyone with the URL can trigger it.',
              zapName: zapName,
              fix: 'Add Query String or Header authentication to your webhook'
            });
          }
        }
      }
    });

    // Check for Code steps with potential API keys
    const codeSteps = document.querySelectorAll('[data-testid*="code"], [class*="code"]');

    codeSteps.forEach(element => {
      const code = element.innerText || element.textContent || '';

      // Simple API key patterns
      if (code.match(/api[_-]?key\s*[=:]\s*['"][^'"]+['"]/i) ||
          code.match(/token\s*[=:]\s*['"][^'"]+['"]/i) ||
          code.match(/secret\s*[=:]\s*['"][^'"]+['"]/i)) {

        // Avoid duplicate API key reports
        const issueKey = 'hardcoded-api-key';
        if (!foundIssues.has(issueKey)) {
          foundIssues.add(issueKey);
          issues.push({
            severity: 'CRITICAL',
            category: 'Credential Exposure',
            title: 'Hardcoded API Key in Code',
            description: 'Found what appears to be a hardcoded API key or secret in a Code step.',
            zapName: zapName,
            fix: 'Use Zapier Secret Storage instead of hardcoding credentials'
          });
        }
      }
    });

    // Check Zap name for PII
    const piiIssues = checkForPII(zapName);
    issues.push(...piiIssues);

  } catch (error) {
    console.error('Error in scanZapEditor:', error);
  }

  return issues;

  // Helper function to check webhook authentication
  function checkWebhookAuth(element) {
    // Look for authentication indicators
    const parent = element.closest('div[class*="step"]') || element.parentElement;
    const allText = parent?.innerText || '';

    // Check for auth keywords
    if (allText.toLowerCase().includes('query string') ||
        allText.toLowerCase().includes('header') ||
        allText.toLowerCase().includes('authentication') ||
        allText.toLowerCase().includes('secret')) {
      return true; // Likely has auth
    }

    return false; // No auth found
  }

  // Check for PII in text
  function checkForPII(text) {
    const issues = [];

    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailPattern);
    if (emails) {
      issues.push({
        severity: 'MEDIUM',
        category: 'Privacy Risk',
        title: 'Email in Zap Name',
        description: `Contains email: ${emails[0]}`,
        zapName: zapName,
        fix: 'Rename Zap to remove email'
      });
    }

    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    const phones = text.match(phonePattern);
    if (phones) {
      issues.push({
        severity: 'MEDIUM',
        category: 'Privacy Risk',
        title: 'Phone Number in Zap Name',
        description: `Contains phone: ${phones[0]}`,
        zapName: zapName,
        fix: 'Rename Zap to remove phone number'
      });
    }

    return issues;
  }
}

// Check only Zap name (fallback when can't open editor)
function checkZapNameOnly(zapName) {
  const issues = [];

  // Check for PII
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  if (zapName.match(emailPattern)) {
    issues.push({
      severity: 'MEDIUM',
      category: 'Privacy Risk',
      title: 'Email in Zap Name',
      description: `Zap name contains email address`,
      zapName: zapName,
      fix: 'Rename Zap to remove email'
    });
  }

  // Check for webhook keywords
  if (zapName.toLowerCase().includes('webhook') ||
      zapName.toLowerCase().includes('catch') ||
      zapName.toLowerCase().includes('hook')) {
    issues.push({
      severity: 'INFO',
      category: 'Manual Review',
      title: 'Possible Webhook - Manual Review Needed',
      description: 'Zap name suggests it uses webhooks. Could not auto-scan - please verify authentication manually.',
      zapName: zapName,
      fix: 'Open Zap and check if webhooks have authentication'
    });
  }

  return issues;
}

// Wait for tab to finish loading
function waitForTabLoad(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    });
  });
}

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
