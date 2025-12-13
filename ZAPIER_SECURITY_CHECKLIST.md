# Zapier Security Checklist
## Self-Serve Security Audit for Your Zapier Workspace

**⏱️ Time to complete:** 15-30 minutes
**🎯 Goal:** Find and fix common security misconfigurations in your Zapier workflows

---

## How to Use This Checklist

1. **Open your Zapier dashboard** in one window
2. **Open this checklist** in another window
3. **Go through each Zap** and check the items below
4. **Mark issues** you find and fix them as you go
5. **Share your results** (optional) - helps us build better tools!

---

## ✅ THE CHECKLIST

### 🔴 CRITICAL: Exposed API Keys & Credentials

**Risk Level:** CRITICAL 🚨
**Impact:** Full account compromise, data breach, unauthorized access

#### What to Check:

- [ ] **Webhook URLs with API keys in query parameters**

  **Where to look:** Open each Zap → Look at webhook triggers

  **Bad example:**
  ```
  ❌ https://api.stripe.com/v1/charges?api_key=STRIPE_KEY_HERE_VISIBLE_TO_ALL
  ❌ https://yourapi.com/endpoint?token=SECRET_TOKEN_EXPOSED
  ❌ https://service.com/webhook?auth=Bearer_INSECURE_TOKEN
  ```

  **Why it's bad:**
  - API key is visible to all workspace members
  - Stored in Zap history for 7-30 days
  - If workspace is compromised, attacker gets full API access

  **How to fix:**
  - Use **Zapier Secret Storage** (Storage by Zapier)
  - Or use webhook **authentication headers** instead of query params
  - Or use OAuth connections when available

---

- [ ] **API keys hardcoded in Code steps**

  **Where to look:** Open Zaps with "Code by Zapier" or "Run Python/JavaScript"

  **Bad example:**
  ```javascript
  ❌ const apiKey = 'sk_live_abcdefg123456789';
  ❌ const token = 'your_actual_token_here';
  ```

  **How to fix:**
  - Store API keys in **Storage by Zapier**
  - Reference them as input fields
  - Use environment variables if self-hosting

---

- [ ] **Credentials in Zap names or descriptions**

  **Where to look:** Zapier dashboard - look at all your Zap names

  **Bad example:**
  ```
  ❌ "Stripe Integration - API Key: sk_live_123456"
  ❌ "Gmail to Sheets (password: mypassword123)"
  ```

  **How to fix:**
  - Rename Zaps to remove any credentials
  - Use generic descriptions only

---

### 🟠 HIGH: Insecure Webhooks

**Risk Level:** HIGH ⚠️
**Impact:** Unauthorized trigger access, data injection, workflow spam

#### What to Check:

- [ ] **Catch Hook webhooks without authentication**

  **Where to look:** Any Zap using "Webhooks by Zapier" → "Catch Hook" trigger

  **The problem:**
  - Default webhook URL has **no authentication**
  - Anyone who finds the URL can trigger your Zap
  - Can inject fake data into your workflow

  **Example webhook URL:**
  ```
  https://hooks.zapier.com/hooks/catch/123456/abcdef/
  ```

  **How to check if it's insecure:**
  1. Open the Zap with Catch Hook
  2. Look at the webhook URL
  3. Check if there's any authentication configured
  4. If URL has no `?secret=` or special headers → **INSECURE**

  **How to fix:**

  **Option 1: Add Query String Authentication**
  - Add a secret parameter: `?secret=your_random_string_here`
  - Update all systems sending webhooks to include this parameter
  - Anyone without the secret can't trigger the Zap

  **Option 2: Add Header Authentication**
  - Configure webhook to require specific headers
  - Example: `X-API-Key: your_secret_key`

  **Option 3: Use IP Whitelisting (if available)**
  - Only accept webhooks from specific IP addresses

---

- [ ] **Webhook URLs shared publicly**

  **Where to look:** Check where you've shared your webhook URLs

  **Risky places:**
  - Public GitHub repositories
  - Slack channels (especially public ones)
  - Email signatures
  - Documentation without access control
  - Client-facing forms or websites

  **How to fix:**
  - Rotate webhook URLs that were exposed
  - Add authentication before sharing new URLs
  - Use environment variables in code repositories

---

### 🟡 MEDIUM: Data Exposure & Privacy

**Risk Level:** MEDIUM 📋
**Impact:** Privacy violations, GDPR/HIPAA non-compliance, internal data leaks

#### What to Check:

- [ ] **PII in Zap names**

  **Where to look:** Zapier dashboard - scan all Zap names

  **Bad examples:**
  ```
  ❌ "Send welcome email to john.smith@email.com"
  ❌ "Add Sarah Johnson to CRM when form submitted"
  ❌ "Alert team when 555-123-4567 makes purchase"
  ❌ "Process payment for customer ID 123-45-6789"
  ```

  **Why it's bad:**
  - Visible to ALL workspace members
  - Shows up in workspace search
  - Appears in Zap history
  - May violate GDPR/privacy regulations

  **How to fix:**
  - Use generic descriptions: "Send welcome email to new customers"
  - Remove names, emails, phone numbers, SSNs, etc.
  - Use role/category instead of specific people

---

- [ ] **Sensitive data in test data or sample values**

  **Where to look:** Open Zaps → Look at test/sample data in each step

  **The problem:**
  - Test runs often use real customer data
  - This data is visible in Zap history
  - Visible to all team members with access

  **How to fix:**
  - Use fake/dummy data for testing
  - Clear Zap history after testing with real data
  - Limit workspace access to only necessary team members

---

- [ ] **Over-sharing Zaps with team members**

  **Where to look:** Zap settings → Sharing

  **What to check:**
  - Who has access to each Zap?
  - Does everyone need access?
  - Are former employees still listed?

  **How to fix:**
  - Follow **principle of least privilege**
  - Only share Zaps with people who need them
  - Regularly audit team member access
  - Remove former employees immediately

---

### 🟡 MEDIUM: Over-Permissioned App Connections

**Risk Level:** MEDIUM 📋
**Impact:** Excessive access if compromised, blast radius of breaches

#### What to Check:

- [ ] **App connections with "Full Access" when not needed**

  **Where to look:** Zapier → My Apps → Review each connection

  **Common culprits:**

  **Google Drive:**
  - ❌ "Full access to all files and folders"
  - ✅ "Access to specific folder only"

  **Gmail:**
  - ❌ "Full Gmail access (read, send, delete)"
  - ✅ "Send email only" or "Read specific labels"

  **Salesforce:**
  - ❌ "Full Salesforce access"
  - ✅ "Read/Write specific objects only"

  **Slack:**
  - ❌ "Access all channels and DMs"
  - ✅ "Post to specific channels only"

  **How to check:**
  1. Go to "My Apps" in Zapier
  2. Click on each connected app
  3. View the permissions granted
  4. Ask: "Does my Zap actually need ALL this access?"

  **How to fix:**
  1. Disconnect the app
  2. Reconnect with minimum required permissions
  3. Update Zaps to use the new connection
  4. Test to ensure Zaps still work

---

### 🟢 LOW: Operational Security Issues

**Risk Level:** LOW ℹ️
**Impact:** Reduced visibility, harder to troubleshoot, compliance gaps

#### What to Check:

- [ ] **Zaps without proper naming conventions**

  **Why it matters:**
  - Hard to understand what Zaps do
  - Difficult to audit later
  - Team members may create duplicates

  **Bad examples:**
  ```
  ❌ "Untitled Zap"
  ❌ "My Zap"
  ❌ "Test 123"
  ```

  **Good examples:**
  ```
  ✅ "New Customer → Send Welcome Email"
  ✅ "Stripe Payment → Update Airtable"
  ✅ "Form Submit → Slack Notification"
  ```

---

- [ ] **Disabled Zaps still connected to apps**

  **Where to look:** Zapier dashboard → Filter by "Off" Zaps

  **The problem:**
  - Disabled Zaps still maintain app connections
  - Still have permissions granted
  - Security debt accumulates

  **How to fix:**
  - Delete Zaps you're no longer using
  - Archive important ones for reference
  - Disconnect unused app connections

---

- [ ] **No Zap history review process**

  **What to do:**
  - Set calendar reminder to review Zap history monthly
  - Look for:
    - Failed Zaps (may indicate security blocks)
    - Unusual trigger patterns (may indicate unauthorized access)
    - Error messages revealing sensitive info

  **How to set up:**
  1. Add monthly calendar event: "Zapier Security Review"
  2. Review Zap history for anomalies
  3. Check "My Apps" for any unknown connections
  4. Audit team member access

---

- [ ] **Multi-factor authentication (MFA) not enabled**

  **Where to enable:** Zapier → Account Settings → Security

  **Why it matters:**
  - Zapier has access to ALL your connected apps
  - If your Zapier account is compromised, attacker gets access to everything
  - MFA prevents 99% of account takeovers

  **How to enable:**
  1. Go to Account Settings
  2. Enable Two-Factor Authentication
  3. Use an authenticator app (Google Authenticator, Authy, 1Password)

---

## 📊 SCORING YOUR SECURITY

After completing the checklist, tally your results:

### Critical Issues (🔴)
- **0 issues:** ✅ Excellent
- **1-2 issues:** ⚠️ Fix immediately
- **3+ issues:** 🚨 Drop everything and fix now

### High Priority Issues (🟠)
- **0 issues:** ✅ Great
- **1-3 issues:** ⚠️ Fix this week
- **4+ issues:** 🚨 Fix ASAP

### Medium Priority Issues (🟡)
- **0-2 issues:** ✅ Good
- **3-5 issues:** ⚠️ Fix this month
- **6+ issues:** 🚨 Needs attention

### Low Priority Issues (🟢)
- **0-3 issues:** ✅ Acceptable
- **4-6 issues:** ⚠️ Could improve
- **7+ issues:** Clean up when you have time

---

## 🛠️ QUICK FIXES

### Fix #1: Enable Webhook Authentication (5 minutes)

1. Open Zap with Catch Hook
2. Add `?secret=` to the webhook URL
3. Generate a random secret: `https://www.random.org/strings/`
4. Updated webhook URL becomes:
   ```
   https://hooks.zapier.com/hooks/catch/123456/abcdef/?secret=YOUR_RANDOM_SECRET
   ```
5. Update all systems sending webhooks to include the secret

---

### Fix #2: Use Zapier Secret Storage (10 minutes)

1. Create new Zap or add step to existing Zap
2. Add "Storage by Zapier" action
3. Choose "Set Value"
4. Store your API key:
   - Key: `stripe_api_key`
   - Value: `sk_live_your_actual_key_here`
5. In your Zaps, retrieve the value:
   - Action: "Storage by Zapier" → "Get Value"
   - Key: `stripe_api_key`
   - Use retrieved value in API calls

---

### Fix #3: Reduce App Permissions (15 minutes)

1. Go to "My Apps" in Zapier
2. Find app with excessive permissions
3. Click "Disconnect"
4. Click "Connect a new account"
5. During OAuth flow, **review permissions carefully**
6. Uncheck boxes for permissions you don't need
7. Complete connection
8. Update your Zaps to use new connection
9. Test Zaps to ensure they still work

---

## 📝 AUDIT TEMPLATE

Use this template to document your audit:

```
ZAPIER SECURITY AUDIT
Date: __________
Audited by: __________

CRITICAL ISSUES FOUND: ___
- Issue 1: ______________________ [Fixed: ☐ Yes ☐ No]
- Issue 2: ______________________ [Fixed: ☐ Yes ☐ No]

HIGH PRIORITY ISSUES FOUND: ___
- Issue 1: ______________________ [Fixed: ☐ Yes ☐ No]
- Issue 2: ______________________ [Fixed: ☐ Yes ☐ No]

MEDIUM PRIORITY ISSUES FOUND: ___
- Issue 1: ______________________ [Fixed: ☐ Yes ☐ No]

LOW PRIORITY ISSUES FOUND: ___
- Issue 1: ______________________ [Fixed: ☐ Yes ☐ No]

TOTAL ZAPS AUDITED: ___
TOTAL ISSUES FIXED: ___

NEXT AUDIT DUE: __________
```

---

## 🎯 BEST PRACTICES

### 1. Regular Security Reviews
- **Monthly:** Quick Zap history review (15 min)
- **Quarterly:** Full security audit using this checklist (30 min)
- **Annually:** Review all app connections and permissions (1 hour)

### 2. Secure Defaults
- Always add authentication to webhooks
- Always use Secret Storage for API keys
- Always use minimum required permissions
- Always enable MFA on your Zapier account

### 3. Team Training
- Train new team members on security best practices
- Share this checklist with your team
- Make security part of your Zap creation process

### 4. Documentation
- Document which Zaps handle sensitive data
- Keep audit trail of security reviews
- Document who has access to what

---

## ❓ FAQ

**Q: How often should I run this audit?**
A: At minimum quarterly. Monthly if you handle sensitive data.

**Q: What if I find critical issues?**
A: Stop and fix them immediately before continuing the audit.

**Q: Can I share this checklist with my team?**
A: Yes! Please do. Security is a team effort.

**Q: Is Zapier insecure?**
A: No! Zapier's platform is very secure. But **users** often misconfigure things. This checklist helps you avoid those mistakes.

**Q: What if I need help fixing issues?**
A: Check Zapier's help docs: https://zapier.com/help/security
Or contact us for a professional audit.

---

## 🚀 WANT AN AUTOMATED SCANNER?

We're building an automated tool that will:
- ✅ Scan your entire workspace automatically
- ✅ Find all security issues in 30 seconds
- ✅ Provide detailed remediation steps
- ✅ Track improvements over time

**Join the waitlist:** [Your Email Signup Link]

---

## 📢 SHARE YOUR RESULTS

Found this helpful? Share what you discovered:

- Tweet: "Just audited my @Zapier workspace using this checklist. Found X security issues! 😱 [link]"
- Reddit: Post to r/nocode or r/zapier about what you found
- LinkedIn: Share security tips with your network

**Help others secure their workflows!**

---

## 📄 LICENSE

This checklist is free to use, share, and modify.
Created by [Your Name]
Last updated: December 2025

---

**🔒 Stay secure! 🔒**
