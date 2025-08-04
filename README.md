# Auto-Refresh-Chrome-Extension

This Chrome extension automatically refreshes any website you visit every three seconds. Upon the first activation, it waits for five seconds before starting the refresh cycle.

## Features

- Automatically refreshes ANY website every three seconds (not limited to a specific URL).
- Initial delay of five seconds before the first refresh when you open a new tab or navigate to a new page.
- Works seamlessly in the background.
- Excludes Chrome internal pages (chrome://* and chrome-extension://*) from auto-refresh.
- **Improved reliability after computer restarts** - Multiple initialization triggers ensure the extension works consistently.
- Status popup to check extension activity and manually trigger refresh if needed.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/pashaarshad/Auto-Refresh-Chrome-Extension.git
   ```
2. Navigate to the project directory:
   ```
   cd Auto-Refresh-Chrome-Extension
   ```
3. Open Chrome and go to `chrome://extensions/`.
4. Enable "Developer mode" by toggling the switch in the top right corner.
5. Click on "Load unpacked" and select the project directory.

## Usage

1. After loading the extension, open any website.
2. The extension will wait for five seconds and then start refreshing the page every three seconds.
3. Every new tab or website you visit will automatically start the refresh cycle.
4. Click the extension icon to see status and manually trigger refresh if needed.

## Troubleshooting

If the extension doesn't work after restarting your computer:

1. **Click the extension icon** in the toolbar and click "Refresh All Tabs" button.
2. **Reload the extension**: Go to `chrome://extensions/`, find the Auto Refresh Extension, and click the reload button.
3. **Check the console**: Open Chrome DevTools → Console to see if there are any error messages.
4. **Restart Chrome** completely and try again.

The extension now has multiple fallback mechanisms to ensure it starts working:
- Automatic initialization on startup and installation
- Periodic checks every 10 seconds
- Fallback initialization when tabs are updated
- Manual initialization via popup

## Notes

- The extension works on all websites except Chrome internal pages.
- Each tab operates independently with its own refresh cycle.
- The extension automatically starts when Chrome starts up.
- If you notice the extension isn't working, use the popup to manually restart it.

## Version History

- **v1.0.1**: Improved reliability after computer restarts, added status popup, better error handling
- **v1.0.0**: Initial release

## License

This project is licensed under the MIT License.