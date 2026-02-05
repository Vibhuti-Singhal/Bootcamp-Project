// content.js - Analyzes web pages for phishing indicators

class PhishingDetector {
  constructor() {
    this.suspicionScore = 0;
    this.indicators = [];
    this.detectionDetails = {
      isEmailInterface: false,
      emailProvider: null,
      checkedElements: 0
    };
    this.urlPatterns = {
      // Common phishing URL patterns
      suspiciousKeywords: ['login', 'verify', 'account', 'update', 'secure', 'banking', 'paypal', 'confirm'],
      suspiciousTLDs: ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.pw', '.ws', '.biz', '.info'],
      ipAddressPattern: /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
      // Regex for detecting international domain names that look like ASCII
      homographPattern: /[а-яА-Я0-9]/
    };
    this.performanceMetrics = {
      startTime: Date.now(),
      endTime: null,
      duration: null
    };
  }

  analyze() {
    // Check if this is an email interface first
    this.checkEmailInterface();

    this.checkURL();
    this.checkDomain();
    this.checkForms();
    this.checkLinks();
    this.checkSSL();
    this.checkContent();
    this.checkSecurityHeaders();

    this.performanceMetrics.endTime = Date.now();
    this.performanceMetrics.duration = this.performanceMetrics.endTime - this.performanceMetrics.startTime;

    return {
      score: this.suspicionScore,
      indicators: this.indicators,
      riskLevel: this.getRiskLevel(),
      detectionDetails: this.detectionDetails,
      performanceMetrics: this.performanceMetrics
    };
  }

  checkEmailInterface() {
    const hostname = window.location.hostname;

    // Check Gmail
    if (hostname.includes('gmail') || hostname.includes('googlemail')) {
      this.detectionDetails.isEmailInterface = true;
      this.detectionDetails.emailProvider = 'Gmail';
      this.checkGmailPhishing();
      return;
    }

    // Check Outlook/Hotmail
    if (hostname.includes('outlook') || hostname.includes('hotmail') || hostname.includes('live.com')) {
      this.detectionDetails.isEmailInterface = true;
      this.detectionDetails.emailProvider = 'Outlook';
      this.checkOutlookPhishing();
      return;
    }

    // Check Yahoo
    if (hostname.includes('yahoo') || hostname.includes('ymail')) {
      this.detectionDetails.isEmailInterface = true;
      this.detectionDetails.emailProvider = 'Yahoo';
      this.checkGenericEmailPhishing();
      return;
    }

    // Check ProtonMail
    if (hostname.includes('protonmail') || hostname.includes('proton.me')) {
      this.detectionDetails.isEmailInterface = true;
      this.detectionDetails.emailProvider = 'ProtonMail';
      this.checkGenericEmailPhishing();
      return;
    }
  }

  checkGmailPhishing() {
    // Check for suspicious sender addresses
    const fromElements = document.querySelectorAll('[email], [data-email], .kq [email]');
    let suspiciousSenders = 0;

    fromElements.forEach(el => {
      const email = el.textContent || el.getAttribute('email') || el.getAttribute('data-email');
      if (email && this.isSuspiciousEmailAddress(email)) {
        suspiciousSenders++;
      }
    });

    if (suspiciousSenders > 0) {
      this.addIndicator(`${suspiciousSenders} suspicious sender(s) detected in emails`, 25);
    }

    // Check for phishing links in email bodies
    const emailBodies = document.querySelectorAll('[data-tooltip], .Bk3pqc, [role="region"]');
    emailBodies.forEach(body => {
      const links = body.querySelectorAll('a');
      links.forEach(link => {
        if (this.isPhishingLink(link.href, link.textContent)) {
          this.addIndicator('Phishing link detected in email', 35);
        }
      });
    });
  }

  checkOutlookPhishing() {
    // Similar checks for Outlook interface
    const fromElements = document.querySelectorAll('[aria-label*="From"], [title*="From"]');

    fromElements.forEach(el => {
      const senderText = el.textContent;
      if (senderText && this.isSuspiciousEmailAddress(senderText)) {
        this.addIndicator('Suspicious sender address detected', 25);
      }
    });
  }

  checkGenericEmailPhishing() {
    // Generic checks applicable to any email provider
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const bodyText = document.body.innerText;
    const emails = bodyText.match(emailRegex) || [];

    const suspiciousEmails = emails.filter(email => this.isSuspiciousEmailAddress(email));
    if (suspiciousEmails.length > 0) {
      this.addIndicator(`${suspiciousEmails.length} suspicious email address(es) found`, 20);
    }
  }

  isSuspiciousEmailAddress(email) {
    if (!email || typeof email !== 'string') return false;

    email = email.toLowerCase().trim();

    // Check for common impersonation patterns
    const impersonationPatterns = [
      /paypal.*@(?!paypal\.com)/,
      /amazon.*@(?!amazon\.com)/,
      /apple.*@(?!apple\.com)/,
      /microsoft.*@(?!microsoft\.com)/,
      /google.*@(?!google\.com)/,
      /bank.*@(?!.*\.bank\.)/,
      /support.*@(?!.*\.com$)/,  // Generic support address
    ];

    return impersonationPatterns.some(pattern => pattern.test(email));
  }

  isPhishingLink(href, text) {
    if (!href) return false;

    // Check if link text doesn't match destination
    try {
      const linkUrl = new URL(href);
      const linkHostname = linkUrl.hostname;

      // Domains the link claims to be
      const claimedDomains = ['paypal', 'amazon', 'apple', 'microsoft', 'google', 'bank'];

      for (const domain of claimedDomains) {
        if (text && text.toLowerCase().includes(domain) && !linkHostname.includes(domain)) {
          return true;
        }
      }

      // Check if URL is obfuscated
      if (linkHostname.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
        return true;
      }
    } catch (e) {
      return false;
    }

    return false;
  }

  checkURL() {
    const url = window.location.href;
    const hostname = window.location.hostname;

    // Check for IP address instead of domain
    if (this.urlPatterns.ipAddressPattern.test(url)) {
      this.addIndicator('URL uses IP address instead of domain name', 30);
    }

    // Check for suspicious TLDs
    this.urlPatterns.suspiciousTLDs.forEach(tld => {
      if (hostname.endsWith(tld)) {
        this.addIndicator(`Suspicious top-level domain: ${tld}`, 20);
      }
    });

    // Check for excessive subdomains
    const subdomains = hostname.split('.');
    if (subdomains.length > 4) {
      this.addIndicator('Excessive subdomains in URL', 15);
    }

    // Check for @ symbol in URL (often used to hide real domain)
    if (url.includes('@')) {
      this.addIndicator('@ symbol in URL (potential obfuscation)', 25);
    }

    // Check for URL shorteners (potential redirect)
    const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly'];
    if (shorteners.some(shortener => hostname.includes(shortener))) {
      this.addIndicator('URL shortener detected', 10);
    }
  }

  checkDomain() {
    const hostname = window.location.hostname;

    // Check against whitelist first (with whitelist.js)
    if (typeof isWhitelistedDomain !== 'undefined') {
      if (isWhitelistedDomain(hostname)) {
        return; // Domain is legitimate
      }
    }

    // Check for common brand impersonation
    const brands = ['paypal', 'amazon', 'google', 'microsoft', 'apple', 'facebook', 'netflix', 'bank', 'bank of america'];
    brands.forEach(brand => {
      const brandRegex = new RegExp(brand.replace(/\s+/g, ''), 'i');
      if (brandRegex.test(hostname)) {
        this.addIndicator(`Possible ${brand} impersonation detected`, 40);
      }
    });

    // Check for look-alike characters (homograph attack)
    const cyrillicPattern = /[а-яА-Я]/;
    const greekPattern = /[α-ωΑ-Ω]/;
    if (cyrillicPattern.test(hostname) || greekPattern.test(hostname)) {
      this.addIndicator('Domain contains suspicious characters (possible homograph attack)', 50);
    }

    // Check for excessive dots/complexity
    const parts = hostname.split('.');
    if (parts.length > 5) {
      this.addIndicator('Unusually complex domain structure', 15);
    }

    // Check for numbers mixed with letters in suspicious way
    if (/\d{3,}/.test(hostname) && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      this.addIndicator('Domain contains suspicious number patterns', 10);
    }
  }

  checkSSL() {
    if (window.location.protocol !== 'https:') {
      this.addIndicator('No HTTPS encryption - connection is not secure', 30);
    }
  }

  checkSecurityHeaders() {
    // Check for security headers in the page
    // X-Frame-Options missing = potential clickjacking
    const xFrameOptions = document.querySelector('[x-frame-options]');
    if (!xFrameOptions && document.body) {
      // This is a client-side approximation
      // In a real scenario, we'd check response headers via fetch
      // For now, we'll do a general check
      if (window.self !== window.top) {
        this.addIndicator('Page is embedded in a frame (potential clickjacking)', 20);
      }
    }

    // Check for suspicious meta tags
    const metaTags = document.querySelectorAll('meta');
    let suspiciousMeta = 0;

    metaTags.forEach(tag => {
      const content = (tag.getAttribute('content') || '').toLowerCase();
      // Check for redirect meta refresh to suspicious URL
      if (tag.getAttribute('http-equiv') === 'refresh') {
        if (content.includes('url=') && content.includes('http')) {
          suspiciousMeta++;
        }
      }
    });

    if (suspiciousMeta > 0) {
      this.addIndicator(`${suspiciousMeta} suspicious meta refresh tag(s) found`, 25);
    }
  }

  checkForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input');
      let hasPasswordField = false;
      let hasEmailField = false;
      let hasCreditCardField = false;

      inputs.forEach(input => {
        const type = input.type.toLowerCase();
        const name = (input.name || '').toLowerCase();
        const id = (input.id || '').toLowerCase();

        if (type === 'password') hasPasswordField = true;
        if (type === 'email' || name.includes('email') || id.includes('email')) hasEmailField = true;
        if (name.includes('card') || name.includes('cvv') || id.includes('card') || id.includes('cvv')) {
          hasCreditCardField = true;
        }
      });

      // Check if form submits to different domain
      const action = form.action;
      if (action && !action.includes(window.location.hostname)) {
        this.addIndicator('Form submits to external domain', 30);
      }

      // Suspicious if asking for sensitive info without HTTPS
      if ((hasPasswordField || hasCreditCardField) && window.location.protocol !== 'https:') {
        this.addIndicator('Requesting sensitive information over HTTP', 40);
      }
    });
  }

  checkLinks() {
    const links = document.querySelectorAll('a');
    let externalLinks = 0;
    let suspiciousLinks = 0;
    let mismatchedLinks = [];

    this.detectionDetails.checkedElements += links.length;

    links.forEach(link => {
      const href = link.href;
      const text = link.textContent.trim();

      if (!href) return;

      // Check if link text doesn't match destination
      if (text && this.isURLMismatch(href, text)) {
        suspiciousLinks++;
        mismatchedLinks.push({ text, href });
      }

      // Check if it's an external link
      try {
        const linkUrl = new URL(href);
        if (!linkUrl.hostname.includes(window.location.hostname)) {
          externalLinks++;
        }

        // Check for suspicious protocols
        if (!linkUrl.protocol.startsWith('http') && linkUrl.protocol !== 'mailto:') {
          suspiciousLinks++;
        }
      } catch (e) {
        // Invalid URL
        suspiciousLinks++;
      }
    });

    const totalLinks = links.length;
    if (totalLinks > 0) {
      const externalRatio = externalLinks / totalLinks;
      if (externalRatio > 0.7) {
        this.addIndicator(`High percentage of external links (${Math.round(externalRatio * 100)}%)`, 15);
      }
    }

    if (suspiciousLinks > 3) {
      this.addIndicator(`${suspiciousLinks} links with suspicious characteristics`, 20);
    }
  }

  isURLMismatch(href, text) {
    try {
      const url = new URL(href);
      const urlHostname = url.hostname.replace('www.', '');

      // Check if text looks like a URL but doesn't match href
      const urlPattern = /https?:\/\/[^\s)]+/;
      const urlMatch = text.match(urlPattern);

      if (urlMatch) {
        const textUrl = new URL(urlMatch[0]);
        const textHostname = textUrl.hostname.replace('www.', '');
        return urlHostname !== textHostname;
      }

      // Check for brand mention mismatch
      const brands = ['paypal', 'amazon', 'apple', 'google', 'microsoft', 'facebook'];
      for (const brand of brands) {
        if (text.toLowerCase().includes(brand) && !urlHostname.includes(brand)) {
          return true;
        }
      }

      return false;
    } catch (e) {
      return false;
    }
  }

  checkContent() {
    const bodyText = document.body.innerText.toLowerCase();

    // Enhanced urgency keywords
    const urgencyKeywords = [
      'urgent', 'immediately', 'suspended', 'expires', 'verify now',
      'click here now', 'limited time', 'act now', 'confirm your account',
      'unusual activity', 'security alert', 'confirm identity', 'update payment',
      'unlock account', 'reactivate', 'unusual access', 'suspicious activity',
      'temporary suspension', 'permanent ban', 'restricted access',
      'validate account', 'authorize transaction', 'verify credentials'
    ];

    let urgencyCount = 0;
    urgencyKeywords.forEach(keyword => {
      if (bodyText.includes(keyword)) urgencyCount++;
    });

    if (urgencyCount >= 3) {
      this.addIndicator(`Multiple urgency keywords detected (${urgencyCount})`, 20);
    }

    // Poor grammar and suspicious phrases
    const suspiciousPhrases = [
      'dear customer', 'dear user', 'dear member',
      'dear sir', 'dear madam',
      'kindly click', 'kindly verify', 'kindly update',
      'needful', 'as soon as possible',
      'click the link', 'copy and paste',
      'do not reply', 'confidential information',
      'wire transfer', 'gift card', 'bitcoin', 'money transfer'
    ];

    let phraseCount = 0;
    suspiciousPhrases.forEach(phrase => {
      if (bodyText.includes(phrase)) phraseCount++;
    });

    if (phraseCount >= 2) {
      this.addIndicator(`${phraseCount} suspicious phrase(s) detected - possible generic/poor grammar`, 15);
    }

    // Check for password requests in content
    if (bodyText.includes('password') && bodyText.includes('enter') || bodyText.includes('type')) {
      this.addIndicator('Page requests password entry - be cautious', 25);
    }

    // Check for requests of credit card info
    if (bodyText.match(/credit card|debit card|card number|expir|cvv|cvc/i)) {
      this.addIndicator('Page requests financial/card information', 30);
    }

    // Check for requests for personal ID
    if (bodyText.match(/social security|ssn|passport|driver.*license|national id/i)) {
      this.addIndicator('Page requests sensitive identification', 35);
    }
  }

  addIndicator(message, score) {
    this.indicators.push(message);
    this.suspicionScore += score;
  }

  getRiskLevel() {
    if (this.suspicionScore >= 70) return 'high';
    if (this.suspicionScore >= 40) return 'medium';
    if (this.suspicionScore >= 20) return 'low';
    return 'safe';
  }
}

// Run analysis when page loads
console.log('🛡️ Phishing Detector: Starting analysis...');
const detector = new PhishingDetector();
const results = detector.analyze();

console.log('🛡️ Phishing Detector: Analysis complete');
console.log('  URL:', window.location.href);
console.log('  Risk Level:', results.riskLevel);
console.log('  Score:', results.score);
console.log('  Indicators found:', results.indicators.length);
console.log('  Duration:', results.performanceMetrics.duration + 'ms');
if (results.indicators.length > 0) {
  console.log('  Details:', results.indicators);
}

// Send results to background script
chrome.runtime.sendMessage({
  type: 'phishing_check',
  results: results,
  url: window.location.href,
  timestamp: new Date().toISOString()
}, (response) => {
  if (chrome.runtime.lastError) {
    console.error('🛡️ Error sending message:', chrome.runtime.lastError);
  } else {
    console.log('✓ Results sent to background script successfully');
  }
});

// Show warning banner if high risk
if (results.riskLevel === 'high') {
  console.log('🛡️ HIGH RISK - Showing warning banner');
  showWarningBanner(results);
}

function showWarningBanner(results) {
  // Don't show on email interfaces (they manage their own security)
  if (results.detectionDetails.isEmailInterface) {
    return;
  }

  // Check if banner already exists
  if (document.getElementById('phishing-warning-banner')) {
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'phishing-warning-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #ff4444, #cc0000);
    color: white;
    padding: 15px;
    text-align: center;
    z-index: 999999;
    font-family: Arial, sans-serif;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    animation: slideDown 0.3s ease;
  `;

  banner.innerHTML = `
    <strong style="font-size: 16px;">⚠️ WARNING: This site may be a phishing attempt!</strong><br>
    <small style="font-size: 12px;">Suspicion Score: ${results.score} | Risk Level: ${results.riskLevel.toUpperCase()} | Click extension icon for details</small>
    <button id="close-warning" style="margin-left: 15px; padding: 5px 10px; background: white; color: #ff4444; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;">Dismiss</button>
  `;

  document.body.insertBefore(banner, document.body.firstChild);

  document.getElementById('close-warning').addEventListener('click', () => {
    banner.style.animation = 'slideUp 0.3s ease';
    setTimeout(() => banner.remove(), 300);
  });

  // Add CSS animation
  if (!document.getElementById('phishing-banner-styles')) {
    const style = document.createElement('style');
    style.id = 'phishing-banner-styles';
    style.textContent = `
      @keyframes slideDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}