# Test Zaps - Create Vulnerable Zaps for Testing

This guide helps you create test Zaps with intentional vulnerabilities to demo the Kintsugi scanner.

---

## 🔴 Test Zap 1: Hardcoded API Key (CRITICAL)

**Name:** `TEST - Hardcoded Stripe Key`

**Steps to create:**
1. Go to Zapier → Create Zap
2. **Trigger:** Schedule by Zapier
   - Frequency: Every Day
3. **Action:** Code by Zapier (JavaScript)
   - Code:
   ```javascript
   // Hardcoded API key - INSECURE!
   const stripeKey = "sk_live_FAKE_KEY_FOR_TESTING_123456789";
   const apiToken = "token_abc123_secret";

   // Simulate API call
   return {
     message: "Payment processed",
     key: stripeKey
   };
   ```
4. Turn Zap ON
5. Save

**Expected Detection:** CRITICAL - Hardcoded API Key in Code

---

## 🔴 Test Zap 2: Command Injection (CRITICAL)

**Name:** `TEST - Eval Command Injection`

**Steps to create:**
1. Create Zap
2. **Trigger:** Webhooks by Zapier → Catch Hook
3. **Action:** Code by Zapier (JavaScript)
   - Code:
   ```javascript
   // Dangerous eval() usage
   const formula = inputData.formula || "2 + 2";
   const result = eval(formula); // DANGEROUS!

   return {result: result};
   ```
4. Turn Zap ON
5. Save

**Expected Detection:** CRITICAL - Dangerous Code Execution Detected (eval)

---

## 🔴 Test Zap 3: Python Command Injection (CRITICAL)

**Name:** `TEST - Python Subprocess Risk`

**Steps to create:**
1. Create Zap
2. **Trigger:** Schedule by Zapier → Every Hour
3. **Action:** Code by Zapier (Python)
   - Code:
   ```python
   import os
   import subprocess

   # Dangerous os.system usage
   filename = input_data.get('filename', 'test.txt')
   os.system(f"cat {filename}")  # DANGEROUS!

   # Also dangerous
   subprocess.call("ls -la", shell=True)  # DANGEROUS!

   return {'status': 'done'}
   ```
4. Turn Zap ON
5. Save

**Expected Detection:** CRITICAL - Dangerous Code Execution Detected (os.system, subprocess)

---

## 🟠 Test Zap 4: Insecure Webhook (HIGH)

**Name:** `TEST - Vulnerable Feedback Collector`

**Steps to create:**
1. Create Zap
2. **Trigger:** Webhooks by Zapier → Catch Hook
   - **IMPORTANT:** Do NOT add any authentication
   - Just leave the default webhook URL
3. **Action:** Gmail → Send Email
   - To: your-email@example.com
   - Subject: New Feedback
   - Body: {{trigger.message}}
4. Turn Zap ON
5. Save

**Expected Detection:** HIGH - Catch Hook Without Authentication

---

## 🟡 Test Zap 5: PII in Zap Name (MEDIUM)

**Name:** `TEST - Send email to john.doe@company.com`

**Steps to create:**
1. Create Zap
2. **Name it exactly:** `TEST - Send email to john.doe@company.com`
3. **Trigger:** Schedule by Zapier → Every Day
4. **Action:** Gmail → Send Email
   - To: test@test.com
   - Subject: Test
   - Body: Test
5. Turn Zap ON
6. Save

**Expected Detection:** MEDIUM - Email Address in Zap Name

---

## 🟡 Test Zap 6: Phone Number in Name (MEDIUM)

**Name:** `TEST - Call 555-123-4567 on signup`

**Steps to create:**
1. Create Zap
2. **Name it exactly:** `TEST - Call 555-123-4567 on signup`
3. **Trigger:** Schedule by Zapier → Every Day
4. **Action:** Delay by Zapier → 1 Minute
5. Turn Zap ON
6. Save

**Expected Detection:** MEDIUM - Phone Number in Zap Name

---

## 🔴 Test Zap 7: Multiple Issues (CRITICAL + HIGH)

**Name:** `TEST - Multi-Vulnerability Demo`

**Steps to create:**
1. Create Zap
2. **Trigger:** Webhooks by Zapier → Catch Hook (NO auth)
3. **Action 1:** Code by Zapier (JavaScript)
   - Code:
   ```javascript
   // Multiple security issues
   const apiKey = "sk_test_hardcoded_key_123";
   const userInput = inputData.query || "";

   // Command injection risk
   const result = eval(userInput);

   // Another dangerous pattern
   setTimeout(userInput, 1000);

   return {
     result: result,
     key: apiKey
   };
   ```
4. Turn Zap ON
5. Save

**Expected Detections:**
- CRITICAL - Hardcoded API Key
- CRITICAL - Dangerous Code Execution (eval, setTimeout with string)
- HIGH - Insecure Webhook

---

## 📊 Summary of Test Zaps

| # | Zap Name | Vulnerabilities | Severity |
|---|----------|----------------|----------|
| 1 | TEST - Hardcoded Stripe Key | Hardcoded API key | 🔴 CRITICAL |
| 2 | TEST - Eval Command Injection | eval() usage | 🔴 CRITICAL |
| 3 | TEST - Python Subprocess Risk | os.system, subprocess | 🔴 CRITICAL |
| 4 | TEST - Vulnerable Feedback Collector | No webhook auth | 🟠 HIGH |
| 5 | TEST - Send email to john.doe@company.com | Email in name | 🟡 MEDIUM |
| 6 | TEST - Call 555-123-4567 on signup | Phone in name | 🟡 MEDIUM |
| 7 | TEST - Multi-Vulnerability Demo | All of the above | 🔴 CRITICAL |

---

## 🧪 Testing Workflow

1. **Create all test Zaps** (15-20 minutes)
2. **Turn them all ON**
3. **Run Kintsugi scan**
4. **Expected results:**
   - Total Zaps Scanned: 7+ (your real Zaps + test Zaps)
   - Issues Found: ~10-12 issues
   - Breakdown:
     - CRITICAL: 5-7 issues
     - HIGH: 2-3 issues
     - MEDIUM: 2 issues

5. **Verify each fix message:**
   - Should have proper line breaks
   - Multiple STEP 1, STEP 2, etc.
   - Examples with ✅ and ❌
   - Clear, readable format

---

## 🗑️ Cleanup After Testing

To remove test Zaps:

1. Go to Zapier dashboard
2. Filter by "TEST -" in search
3. Select all test Zaps
4. Turn OFF
5. Delete

---

## 💡 Demo Tips

**For screenshots/demos:**
- Test Zap 7 (Multi-Vulnerability) shows multiple issues in one Zap
- Test Zap 4 (Insecure Webhook) shows the most common real-world issue
- Test Zap 2 (Eval) shows the most dangerous vulnerability

**For presentations:**
1. Show "before" state: 7 test Zaps running
2. Run Kintsugi scan
3. Show findings with detailed fix messages
4. Fix one issue live (rename the PII Zap)
5. Re-scan to show issue count decreased

---

**Ready to test! Create these Zaps and run the scanner.** 🧪
