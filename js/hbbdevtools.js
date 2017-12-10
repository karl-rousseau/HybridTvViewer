if (chrome.devtools.panels /*&& localStorage.getItem('tvViewer_active') === 'true'*/) {
    var hbbtvPanel = chrome.devtools.panels.create(
        'HbbTV',
        '../img/tv-icon128-on.png',
        '../html/hbbpanel.html'
    );
}
