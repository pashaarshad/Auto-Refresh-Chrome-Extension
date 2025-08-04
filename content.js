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
    
    refreshStarted = true;
    
    // Wait 5 seconds initially before starting the refresh cycle
    setTimeout(() => {
        // Then refresh every 3 seconds
        refreshInterval = setInterval(() => {
            if (isValidPage()) {
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAutoRefresh);
} else {
    startAutoRefresh();
}
