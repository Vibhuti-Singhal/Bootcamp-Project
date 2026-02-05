// whitelist.js - Comprehensive whitelist of legitimate domains

const WHITELIST = {
    // Email providers
    'email_providers': [
        'gmail.com', 'googlemail.com',
        'outlook.com', 'hotmail.com', 'live.com', 'microsoft.com',
        'yahoo.com', 'ymail.com',
        'protonmail.com', 'proton.me',
        'aol.com',
        'icloud.com', 'me.com', 'mac.com',
        'mail.com',
        'tutanota.com',
        'zoho.com'
    ],

    // Major financial institutions
    'financial': [
        'paypal.com', 'paypalobjects.com',
        'amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.fr', 'amazon.es', 'amazon.ca', 'amazon.in', 'amazon.it',
        'amazon.com.br', 'amazon.com.mx', 'amazon.co.jp', 'amazon.sg', 'amazon.com.au',
        'americanexpress.com',
        'mastercard.com',
        'visa.com', 'visaeurope.com',
        'bankofamerica.com',
        'wellsfargo.com',
        'chase.com',
        'bofa.com',
        'citi.com',
        'capitalone.com',
        'discover.com',
        'squareup.com',
        'stripe.com',
        'github.com'  // For payments
    ],

    // Tech giants
    'tech': [
        'google.com', 'googlemail.com', 'gmail.com', 'youtube.com', 'maps.google.com', 'drive.google.com',
        'microsoft.com', 'outlook.com', 'onedrive.com', 'office.com', 'teams.microsoft.com',
        'apple.com', 'icloud.com', 'itunes.com', 'appstore.apple.com',
        'facebook.com', 'fb.com', 'messenger.com', 'instagram.com', 'threads.net',
        'twitter.com', 'x.com',
        'linkedin.com',
        'amazon.com',
        'netflix.com',
        'github.com', 'githubassets.com', 'githubusercontent.com',
        'slack.com',
        'discord.com',
        'zoom.us', 'zoomgov.com',
        'twitch.tv',
        'reddit.com',
        'wikipedia.org',
        'wikimedia.org',
        'openai.com'
    ],

    // Major retailers
    'retail': [
        'amazon.com',
        'ebay.com',
        'walmart.com',
        'target.com',
        'costco.com',
        'bestbuy.com',
        'alibaba.com',
        'alibabagroup.com',
        'alliedexpress.com'
    ],

    // Cloud services
    'cloud': [
        'dropbox.com', 'dropboxapi.com',
        'onedrive.com',
        'drive.google.com',
        'box.com',
        'icloud.com',
        'aws.amazon.com',
        'heroku.com',
        'vercel.com',
        'netlify.com'
    ],

    // Educational institutions
    'education': [
        'edu',  // All .edu domains
        'coursera.org',
        'udemy.com',
        'edx.org',
        'codecademy.com',
        'khanacademy.org'
    ],

    // Government
    'government': [
        'gov',  // All .gov domains
        'irs.gov',
        'usps.com',
        'ssn.ssa.gov',
        'whitehouse.gov'
    ]
};

// Function to check if a domain is in the whitelist
function isWhitelistedDomain(hostname) {
    // Remove www and extract main domain
    const cleanHostname = hostname.replace(/^www\./, '').toLowerCase();
    const parts = cleanHostname.split('.');

    // Check all whitelisted categories
    for (const category in WHITELIST) {
        const domains = WHITELIST[category];

        // Check exact match
        if (domains.includes(cleanHostname)) {
            return true;
        }

        // Check TLD-only matches (like .edu, .gov)
        if (domains.includes(parts[parts.length - 1])) {
            return true;
        }

        // Check subdomains of whitelisted domains
        for (const domain of domains) {
            if (cleanHostname.endsWith('.' + domain)) {
                return true;
            }
        }
    }

    return false;
}

// Function to get category for a domain
function getDomainCategory(hostname) {
    const cleanHostname = hostname.replace(/^www\./, '').toLowerCase();

    for (const category in WHITELIST) {
        const domains = WHITELIST[category];
        if (domains.includes(cleanHostname) || domains.some(d => cleanHostname.endsWith('.' + d))) {
            return category;
        }
    }

    return null;
}

// Function to add custom whitelist entry (for user modifications)
function addToWhitelist(domain, category = 'custom') {
    if (!WHITELIST[category]) {
        WHITELIST[category] = [];
    }
    if (!WHITELIST[category].includes(domain.toLowerCase())) {
        WHITELIST[category].push(domain.toLowerCase());
    }
}

// Function to remove from whitelist
function removeFromWhitelist(domain, category) {
    if (WHITELIST[category]) {
        const index = WHITELIST[category].indexOf(domain.toLowerCase());
        if (index > -1) {
            WHITELIST[category].splice(index, 1);
        }
    }
}
