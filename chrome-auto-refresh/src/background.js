// Track active tabs and their refresh intervals
let activeRefreshIntervals = new Map();

// Start refreshing when extension is installed or enabled
chrome.runtime.onStartup.addListener(() => {
    initializeAutoRefresh();
});

chrome.runtime.onInstalled.addListener(() => {
    initializeAutoRefresh();
});

async function initializeAutoRefresh() {
    try {
        // Get all active tabs and start auto-refresh for each
        const tabs = await chrome.tabs.query({});
        tabs.forEach(tab => {
            if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
                startRefreshingTab(tab.id);
            }
        });
    } catch (error) {
        console.error('Error initializing auto refresh:', error);
    }
}

function startRefreshingTab(tabId) {
    // Clear any existing interval for this tab
    if (activeRefreshIntervals.has(tabId)) {
        clearInterval(activeRefreshIntervals.get(tabId));
    }
    
    // Wait 5 seconds initially, then refresh every 3 seconds
    setTimeout(() => {
        const refreshInterval = setInterval(async () => {
            try {
                const tab = await chrome.tabs.get(tabId);
                
                // Only refresh if tab is not a chrome:// or extension page
                if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
                    await chrome.tabs.reload(tabId);
                }
            } catch (error) {
                // Tab no longer exists, clear the interval
                clearInterval(activeRefreshIntervals.get(tabId));
                activeRefreshIntervals.delete(tabId);
            }
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