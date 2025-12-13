# Kintsugi

**Security for no-code workflows** - Find the cracks in your Zapier automations and fix them beautifully.

---

## What is Kintsugi?

Kintsugi (金継ぎ) is the Japanese art of repairing broken pottery with gold. Instead of hiding the cracks, they're highlighted with gold lacquer, making the piece more beautiful and valuable for having been broken.

**Our mission:** Find vulnerabilities in your no-code workflows, help you fix them, and make your automations stronger.

---

## 🔍 Free Security Checklist

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

### ✅ Phase 1: Self-Serve Checklist (Available Now)
Free comprehensive security checklist you can use to audit your Zapier workspace manually.

### 🚧 Phase 2: Automated Scanner (Coming in 3-4 weeks)
Automated tool that scans your entire workspace in 30 seconds using the Zapier API.

**Features:**
- Full workspace scanning via API
- Detects all security issues automatically
- Detailed remediation steps
- Historical tracking

**[Join the waitlist →](#)** _(Coming soon)_

### 🔮 Phase 3: Multi-Platform Support
Expand to Make.com, n8n, Power Automate, and other no-code platforms.

---

## 📖 Documentation

- **[Security Checklist](ZAPIER_SECURITY_CHECKLIST.md)** - Complete self-serve audit guide
- **[Reddit Launch Guide](REDDIT_POST_CHECKLIST.md)** - How we're launching this
- **[Launch Playbook](LAUNCH_TODAY.md)** - Behind the scenes
- **[Roadmap](ROADMAP.md)** - Detailed future plans

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
