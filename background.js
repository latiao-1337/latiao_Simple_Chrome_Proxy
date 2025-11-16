chrome.runtime.onMessage.addListener(({ action, config }) => {
    if (action === 'apply') {
        chrome.proxy.settings.set({ value: config, scope: 'regular' });
    } else if (action === 'clear') {
        chrome.proxy.settings.clear({ scope: 'regular' });
    }
});

chrome.storage.local.get('proxy', ({ proxy }) => {
    if (proxy) {
        chrome.proxy.settings.set({ value: proxy, scope: 'regular' });
    }
});
