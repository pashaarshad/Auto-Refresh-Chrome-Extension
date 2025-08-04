# Auto-Refresh-Chrome-Extension

This Chrome extension automatically refreshes any website you visit every three seconds. Upon the first activation, it waits for five seconds before starting the refresh cycle.

## Features

- Automatically refreshes ANY website every three seconds (not limited to a specific URL).
- Initial delay of five seconds before the first refresh when you open a new tab or navigate to a new page.
- Works seamlessly in the background.
- Excludes Chrome internal pages (chrome://* and chrome-extension://*) from auto-refresh.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/pashaarshad/Auto-Refresh-Chrome-Extension.git
   ```
2. Navigate to the project directory:
   ```
   cd Auto-Refresh-Chrome-Extension/chrome-auto-refresh
   ```
3. Open Chrome and go to `chrome://extensions/`.
4. Enable "Developer mode" by toggling the switch in the top right corner.
5. Click on "Load unpacked" and select the `chrome-auto-refresh` directory.

## Usage

1. After loading the extension, open any website.
2. The extension will wait for five seconds and then start refreshing the page every three seconds.
3. Every new tab or website you visit will automatically start the refresh cycle.

## Notes

- The extension works on all websites except Chrome internal pages.
- Each tab operates independently with its own refresh cycle.
- The extension automatically starts when Chrome starts up.

## License

This project is licensed under the MIT License.