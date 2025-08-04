// Content script for Auto Refresh Extension
// This runs on every webpage and provides backup refresh functionality

let refreshStarted = false;
let refreshInterval;

function isValidPage() {
    const url = window.location.href;
    return !url.startsWith('chrome://') && 
           !url.startsWith('chrome-extension://') &&
           !url.startsWith('edge://') &&
           !url.startsWith('about:');
}

function startAutoRefresh() {
    if (refreshStarted || !isValidPage()) return;
    
    console.log('Content script: Starting auto refresh for', window.location.href);
    refreshStarted = true;
    
    // Wait 5 seconds initially before starting the refresh cycle
    setTimeout(() => {
        // Then refresh every 3 seconds
        refreshInterval = setInterval(() => {
            if (isValidPage()) {
                console.log('Content script: Refreshing page');
                window.location.reload();
            }
        }, 3000);
    }, 5000);
}

// Clean up interval when page is unloaded
window.addEventListener('beforeunload', () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshStarted = false;
    }
});

// Try to connect to background script to ensure it's active
try {
    const port = chrome.runtime.connect();
    port.onDisconnect.addListener(() => {
        console.log('Content script: Disconnected from background');
    });
} catch (error) {
    console.log('Content script: Could not connect to background');
}

// Start auto-refresh when content script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAutoRefresh);
} else {
    startAutoRefresh();
}

// Additional safety: start refresh after a delay if not already started
setTimeout(() => {
    if (!refreshStarted && isValidPage()) {
        console.log('Content script: Backup initialization');
        startAutoRefresh();
    }
}, 2000);
