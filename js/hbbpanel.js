
var manifest = chrome.runtime.getManifest();
document.getElementById('toolsVersion').textContent = 'v' + manifest.version;
