# Kintsugi - Quick Start Guide

## 🚀 Get Started in 5 Minutes

Kintsugi helps you find security vulnerabilities in your Zapier workflows automatically.

---

## Choose Your Method

### 🤖 **Recommended: Chrome Extension** (Automated)

**Best for:** Complete security scan with detailed findings

**Install:**
1. Download: https://github.com/peanutlife/kintsugi/releases
2. Chrome → `chrome://extensions/` → Enable "Developer mode"
3. Click "Load unpacked" → Select `kintsugi-extension` folder
4. Done!

**Use:**
1. Go to https://zapier.com/app/zaps
2. Click Kintsugi extension icon
3. Click "Scan Workspace"
4. Review findings + export report

**Detects:**
- ✅ Hardcoded API keys (CRITICAL)
- ✅ Command injection risks (CRITICAL)
- ✅ Insecure webhooks (HIGH)
- ✅ PII in Zap names (MEDIUM)

[Full Installation Guide](kintsugi-extension/INSTALLATION.md)

---

### 📋 **Manual Checklist** (Self-Audit)

**Best for:** Understanding security best practices, learning, or when you can't install extensions

**Use:**
1. Open: [Zapier Security Checklist](ZAPIER_SECURITY_CHECKLIST.md)
2. Open your Zapier dashboard in another tab
3. Go through each checklist item
4. Mark issues you find
5. Fix as you go

**Covers:**
- 🔴 CRITICAL: Exposed credentials, hardcoded API keys
- 🟠 HIGH: Insecure webhooks, code injection risks
- 🟡 MEDIUM: Data leakage, PII exposure, over-permissioned apps
- 🟢 LOW: Operational security, naming conventions

**Time:** 15-30 minutes

---

## What You'll Find

### Common Issues:

1. **Catch Hook webhooks without authentication** (60% of users)
   - Fix: Add query string secret in 5 minutes

2. **Hardcoded API keys in Code steps** (30% of users)
   - Fix: Use Zapier Storage instead

3. **PII in Zap names** (40% of users)
   - Fix: Rename to generic descriptions

4. **Over-permissioned app connections** (70% of users)
   - Fix: Reconnect with minimum permissions

---

## After Scanning

### Priority Order:

1. **🔴 CRITICAL** → Fix immediately (rotate keys, review code)
2. **🟠 HIGH** → Fix this week (add webhook auth)
3. **🟡 MEDIUM** → Fix this month (clean up PII)
4. **🟢 LOW** → Improve gradually (naming, processes)

---

## Need Help?

- 📖 **Full Checklist**: [ZAPIER_SECURITY_CHECKLIST.md](ZAPIER_SECURITY_CHECKLIST.md)
- 🐛 **Report Issues**: https://github.com/peanutlife/kintsugi/issues
- 💬 **Questions**: Open a GitHub issue

---

## Comparison

| Feature | Chrome Extension | Manual Checklist |
|---------|-----------------|------------------|
| **Speed** | 30-60 seconds | 15-30 minutes |
| **Automation** | Fully automated | Manual review |
| **Coverage** | Current detections | Comprehensive |
| **Learning** | Quick findings | Educational |
| **Export** | Yes | Manual notes |
| **Best For** | Fast scans | Deep understanding |

---

**Start securing your Zapier workflows now! 🔒**

Choose automated (Chrome extension) or manual (checklist) above.
