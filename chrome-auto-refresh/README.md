# Chrome Auto Refresh Extension

This Chrome extension automatically refreshes a specified URL every three seconds. Upon the first activation, it waits for five seconds before starting the refresh cycle.

## Features

- Automatically refreshes a specified URL every three seconds.
- Initial delay of five seconds before the first refresh.
- Works seamlessly in the background.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/chrome-auto-refresh.git
   ```
2. Navigate to the project directory:
   ```
   cd chrome-auto-refresh
   ```
3. Open Chrome and go to `chrome://extensions/`.
4. Enable "Developer mode" by toggling the switch in the top right corner.
5. Click on "Load unpacked" and select the `chrome-auto-refresh` directory.

## Usage

1. After loading the extension, open the URL you want to refresh.
2. The extension will wait for five seconds and then start refreshing the page every three seconds.

## Notes

- Ensure that the extension has the necessary permissions to access the specified URL.
- You can modify the URL in the `content.js` file to set the desired page for refreshing.

## License

This project is licensed under the MIT License.