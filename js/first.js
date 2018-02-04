window.KeyEvent = window.KeyEvent || {}; // defining default global KeyEvent as defined in CEA-HTML 2014 specs
window.KeyEvent.VK_LEFT = (typeof window.KeyEvent.VK_LEFT !== 'undefined' ? window.KeyEvent.VK_LEFT : 0x25);
window.KeyEvent.VK_UP = (typeof window.KeyEvent.VK_UP !== 'undefined' ? window.KeyEvent.VK_UP : 0x26);
window.KeyEvent.VK_RIGHT = (typeof window.KeyEvent.VK_RIGHT !== 'undefined' ? window.KeyEvent.VK_RIGHT : 0x27);
window.KeyEvent.VK_DOWN = (typeof window.KeyEvent.VK_DOWN !== 'undefined' ? window.KeyEvent.VK_DOWN : 0x28);
window.KeyEvent.VK_ENTER = (typeof window.KeyEvent.VK_ENTER !== 'undefined' ? window.KeyEvent.VK_ENTER : 13);
window.KeyEvent.VK_BACK = (typeof window.KeyEvent.VK_BACK !== 'undefined' ? window.KeyEvent.VK_BACK : 461);

window.KeyEvent.VK_RED = (typeof window.KeyEvent.VK_RED !== 'undefined' ? window.KeyEvent.VK_RED : 403);
window.KeyEvent.VK_GREEN = (typeof window.KeyEvent.VK_GREEN !== 'undefined' ? window.KeyEvent.VK_GREEN : 404);
window.KeyEvent.VK_YELLOW = (typeof window.KeyEvent.VK_YELLOW !== 'undefined' ? window.KeyEvent.VK_YELLOW : 405);
window.KeyEvent.VK_BLUE = (typeof window.KeyEvent.VK_BLUE !== 'undefined' ? window.KeyEvent.VK_BLUE : 406);

window.KeyEvent.VK_PLAY = (typeof window.KeyEvent.VK_PLAY !== 'undefined' ? window.KeyEvent.VK_PLAY : 0x50);
window.KeyEvent.VK_PAUSE = (typeof window.KeyEvent.VK_PAUSE !== 'undefined' ? window.KeyEvent.VK_PAUSE : 0x51);
window.KeyEvent.VK_STOP = (typeof window.KeyEvent.VK_STOP !== 'undefined' ? window.KeyEvent.VK_STOP : 0x53);

window.KeyEvent.VK_FAST_FWD = (typeof window.KeyEvent.VK_FAST_FWD !== 'undefined' ? window.KeyEvent.VK_FAST_FWD : 0x46);
window.KeyEvent.VK_REWIND = (typeof window.KeyEvent.VK_REWIND !== 'undefined' ? window.KeyEvent.VK_REWIND : 0x52);

window.KeyEvent.VK_PAGE_UP = (typeof window.KeyEvent.VK_PAGE_UP !== 'undefined' ? window.KeyEvent.VK_PAGE_UP : 0x21);
window.KeyEvent.VK_PAGE_DOWN = (typeof window.KeyEvent.VK_PAGE_DOWN !== 'undefined' ? window.KeyEvent.VK_PAGE_DOWN : 0x22);

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

// patches for some CE-HTML apps ...

window.VK_LEFT = (typeof window.VK_LEFT !== 'undefined' ? window.VK_LEFT : 0x25);
window.VK_UP = (typeof window.VK_UP !== 'undefined' ? window.VK_UP : 0x26);
window.VK_RIGHT = (typeof window.VK_RIGHT !== 'undefined' ? window.VK_RIGHT : 0x27);
window.VK_DOWN = (typeof window.VK_DOWN !== 'undefined' ? window.VK_DOWN : 0x28);
window.VK_ENTER = (typeof window.VK_ENTER !== 'undefined' ? window.VK_ENTER : 13);
window.VK_BACK = (typeof window.VK_BACK !== 'undefined' ? window.VK_BACK : 461);

window.VK_RED = (typeof window.VK_RED !== 'undefined' ? window.VK_RED : 403);
window.VK_GREEN = (typeof window.VK_GREEN !== 'undefined' ? window.VK_GREEN : 404);
window.VK_YELLOW = (typeof window.VK_YELLOW !== 'undefined' ? window.VK_YELLOW : 405);
window.VK_BLUE = (typeof window.VK_BLUE !== 'undefined' ? window.VK_BLUE : 406);

window.VK_PLAY = (typeof window.VK_PLAY !== 'undefined' ? window.VK_PLAY : 0x50);
window.VK_PAUSE = (typeof window.VK_PAUSE !== 'undefined' ? window.VK_PAUSE : 0x51);
window.VK_STOP = (typeof window.VK_STOP !== 'undefined' ? window.VK_STOP : 0x53);

window.VK_FAST_FWD = (typeof window.VK_FAST_FWD !== 'undefined' ? window.VK_FAST_FWD : 0x46);
window.VK_REWIND = (typeof window.VK_REWIND !== 'undefined' ? window.VK_REWIND : 0x52);

window.VK_PAGE_UP = (typeof window.VK_PAGE_UP !== 'undefined' ? window.VK_PAGE_UP : 0x21);
window.VK_PAGE_DOWN = (typeof window.VK_PAGE_DOWN !== 'undefined' ? window.VK_PAGE_DOWN : 0x22);

window.VK_0 = (typeof window.VK_0 !== 'undefined' ? window.VK_0 : 0x30);
window.VK_1 = (typeof window.VK_1 !== 'undefined' ? window.VK_1 : 0x31);
window.VK_2 = (typeof window.VK_2 !== 'undefined' ? window.VK_2 : 0x32);
window.VK_3 = (typeof window.VK_3 !== 'undefined' ? window.VK_3 : 0x33);
window.VK_4 = (typeof window.VK_4 !== 'undefined' ? window.VK_4 : 0x34);
window.VK_5 = (typeof window.VK_5 !== 'undefined' ? window.VK_5 : 0x35);
window.VK_6 = (typeof window.VK_6 !== 'undefined' ? window.VK_6 : 0x36);
window.VK_7 = (typeof window.VK_7 !== 'undefined' ? window.VK_7 : 0x37);
window.VK_8 = (typeof window.VK_8 !== 'undefined' ? window.VK_8 : 0x38);
window.VK_9 = (typeof window.VK_9 !== 'undefined' ? window.VK_9 : 0x39);
