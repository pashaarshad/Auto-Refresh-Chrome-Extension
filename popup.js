// Popup script for Auto Refresh Extension
document.addEventListener('DOMContentLoaded', function() {
    const statusDiv = document.getElementById('status');
    const tabsList = document.getElementById('tabsList');
    const refreshAllButton = document.getElementById('refreshAll');
    const checkStatusButton = document.getElementById('checkStatus');

    function updateStatus() {
        chrome.tabs.query({}, (tabs) => {
            const validTabs = tabs.filter(tab => 
                tab.url && 
                !tab.url.startsWith('chrome://') && 
                !tab.url.startsWith('chrome-extension://') &&
                !tab.url.startsWith('edge://') &&
                !tab.url.startsWith('about:')
            );

            if (validTabs.length > 0) {
                statusDiv.className = 'status active';
                statusDiv.textContent = `Auto-refresh active on ${validTabs.length} tab(s)`;
                
                tabsList.innerHTML = '<h4>Active Tabs:</h4>';
                validTabs.forEach(tab => {
                    const tabItem = document.createElement('div');
                    tabItem.className = 'tab-item';
                    tabItem.textContent = `${tab.title || 'Loading...'} - ${tab.url}`;
                    tabsList.appendChild(tabItem);
                });
            } else {
                statusDiv.className = 'status inactive';
                statusDiv.textContent = 'No valid tabs for auto-refresh';
                tabsList.innerHTML = '';
            }
        });
    }

    function sendMessageToBackground(action) {
        chrome.runtime.sendMessage({action: action}, (response) => {
            if (chrome.runtime.lastError) {
                console.log('Could not send message to background:', chrome.runtime.lastError.message);
            } else {
                console.log('Message sent successfully:', response);
            }
        });
    }

    refreshAllButton.addEventListener('click', () => {
        sendMessageToBackground('initializeAutoRefresh');
        setTimeout(updateStatus, 1000);
    });

    checkStatusButton.addEventListener('click', updateStatus);

    // Initial status update
    updateStatus();
});
