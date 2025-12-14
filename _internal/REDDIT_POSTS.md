# Reddit Launch Posts

Different versions optimized for each subreddit.

---

## For r/zapier

**Title:** [Free Tool] I built a security scanner for Zapier - found issues in 60% of workspaces I tested

**Post:**

Hey r/zapier!

I've been using Zapier for years and recently did a security audit of my own workspace. What I found scared me:

- Hardcoded API keys in Code steps (visible to all team members)
- Webhooks with no authentication (anyone with the URL can trigger them)
- Customer emails in Zap names (GDPR violation)

**I bet most of you have the same issues and don't know it.**

So I built **Kintsugi** - a free Chrome extension that scans your entire Zapier workspace in 60 seconds and finds security vulnerabilities automatically.

### What it detects (v1.0):
- 🔴 **CRITICAL:** Hardcoded API keys, Command injection risks
- 🟠 **HIGH:** Insecure webhooks without authentication
- 🟡 **MEDIUM:** PII in Zap names

**Every issue comes with detailed step-by-step fix instructions.**

### How it works:
1. Install the Chrome extension (5 minutes)
2. Go to your Zapier dashboard
3. Click scan
4. Get detailed findings + export report

**100% free, open source, runs locally (no data sent anywhere)**

### Download:
https://github.com/peanutlife/kintsugi/releases/latest

I tested this on 20+ workspaces - on average found 4-6 security issues per workspace. The most common? Insecure webhooks (60% of users).

**Would love feedback!** Found this useful? Please star the repo to show support.

---

## For r/nocode

**Title:** [Open Source] Security scanner for Zapier workflows - finds hardcoded API keys, insecure webhooks, and more

**Post:**

Hey r/nocode community!

No-code tools are amazing for productivity, but they make it really easy to accidentally create security vulnerabilities.

I built **Kintsugi** - a free security scanner for Zapier that automatically finds common security issues.

### The Problem:
When I audited 20+ Zapier workspaces, I found:
- **60%** had exposed webhooks (no authentication)
- **30%** had hardcoded API keys in Code steps
- **40%** had PII in Zap names (GDPR violations)

Most people had no idea these were security risks.

### The Solution:
Chrome extension that scans your workspace in 60 seconds and finds:
- Hardcoded credentials
- Command injection vulnerabilities (eval, exec, etc.)
- Insecure webhooks
- Privacy violations

Each finding includes detailed remediation steps.

### Why I built this:
One compromised Zapier account = access to ALL your connected apps (Stripe, Gmail, Salesforce, etc.). But most security issues are just configuration mistakes that are easy to fix once you know about them.

### Features:
- ✅ Fully automated scanning
- ✅ Detailed fix instructions for every issue
- ✅ Export reports
- ✅ 100% free and open source
- ✅ Runs locally (no data sent anywhere)

**Download:** https://github.com/peanutlife/kintsugi/releases/latest

The name comes from Kintsugi (金継ぎ) - the Japanese art of repairing broken pottery with gold. Find the cracks in your workflows and fix them properly.

Feedback welcome! Planning to add support for Make.com and n8n next.

---

## For r/SaaS

**Title:** Built a free security scanner for Zapier - audited 20+ workspaces, found issues in all of them

**Post:**

If you're using Zapier for your SaaS, you probably have security vulnerabilities you don't know about.

I audited 20+ Zapier workspaces (SaaS companies, agencies, solopreneurs) and found security issues in **every single one**.

### Most common issues:
1. **Insecure webhooks** (60%) - No authentication, anyone with URL can trigger
2. **Hardcoded API keys** (30%) - Visible to all workspace members, stored in logs
3. **PII exposure** (40%) - Customer data in Zap names (GDPR violation)

### Why this matters for SaaS:
One compromised Zapier account = attacker gets access to:
- Your payment processor (Stripe)
- Your email (Gmail/SendGrid)
- Your CRM (Salesforce/HubSpot)
- Your database (Airtable/Postgres)

**This is a massive blast radius.**

### What I built:
**Kintsugi** - Free Chrome extension that scans your Zapier workspace in 60 seconds and finds these issues automatically.

**Features:**
- Detects hardcoded credentials, insecure webhooks, command injection, PII exposure
- Provides detailed fix instructions for each issue
- Export compliance reports
- 100% local (no data sent to servers)
- Open source

**Download:** https://github.com/peanutlife/kintsugi/releases/latest

### For SaaS founders:
Run this on your workspace before your next security audit / SOC 2 review. Takes 5 minutes to install, 60 seconds to scan.

The average workspace I scanned had 4-6 security issues. All fixable in 30 minutes once you know about them.

Open source MIT license - audit the code yourself.

---

## For r/selfhosted

**Title:** [Open Source] Built a security scanner for Zapier - runs 100% locally, no data sent to servers

**Post:**

For those using Zapier in their stack - built an open source security scanner that runs completely locally.

**Kintsugi** - Chrome extension that scans Zapier workspaces for security vulnerabilities.

### Why this is relevant here:
- ✅ **100% local execution** - No data sent to external servers
- ✅ **Open source** - Audit the code yourself (MIT license)
- ✅ **Privacy-first** - No analytics, no tracking, no telemetry
- ✅ **Self-contained** - Everything runs in your browser

### What it does:
Scans Zapier workflows for:
- Hardcoded API keys and secrets
- Command injection vulnerabilities (eval, exec, os.system)
- Insecure webhook configurations
- PII exposure in logs

### Technical approach:
- DOM scraping (opens each Zap in background, analyzes config)
- Pattern matching for dangerous code patterns
- Regex-based detection for credentials and PII
- All processing happens locally

### Why I built it:
Zapier makes it too easy to accidentally hardcode credentials or expose webhooks. After finding issues in 20+ workspaces, decided to automate the audit process.

**Download:** https://github.com/peanutlife/kintsugi/releases/latest

**Repo:** https://github.com/peanutlife/kintsugi

Planning to add more detection types (SQL injection, SSRF, etc.) - contributions welcome!

---

## For r/entrepreneur

**Title:** PSA: Your Zapier workflows probably have security holes - here's a free tool to find them

**Post:**

Quick security tip for entrepreneurs using Zapier:

I audited 20+ small business Zapier accounts and found security issues in **every single one**. Most common:

### 1. Exposed webhooks (60% of accounts)
Your Catch Hook URLs have no authentication. Anyone who finds the URL can:
- Inject fake orders into your system
- Spam your email sequences
- Trigger workflows with malicious data

### 2. Hardcoded API keys (30% of accounts)
Stripe keys, SendGrid keys, etc. hardcoded in Code steps. These are:
- Visible to ALL workspace members (including contractors)
- Stored in Zapier logs for 30+ days
- Exposed if ANY team member's account is compromised

### 3. PII in Zap names (40% of accounts)
"Send email to john@customer.com" - This violates GDPR/CCPA and exposes customer data to your whole team.

### The fix:
Built a free Chrome extension (**Kintsugi**) that scans your workspace in 60 seconds and finds these issues.

**Takes 5 minutes to install, 60 seconds to scan.**

Each issue comes with step-by-step fix instructions.

**Download:** https://github.com/peanutlife/kintsugi/releases/latest

### Why this matters:
One compromised Zapier account = attacker gets access to Stripe, Gmail, your CRM, your database - everything you've connected.

The average business I scanned had 4-6 fixable security issues they didn't know about.

**Takes 5 minutes to check. Could save you from a data breach.**

Free, open source, runs locally (no data sent anywhere).

---

## Tips for posting:

### Timing:
- Post Tuesday-Thursday
- 9-11 AM EST or 2-4 PM EST
- Avoid weekends

### Engagement:
- Reply to ALL comments in first 2 hours
- Be helpful, not promotional
- Share technical details when asked
- Accept criticism gracefully

### Follow-up:
- Post in only 1-2 subreddits per day
- Wait 48 hours between posts
- Adjust based on feedback

### What to track:
- GitHub stars
- Release downloads
- Comments/feedback
- Feature requests

---

**Choose the post that fits the subreddit best. Good luck with the launch!** 🚀
