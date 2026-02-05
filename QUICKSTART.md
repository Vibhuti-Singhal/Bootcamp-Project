# 🚀 Quick Start Guide

## 5-Minute Setup

### Step 1: Load the Extension (2 minutes)
1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle **"Developer mode"** in the top-right corner
3. Click **"Load unpacked"**
4. Select the `Bootcamp-Project` folder
5. ✅ Done! You should see the extension loaded

### Step 2: Test It (2 minutes)
1. Visit any website
2. Click the **extension icon** next to your address bar
3. You'll see:
   - 🟢 **Green checkmark** = Safe site
   - 🟡 **Yellow dot** = Minor concerns
   - 🟠 **Orange ?** = Suspicious!
   - 🔴 **Red !** = High danger!

### Step 3: View Reports (1 minute)
1. Click the extension icon
2. Click **"📊 View Reports"** at the top
3. Explore the Reports Dashboard:
   - **Recent Reports** - See detected phishing
   - **Statistics** - View detection trends
   - **Export/Import** - Backup your data

---

## 🎯 What to Do Now

### Try Email Detection
- Open [Gmail](https://mail.google.com) or [Outlook](https://outlook.com)
- The extension will scan email subjects and senders
- Click the extension icon to see email-specific detections

### Visit Test Sites
Test the extension's detection (these are safe to visit):
- Normal site → Green checkmark ✓
- Suspicious site → Orange/Red warning ⚠️

### Check Your First Report
1. Visit any site (safe or suspicious)
2. Click extension icon
3. Click "View Reports"
4. See your detection logged

---

## 🔍 Understanding the Results

### Risk Levels Explained:

| Level | Color | Meaning | Action |
|-------|-------|---------|--------|
| **Safe** | 🟢 Green | No suspicion | Normal browsing |
| **Low** | 🟡 Yellow | Minor concerns | Be cautious |
| **Medium** | 🟠 Orange | Several indicators | Don't share personal info |
| **High** | 🔴 Red | Likely phishing | LEAVE IMMEDIATELY |

### Suspicion Score:
- **0-19** = Safe
- **20-39** = Low risk
- **40-69** = Medium risk  
- **70+** = High risk

---

## 📊 Reports Dashboard Features

### Recent Reports Tab
```
✓ Search by URL
✓ Filter by risk level (High, Medium, Low)
✓ View detailed information
✓ Delete individual reports
✓ Export all reports
```

### Statistics Tab
```
✓ Total detections count
✓ Breakdown by risk level
✓ Most dangerous domains
✓ Detection trends
```

### Export/Import Tab
```
✓ Download reports as JSON
✓ Import previously saved reports
✓ Backup your detection history
```

---

## ⚠️ What Triggers Phishing Detection

### 🚩 High Risk Indicators:
- IP address instead of domain
- Unusual domain characters
- Forms requesting passwords without HTTPS
- Fake bank/PayPal/Amazon domains
- Urgency language (Verify NOW, Account Suspended)
- Poor grammar (Dear Customer, Kindly Click)
- Links don't match text

### 🟡 Low Risk Indicators:
- Excessive external links
- Generic greetings
- Some urgency keywords
- Unusual domain structure

---

## 🛠️ Common Questions

### Q: Will this slow down my browser?
**A:** No! Analysis completes in <100ms per page. You won't notice any slowdown.

### Q: Does it send my data somewhere?
**A:** No! Everything happens locally in your browser. No data is sent anywhere.

### Q: Can I disable it?
**A:** Yes! Go to `chrome://extensions` and toggle off the extension.

### Q: What about HTTPS sites?
**A:** HTTPS protects your connection but doesn't guarantee the site isn't phishing. This extension checks for other indicators.

### Q: How do I add my own domains to the whitelist?
**A:** Edit `whitelist.js` and use:
```javascript
addToWhitelist('mydomain.com', 'custom');
```

---

## 🔐 Safe Browsing Tips

1. **Hover over links** to see where they go
2. **Check the padlock** for HTTPS
3. **Never click email links** for sensitive actions
4. **Type URLs directly** into address bar
5. **Review this extension's reports** regularly

---

## 📱 Chrome Extension Management

### Pin the Extension (Recommended)
1. Click the **Extensions icon** (puzzle piece) in toolbar
2. Find "Phishing Detector"
3. Click the **pin icon** to pin it
4. Now it's always visible! 📌

### Keyboard Shortcut (Optional)
1. Go to `chrome://extensions/shortcuts`
2. Find "Phishing Detector"
3. Set a keyboard shortcut (e.g., Ctrl+Shift+P)
4. Press the shortcut to open popup instantly

---

## 🎓 Learning Resources

### Inside the Extension:
- **[README.md](README.md)** - Full documentation
- **[CHANGES.md](CHANGES.md)** - What was improved
- **Console logs** - Open DevTools (F12) → Console → See debug info

### Extension Code Structure:
```
content.js         → Analyzes every page you visit
background.js      → Manages reports and UI updates
whitelist.js       → Safe domain database
phishing-report.js → Stores detection history
popup.js           → Small popup interface
reports.js         → Full analytics dashboard
```

---

## 🆘 Troubleshooting

### Extension not showing results?
1. Refresh the page
2. Go to `chrome://extensions`
3. Find the extension and click reload button 🔄

### Reports page not loading?
1. Make sure you clicked the correct link
2. Check if JavaScript is enabled
3. Try opening in an incognito window

### Seeing too many false positives?
1. Add legitimate sites to custom whitelist
2. Report false positives to help improve detection
3. Check the whitelist in `whitelist.js`

---

## 🎉 You're Ready!

Your phishing detector is now active and protecting you from:
- ✅ Fake login pages
- ✅ Impersonation domains  
- ✅ Malicious email links
- ✅ Credential theft attempts
- ✅ Financial fraud sites
- ✅ Clickjacking attacks

### Next Steps:
1. Browse normally - extension works automatically
2. Check reports occasionally
3. Export data for backup (optional)
4. Help others stay safe by sharing this extension!

---

## 📞 Need Help?

**Check the browser console for debug info:**
1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Look for messages starting with "🛡️"
4. These show exactly what the extension detected

**For questions:**
- Review [README.md](README.md) for detailed documentation
- Check [CHANGES.md](CHANGES.md) for what was improved
- Look at the code comments in JavaScript files

---

## 🚀 Advanced (Optional)

### Customize Detection Rules
Edit `content.js` to adjust:
- What counts as suspicious
- Point values for indicators
- Which keywords trigger warnings

### Manage Reports
Edit `phishing-report.js` to:
- Change maximum stored reports (currently 100)
- Adjust data retention
- Add custom report fields

### Update Whitelist
Edit `whitelist.js` to:
- Add your own trusted domains
- Organize by category
- Remove domains if needed

---

**That's it! Happy, safer browsing! 🛡️**

For more details, see [README.md](README.md)
