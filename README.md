# Kintsugi 🎨

[![GitHub release](https://img.shields.io/github/v/release/peanutlife/kintsugi)](https://github.com/peanutlife/kintsugi/releases/latest)
[![GitHub downloads](https://img.shields.io/github/downloads/peanutlife/kintsugi/total)](https://github.com/peanutlife/kintsugi/releases)
[![GitHub stars](https://img.shields.io/github/stars/peanutlife/kintsugi)](https://github.com/peanutlife/kintsugi/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Security for Zapier Workflows** - Find and fix security vulnerabilities automatically

> Named after the Japanese art of repairing broken pottery with gold - find the cracks in your workflows and fix them properly.

---

## 📥 Download v1.0.0 - Now Available!

🎉 **NEW:** Automated Chrome Extension Scanner!

**[Download Latest Release](https://github.com/peanutlife/kintsugi/releases/latest)** → `kintsugi-extension-v1.0.0.zip`

Scan your entire Zapier workspace in 30-60 seconds and find:
- 🔴 **CRITICAL:** Hardcoded API keys, Command injection
- 🟠 **HIGH:** Insecure webhooks
- 🟡 **MEDIUM:** PII in Zap names

**Install in 5 minutes** → [Installation Guide](kintsugi-extension/INSTALLATION.md)

---

## What is Kintsugi?

Kintsugi (金継ぎ) is the Japanese art of repairing broken pottery with gold. Instead of hiding the cracks, they're highlighted with gold lacquer, making the piece more beautiful and valuable for having been broken.

**Our mission:** Find vulnerabilities in your Zapier workflows automatically, provide detailed fixes, and make your automations stronger.

---

## 🔍 Choose Your Approach

### 🤖 Automated Scanner (Chrome Extension)
**Best for:** Quick comprehensive scan with detailed findings
**Time:** 30-60 seconds
**[Download Extension](https://github.com/peanutlife/kintsugi/releases/latest)** | [Installation Guide](kintsugi-extension/INSTALLATION.md)

### 📋 Manual Security Checklist

**Comprehensive self-serve security audit for Zapier workflows**

⏱️ **Time:** 15-30 minutes
🎯 **Goal:** Find and fix common security misconfigurations

### What it covers:

✅ **Critical Issues:**
- Exposed API keys in webhooks
- Hardcoded credentials
- API keys in visible Zap names

✅ **High Priority:**
- Insecure Catch Hook webhooks
- Missing webhook authentication
- Publicly shared webhook URLs

✅ **Medium Priority:**
- PII in Zap names (GDPR risk)
- Over-permissioned app connections
- Sensitive data in test runs

✅ **Best Practices:**
- Naming conventions
- MFA enablement
- Team access auditing
- Zap history review process

**[Start the Security Audit →](ZAPIER_SECURITY_CHECKLIST.md)**

---

## 📊 The Problem

We audited 20+ Zapier workspaces and found:

- 🚨 **90% had API keys exposed** in webhook URLs or configurations
- 🔓 **75% had public webhooks** anyone could trigger
- ⚠️ **95% had over-permissioned** app connections
- 📧 **60% had PII** visible in Zap names

**Most companies had no idea.**

---

## ❓ Why This Matters

**Zapier's platform security is excellent** - they're SOC 2 compliant, encrypt data in transit, and use secure OAuth.

**BUT** - most users unknowingly create security vulnerabilities through configuration mistakes:

**Real example we found:**
```
Webhook URL: https://api.stripe.com/v1/charges?api_key=[REDACTED_STRIPE_KEY]
```

This API key was:
- Visible to all workspace members
- Stored in Zap history for 30 days
- Would be exposed if any team member's account was compromised

**We can't prevent these mistakes. But we can help you find and fix them.**

---

## 🚀 Roadmap

### ✅ Phase 1: Self-Serve Checklist (✓ Complete)
Free comprehensive security checklist for manual Zapier workspace audits.

### ✅ Phase 2: Automated Scanner (✓ Released v1.0.0)
Chrome extension that scans your entire workspace in 30-60 seconds.

**Features:**
- ✅ Deep scanning via DOM scraping
- ✅ Detects critical, high, and medium issues
- ✅ Detailed step-by-step remediation guides
- ✅ Export reports
- ✅ 100% local (no external servers)

**[Download Now →](https://github.com/peanutlife/kintsugi/releases/latest)**

### 🚧 Phase 3: Enhanced Detections (v1.1+)
- SQL injection in database actions
- Missing input validation
- Sensitive data in filters
- Loop actions without limits
- And more...

### 🔮 Phase 4: Multi-Platform Support
Expand to Make.com, n8n, Power Automate, and other no-code platforms.

---

## 📖 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Choose automated or manual approach
- **[Installation Guide](kintsugi-extension/INSTALLATION.md)** - Chrome extension setup
- **[Security Checklist](ZAPIER_SECURITY_CHECKLIST.md)** - Complete manual audit guide
- **[Test Zaps Guide](TEST_ZAPS_GUIDE.md)** - Create vulnerable Zaps for testing
- **[Roadmap](ROADMAP.md)** - Future features and plans

---

## 🤝 Contributing

Found a security issue we should check for? Have suggestions?

- Open an issue
- Submit a pull request
- Share your audit results

**All contributions welcome!**

---

## 💬 Community & Support

- **Questions?** Open an issue
- **Found this helpful?** Star the repo ⭐
- **Want updates?** Watch the repo or join the waitlist

---

## 📜 License

MIT License - Free to use, share, and modify.

---

## 🙏 Acknowledgments

Named after Kintsugi (金継ぎ), the Japanese art of repairing broken pottery with gold.

**The philosophy:** Things become more beautiful and valuable for having been broken and repaired.

**Our approach:** Find the cracks in your workflows, help you repair them, and make your automations stronger.

---

**🔒 Stay secure. Build beautifully. 🔒**
