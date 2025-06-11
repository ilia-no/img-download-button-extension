chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'download' && message.url) {
    chrome.downloads.download({ url: message.url });
  }
});
