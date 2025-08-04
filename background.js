// Background service worker for Auto Refresh Extension
// Track active tabs and their refresh intervals
let activeRefreshIntervals = new Map();

// Initialize when extension starts
chrome.runtime.onStartup.addListener(() => {
    initializeAutoRefresh();
});

chrome.runtime.onInstalled.addListener(() => {
    initializeAutoRefresh();
});

async function initializeAutoRefresh() {
    try {
        const tabs = await chrome.tabs.query({});
        tabs.forEach(tab => {
            if (isValidUrl(tab.url)) {
                startRefreshingTab(tab.id);
            }
        });
    } catch (error) {
        console.error('Error initializing auto refresh:', error);
    }
}

function isValidUrl(url) {
    return url && 
           !url.startsWith('chrome://') && 
           !url.startsWith('chrome-extension://') &&
           !url.startsWith('edge://') &&
           !url.startsWith('about:');
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
                
                if (isValidUrl(tab.url)) {
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

// Handle new tabs
chrome.tabs.onCreated.addListener((tab) => {
    if (isValidUrl(tab.url)) {
        startRefreshingTab(tab.id);
    }
});

// Handle tab updates (navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && isValidUrl(tab.url)) {
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
