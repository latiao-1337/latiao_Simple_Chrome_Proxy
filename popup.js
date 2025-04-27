const $ = id => document.getElementById(id);

chrome.storage.local.get('proxy', ({ proxy }) => {
    if (proxy) {
        $('type').value = proxy.rules.singleProxy.scheme;
        $('host').value = proxy.rules.singleProxy.host;
        $('port').value = proxy.rules.singleProxy.port;
    }
});

const apply = () => {
    const [scheme, host, port] = [$('type').value, $('host').value.trim(), +$('port').value];
    if (!host || !port) return alert('请输入完整的代理信息');

    const config = { mode: 'fixed_servers', rules: { singleProxy: { scheme, host, port } } };
    chrome.storage.local.set({ proxy: config }, () => {
        chrome.runtime.sendMessage({ action: 'apply', config });
    });
};

$('enable').onclick = apply;
$('disable').onclick = () => {
    chrome.storage.local.remove('proxy', () => chrome.runtime.sendMessage({ action: 'clear' }));
};