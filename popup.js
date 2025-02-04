document.addEventListener('DOMContentLoaded', function () {
    const proxyType = document.getElementById('proxyType');
    const proxyHost = document.getElementById('proxyHost');
    const proxyPort = document.getElementById('proxyPort');
    const enableBtn = document.getElementById('enableProxy');
    const disableBtn = document.getElementById('disableProxy');

    chrome.storage.local.get(['proxySettings'], (result) => {
        if (result.proxySettings) {
            proxyType.value = result.proxySettings.type;
            proxyHost.value = result.proxySettings.host;
            proxyPort.value = result.proxySettings.port;
        }
    });

    enableBtn.addEventListener('click', () => {
        const settings = {
            type: proxyType.value,
            host: proxyHost.value.trim(),
            port: parseInt(proxyPort.value)
        };

        if (!settings.host || isNaN(settings.port)) {
            alert('Missing configuration');
            return;
        }

        chrome.storage.local.set({ proxySettings: settings }, () => {
            chrome.runtime.sendMessage({
                action: 'applyProxy',
                config: {
                    mode: "fixed_servers",
                    rules: {
                        singleProxy: {
                            scheme: settings.type,
                            host: settings.host,
                            port: settings.port
                        }
                    }
                }
            });
        });
    });

    disableBtn.addEventListener('click', () => {
        chrome.storage.local.remove('proxySettings', () => {
            chrome.runtime.sendMessage({
                action: 'disableProxy'
            });
        });
    });
});