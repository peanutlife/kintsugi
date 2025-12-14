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
              description: 'This Zap uses a Catch Hook webhook with no authentication. Anyone with the URL can trigger it and inject arbitrary data into your workflow.',
              zapName: zapName,
              fix: 'STEP 1: Open this Zap in editor. STEP 2: Click on the Catch Hook trigger step. STEP 3: Scroll to "Pick off a Child Key" section and add a field like "secret". STEP 4: In your webhook sender, add ?secret=YOUR_RANDOM_SECRET to the URL. STEP 5: Add a Filter step after the trigger: "Only continue if secret exactly matches YOUR_RANDOM_SECRET". STEP 6: Test the webhook. Generate a strong random secret at: https://www.random.org/strings/ (20+ characters recommended). Alternative: Use Webhooks by Zapier "Catch Raw Hook" with custom validation code.'
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
            description: 'Found what appears to be a hardcoded API key, token, or secret in a Code step. This is visible to all workspace members and stored in Zap history for 30+ days.',
            zapName: zapName,
            fix: 'IMMEDIATE ACTION REQUIRED: Rotate this API key/token immediately at your service provider. Then fix properly: STEP 1: Create a "Storage by Zapier" Zap (can be same Zap or separate). STEP 2: Add "Storage by Zapier" action → "Set Value". STEP 3: Set key name (e.g., "stripe_api_key") and paste your NEW API key as value. STEP 4: In your Code step, add an input field for the API key. STEP 5: Map that input field to Storage → "Get Value" → use your key name. STEP 6: In code, reference via inputData.apiKey instead of hardcoding. STEP 7: Delete the old Code step version from Zap history. Example: Instead of const key="sk_live_123", use const key=inputData.apiKey and map apiKey input to Storage value. Never commit code with real keys to version control.'
          });
        }
      }
    });

    // Check for Command Injection in Code steps
    const allCodeSteps = document.querySelectorAll('[data-testid*="code"], [class*="code"]');

    allCodeSteps.forEach(element => {
      const code = element.innerText || element.textContent || '';

      // Dangerous patterns for command injection
      const dangerousPatterns = [
        /eval\s*\(/i,                           // eval(
        /exec\s*\(/i,                           // exec(
        /execFile\s*\(/i,                       // execFile(
        /spawn\s*\(/i,                          // spawn(
        /execSync\s*\(/i,                       // execSync(
        /child_process/i,                       // require('child_process')
        /os\.system\s*\(/i,                     // os.system(
        /subprocess\.call/i,                    // subprocess.call
        /subprocess\.Popen/i,                   // subprocess.Popen
        /shell\s*=\s*True/i,                    // shell=True
        /Function\s*\(\s*['"`]/i,               // new Function(
        /setTimeout\s*\(\s*['"`]/i,             // setTimeout with string
        /setInterval\s*\(\s*['"`]/i             // setInterval with string
      ];

      let foundDangerous = false;
      let matchedPattern = '';

      for (const pattern of dangerousPatterns) {
        const match = code.match(pattern);
        if (match) {
          foundDangerous = true;
          matchedPattern = match[0];
          break;
        }
      }

      if (foundDangerous) {
        const issueKey = 'command-injection-risk';
        if (!foundIssues.has(issueKey)) {
          foundIssues.add(issueKey);
          issues.push({
            severity: 'CRITICAL',
            category: 'Code Injection Risk',
            title: 'Dangerous Code Execution Detected',
            description: `Code step contains dangerous function "${matchedPattern}" which can execute arbitrary system commands. If user input reaches this code, an attacker could gain complete system control, read sensitive files, or compromise connected services.`,
            zapName: zapName,
            fix: 'IMMEDIATE REVIEW REQUIRED: STEP 1: Open this Zap and locate the Code step. STEP 2: Find the dangerous code pattern. STEP 3: Ask: Does this code use ANY user-controlled input (webhook data, form submissions, etc.)? If YES - CRITICAL FIX NEEDED. If NO - Still risky, consider alternatives. CRITICAL FIX: NEVER use eval(), exec(), or system commands with user input. Instead: (JavaScript) Replace eval() with JSON.parse() for data, or safe calculation libraries. Remove exec() entirely - use built-in functions or safe APIs. (Python) Replace os.system() with specific libraries (requests for HTTP, not curl). Never use subprocess with shell=True. STEP 4: Validate and sanitize ALL inputs before any processing. STEP 5: Use allowlists, not blocklists (e.g., if expecting number, check type === "number"). Example UNSAFE: eval(inputData.formula) // Attacker sends: formula=";import os;os.system(\'rm -rf /\')" Example SAFE: const result = math.evaluate(inputData.formula, {restricted: true}). Test thoroughly after changes.'
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
        title: 'Email Address in Zap Name',
        description: `Zap name contains email address: ${emails[0]}. This is visible to ALL workspace members, appears in search results, and may violate GDPR/privacy regulations.`,
        zapName: zapName,
        fix: 'STEP 1: Click the gear icon next to this Zap name. STEP 2: Click "Rename". STEP 3: Use a generic description instead. GOOD examples: "Send welcome email to new customers", "Notify team of form submissions". BAD examples: Any name with actual email addresses, names, or customer data. STEP 4: Click Save. Why this matters: Zap names are logged, searchable, and visible to all team members. PII in names can violate data protection laws (GDPR, CCPA) and expose customer information unnecessarily.'
      });
    }

    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    const phones = text.match(phonePattern);
    if (phones) {
      issues.push({
        severity: 'MEDIUM',
        category: 'Privacy Risk',
        title: 'Phone Number in Zap Name',
        description: `Zap name contains phone number: ${phones[0]}. This personally identifiable information is visible to all workspace members and stored in searchable logs.`,
        zapName: zapName,
        fix: 'STEP 1: Click the gear icon next to this Zap. STEP 2: Click "Rename". STEP 3: Replace with generic description (e.g., "Send SMS to customers" instead of "Send SMS to 555-123-4567"). STEP 4: Save changes. Privacy consideration: Phone numbers are PII under GDPR and CCPA. Exposing them in Zap names increases risk of data breach and regulatory non-compliance. Use role-based or category-based naming instead.'
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
  const emails = zapName.match(emailPattern);
  if (emails) {
    issues.push({
      severity: 'MEDIUM',
      category: 'Privacy Risk',
      title: 'Email Address in Zap Name',
      description: `Zap name contains email address: ${emails[0]}. This is visible to ALL workspace members, appears in search results, and may violate GDPR/privacy regulations.`,
      zapName: zapName,
      fix: 'STEP 1: Click the gear icon next to this Zap name. STEP 2: Click "Rename". STEP 3: Use a generic description instead. GOOD examples: "Send welcome email to new customers", "Notify team of form submissions". BAD examples: Any name with actual email addresses, names, or customer data. STEP 4: Click Save. Why this matters: Zap names are logged, searchable, and visible to all team members. PII in names can violate data protection laws (GDPR, CCPA) and expose customer information unnecessarily.'
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
      description: 'Zap name suggests it uses webhooks. Scanner could not open this Zap automatically - please verify webhook security manually.',
      zapName: zapName,
      fix: 'MANUAL CHECK REQUIRED: STEP 1: Open this Zap in the editor. STEP 2: Look for "Webhooks by Zapier" trigger with "Catch Hook". STEP 3: Check the webhook URL - does it have authentication? STEP 4: Secure webhook: Add a Filter step after trigger checking for a secret parameter (e.g., "Only continue if query_secret equals YOUR_RANDOM_VALUE"). STEP 5: Update your webhook sender to include ?secret=YOUR_RANDOM_VALUE in the URL. Without authentication, anyone who finds the webhook URL can trigger your Zap and inject fake data.'
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
