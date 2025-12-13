// Popup controller for Kintsugi Security Scanner

document.addEventListener('DOMContentLoaded', () => {
  const scanBtn = document.getElementById('scan-btn');
  const resultsDiv = document.getElementById('results');
  const statusDiv = document.getElementById('status');
  const errorDiv = document.getElementById('error');
  const exportBtn = document.getElementById('export-btn');

  // Check if we're on Zapier
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (!currentTab.url.includes('zapier.com')) {
      showError('Please navigate to zapier.com to use this scanner');
      scanBtn.disabled = true;
    }
  });

  // Handle scan button click
  scanBtn.addEventListener('click', async () => {
    try {
      scanBtn.disabled = true;
      scanBtn.innerHTML = '<span class="spinner"></span> <span>Scanning...</span>';
      statusDiv.querySelector('.status-message').textContent = 'Scanning your Zaps...';

      // Send message to background script to start scan
      chrome.runtime.sendMessage({ action: 'startScan' }, (response) => {
        if (response.success) {
          // Poll for scan results
          pollForResults();
        } else {
          showError(response.error || 'Failed to start scan');
          resetButton();
        }
      });
    } catch (error) {
      showError(error.message);
      resetButton();
    }
  });

  // Poll for scan results
  function pollForResults() {
    const interval = setInterval(() => {
      chrome.runtime.sendMessage({ action: 'getScanStatus' }, (response) => {
        if (response.status === 'complete') {
          clearInterval(interval);
          displayResults(response.results);
          resetButton();
        } else if (response.status === 'error') {
          clearInterval(interval);
          showError(response.error);
          resetButton();
        } else {
          // Update progress
          const zapName = response.currentZap || 'Scanning...';
          statusDiv.querySelector('.status-message').textContent =
            `${zapName} (${response.progress || 0}%)`;
        }
      });
    }, 1000);
  }

  // Display scan results
  function displayResults(results) {
    statusDiv.classList.add('hidden');
    resultsDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');

    // Update summary
    document.getElementById('zaps-count').textContent = results.zapsScanned || 0;
    document.getElementById('issues-count').textContent = results.issues.length || 0;

    // Display issues
    const issuesList = document.getElementById('issues-list');
    issuesList.innerHTML = '';

    if (results.issues.length === 0) {
      issuesList.innerHTML = `
        <div class="issue-card">
          <div class="issue-title" style="text-align: center; color: #4CAF50;">
            🎉 No security issues found!
          </div>
          <div class="issue-description" style="text-align: center; margin-top: 12px;">
            Your Zapier workspace looks secure. Keep following security best practices!
          </div>
        </div>
      `;
    } else {
      results.issues.forEach(issue => {
        const issueCard = createIssueCard(issue);
        issuesList.appendChild(issueCard);
      });
    }

    // Store results for export
    window.scanResults = results;
  }

  // Create issue card element
  function createIssueCard(issue) {
    const card = document.createElement('div');
    card.className = `issue-card severity-${issue.severity.toLowerCase()}`;

    card.innerHTML = `
      <div class="issue-header">
        <div class="issue-title">${issue.title}</div>
        <span class="issue-severity ${issue.severity.toLowerCase()}">${issue.severity}</span>
      </div>
      <div class="issue-zap">📍 ${issue.zapName}</div>
      <div class="issue-description">${issue.description}</div>
      ${issue.fix ? `<div class="issue-fix"><strong>Fix:</strong> ${issue.fix}</div>` : ''}
    `;

    return card;
  }

  // Export results
  exportBtn.addEventListener('click', () => {
    if (!window.scanResults) return;

    const report = generateReport(window.scanResults);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `kintsugi-security-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  });

  // Generate text report
  function generateReport(results) {
    let report = `KINTSUGI SECURITY SCAN REPORT\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `\n`;
    report += `${'='.repeat(60)}\n`;
    report += `\n`;
    report += `SUMMARY\n`;
    report += `Zaps Scanned: ${results.zapsScanned}\n`;
    report += `Issues Found: ${results.issues.length}\n`;
    report += `\n`;

    if (results.issues.length > 0) {
      report += `${'='.repeat(60)}\n`;
      report += `\n`;
      report += `ISSUES FOUND\n`;
      report += `\n`;

      results.issues.forEach((issue, index) => {
        report += `${index + 1}. ${issue.title}\n`;
        report += `   Severity: ${issue.severity}\n`;
        report += `   Zap: ${issue.zapName}\n`;
        report += `   Description: ${issue.description}\n`;
        if (issue.fix) {
          report += `   Fix: ${issue.fix}\n`;
        }
        report += `\n`;
      });
    }

    report += `${'='.repeat(60)}\n`;
    report += `\n`;
    report += `Generated by Kintsugi Security Scanner\n`;
    report += `https://github.com/peanutlife/kintsugi\n`;

    return report;
  }

  // Show error message
  function showError(message) {
    errorDiv.classList.remove('hidden');
    errorDiv.querySelector('.error-message').textContent = message;
  }

  // Reset scan button
  function resetButton() {
    scanBtn.disabled = false;
    scanBtn.innerHTML = '<span class="btn-icon">🔍</span><span class="btn-text">Scan Workspace</span>';
  }
});
