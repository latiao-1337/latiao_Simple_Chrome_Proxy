const $ = id => document.getElementById(id);

const updateStatus = (isEnabled) => {
    const statusEl = $('status');
    if (isEnabled) {
        statusEl.textContent = '当前状态：已启用代理';
        statusEl.className = 'status status-enabled';
    } else {
        statusEl.textContent = '当前状态：未启用代理';
        statusEl.className = 'status status-disabled';
    }
};

// 初始化时加载配置
chrome.storage.local.get('proxy', ({ proxy }) => {
    if (proxy) {
        $('mode').value = proxy.mode;
        if (proxy.mode === 'fixed_servers') {
            $('type').value = proxy.rules.singleProxy.scheme;
            $('host').value = proxy.rules.singleProxy.host;
            $('port').value = proxy.rules.singleProxy.port;
            showFixedFields();
        } else if (proxy.mode === 'pac_script') {
            $('pac').value = proxy.pacScript.url || '';
            showPacField();
        }
        updateStatus(true);
    } else {
        updateStatus(false);
        showFixedFields(); // 默认显示固定代理输入框
    }
});

// 切换模式时显示/隐藏输入框
$('mode').onchange = () => {
    if ($('mode').value === 'pac_script') {
        showPacField();
    } else {
        showFixedFields();
    }
};

function showPacField() {
    $('pac-field').style.display = 'block';
    $('fixed-field').style.display = 'none';
    $('fixed-field-host').style.display = 'none';
    $('fixed-field-port').style.display = 'none';
}

function showFixedFields() {
    $('pac-field').style.display = 'none';
    $('fixed-field').style.display = 'block';
    $('fixed-field-host').style.display = 'block';
    $('fixed-field-port').style.display = 'block';
}

const apply = () => {
    const mode = $('mode').value;
    let config;

    if (mode === 'fixed_servers') {
        const [scheme, host, port] = [$('type').value, $('host').value.trim(), +$('port').value];
        if (!host || !port) return alert('请输入完整的代理信息');
        config = { mode: 'fixed_servers', rules: { singleProxy: { scheme, host, port } } };
    } else if (mode === 'pac_script') {
        const pacUrl = $('pac').value.trim();
        if (!pacUrl) return alert('请输入PAC地址');
        config = { mode: 'pac_script', pacScript: { url: pacUrl } };
    }

    chrome.storage.local.set({ proxy: config }, () => {
        chrome.runtime.sendMessage({ action: 'apply', config });
        updateStatus(true);
    });
};

$('enable').onclick = apply;
$('disable').onclick = () => {
    chrome.storage.local.remove('proxy', () => {
        chrome.runtime.sendMessage({ action: 'clear' });
        updateStatus(false);
    });
};
