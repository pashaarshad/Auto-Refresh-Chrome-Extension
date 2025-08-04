// Content script for auto-refresh extension
// This script runs on every webpage and handles the refresh logic

let refreshStarted = false;
let refreshInterval;

// Function to start the auto-refresh cycle
function startAutoRefresh() {
    if (refreshStarted) return;
    
    refreshStarted = true;
    
    // Wait 5 seconds initially before starting the refresh cycle
    setTimeout(() => {
        // Then refresh every 3 seconds
        refreshInterval = setInterval(() => {
            // Only refresh if we're still on a regular webpage (not chrome:// pages)
            if (!window.location.href.startsWith('chrome://') && 
                !window.location.href.startsWith('chrome-extension://')) {
                window.location.reload();
            }
        }, 3000);
    }, 5000);
}

// Clean up interval when page is unloaded
window.addEventListener('beforeunload', () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
});

// Start auto-refresh when content script loads
startAutoRefresh();