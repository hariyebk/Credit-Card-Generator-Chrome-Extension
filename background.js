// we are listening for an event that when the user first installs this extension, we will open a new tab to display our welcome page
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        chrome.tabs.create({ url: 'welcome.html' });
    }
});