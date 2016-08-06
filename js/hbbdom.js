/*******************************************************************************

    ChromeTvViewer - a browser extension to open HbbTV,CE-HTML,BML,OHTV webpages
    instead of downloading them. A mere simulator is also provided.

    Copyright (C) 2015 Karl Rousseau

    MIT License:
    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.

    See the MIT License for more details: http://opensource.org/licenses/MIT

    HomePage: https://github.com/karl-rousseau/ChromeHybridTvViewer
*/
// jshint -W082:true, -W083:true

// If the extension is not activated for this web page then we do nothing and
// wait for the user to click on the extension icon ... otherwise we inject stuff in the DOM
var pageActivated = localStorage.getItem('tvViewer_active') == 'true';
if (pageActivated) {
    function addClass(element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else {
            element.className += ' ' + className;
        }
    }

    function removeClass(element, className) {
        if (element.classList) {
            element.classList.remove(className);
        }
    }

    (function injectClass(document) {
        // Just tag current page as activated and also do CSS injection at the same time ...
        addClass(document.documentElement, "tvViewer");
    })(window.document);

    // UserAgent spoofing ----------------------------------------------------------

    var newUserAgent = "Mozilla/5.0 (Linux mipsel; U; HbbTV/1.1.1 (; TOSHIBA; DTV_L7300; 7.2.67.14.01.1; a5; ) ; ToshibaTP/2.0.0 (+DRM) ; xx) AppleWebKit/537.4 (KHTML, like Gecko) TOSHIBA-DTV (DTV_L7300; 7.2.67.14.01.1; 2013A; NA)";
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
    });

    // Button keys emulator --------------------------------------------------------

    (function injectButtons(document) {

        if (document.getElementById("redkey")) {
            return ;
        }

        function doKeyPress(key) {
            var event = document.createEvent('Event');
            event.keyCode = key;
            event.initEvent('keydown');
            document.dispatchEvent(event);
        }

        function doKeyChangeResolution(keyId) {
            // just verify that the click is not done on the same selected button ...
            var res = keyId.replace(/key/g, 'p');
            var storedResolution = localStorage.getItem('tvViewer_resolution') || "res720p";
            if (res == storedResolution) {
                return ;
            }

            removeClass(document.getElementById("res720key"), "focus");
            removeClass(document.getElementById("res1080key"), "focus");
            removeClass(document.getElementById("res1440key"), "focus");
            removeClass(document.getElementById("res2160key"), "focus");
            removeClass(document.body, "res720p");
            removeClass(document.body, "res1080p");
            removeClass(document.body, "res1440p");
            removeClass(document.body, "res2160p");
            addClass(document.body, res);
            addClass(document.getElementById(keyId), "focus");
            localStorage.setItem('tvViewer_resolution', res); // TODO: store this value in Chrome's extension
        }

        function generateButton(keyId, keyValue, optionClassName) {
            var keyButton = document.createElement('span');
            keyButton.setAttribute("id", keyId);
            keyButton.setAttribute("class", "keybutton" + (optionClassName ? ' ' + optionClassName : ''));
            keyButton.addEventListener('click', function() {
                if (keyValue) {
                    doKeyPress(keyValue);
                } else if (typeof keyValue == 'undefined') {
                    doKeyChangeResolution(keyId);
                }
            });
            var body = document.getElementsByTagName("body")[0];
            if (body) {
                body.appendChild(keyButton);
            }
        }

        // warning: here for ARTE, we can't use the KeyEvent object but only the global VK_xx
        window.KeyEvent = window.KeyEvent || {};
        var redValue = window.KeyEvent.VK_RED ? window.KeyEvent.VK_RED : (typeof VK_RED !== 'undefined' ? VK_RED : 403);
        var greenValue = window.KeyEvent.VK_GREEN ? window.KeyEvent.VK_GREEN : (typeof VK_GREEN !== 'undefined' ? VK_GREEN : 404);
        var yellowValue = window.KeyEvent.VK_YELLOW ? window.KeyEvent.VK_YELLOW : (typeof VK_YELLOW !== 'undefined' ? VK_YELLOW : 405);
        var blueValue = window.KeyEvent.VK_BLUE ? window.KeyEvent.VK_BLUE : (typeof VK_BLUE !== 'undefined' ? VK_BLUE : 406);
        generateButton("redkey", redValue);
        generateButton("greenkey", greenValue);
        generateButton("yellowkey", yellowValue);
        generateButton("bluekey", blueValue);

        // add F11 and F12 buttons ... (not clickable as the browser will handle their actions by default)
        generateButton("f11key", null, "btleftgradient btrightgradient");
        generateButton("f12key", null, "btleftgradient btrightgradient");

        // add resizing screen buttons ...
        generateButton("res720key");
        generateButton("res1080key");
        generateButton("res1440key");
        generateButton("res2160key");

        var pageResolution = localStorage.getItem('tvViewer_resolution') || "res720p";
        addClass(document.body, pageResolution);

        var resButton = document.getElementById(pageResolution.replace(/p/g, "key"));
        addClass(resButton, "focus");
    })(window.document);

    // OIPF objects mapping --------------------------------------------------------

    (function injectOipf(document) {
        console.log("Checking for OIPF objects ...");
        window.oipf = window.oipf || {};

        var int_objs = [];
        var int_objTypes = {
            oipfAppMan: "oipfApplicationManager",
            oipfAppConfig: "oipfConfiguration",
            oipfAppCapObj: "oipfCapabilities"
        };
        var int_objTypesClass = {
            oipfAppMan: window.oipfApplicationManager,
            oipfAppConfig: window.oipfConfiguration,
            oipfAppCapObj: window.oipfCapabilities
        };

        function mixin(source, target) { // soon we might use ES6 Object.assign()
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
        }

        // Introspection: looking for existing objects ...
        var objects = document.getElementsByTagName("object");
        for (var i = 0; i < objects.length; i++) {
            var oipfPluginObject = objects.item(i);
            var sType = oipfPluginObject.getAttribute("type");
            console.log((i + 1) + " / " + objects.length + " : " + sType);
            for (var eType in int_objTypes) {
                var objType = int_objTypes[eType];
                if (sType === "application/" + objType) {
                    int_objs[objType] = oipfPluginObject;
                    if (objType === "oipfApplicationManager") {
                        console.log("re-using user-defined oipfApplicationManager");
                        mixin(window.oipfApplicationManager, int_objs[objType]);
                        break;
                    } else if (objType === "oipfConfiguration") {
                        console.log("re-using user-defined oipfConfiguration");
                        mixin(window.oipfConfiguration, int_objs[objType]);
                        break;
                    } else if (objType === "oipfCapabilities") {
                        console.log("re-using user-defined oipfCapabilities");
                        mixin(window.oipfCapabilities, int_objs[objType]);
                        break;
                    }
                }
            }
            if (sType.indexOf("video/") !== -1) {
                if (sType === "video/broadcast") {
                    console.log("re-using user-defined video object");
                    window.oipf.videoObject = oipfPluginObject;
                    var currentChannel = {
                        'TYPE_TV': 12,
                        'channelType': 12,
                        'sid': 1,
                        'onid': 1,
                        'tsid': 1,
                        'name': 'test'
                    };
                    oipfPluginObject.currentChannel = currentChannel;
                    oipfPluginObject.bindToCurrentChannel = function() {
                        return currentChannel;
                    };
                } else if (sType === "video/mp4" || sType === "video/mpeg4") {
                    window.oipf.videoObject = oipfPluginObject;
                    oipfPluginObject.play = function (speed) {
                    };

                }
            }
        }
    })(window.document);

    console.log("DOM HbbTV emulator added.");
}
