# 🛡️ Phishing Detector Extension

A comprehensive Chrome extension that detects phishing attempts on websites and within email interfaces like Gmail and Outlook. The extension analyzes pages in real-time and provides detailed risk assessments with persistent reporting.

## ✨ Features

### 1. **Real-Time Phishing Detection**
- Analyzes every web page you visit
- Detects phishing indicators with smart scoring
- 4-level risk assessment (Safe, Low, Medium, High)
- Live warning banner on suspicious sites

### 2. **Email Interface Detection**
- **Gmail Support**: Detects suspicious senders and phishing links in emails
- **Outlook/Hotmail Support**: Email analysis and fraud detection
- **Yahoo & ProtonMail**: Full email scanning capabilities
- Generic email pattern detection

### 3. **Advanced Phishing Indicators**
The extension checks for:

#### Domain & URL Analysis
- ✓ IP addresses used instead of domain names
- ✓ Suspicious top-level domains (.tk, .ml, .ga, .cf, etc.)
- ✓ Excessive subdomains or unusual complexity
- ✓ Homograph attacks (Cyrillic/Greek characters)
- ✓ Domain impersonation patterns
- ✓ URL shorteners and redirects

#### Form Analysis
- ✓ Forms submitting to external domains
- ✓ Forms requesting sensitive information without HTTPS
- ✓ Password, email, or credit card fields
- ✓ Suspicious form structure

#### Link Analysis
- ✓ Mismatched link text and destinations
- ✓ High percentage of external links
- ✓ Suspicious protocols
- ✓ Invalid or malformed URLs

#### Content Analysis
- ✓ Urgency keywords (urgent, expires, verify now, etc.)
- ✓ Poor grammar and generic greetings
- ✓ Password/credential requests
- ✓ Financial information requests
- ✓ Personal ID requests

#### Security Analysis
- ✓ Missing HTTPS encryption
- ✓ Suspicious meta refresh tags
- ✓ Embedded frames (clickjacking risk)

### 4. **Whitelist System**
Comprehensive whitelist of:
- Email providers (Gmail, Outlook, Yahoo, ProtonMail, etc.)
- Financial institutions (PayPal, Amazon, Banks, etc.)
- Tech giants (Google, Microsoft, Apple, Facebook, etc.)
- Cloud services (Dropbox, OneDrive, Box, etc.)
- Educational institutions and government (.edu, .gov domains)

Whitelisted domains are automatically marked as safe.

### 5. **Persistent Reporting & Logging**
- Auto-saves detected phishing attempts (Medium & High risk)
- Stores up to 100 recent reports
- Local browser storage (no data sent externally)
- Detailed report information:
  - URL and timestamp
  - Risk level and suspicion score
  - All detected indicators
  - Email provider details (if email interface)
  - Analysis metrics

### 6. **Reports Dashboard**
Access the full reports interface:
- **Recent Reports Tab**: Browse all detected phishing attempts
- **Statistics Tab**: View trends and top domains
- **Export/Import Tab**: Backup and restore reports

#### Reports Features:
- Search by URL
- Filter by risk level
- View detailed report information
- Export reports as JSON
- Import previously saved reports
- Clear all reports
- View top detected domains

### 7. **Visual Indicators**
- **Badge System**: Extension icon shows risk level
  - ✓ (Green) = Safe
  - · (Yellow) = Low Risk
  - ? (Orange) = Medium Risk
  - ! (Red) = High Risk
- **Color-Coded UI**: Risk levels visually differentiated
- **Progress Bars**: Visual representation of suspicion score
- **Interactive Modals**: Detailed report inspection

## 📁 Project Structure

```
├── manifest.json              # Extension configuration
├── content.js                 # Page analysis script (runs on every page)
├── background.js              # Service worker (message handling)
├── whitelist.js               # Legitimate domain whitelist
├── phishing-report.js          # Persistent reporting system
│
├── popup.html                 # Main popup interface
├── popup.js                   # Popup functionality
├── popup.css                  # Popup styling
│
├── reports.html               # Reports dashboard
├── reports.js                 # Reports functionality
├── reports.css                # Reports styling
│
├── icons/                     # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
└── README.md                  # This file
```

## 🚀 Installation

1. **Clone or Download** this repository
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable** "Developer mode" (top-right toggle)
4. **Click** "Load unpacked"
5. **Select** the extension folder
6. **Done!** The extension is now active

## 📖 Usage

### Basic Usage
1. Browse normally - the extension analyzes every page
2. Check the extension icon for risk level
3. Click the icon to view detailed analysis
4. Click "View Reports" to access the dashboard

### Accessing Reports
- **In Popup**: Click the "📊 View Reports" link
- **Direct URL**: Open `chrome-extension://YOUR_EXTENSION_ID/reports.html`

### Reading Reports
- Each report shows:
  - Risk level and suspicion score
  - Detected indicators with explanations
  - URL and timestamp
  - Email provider (if applicable)
  - Recommendations

### Exporting Data
1. Open Reports Dashboard
2. Go to "Export/Import" tab
3. Click "Download as JSON"
4. Save the file for backup or analysis

## 🔒 Security & Privacy

- **No Data Collection**: All analysis happens locally in your browser
- **No Tracking**: The extension does not track your browsing
- **No External Requests**: Phishing detection is entirely client-side
- **Local Storage**: Reports are stored only in your browser's local storage
- **No Account Required**: Completely anonymous operation

## ⚙️ How It Works

### 1. **Content Script Analysis**
When you load a page:
1. `content.js` runs and analyzes the page
2. Checks URL, domain, forms, links, and content
3. Calculates suspicion score (0-100+)
4. Generates risk level assessment
5. Shows warning banner if high risk

### 2. **Report Processing**
For Medium and High risk pages:
1. Results sent to service worker
2. Report saved to browser storage
3. Badge updated with risk indicator
4. Data available in Reports Dashboard

### 3. **Email Detection**
In Gmail/Outlook:
1. Detects email interface
2. Scans sender addresses
3. Analyzes email links
4. Checks for urgency/phishing patterns
5. Reports email-specific threats

## 📊 Suspicion Score Formula

Score = Sum of all indicators:
- IP Address: +30 points
- Suspicious TLD: +20 points each
- Form submits externally: +30 points
- No HTTPS: +30 points
- Brand impersonation: +40 points
- Homograph attack: +50 points
- Multiple urgency keywords: +20 points
- Suspicious email domain: +25 points
- Phishing link detected: +35 points
- Missing security headers: +20 points

**Risk Levels:**
- Safe: 0-19 points
- Low: 20-39 points
- Medium: 40-69 points
- High: 70+ points

## 🔧 Customization

### Adding to Whitelist
Edit `whitelist.js`:
```javascript
addToWhitelist('yourdomain.com', 'custom');
```

### Adjusting Score Weights
Edit `content.js` - modify `addIndicator()` calls with different point values

### Changing Report Limit
Edit `phishing-report.js`:
```javascript
this.maxReports = 100; // Change to desired limit
```

## 🐛 Known Limitations

1. **Email Content**: Gmail/Outlook detection works for web interface, not for actual email content analysis
2. **JavaScript-Heavy Sites**: May not detect dynamically loaded phishing content
3. **Network Requests**: Cannot access HTTPS certificate details (browser security restrictions)
4. **Load Time**: Analysis adds ~50-100ms to page load (optimized)

## 🚨 What to Do If You Find Phishing

1. **Don't enter any information**
2. **Close the page** (or click "Dismiss" on banner)
3. **Check the Reports dashboard** for details
4. **Report to authorities**:
   - Gmail: Click "Report phishing" in the email
   - Chrome: Send feedback with "Report harmful site"
   - FBI: ic3.gov (for financial phishing)

## 🔄 Version History

**v1.1 (Current)**
- Added email detection for Gmail/Outlook/Yahoo/ProtonMail
- Enhanced whitelist system
- Persistent reporting and logging
- Reports dashboard with statistics
- Improved phishing indicators
- Performance optimizations
- Security header checks

**v1.0**
- Basic phishing detection
- URL analysis
- Form checking
- Real-time warnings

## 📝 Technical Details

### Permissions Used
- `activeTab` - Access to current tab
- `tabs` - Tab management
- `scripting` - Run content scripts
- `storage` - Local report storage
- `<all_urls>` - Analyze all websites

### Manifest Version
- Version 3 (latest Chrome extension standard)

### Browser Compatibility
- Chrome 88+
- Edge 88+ (Chromium-based)
- Brave (Chromium-based)

## 🤝 Contributing

To improve the extension:
1. Test on known phishing sites (safely)
2. Report false positives/negatives
3. Suggest new indicators
4. Improve whitelist accuracy

## 📄 License

This project is provided as-is for educational and protective purposes.

## ⚠️ Disclaimer

This extension provides an additional layer of protection but **should not be relied upon as the sole security measure**. Always:
- Use strong, unique passwords
- Enable two-factor authentication
- Be cautious with personal information
- Keep your browser updated
- Report suspicious emails

## 💡 Tips for Safe Browsing

1. **Hover over links** to see their actual destination
2. **Look for HTTPS** lock icon in address bar
3. **Check sender email** closely - phishers often use similar addresses
4. **Verify unexpected requests** by contacting companies directly
5. **Never click email links** for sensitive actions - go directly to website
6. **Review Reports dashboard** regularly for detected threats

## 🎯 Future Enhancements

Planned features:
- Machine learning-based detection
- User feedback integration
- Cloud sync (optional, privacy-focused)
- Mobile app integration
- Advanced certificate validation
- DNS/WHOIS lookup integration
- Custom notification settings

---

**Made with 🛡️ for safer browsing**

For issues or questions, review the code or check your browser console for debug messages.
