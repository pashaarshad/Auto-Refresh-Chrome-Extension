// Track active tabs and their refresh intervals
let activeRefreshIntervals = new Map();

// Start refreshing when extension is installed or enabled
chrome.runtime.onStartup.addListener(() => {
    initializeAutoRefresh();
});

chrome.runtime.onInstalled.addListener(() => {
    initializeAutoRefresh();
});

function initializeAutoRefresh() {
    // Get all active tabs and start auto-refresh for each
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
                startRefreshingTab(tab.id);
            }
        });
    });
}

function startRefreshingTab(tabId) {
    // Clear any existing interval for this tab
    if (activeRefreshIntervals.has(tabId)) {
        clearInterval(activeRefreshIntervals.get(tabId));
    }
    
    // Wait 5 seconds initially, then refresh every 3 seconds
    setTimeout(() => {
        const refreshInterval = setInterval(() => {
            chrome.tabs.get(tabId, (tab) => {
                if (chrome.runtime.lastError) {
                    // Tab no longer exists, clear the interval
                    clearInterval(activeRefreshIntervals.get(tabId));
                    activeRefreshIntervals.delete(tabId);
                    return;
                }
                
                // Only refresh if tab is not a chrome:// or extension page
                if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
                    chrome.tabs.reload(tabId);
                }
            });
        }, 3000);
        
        activeRefreshIntervals.set(tabId, refreshInterval);
    }, 5000);
}

// Start auto-refresh for new tabs
chrome.tabs.onCreated.addListener((tab) => {
    if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
        startRefreshingTab(tab.id);
    }
});

// Handle tab updates (when user navigates to a new URL)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && 
        !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
        startRefreshingTab(tabId);
    }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    if (activeRefreshIntervals.has(tabId)) {
        clearInterval(activeRefreshIntervals.get(tabId));
        activeRefreshIntervals.delete(tabId);
    }
});