// Background service worker for Auto Refresh Extension
// Track active tabs and their refresh intervals
let activeRefreshIntervals = new Map();
let isInitialized = false;

// Initialize when extension starts
chrome.runtime.onStartup.addListener(() => {
    console.log('Extension startup detected');
    initializeAutoRefresh();
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed/updated');
    initializeAutoRefresh();
});

// Initialize when service worker starts up (important for computer restarts)
chrome.runtime.onConnect.addListener(() => {
    if (!isInitialized) {
        console.log('Connection detected, initializing...');
        initializeAutoRefresh();
    }
});

async function initializeAutoRefresh() {
    if (isInitialized) return;
    
    try {
        console.log('Initializing auto refresh...');
        isInitialized = true;
        
        // Wait a moment for Chrome to fully load
        setTimeout(async () => {
            const tabs = await chrome.tabs.query({});
            console.log(`Found ${tabs.length} tabs to process`);
            
            tabs.forEach(tab => {
                if (isValidUrl(tab.url)) {
                    console.log(`Starting refresh for tab ${tab.id}: ${tab.url}`);
                    startRefreshingTab(tab.id);
                }
            });
        }, 1000);
    } catch (error) {
        console.error('Error initializing auto refresh:', error);
        isInitialized = false;
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
    console.log(`New tab created: ${tab.id}`);
    if (isValidUrl(tab.url)) {
        startRefreshingTab(tab.id);
    }
});

// Handle tab updates (navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && isValidUrl(tab.url)) {
        console.log(`Tab updated: ${tabId} - ${tab.url}`);
        startRefreshingTab(tabId);
    }
    
    // Fallback: If we haven't initialized yet and we see a tab loading, initialize
    if (!isInitialized && changeInfo.status === 'complete') {
        console.log('Fallback initialization triggered by tab update');
        initializeAutoRefresh();
    }
});

// Handle tab activation (when switching between tabs)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (isValidUrl(tab.url) && !activeRefreshIntervals.has(activeInfo.tabId)) {
            console.log(`Activated tab without refresh: ${activeInfo.tabId} - ${tab.url}`);
            startRefreshingTab(activeInfo.tabId);
        }
    } catch (error) {
        console.error('Error handling tab activation:', error);
    }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    console.log(`Tab removed: ${tabId}`);
    if (activeRefreshIntervals.has(tabId)) {
        clearInterval(activeRefreshIntervals.get(tabId));
        activeRefreshIntervals.delete(tabId);
    }
});

// Additional initialization trigger - check periodically
setInterval(() => {
    if (!isInitialized) {
        console.log('Periodic check: initializing auto refresh');
        initializeAutoRefresh();
    }
}, 10000); // Check every 10 seconds

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'initializeAutoRefresh') {
        console.log('Manual initialization requested from popup');
        isInitialized = false; // Reset to force re-initialization
        initializeAutoRefresh();
        sendResponse({status: 'initialized'});
    }
    return true;
});

// Immediate initialization when service worker starts
console.log('Service worker starting, attempting immediate initialization');
setTimeout(() => {
    initializeAutoRefresh();
}, 500);
