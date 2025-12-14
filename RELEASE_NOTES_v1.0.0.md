# Kintsugi v1.0.0 - Security Scanner for Zapier 🎨

**First stable release!** Find and fix security vulnerabilities in your Zapier workflows automatically.

---

## 🎯 What's Included

### Chrome Extension - Automated Security Scanner

**Download:** `kintsugi-extension-v1.0.0.zip` (see Assets below)

Automatically scans your entire Zapier workspace in 30-60 seconds and finds:

- 🔴 **CRITICAL Issues**
  - Hardcoded API keys in Code steps
  - Command injection vulnerabilities (eval, exec, os.system, etc.)

- 🟠 **HIGH Issues**
  - Insecure webhooks without authentication

- 🟡 **MEDIUM Issues**
  - PII in Zap names (emails, phone numbers)

**Each finding includes detailed step-by-step fix instructions!**

---

## ✨ Key Features

### Automated Deep Scanning
- Opens each Zap in background and analyzes configuration
- Scans code, webhooks, names, and settings
- Real-time progress tracking
- No data sent to external servers (100% local)

### Detailed Fix Guidance
Every issue includes:
- Step-by-step remediation instructions
- Code examples (good vs bad)
- Security implications (GDPR, CCPA)
- Links to tools and resources
- Alternative approaches

### Privacy-First Design
- ✅ Runs 100% in your browser
- ✅ No external servers or APIs
- ✅ No data collection or analytics
- ✅ No sign-up required
- ✅ Open source - audit the code yourself

---

## 📥 Installation

### Quick Install (5 minutes)

1. **Download** `kintsugi-extension-v1.0.0.zip` from Assets below
2. **Extract** the ZIP file
3. **Open Chrome** → `chrome://extensions/`
4. **Enable** "Developer mode" (toggle in top right)
5. **Click** "Load unpacked"
6. **Select** the extracted folder
7. **Done!** Extension is installed

### Usage

1. Go to https://zapier.com/app/zaps
2. Click the Kintsugi extension icon
3. Click "Scan Workspace"
4. Review findings and export report

📖 [Full Installation Guide](https://github.com/peanutlife/kintsugi/blob/main/kintsugi-extension/INSTALLATION.md)

---

## 📋 Alternative: Manual Security Checklist

Prefer a manual audit? Use our comprehensive [Security Checklist](https://github.com/peanutlife/kintsugi/blob/main/ZAPIER_SECURITY_CHECKLIST.md) (15-30 minutes).

Covers 15+ vulnerability categories with detailed remediation guides.

---

## 🔍 What Gets Detected

### Current Detection Capabilities (v1.0.0)

| Severity | Issue Type | Detection Method |
|----------|-----------|------------------|
| 🔴 CRITICAL | Hardcoded API Keys | Pattern matching in Code steps |
| 🔴 CRITICAL | Command Injection (eval, exec, os.system) | 13+ dangerous function patterns |
| 🟠 HIGH | Insecure Webhooks | Catch Hook without authentication |
| 🟡 MEDIUM | Email in Zap Names | Regex pattern matching |
| 🟡 MEDIUM | Phone in Zap Names | Regex pattern matching |

### Coming Soon (v1.1+)

- SQL injection in database actions
- Missing input validation
- Sensitive data in filters
- Loop actions without limits
- Overly permissioned apps

See [ROADMAP.md](https://github.com/peanutlife/kintsugi/blob/main/ROADMAP.md) for full future plans.

---

## 📊 Why This Matters

### Real Statistics from Zapier Users

- **60%** have exposed webhooks with no authentication
- **30%** have hardcoded API keys in Code steps
- **40%** have PII in Zap names (GDPR/CCPA violations)
- **70%** have over-permissioned app connections

**One security breach in Zapier = All connected services compromised**

---

## 🧪 Testing

Want to test the scanner? Create vulnerable test Zaps using our guide:

📖 [Test Zaps Guide](https://github.com/peanutlife/kintsugi/blob/main/TEST_ZAPS_GUIDE.md)

Includes 7 pre-configured test scenarios covering all vulnerability types.

---

## 📖 Documentation

- [Quick Start Guide](https://github.com/peanutlife/kintsugi/blob/main/QUICK_START.md) - Choose automated or manual
- [Installation Guide](https://github.com/peanutlife/kintsugi/blob/main/kintsugi-extension/INSTALLATION.md) - Chrome extension setup
- [Security Checklist](https://github.com/peanutlife/kintsugi/blob/main/ZAPIER_SECURITY_CHECKLIST.md) - Complete manual audit
- [Test Zaps Guide](https://github.com/peanutlife/kintsugi/blob/main/TEST_ZAPS_GUIDE.md) - Create vulnerable Zaps for testing

---

## 🤝 Contributing

Found a bug? Have a feature idea?

1. Open an issue: https://github.com/peanutlife/kintsugi/issues
2. Submit a pull request
3. Star the repo to show support!

---

## 📝 License

MIT License - Free to use, modify, and distribute.

---

## 🙏 Acknowledgments

Named after the Japanese art of Kintsugi (金継ぎ) - the practice of repairing broken pottery with gold lacquer, making the repaired object more beautiful than the original.

**Find the cracks in your workflows and fix them properly.** 🔒

---

## 🔗 Links

- **Repository:** https://github.com/peanutlife/kintsugi
- **Issues:** https://github.com/peanutlife/kintsugi/issues
- **Changelog:** See commit history
- **Roadmap:** [ROADMAP.md](https://github.com/peanutlife/kintsugi/blob/main/ROADMAP.md)

---

**Start securing your Zapier workflows today!** 🚀

Download the extension below and run your first scan in 5 minutes.
