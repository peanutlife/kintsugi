(function() {
  'use strict';

  console.log('%c🎨 Kintsugi Security Scanner v2.0', 'font-size: 20px; font-weight: bold; color: #FF6B35;');
  console.log('%cFind the cracks in your Zapier workflows', 'font-size: 14px; color: #666; font-style: italic;');
  console.log('');

  const issues = [];
  let zapCount = 0;

  // Improved security patterns with better accuracy
  const patterns = {
    // High-confidence PII only (no false positives)
    pii: {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    },

    // Webhook patterns
    webhooks: {
      zapierHook: /hooks\.zapier\.com\/hooks\/catch\/\d+\/[a-zA-Z0-9]+/gi,
      generic: /webhook/gi,
    }
  };

  // Helper function to add an issue
  function addIssue(severity, category, title, description, zapName = null, actionable = null) {
    issues.push({
      severity,
      category,
      title,
      description,
      zapName: zapName || 'N/A',
      fix: actionable || 'Review this Zap manually'
    });
  }

  // Scan for Zap cards with improved selectors
  function scanZapCards() {
    // Try current Zapier UI selector (as of Dec 2025)
    let zapCards = document.querySelectorAll('[data-testid="AssetItem-title"]');

    if (zapCards.length === 0) {
      // Fallback selectors for older UI versions
      zapCards = document.querySelectorAll('[data-test="zap-title"], [class*="zap-card"], [class*="ZapCard"]');
    }

    if (zapCards.length === 0) {
      console.warn('%c⚠️ No Zaps found on this page', 'color: #FF6B35; font-weight: bold;');
      console.log('');
      console.log('💡 Make sure you are on: https://zapier.com/app/zaps');
      console.log('💡 If you just created Zaps, try refreshing the page');
      console.log('');
      return 0;
    }

    zapCards.forEach(card => {
      zapCount++;

      // Get Zap name with multiple fallbacks
      const zapNameElement = card.dataset?.testid === 'AssetItem-title' ? card :
                            card.querySelector('[data-testid="AssetItem-title"]') ||
                            card.querySelector('[data-test="zap-title"]') ||
                            card.querySelector('h3') ||
                            card;

      const zapName = zapNameElement?.innerText || zapNameElement?.textContent || 'Unknown Zap';

      // Get parent container for broader scanning
      const parent = card.closest('div[class*="row"]') || card.closest('tr') || card.parentElement;
      const parentText = parent?.innerText || zapName;

      // Check for PII in Zap names
      checkForPII(zapName, zapName);

      // Check for webhook keywords (guide users to check)
      checkForWebhookKeywords(zapName, zapName);
    });

    return zapCards.length;
  }

  // Check for PII with improved accuracy
  function checkForPII(text, zapName) {
    // Check for emails
    const emails = text.match(patterns.pii.email);
    if (emails && emails.length > 0) {
      addIssue(
        'MEDIUM',
        'Privacy Risk',
        'Email Address in Zap Name',
        `Contains email address: "${emails[0]}". This is visible to all workspace members and may violate privacy policies.`,
        zapName,
        'Rename Zap to remove email address'
      );
    }

    // Check for phone numbers
    const phones = text.match(patterns.pii.phone);
    if (phones && phones.length > 0) {
      addIssue(
        'MEDIUM',
        'Privacy Risk',
        'Phone Number in Zap Name',
        `Contains phone number: "${phones[0]}". This is visible to all workspace members.`,
        zapName,
        'Rename Zap to remove phone number'
      );
    }

    // Check for SSN
    const ssns = text.match(patterns.pii.ssn);
    if (ssns && ssns.length > 0) {
      addIssue(
        'HIGH',
        'Privacy Risk',
        'Social Security Number in Zap Name',
        `Contains what appears to be an SSN: "${ssns[0]}". This is a serious privacy violation.`,
        zapName,
        'Immediately rename Zap to remove SSN'
      );
    }
  }

  // Check for webhook keywords and guide users
  function checkForWebhookKeywords(text, zapName) {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('webhook') || lowerText.includes('catch') || lowerText.includes('hook')) {
      addIssue(
        'INFO',
        'Webhook Detected',
        'Zap May Use Webhooks',
        `Zap name contains webhook-related keywords. Open this Zap to verify if webhooks have proper authentication.`,
        zapName,
        'Click on Zap → Check if Catch Hook has authentication enabled'
      );
    }
  }

  // Scan entire page for exposed webhook URLs
  function scanForExposedWebhooks() {
    const bodyText = document.body.innerText;
    const webhookURLs = bodyText.match(patterns.webhooks.zapierHook);

    if (webhookURLs && webhookURLs.length > 0) {
      const uniqueWebhooks = [...new Set(webhookURLs)];
      uniqueWebhooks.forEach(url => {
        addIssue(
          'HIGH',
          'Webhook Exposure',
          'Webhook URL Visible on Page',
          `Found webhook URL: ${url}. If this is visible, verify it has authentication enabled.`,
          'Dashboard',
          'Open Zap → Add authentication (Query String or Header auth)'
        );
      });
    }
  }

  // Generate comprehensive report
  function generateReport() {
    console.log('');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
    console.log('%c📊 SECURITY SCAN REPORT', 'font-size: 18px; font-weight: bold; color: #FF6B35;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
    console.log('');
    console.log(`✅ Scanned ${zapCount} visible Zaps`);
    console.log(`${issues.length > 0 ? '⚠️' : '🎉'} Found ${issues.length} potential security issue${issues.length === 1 ? '' : 's'}`);
    console.log('');

    if (issues.length === 0) {
      console.log('%c🎉 No obvious security issues found!', 'color: #4CAF50; font-weight: bold; font-size: 16px;');
      console.log('');
      console.log('%c💡 Recommended Next Steps:', 'font-weight: bold; color: #FF6B35;');
      console.log('');
      console.log('1. Open each Zap to verify webhook authentication');
      console.log('2. Review app connection permissions (My Apps)');
      console.log('3. Check Zap history for any leaked data');
      console.log('4. Enable 2FA on your Zapier account');
      console.log('');
      console.log('%cFor a comprehensive audit, use our full checklist:', 'color: #666;');
      console.log('https://github.com/peanutlife/kintsugi');
    } else {
      // Group issues by severity
      const high = issues.filter(i => i.severity === 'HIGH');
      const medium = issues.filter(i => i.severity === 'MEDIUM');
      const info = issues.filter(i => i.severity === 'INFO');

      // Display high priority issues
      if (high.length > 0) {
        console.log('%c⚠️  HIGH PRIORITY (' + high.length + ')', 'color: #FF6B35; font-weight: bold; font-size: 16px;');
        console.log('');
        high.forEach((issue, idx) => {
          console.log(`%c${idx + 1}. ${issue.title}`, 'color: #FF6B35; font-weight: bold;');
          console.log(`   📍 Zap: ${issue.zapName}`);
          console.log(`   📝 ${issue.description}`);
          console.log(`   ✅ Fix: ${issue.fix}`);
          console.log('');
        });
      }

      // Display medium priority issues
      if (medium.length > 0) {
        console.log('%c📋 MEDIUM PRIORITY (' + medium.length + ')', 'color: #FFC107; font-weight: bold; font-size: 16px;');
        console.log('');
        medium.forEach((issue, idx) => {
          console.log(`%c${idx + 1}. ${issue.title}`, 'color: #FFC107; font-weight: bold;');
          console.log(`   📍 Zap: ${issue.zapName}`);
          console.log(`   📝 ${issue.description}`);
          console.log(`   ✅ Fix: ${issue.fix}`);
          console.log('');
        });
      }

      // Display info items
      if (info.length > 0) {
        console.log('%c💡 REVIEW RECOMMENDED (' + info.length + ')', 'color: #2196F3; font-weight: bold; font-size: 16px;');
        console.log('');
        info.forEach((issue, idx) => {
          console.log(`${idx + 1}. ${issue.title}`);
          console.log(`   📍 Zap: ${issue.zapName}`);
          console.log(`   📝 ${issue.description}`);
          console.log(`   ✅ Action: ${issue.fix}`);
          console.log('');
        });
      }

      // Summary table
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
      console.log('%c📈 SUMMARY TABLE', 'font-weight: bold; font-size: 14px;');
      console.table(issues.map(i => ({
        'Priority': i.severity,
        'Category': i.category,
        'Issue': i.title,
        'Zap': i.zapName.substring(0, 30) + (i.zapName.length > 30 ? '...' : '')
      })));
    }

    // Recommendations
    console.log('');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
    console.log('%c🛡️  SECURITY BEST PRACTICES', 'font-weight: bold; font-size: 16px; color: #FF6B35;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
    console.log('');
    console.log('%cQuick Wins:', 'font-weight: bold;');
    console.log('  1. 🔐 Enable webhook authentication (Query String or Header auth)');
    console.log('  2. 🏷️  Remove PII from Zap names');
    console.log('  3. 👥 Review who has access to your workspace');
    console.log('  4. 🔄 Enable 2FA if you haven\'t already');
    console.log('');
    console.log('%cRegular Maintenance:', 'font-weight: bold;');
    console.log('  • Monthly: Review Zap history for anomalies');
    console.log('  • Quarterly: Audit app permissions (My Apps)');
    console.log('  • When adding team members: Review what they can access');
    console.log('');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #888;');
    console.log('');
    console.log('%c📖 Want a comprehensive audit?', 'font-weight: bold; color: #FF6B35;');
    console.log('Use our full security checklist: https://github.com/peanutlife/kintsugi');
    console.log('');
    console.log('%c🎨 Kintsugi - Find the cracks. Fix them beautifully.', 'font-style: italic; color: #666;');
    console.log('');
  }

  // Limitations notice
  function showLimitations() {
    console.log('%c⚠️  Scanner Limitations', 'font-weight: bold; color: #FF6B35;');
    console.log('');
    console.log('This scanner can only check what\'s visible on the dashboard:');
    console.log('  ✅ Zap names for PII');
    console.log('  ✅ Visible text for keywords');
    console.log('  ❌ Cannot see inside Zaps (need to open each one)');
    console.log('  ❌ Cannot detect webhook auth settings');
    console.log('  ❌ Cannot check app permission scopes');
    console.log('');
    console.log('For comprehensive scanning, use our full checklist or wait for our automated tool!');
    console.log('');
  }

  // Run the scan
  console.log('🔍 Scanning...');
  console.log('');

  const scannedCount = scanZapCards();
  scanForExposedWebhooks();

  generateReport();
  showLimitations();

  // Return data for programmatic access
  return {
    summary: {
      zapsScanned: scannedCount,
      issuesFound: issues.length,
      high: issues.filter(i => i.severity === 'HIGH').length,
      medium: issues.filter(i => i.severity === 'MEDIUM').length,
      info: issues.filter(i => i.severity === 'INFO').length,
    },
    issues: issues,
    timestamp: new Date().toISOString()
  };
})();
