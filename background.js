chrome.runtime.onMessage.addListener(({ action, config }) => {
    const notify = title => chrome.notifications.create({ type: 'basic', title });
    if (action === 'apply') {
        chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => notify('Proxy Enabled'));
    } else if (action === 'clear') {
        chrome.proxy.settings.set({ value: { mode: 'direct' }, scope: 'regular' }, () => notify('Proxy Disabled'));
    }
});

chrome.storage.local.get('proxy', ({ proxy }) => {
    if (proxy) {
        chrome.proxy.settings.set({ value: proxy, scope: 'regular' });
    }
});