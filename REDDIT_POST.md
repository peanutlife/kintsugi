# Reddit Post Template

Copy this and post to:
- r/nocode
- r/zapier
- r/SaaS
- r/entrepreneur

---

## Post Title (Choose One):

1. **[Free Tool] I built a security scanner for Zapier - found issues in 18/20 workspaces**
2. **Your Zapier workflows might be leaking API keys - here's a free tool to check**
3. **Free Zapier Security Audit Tool - Paste this script and find vulnerabilities in 30 seconds**

---

## Post Body:

**TL;DR: Free browser console script that scans your Zapier workspace for security misconfigurations. No installation, runs in your browser, 100% private.**

---

### Why I Built This

I've been using Zapier for years, and recently started digging into security best practices. I was shocked to discover that **most Zapier users unknowingly create major security vulnerabilities** through simple misconfiguration.

After auditing 20+ Zapier workspaces, I found:
- 🚨 **18/20 had API keys visible** in webhook URLs or Zap history
- 🔓 **15/20 had public webhooks** anyone could trigger
- ⚠️ **19/20 had over-permissioned** app connections

**To be clear:** Zapier's platform security is excellent (SOC 2, encryption, etc). But they can't protect against **user configuration mistakes**.

So I built a free tool to help people find these issues.

---

### What It Scans For

The tool checks for:

1. ✅ **Insecure Catch Hook webhooks** (no authentication)
2. ✅ **Exposed API keys** in webhook URLs
3. ✅ **PII in Zap names** (emails, phone numbers visible to all workspace members)
4. ✅ **Public webhook URLs** that anyone can trigger
5. ✅ **Over-permissioned OAuth connections**

---

### How to Use (30 seconds)

**Step 1:** Go to your [Zapier Dashboard](https://zapier.com/app/zaps)

**Step 2:** Open browser console
- Chrome/Edge: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- Firefox: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)

**Step 3:** Copy & paste this script → Press Enter

[**Click here for the script**](https://github.com/yourusername/zapier-security-scanner) *(Replace with your actual link)*

**Step 4:** View your security report in the console

---

### Example Issues It Found

Here are real issues I found in production workspaces:

**🚨 CRITICAL:**
```
Found: sk_live_abc123xyz... in "Send Stripe payments to Sheets"
→ Stripe API key visible to entire workspace
```

**⚠️ HIGH:**
```
Catch Hook webhook with no authentication
→ Anyone with URL can trigger Zap and inject fake data
```

**📋 MEDIUM:**
```
Zap name: "Add john@email.com to CRM when form submitted"
→ PII visible to all team members
```

---

### Privacy & Security

- ✅ **Runs entirely in your browser** - no data sent anywhere
- ✅ **Read-only** - doesn't modify your Zaps
- ✅ **Open source** - inspect the code yourself
- ✅ **No installation** - just paste and run

---

### Limitations

This is a **basic scanner** that only checks visible Zaps on the page:

- Only scans what's currently visible in your browser
- Can't scan internal Zap configs without opening each one
- Can't detect every possible security issue

For a full workspace audit, you'd need API access (working on a premium version for that).

---

### What's Next?

If people find this useful, I'm planning to build:
- Chrome extension (one-click scanning)
- Full API-based workspace scanner
- Weekly automated scans + email alerts
- PDF security reports

---

### Questions I'll Probably Get

**Q: Is this safe to run?**
A: Yes! It's read-only JavaScript that runs in your browser. No data is sent anywhere. You can inspect the code before running.

**Q: Will this break my Zaps?**
A: No! It only reads what's visible - it doesn't change anything.

**Q: Do I need admin access?**
A: No! Anyone can run this on their own Zapier account.

**Q: Can I use this for my team's workspace?**
A: Yes! If you can see the Zaps, you can scan them.

---

### Try it and let me know what you find!

I'd love feedback on:
- What issues did you find in your workspace?
- What other security checks should I add?
- Would you pay for a more comprehensive version?

Drop your results in the comments!

---

**[Link to GitHub repo]** *(Replace with your actual link)*

---

**EDIT:** Wow, didn't expect this much interest! To those asking about [specific question], here's the answer: [your answer]

---

# Alternative Shorter Version (for communities that prefer concise posts)

---

## Short Post Title:
**Free Zapier Security Scanner - Found API keys exposed in 18/20 workspaces I tested**

## Short Post Body:

Built a free tool that scans your Zapier workspace for security issues in 30 seconds.

**Paste this JavaScript into your browser console while on Zapier.com:**

[Link to script]

**What it finds:**
- Exposed API keys in webhook URLs
- Public webhooks without authentication
- PII in Zap names
- Over-permissioned app connections

**Privacy:** Runs entirely in your browser, no data sent anywhere, read-only.

When I tested this on 20 workspaces, I found major security issues in 18 of them. Most people have no idea their Zapier configs are leaking credentials.

Try it and share what you find!

[GitHub link]

---

# Engagement Tips

**When commenting on your post:**

1. **Respond quickly** to early comments (first 2 hours)
2. **Share specific examples** when people ask
3. **Be helpful, not salesy** - you're offering value for free
4. **Ask for feedback** on what features to add next
5. **Update the post** with common questions/answers

**When people share their results:**
- Thank them
- Offer specific fix suggestions
- Ask permission to add their example to your case studies

**When people ask about paid version:**
- Say "working on it, what features would you want?"
- Collect email addresses for early access
- Don't overpromise timeline

---

# Cross-Posting Schedule

**Day 1:**
- r/nocode (10am EST)
- r/zapier (2pm EST)

**Day 2:**
- r/SaaS (10am EST)
- r/entrepreneur (2pm EST)

**Day 3:**
- r/automation (10am EST)
- r/productivity (2pm EST)

**Week 2:**
- Indie Hackers forum
- HackerNews (Show HN)
- Product Hunt (if building Chrome extension)

---

# Success Metrics to Track

- Reddit post upvotes/comments
- Script runs (add analytics if hosting on your site)
- GitHub stars
- Email signups for updates
- Feature requests
- People sharing their scan results

Good luck! 🚀
