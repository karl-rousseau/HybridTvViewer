window.Application = {};
(function(Application) {

    Application.visible = undefined;
    Application.privateData = {};
    Application.privateData.keyset = {};
    Application.privateData.keyset.RED = 0x1;
    Application.privateData.keyset.GREEN = 0x2;
    Application.privateData.keyset.YELLOW = 0x4;
    Application.privateData.keyset.BLUE = 0x8;
    Application.privateData.keyset.NAVIGATION = 0x10;
    Application.privateData.keyset.VCR = 0x20;
    Application.privateData.keyset.SCROLL = 0x40;
    Application.privateData.keyset.INFO = 0x80;
    Application.privateData.keyset.NUMERIC = 0x100;
    Application.privateData.keyset.ALPHA = 0x200;
    Application.privateData.keyset.OTHER = 0x400;
    Application.privateData.keyset.value = null;
    Application.privateData.keyset.setValue = function(value) {
        Application.privateData.keyset.value = value;
    };
    Application.privateData.currentChannel = {};
    Application.privateData.getFreeMem = function() {
        // FIXME: better use https://developer.chrome.com/extensions/examples/api/processes/process_monitor/popup.js
        return ((window.performance && window.performance.memory.usedJSHeapSize) || -1);
    };

    Application.show = function() {

    };

    Application.hide = function() {

    };

    Application.createApplication = function(uri, createChild) {

    };

    Application.destroyApplication = function() {

    };

})(window.Application);
