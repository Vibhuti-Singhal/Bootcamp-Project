// background.js - Background service worker

let currentTabResults = {};

// Listen for all messages - SINGLE LISTENER
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message.type);

    // Handle phishing check results from content script
    if (message.type === 'phishing_check') {
        const tabId = sender.tab.id;
        const url = message.url || sender.url;

        // Store results for this tab
        currentTabResults[tabId] = {
            ...message.results,
            url: url,
            tabId: tabId,
            timestamp: message.timestamp || new Date().toISOString()
        };

        // Update badge based on risk level
        updateBadge(tabId, message.results.riskLevel);

        // Log to console for debugging
        console.log('✓ Phishing check completed for:', url);
        console.log('  Risk level:', message.results.riskLevel);
        console.log('  Score:', message.results.score);
        console.log('  Indicators:', message.results.indicators.length);

        // Save report to persistent storage (if high or medium risk)
        if (message.results.riskLevel === 'high' || message.results.riskLevel === 'medium') {
            savePhishingReport({
                url: url,
                riskLevel: message.results.riskLevel,
                score: message.results.score,
                indicators: message.results.indicators,
                detectionDetails: message.results.detectionDetails,
                tabId: tabId,
                timestamp: message.timestamp || new Date().toISOString()
            });
        }

        sendResponse({ success: true });
        return true;
    }

    // Handle popup requesting results
    if (message.type === 'get_results') {
        console.log('Popup requested results');
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs[0]) {
                const tabId = tabs[0].id;
                const results = currentTabResults[tabId];
                console.log('Sending results to popup:', results ? 'Found' : 'Not found');
                if (results) {
                    console.log('  Score:', results.score, 'Risk:', results.riskLevel);
                }
                sendResponse({ results: results || null });
            } else {
                sendResponse({ results: null });
            }
        });
        return true; // Keep channel open for async response
    }

    // Handle statistics request
    if (message.type === 'get_statistics') {
        console.log('Statistics requested');
        if (typeof phishingReporter !== 'undefined') {
            phishingReporter.getStatistics().then(stats => {
                sendResponse({ statistics: stats });
            });
        } else {
            sendResponse({ statistics: null });
        }
        return true;
    }

    // Handle reports request
    if (message.type === 'get_reports') {
        console.log('Reports requested');
        if (typeof phishingReporter !== 'undefined') {
            const limit = message.limit || 20;
            phishingReporter.getReports(limit).then(reports => {
                sendResponse({ reports: reports });
            });
        } else {
            sendResponse({ reports: [] });
        }
        return true;
    }

    // Handle clear reports request
    if (message.type === 'clear_reports') {
        console.log('Clear reports requested');
        if (typeof phishingReporter !== 'undefined') {
            phishingReporter.clearAllReports().then(success => {
                sendResponse({ success: success });
            });
        } else {
            sendResponse({ success: false });
        }
        return true;
    }

    // Handle export reports request
    if (message.type === 'export_reports') {
        console.log('Export reports requested');
        if (typeof phishingReporter !== 'undefined') {
            phishingReporter.exportReports().then(data => {
                sendResponse({ data: data });
            });
        } else {
            sendResponse({ data: null });
        }
        return true;
    }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    console.log('Tab closed, cleaning up:', tabId);
    delete currentTabResults[tabId];
});

function updateBadge(tabId, riskLevel) {
    const badgeConfig = {
        'high': { text: '!', color: '#ff4444' },
        'medium': { text: '?', color: '#ffaa00' },
        'low': { text: '·', color: '#ffdd00' },
        'safe': { text: '✓', color: '#44ff44' }
    };

    const config = badgeConfig[riskLevel] || badgeConfig['safe'];

    chrome.action.setBadgeText({ text: config.text, tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: config.color, tabId: tabId });

    console.log('Badge updated for tab', tabId, ':', config.text);
}

function savePhishingReport(report) {
    if (typeof phishingReporter !== 'undefined') {
        phishingReporter.addReport(report).then(result => {
            if (result) {
                console.log('✓ Report saved with ID:', result.id);
            }
        });
    }
}