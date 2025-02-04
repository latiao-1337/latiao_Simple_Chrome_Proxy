chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'applyProxy') {
        chrome.proxy.settings.set(
            { value: message.config, scope: 'regular' },
            () => chrome.notifications.create({
                type: 'basic',
                title: 'Start',
                message: 'Proxt is enabled'
            })
        );
    } else if (message.action === 'disableProxy') {
        chrome.proxy.settings.set(
            { value: { mode: "direct" }, scope: 'regular' },
            () => chrome.notifications.create({
                type: 'basic',
                title: 'Stop',
                message: 'Proxy is disabled'
            })
        );
    }
});


chrome.storage.local.get(['proxySettings'], (result) => {
    if (result.proxySettings) {
        const settings = result.proxySettings;
        chrome.proxy.settings.set({
            value: {
                mode: "fixed_servers",
                rules: {
                    singleProxy: {
                        scheme: settings.type,
                        host: settings.host,
                        port: settings.port
                    },
                }
            },
            scope: 'regular'
        });
    }
});