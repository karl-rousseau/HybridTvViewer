//setTimeout(function () {
window.KeyEvent = window.KeyEvent || {}; // defining default global KeyEvent as defined in CEA-HTML 2014 specs
window.KeyEvent.VK_LEFT = (typeof window.KeyEvent.VK_LEFT !== 'undefined' ? window.KeyEvent.VK_LEFT : 0x25);
window.KeyEvent.VK_UP = (typeof window.KeyEvent.VK_UP !== 'undefined' ? window.KeyEvent.VK_UP : 0x26);
window.KeyEvent.VK_RIGHT = (typeof window.KeyEvent.VK_RIGHT !== 'undefined' ? window.KeyEvent.VK_RIGHT : 0x27);
window.KeyEvent.VK_DOWN = (typeof window.KeyEvent.VK_DOWN !== 'undefined' ? window.KeyEvent.VK_DOWN : 0x28);
window.KeyEvent.VK_ENTER = (typeof window.KeyEvent.VK_ENTER !== 'undefined' ? window.KeyEvent.VK_ENTER : 0x0d);
window.KeyEvent.VK_BACK = (typeof window.KeyEvent.VK_BACK !== 'undefined' ? window.KeyEvent.VK_BACK : 0xa6);

window.KeyEvent.VK_RED = (typeof window.KeyEvent.VK_RED !== 'undefined' ? window.KeyEvent.VK_RED : 403);
window.KeyEvent.VK_GREEN = (typeof window.KeyEvent.VK_GREEN !== 'undefined' ? window.KeyEvent.VK_GREEN : 404);
window.KeyEvent.VK_YELLOW = (typeof window.KeyEvent.VK_YELLOW !== 'undefined' ? window.KeyEvent.VK_YELLOW : 405);
window.KeyEvent.VK_BLUE = (typeof window.KeyEvent.VK_BLUE !== 'undefined' ? window.KeyEvent.VK_BLUE : 406);

window.KeyEvent.VK_PLAY = (typeof window.KeyEvent.VK_PLAY !== 'undefined' ? window.KeyEvent.VK_PLAY : 0x50);
window.KeyEvent.VK_PAUSE = (typeof window.KeyEvent.VK_PAUSE !== 'undefined' ? window.KeyEvent.VK_PAUSE : 0x51);
window.KeyEvent.VK_STOP = (typeof window.KeyEvent.VK_STOP !== 'undefined' ? window.KeyEvent.VK_STOP : 0x53);

window.KeyEvent.VK_FAST_FWD = (typeof window.KeyEvent.VK_FAST_FWD !== 'undefined' ? window.KeyEvent.VK_FAST_FWD : 0x46);
window.KeyEvent.VK_REWIND = (typeof window.KeyEvent.VK_REWIND !== 'undefined' ? window.KeyEvent.VK_REWIND : 0x52);

window.KeyEvent.VK_0 = (typeof window.KeyEvent.VK_0 !== 'undefined' ? window.KeyEvent.VK_0 : 0x30);
window.KeyEvent.VK_1 = (typeof window.KeyEvent.VK_1 !== 'undefined' ? window.KeyEvent.VK_1 : 0x31);
window.KeyEvent.VK_2 = (typeof window.KeyEvent.VK_2 !== 'undefined' ? window.KeyEvent.VK_2 : 0x32);
window.KeyEvent.VK_3 = (typeof window.KeyEvent.VK_3 !== 'undefined' ? window.KeyEvent.VK_3 : 0x33);
window.KeyEvent.VK_4 = (typeof window.KeyEvent.VK_4 !== 'undefined' ? window.KeyEvent.VK_4 : 0x34);
window.KeyEvent.VK_5 = (typeof window.KeyEvent.VK_5 !== 'undefined' ? window.KeyEvent.VK_5 : 0x35);
window.KeyEvent.VK_6 = (typeof window.KeyEvent.VK_6 !== 'undefined' ? window.KeyEvent.VK_6 : 0x36);
window.KeyEvent.VK_7 = (typeof window.KeyEvent.VK_7 !== 'undefined' ? window.KeyEvent.VK_7 : 0x37);
window.KeyEvent.VK_8 = (typeof window.KeyEvent.VK_8 !== 'undefined' ? window.KeyEvent.VK_8 : 0x38);
window.KeyEvent.VK_9 = (typeof window.KeyEvent.VK_9 !== 'undefined' ? window.KeyEvent.VK_9 : 0x39);

/*var newUserAgent = "Mozilla/5.0 (Linux mipsel; U; HbbTV/1.1.1 (; TOSHIBA; DTV_L7300; 7.2.67.14.01.1; a5; ) ; ToshibaTP/2.0.0 (+DRM) ; xx) AppleWebKit/537.4 (KHTML, like Gecko) TOSHIBA-DTV (DTV_L7300; 7.2.67.14.01.1; 2013A; NA)";
var modifiedNavigator;
if ('userAgent' in Navigator.prototype) { // Chrome V43+ moved all properties from navigator to the prototype
    modifiedNavigator = Navigator.prototype;
}
Object.defineProperties(modifiedNavigator, {
    userAgent: {
        value: newUserAgent,
        configurable: false,
        enumerable: true,
        writable: false
    },
    appName: {
        value: "ChromeTvViewer",
        configurable: false,
        enumerable: true,
        writable: false
    },
    appVersion: {
        value: "AppleWebKit/537.4 (KHTML, like Gecko) TOSHIBA-DTV (DTV_L7300; 7.2.67.14.01.1; 2013A; NA)",
        configurable: false,
        enumerable: true,
        writable: false
    },
    platform: {
        value: 'Chrome',
        configurable: false,
        enumerable: true,
        writable: false
    }
});*/
//console.warn(navigator.userAgent)
//}, 150);
