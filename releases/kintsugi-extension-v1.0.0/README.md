# Kintsugi Chrome Extension

Security scanner for Zapier workflows - Chrome extension that provides automated security scanning.

## Features

✅ **One-Click Scanning** - Click extension icon to scan your Zapier workspace
✅ **Comprehensive Detection** - Finds PII in Zap names, exposed webhooks, and more
✅ **Beautiful Reports** - Color-coded severity levels and actionable fixes
✅ **Export Reports** - Download scan results as text file

## Installation (Development)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `kintsugi-extension` folder
5. Extension is now installed!

## Usage

1. Go to https://zapier.com/app/zaps
2. Click the Kintsugi extension icon
3. Click "Scan Workspace"
4. View results and export report

## Project Structure

```
kintsugi-extension/
├── manifest.json           # Extension configuration
├── src/
│   ├── popup/             # Extension popup UI
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── background/        # Background service worker
│   │   └── background.js
│   ├── content/           # Content scripts (run on Zapier pages)
│   │   └── scanner.js
│   └── utils/             # Shared utilities
├── assets/                # Icons and images
│   └── icons/
└── dist/                  # Build output (for production)
```

## Development

### Testing Changes

After making code changes:
1. Go to `chrome://extensions/`
2. Click the refresh icon on the Kintsugi extension card
3. Reload the Zapier page
4. Test your changes

### Current Capabilities

**v1.0 (Current)**
- ✅ Scans Zap names for PII (emails, phones, SSN)
- ✅ Detects webhook-related keywords
- ✅ Finds exposed webhook URLs on dashboard
- ✅ Beautiful UI with severity levels
- ✅ Export reports

**v1.1 (Next)**
- Navigate into individual Zaps
- Detect webhook authentication settings
- Check for API keys in action configurations
- Scan app permissions

## TODO

- [ ] Add extension icons (16x16, 48x48, 128x128)
- [ ] Implement deep Zap scanning (navigate into each Zap)
- [ ] Add webhook authentication detection
- [ ] Detect API keys in Code steps
- [ ] Check app permission scopes
- [ ] Add progress indicator during scan
- [ ] Implement caching for faster rescans

## License

MIT
