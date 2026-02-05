# Website Safety Classification & Risk Assessment

## 🟢 SAFE WEBSITES (Whitelisted Domains)

### Email Providers
- gmail.com, googlemail.com
- outlook.com, hotmail.com, live.com, microsoft.com
- yahoo.com, ymail.com
- protonmail.com, proton.me
- aol.com, icloud.com, me.com, mac.com
- mail.com, tutanota.com, zoho.com

### Financial Institutions
- paypal.com, amazon.com (all regional variants)
- americanexpress.com, mastercard.com, visa.com
- bankofamerica.com, wellsfargo.com, chase.com
- citi.com, capitalone.com, discover.com
- stripe.com, squareup.com

### Tech Giants
- google.com, youtube.com, maps.google.com, drive.google.com
- **github.com** ✓ (Development & payments)
- microsoft.com, office.com, teams.microsoft.com
- apple.com, itunes.com, appstore.apple.com
- facebook.com, instagram.com, linkedin.com
- netflix.com, twitch.tv, discord.com
- slack.com, zoom.us, openai.com

### Cloud & Storage Services
- dropbox.com, onedrive.com, drive.google.com
- aws.amazon.com, heroku.com, vercel.com, netlify.com

### Educational & Reference
- All `.edu` domains (universities)
- coursera.org, udemy.com, edx.org
- codecademy.com, khanacademy.org
- wikipedia.org, wikimedia.org

### Government & Legal
- All `.gov` domains (US government)
- irs.gov, usps.com, whitehouse.gov

### Major Retailers
- amazon.com, ebay.com, walmart.com, target.com
- bestbuy.com, costco.com, alibaba.com

---

## 🔴 UNSAFE WEBSITES (High-Risk Indicators)

### Suspicious Top-Level Domains (TLDs)
⚠️ **High Risk**: `.tk`, `.ml`, `.ga`, `.cf`, `.gq`, `.xyz`, `.top`, `.pw`, `.ws`, `.biz`, `.info`
- Often used by scammers due to low cost and minimal verification

### Pirated Content & Illegal Streaming Sites
Common indicators in domain names and URLs:
- Sites containing keywords like: "free movies", "streaming", "torrent", "watch online"
- Domains with generic/suspicious names combined with risky TLDs
- Examples of patterns: `movie.tk`, `stream.ml`, `torrentx.xyz`

### Phishing Red Flags
Detected through multiple criteria:

**1. URL Pattern Dangers:**
- IP addresses instead of domain names (e.g., `https://192.168.1.1`)
- Suspicious keywords in URLs: `login`, `verify`, `account`, `update`, `secure`, `banking`, `paypal`, `confirm`
- Homograph attacks (Cyrillic characters mimicking ASCII)
- URL-link mismatches (displayed text differs from actual URL)

**2. Domain Issues:**
- Typosquatting (misspelled famous brands)
- Suspicious TLDs combined with brand names
- Unregistered or recently registered domains
- Missing or invalid SSL certificates

**3. Content Indicators:**
- Urgent language: "Act now!", "Verify immediately!", "Confirm credentials"
- Suspicious login forms asking for excessive personal data
- Poor grammar, spelling errors
- Mismatched branding/logos

**4. Email-Based Phishing:**
- Spoofed sender addresses
- Phishing links disguised with misleading anchor text
- Suspicious email attachments

---

## ✅ RECOMMENDED ACTIONS FOR USERS

### For Unsafe Websites:

| Risk Level | Action | Details |
|-----------|--------|---------|
| **HIGH** | ⛔ AVOID & REPORT | <ul><li>Do not enter any personal/financial information</li><li>Close the site immediately</li><li>Report to the extension</li><li>Report to authorities if it's phishing</li></ul> |
| **MEDIUM** | ⚠️ EXERCISE CAUTION | <ul><li>Verify legitimacy through official channels</li><li>Use bookmarks instead of typing URLs</li><li>Check SSL certificate (green lock icon)</li><li>Never enter passwords</li></ul> |
| **LOW** | 🟡 BE CAREFUL | <ul><li>Normal browsing is acceptable</li><li>Avoid entering sensitive credentials</li><li>Watch for unusual behavior</li></ul> |
| **SAFE** | ✓ TRUSTED | <ul><li>Normal browsing recommended</li><li>Safe for financial transactions</li><li>Safe for account management</li></ul> |

### Protective Steps:

1. **Verify Domain Authority**
   - Always type URLs directly or use bookmarks
   - Check the lock icon for SSL certificate
   - Hover over links to verify actual URL before clicking

2. **Avoid Suspicious TLDs**
   - Be extremely cautious with `.tk`, `.ml`, `.ga`, `.cf`, `.xyz`, `.top`
   - These are legitimate but frequently used for scams

3. **Use Strong Verification Methods**
   - Enable two-factor authentication on important accounts
   - Use password managers with unique passwords per site
   - Verify through official contact information (not email links)

4. **Report Suspicious Sites**
   - Use the Phishing Detector extension to report
   - Contact the website's host/registrar
   - Report to authorities (FBI IC3, FTC) for major phishing attempts

5. **Monitor for Pirated Content Sites**
   - These often contain malware, spyware, and ads
   - Avoid all `torrent`, `stream`, `free movie` sites with risky TLDs
   - Use legitimate services: Netflix, Disney+, Amazon Prime, etc.

---

## 🛡️ How the Phishing Detector Works

The extension automatically:
- ✓ Checks URLs against the whitelist
- ✓ Detects phishing keywords and patterns
- ✓ Verifies SSL certificates
- ✓ Analyzes form fields for credential harvesting
- ✓ Checks security headers
- ✓ Detects email interface phishing attempts
- ✓ Generates a suspicion score (0-100)
- ✓ Assigns risk levels: Safe → Low → Medium → High

**Risk Score Calculation:**
- Each suspicious indicator adds points
- Score 0-20: **SAFE** ✓
- Score 21-40: **LOW** 🟡
- Score 41-70: **MEDIUM** ⚠️
- Score 71-100: **HIGH** 🔴

---

## 📊 Summary Table

| Category | Examples | Status | Recommendation |
|----------|----------|--------|-----------------|
| Email Services | Gmail, Outlook, Yahoo | ✓ SAFE | Use freely for email |
| Banks & Finance | PayPal, Chase, AmEx | ✓ SAFE | Safe for transactions |
| Cloud Storage | Google Drive, Dropbox | ✓ SAFE | Safe for documents |
| Tech Platforms | GitHub, Microsoft, Apple | ✓ SAFE | Safe for development/accounts |
| Streaming (Legal) | Netflix, YouTube | ✓ SAFE | Use legitimate services |
| Pirated Content | torrent.tk, movie.ml | 🔴 UNSAFE | AVOID - malware/scams |
| Unknown .tk/.ml | Various random domains | 🔴 UNSAFE | AVOID - high risk TLDs |
| Phishing Pages | login-verify.tk, secure-account.xyz | 🔴 UNSAFE | AVOID - report immediately |

---

## 🔗 Resources

- **Report Phishing**: Use the extension's report feature
- **Legal Streaming**: Netflix, Disney+, Amazon Prime, Hulu, YouTube, HBO Max
- **Safer Alternatives to Piracy**:
  - Netflix: $6-22/month
  - Disney+: $7.99/month
  - Amazon Prime Video: included with Prime
  - YouTube Premium: $13.99/month
  - Legitimate torrents: LinuxTracker.org (legal open-source)
