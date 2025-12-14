# Kintsugi Security Scanner - Installation Guide

## Quick Install (5 minutes)

### Step 1: Download the Extension

**Option A: Download ZIP from GitHub Releases**
1. Go to https://github.com/peanutlife/kintsugi/releases
2. Download `kintsugi-extension-v1.0.0.zip`
3. Extract the ZIP file

**Option B: Clone from GitHub**
```bash
git clone https://github.com/peanutlife/kintsugi.git
cd kintsugi/kintsugi-extension
```

### Step 2: Install in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right corner)
3. Click **"Load unpacked"**
4. Select the `kintsugi-extension` folder
5. The extension is now installed! 🎉

### Step 3: Use the Scanner

1. Go to https://zapier.com/app/zaps (your Zapier dashboard)
2. Click the Kintsugi extension icon in Chrome toolbar
3. Click **"Scan Workspace"**
4. Wait for the scan to complete (30-60 seconds)
5. Review the security findings
6. Export the report if needed

---

## What Gets Scanned

### ✅ Currently Detects:

1. **🔴 CRITICAL: Hardcoded API Keys**
   - API keys in Code by Zapier steps
   - Tokens and secrets in JavaScript/Python code
   - Provides step-by-step fix with Zapier Storage

2. **🔴 CRITICAL: Command Injection Risks**
   - Use of eval(), exec(), os.system()
   - Dangerous subprocess calls
   - Detailed remediation guidance

3. **🟠 HIGH: Insecure Webhooks**
   - Catch Hook webhooks without authentication
   - Detailed fix with authentication examples
   - Query string secret implementation guide

4. **🟡 MEDIUM: PII in Zap Names**
   - Email addresses
   - Phone numbers
   - GDPR/CCPA compliance guidance

---

## Troubleshooting

### Extension won't load
- Make sure you selected the `kintsugi-extension` folder, not the parent folder
- Check that manifest.json is in the root of the selected folder
- Disable and re-enable Developer mode

### "Please navigate to Zapier dashboard" error
- Make sure you're on https://zapier.com/app/* (any Zapier page)
- Refresh the Zapier page after installing extension
- Check that the extension is enabled in chrome://extensions

### Scan shows 0 Zaps
- Make sure you have Zaps in your account
- Check that you're on the correct Zapier account
- Try refreshing the page and running scan again

### Scan gets stuck
- Close any other Zapier tabs
- Refresh the Zapier dashboard page
- Reload the extension (chrome://extensions → refresh icon)
- Try again with fewer Zaps

---

## Privacy & Security

### What data does this extension access?
- **Zap names** - To check for PII
- **Zap editor content** - To scan for security issues
- **NO credentials** - Never accesses your API keys or passwords
- **NO external servers** - Everything runs locally in your browser

### What data is sent to external servers?
- **NOTHING** - This extension is 100% local
- No analytics, no tracking, no data collection
- All scanning happens in your browser
- Reports are generated locally

### Permissions explained:
- `activeTab` - Access current Zapier tab content
- `tabs` - Open Zaps in background for scanning
- `scripting` - Inject scanner into Zap pages
- `storage` - Save scan results locally
- `zapier.com/*` - Only works on Zapier domain

---

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Kintsugi Security Scanner"
3. Click "Remove"
4. Confirm removal

---

## Support

- **Issues/Bugs**: https://github.com/peanutlife/kintsugi/issues
- **Manual Checklist**: https://github.com/peanutlife/kintsugi/blob/main/ZAPIER_SECURITY_CHECKLIST.md
- **Security Questions**: Open an issue on GitHub

---

## What's Next?

After running the scanner:

1. **Fix CRITICAL issues immediately**
   - Rotate any exposed API keys
   - Implement fixes from detailed guidance

2. **Review HIGH priority issues**
   - Add webhook authentication
   - Follow step-by-step instructions

3. **Address MEDIUM issues**
   - Rename Zaps with PII
   - Follow GDPR best practices

4. **Export the report**
   - Keep for compliance records
   - Share with security team
   - Track progress over time

---

## Updates

To update to the latest version:

1. Download new release from GitHub
2. Or pull latest code: `git pull origin main`
3. Go to `chrome://extensions/`
4. Click the **refresh icon** on Kintsugi extension
5. New features and detections are now active!

---

**🔒 Stay secure! 🔒**
