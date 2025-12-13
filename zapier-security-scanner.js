(function() {
  'use strict';

  console.log('%c🔒 Zapier Security Scanner v1.0', 'font-size: 20px; font-weight: bold; color: #4CAF50;');
  console.log('%cScanning your Zapier workspace for security issues...', 'font-size: 14px; color: #666;');
  console.log('');

  const issues = [];
  let zapCount = 0;

  // Security patterns to detect
  const patterns = {
    apiKeys: [
      /api[_-]?key[=:]\s*['"]?([a-zA-Z0-9_\-]{20,})/gi,
      /sk_live_[a-zA-Z0-9]{20,}/gi,
      /sk_test_[a-zA-Z0-9]{20,}/gi,
      /token[=:]\s*['"]?([a-zA-Z0-9_\-]{20,})/gi,
      /bearer\s+[a-zA-Z0-9_\-\.]{20,}/gi,
      /[a-f0-9]{32}/gi, // MD5-like hashes
    ],
    pii: [
      // Removed name detection - too many false positives
      // Only detect high-confidence PII: emails, phones, SSNs
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Emails
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers (format: 555-123-4567)
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN (format: 123-45-6789)
    ],
    webhooks: [
      /hooks\.zapier\.com\/hooks\/catch\/\d+\/[a-zA-Z0-9]+/gi,
      /webhook/gi,
    ]
  };

  // Helper function to add an issue
  function addIssue(severity, category, title, description, zapName = null) {
    issues.push({
      severity,
      category,
      title,
      description,
      zapName: zapName || 'N/A'
    });
  }

  // Scan for Zap cards (main dashboard)
  function scanZapCards() {
    // Try multiple selectors for different Zapier UI versions
    let zapCards = document.querySelectorAll('[data-testid="AssetItem-title"]'); // New UI

    if (zapCards.length === 0) {
      // Fallback to older selectors
      zapCards = document.querySelectorAll('[data-test="zap-title"], [class*="zap-card"], [class*="ZapCard"]');
    }

    if (zapCards.length === 0) {
      console.warn('⚠️ No Zap cards found. Make sure you are on the Zapier dashboard page with your Zaps visible.');
      console.warn('💡 Navigate to: https://zapier.com/app/zaps');
      return 0;
    }

    zapCards.forEach(card => {
      zapCount++;
      // For new UI, the card itself might be the title element
      const zapNameElement = card.dataset?.testid === 'AssetItem-title' ? card :
                            card.querySelector('[data-testid="AssetItem-title"]') ||
                            card.querySelector('[data-test="zap-title"]') ||
                            card.querySelector('h3') ||
                            card.querySelector('[class*="title"]') ||
                            card;

      const zapName = zapNameElement?.innerText || zapNameElement?.textContent || 'Unknown Zap';
      const cardHtml = card.innerHTML || card.outerHTML || '';

      // Check for Catch Hook webhooks
      if (zapName.toLowerCase().includes('catch') ||
          zapName.toLowerCase().includes('webhook') ||
          cardHtml.toLowerCase().includes('catch hook')) {
        addIssue(
          'HIGH',
          'Insecure Webhook',
          'Potentially Insecure Catch Hook Webhook',
          'This Zap appears to use a Catch Hook webhook, which has no authentication by default. Anyone with the webhook URL can trigger this Zap and inject data.',
          zapName
        );
      }

      // Check for PII in Zap name
      patterns.pii.forEach(pattern => {
        const matches = zapName.match(pattern);
        if (matches && matches.length > 0) {
          addIssue(
            'MEDIUM',
            'Data Exposure',
            'Potential PII in Zap Name',
            `Zap name contains what appears to be personally identifiable information: "${matches[0]}". This is visible to all workspace members.`,
            zapName
          );
        }
      });

      // Check for API keys or tokens in visible text
      patterns.apiKeys.forEach(pattern => {
        const matches = cardHtml.match(pattern);
        if (matches && matches.length > 0) {
          const snippet = matches[0].substring(0, 30) + '...';
          addIssue(
            'CRITICAL',
            'Credential Exposure',
            'Potential API Key or Token Found',
            `Found what appears to be an API key or token: "${snippet}". If this is visible in the UI, it may be exposed to all workspace members.`,
            zapName
          );
        }
      });
    });

    return zapCards.length;
  }

  // Scan page for webhook URLs
  function scanForWebhookURLs() {
    const bodyText = document.body.innerText;
    const webhookMatches = bodyText.match(/https:\/\/hooks\.zapier\.com\/hooks\/catch\/\d+\/[a-zA-Z0-9]+/gi);

    if (webhookMatches && webhookMatches.length > 0) {
      const uniqueWebhooks = [...new Set(webhookMatches)];
      uniqueWebhooks.forEach(url => {
        addIssue(
          'HIGH',
          'Insecure Webhook',
          'Public Webhook URL Detected',
          `Found exposed webhook URL: ${url}. Verify this webhook has proper authentication enabled.`,
          'Page Content'
        );
      });
    }
  }

  // Scan for overly broad permissions (look for permission indicators in UI)
  function scanForPermissions() {
    const permissionText = document.body.innerText.toLowerCase();

    if (permissionText.includes('full access') ||
        permissionText.includes('all files') ||
        permissionText.includes('complete access')) {
      addIssue(
        'MEDIUM',
        'Over-Permissions',
        'Potential Over-Permissioned Connection',
        'Detected text indicating "full access" or similar broad permissions. Review your app connections to ensure they follow the principle of least privilege.',
        'App Connections'
      );
    }
  }

  // Run all scans
  console.log('🔍 Scanning...');
  const cardsFound = scanZapCards();
  scanForWebhookURLs();
  scanForPermissions();

  // Generate report
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
  console.log('%c📊 SECURITY SCAN REPORT', 'font-size: 18px; font-weight: bold; color: #2196F3;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
  console.log('');
  console.log(`✅ Scanned ${cardsFound} visible Zaps`);
  console.log(`⚠️  Found ${issues.length} potential security issues`);
  console.log('');

  if (issues.length === 0) {
    console.log('%c🎉 Great job! No obvious security issues found in visible Zaps.', 'color: #4CAF50; font-weight: bold;');
    console.log('');
    console.log('💡 Tips for staying secure:');
    console.log('   • Regularly review your app connections');
    console.log('   • Use Secret Storage for API keys when possible');
    console.log('   • Enable webhook authentication');
    console.log('   • Follow the principle of least privilege');
  } else {
    // Group issues by severity
    const critical = issues.filter(i => i.severity === 'CRITICAL');
    const high = issues.filter(i => i.severity === 'HIGH');
    const medium = issues.filter(i => i.severity === 'MEDIUM');

    if (critical.length > 0) {
      console.log('%c🚨 CRITICAL ISSUES (' + critical.length + ')', 'color: #F44336; font-weight: bold; font-size: 16px;');
      critical.forEach((issue, idx) => {
        console.log(`%c${idx + 1}. ${issue.title}`, 'color: #F44336; font-weight: bold;');
        console.log(`   Zap: ${issue.zapName}`);
        console.log(`   ${issue.description}`);
        console.log('');
      });
    }

    if (high.length > 0) {
      console.log('%c⚠️  HIGH PRIORITY ISSUES (' + high.length + ')', 'color: #FF9800; font-weight: bold; font-size: 16px;');
      high.forEach((issue, idx) => {
        console.log(`%c${idx + 1}. ${issue.title}`, 'color: #FF9800; font-weight: bold;');
        console.log(`   Zap: ${issue.zapName}`);
        console.log(`   ${issue.description}`);
        console.log('');
      });
    }

    if (medium.length > 0) {
      console.log('%c📋 MEDIUM PRIORITY ISSUES (' + medium.length + ')', 'color: #FFC107; font-weight: bold; font-size: 16px;');
      medium.forEach((issue, idx) => {
        console.log(`%c${idx + 1}. ${issue.title}`, 'color: #FFC107; font-weight: bold;');
        console.log(`   Zap: ${issue.zapName}`);
        console.log(`   ${issue.description}`);
        console.log('');
      });
    }
  }

  // Display summary table
  if (issues.length > 0) {
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
    console.log('%c📈 ISSUES SUMMARY TABLE', 'font-weight: bold; font-size: 14px;');
    console.table(issues.map(i => ({
      'Severity': i.severity,
      'Category': i.category,
      'Issue': i.title,
      'Zap': i.zapName.substring(0, 40)
    })));
  }

  // Recommendations
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
  console.log('%c💡 RECOMMENDATIONS', 'font-weight: bold; font-size: 16px; color: #2196F3;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
  console.log('');
  console.log('1. 🔐 Use Zapier Secret Storage for API keys instead of hardcoding them');
  console.log('2. 🔒 Enable webhook authentication (use Query String or Header auth)');
  console.log('3. 👥 Review app permissions - only grant minimum required access');
  console.log('4. 🏷️  Avoid putting sensitive data in Zap names or descriptions');
  console.log('5. 🔄 Regularly audit your Zaps for security best practices');
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
  console.log('');
  console.log('%cNeed help fixing these issues? Visit: https://zapier.com/help/security', 'color: #666;');
  console.log('%cFor a more comprehensive scan, check out our full audit service!', 'color: #666; font-style: italic;');
  console.log('');
  console.log('%c🔒 Stay secure! 🔒', 'font-size: 16px; font-weight: bold; color: #4CAF50;');

  // Return issues for programmatic access
  return {
    scanSummary: {
      zapsScanned: cardsFound,
      issuesFound: issues.length,
      critical: issues.filter(i => i.severity === 'CRITICAL').length,
      high: issues.filter(i => i.severity === 'HIGH').length,
      medium: issues.filter(i => i.severity === 'MEDIUM').length,
    },
    issues: issues
  };
})();
