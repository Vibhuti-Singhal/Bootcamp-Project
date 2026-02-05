<div align="center">

# 🛡️ Phishing Detector Extension

### Real-time anti-phishing protection for Chrome, Gmail, and Outlook.

A comprehensive Chrome extension that detects phishing attempts on websites and within email interfaces like Gmail and Outlook. The extension analyzes pages in real-time and provides detailed risk assessments with persistent reporting.

</div>

---

## 🚀 Installation

1. **Clone or Download** this repository
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable** "Developer mode" (top-right toggle)
4. **Click** "Load unpacked"
5. **Select** the extension folder
6. **Done!** The extension is now active

---
  
## ✨ Key Features

- **Real-Time Analysis:** Scans every page for 20+ phishing indicators (IP-based URLs, homograph attacks, suspicious TLDs).

- **Email Protection:** Specialized hooks for Gmail, Outlook, Yahoo, and ProtonMail to flag suspicious senders and links.

- **Risk Scoring:** Dynamic 4-level assessment (Safe to High Risk) based on a weighted point system.

- **Privacy First:** 100% client-side analysis. No data is sent to external servers.

- **Reporting Dashboard:** Local storage for up to 100 reports with export/import (JSON) functionality.

---

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

---

## 📊 Suspicion Scoring

| Risk Level | Score | Action Taken |
| :-- | :-- | :--|
| Safe | 0-19 | Regular browsing |
| Low | 20-39 | Visual badge update |
| Medium | 40-69 | Logged to Dashboard |
| High | 70+ | Warning banner displayed |

---

## 📝 Technical Details

### Permissions Used
- `activeTab` - Access to current tab
- `tabs` - Tab management
- `scripting` - Run content scripts
- `storage` - Local report storage
- `<all_urls>` - Analyze all websites

---

### Manifest Version
- Version 3 (latest Chrome extension standard)

---

## 👥 Project Contributors 

* **Vibhuti Singhal** ([@Vibhuti-Singhal](https://github.com/Vibhuti-Singhal))
* **Pratham** ([@Pratham08-11](https://github.com/Pratham08-11))
* **Prince Agarwal** ([@Princeag1652](https://github.com/Princeag1652))
* **Shruti Choudhary** ([@ShrutiChoudhary-23](https://github.com/ShrutiChoudhary-23))
* **Saurav Jha** ([@saurav3255](https://github.com/saurav3255))
* **Vikas Singh** ([@vikasingh0897](https://github.com/vikasingh0897))

---

## 🔒 Security Disclaimer

This tool is for educational and protective use. Always use MFA and exercise caution with sensitive data.

---

<div align="center">

## ☕ Support Our Work

If you like my projects and want to support my work 

[![Buy Me A Coffee](https://img.shields.io/badge/Buy_Us_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/vikasingh0897) 

</div>

---

<div align="center">

**Made with 🛡️ for safer browsing**

</div>