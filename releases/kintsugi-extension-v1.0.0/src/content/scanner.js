// Content script for Kintsugi Security Scanner
// This runs on Zapier pages

console.log('🎨 Kintsugi Security Scanner loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanPage') {
    const results = scanCurrentPage();
    sendResponse({ success: true, results });
  }
  return true;
});

// Scan the current Zapier page
function scanCurrentPage() {
  // This will be expanded to scan individual Zap pages
  console.log('Scanning current page...');

  return {
    scanned: true,
    issues: []
  };
}
