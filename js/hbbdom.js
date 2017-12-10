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

// If the extension is not activated for this web page then we do nothing and
// wait for the user to click on the extension icon + provided button ... otherwise we inject stuff in the DOM
var pageActivated = localStorage.getItem('tvViewer_active') === 'true';
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
        addClass(document.documentElement, 'tvViewer');
    })(window.document);

    // Android zoom option ---------------------------------------------------------

    if (navigator.userAgent.indexOf('Android') !== -1 && window.devicePixelRatio !== 1) {
        var head = document.getElementsByTagName('head')[0];
        if (head) {
            var isViewportAlreadySet = [].slice.call(head.getElementsByTagName('meta'));
            isViewportAlreadySet = isViewportAlreadySet.map(function(l) {
                return l.name.indexOf('viewport')!==-1;
            }).reduce(function(a,b) {
                return a || b;
            })==true;
            //console.log("isViewportAlreadySet=" + isViewportAlreadySet);
            if (!isViewportAlreadySet) {
                var viewport = document.createElement('meta');
                viewport.setAttribute('name', 'viewport');
                viewport.setAttribute('content', 'width=device-width, initial-scale=' + (1 / window.devicePixelRatio));
                //viewport.setAttribute('content', 'width=1280, initial-scale=1.0');
                head.appendChild(viewport);
                //console.log("Viewport meta added.");
            }
        }
    }

    // UserAgent spoofing ----------------------------------------------------------

    function toEtsiVersion(hbbVersion) {
        var versionMapping = {
            '1.0': '1.0.1',
            '1.1': '1.1.1',
            '1.5': '1.2.1',
            '2.0': '1.3.1',
            '2.0.1': '1.4.1',
            null: undefined
        };
        return versionMapping[hbbVersion];
    }

    try {
        var currentSystem = navigator.userAgent.split(/\s*[;)(]\s*/).slice(1,3).join(' ');
        var hbbtvVersion = toEtsiVersion(localStorage.getItem("tvViewer_hbbtv"));
        // FIXME: read user-agent values from localStorage ...
        var newUserAgent = 'Mozilla/5.0 (' + currentSystem + "; U; HbbTV/" + hbbtvVersion + " (; TOSHIBA; DTV_L7300; 7.2.67.14.01.1; a5; ) ; ToshibaTP/2.0.0 (+DRM) ; xx) AppleWebKit/537.4 (KHTML, like Gecko) TOSHIBA-DTV (DTV_L7300; 7.2.67.14.01.1; 2013A; NA)";
        var modifiedNavigator;
        if (currentSystem.indexOf('Mac OS') !== -1) {
            addClass(document.documentElement, 'macos');
        }
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
                value: 'HybridTvViewer',
                configurable: false,
                enumerable: true,
                writable: false
            },
            appVersion: {
                value: 'AppleWebKit/537.4 (KHTML, like Gecko) TOSHIBA-DTV (DTV_L7300; 7.2.67.14.01.1; 2013A; NA)',
                configurable: false,
                enumerable: true,
                writable: false
            },
            platform: {
                value: 'Chrome ' + currentSystem,
                configurable: false,
                enumerable: true,
                writable: false
            }
        });
    } catch (e) { } // avoid warning even if the patch is done

    // Button keys emulator --------------------------------------------------------

    (function injectButtons(document) {

        if (document.getElementById('redkey')) {
            return ;
        }

        function doKeyPress(key) {
            var oEvent = document.createEvent('KeyboardEvent');
            Object.defineProperty(oEvent, 'keyCode', { // for Chrome based browser
                get : function() { return this.keyCodeVal; }
            });
            Object.defineProperty(oEvent, 'which', {
                get : function() { return this.keyCodeVal; }
            });
            if (oEvent.initKeyboardEvent) {
                oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, key, key);
            } else {
                oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, key, 0);
            }

            oEvent.keyCodeVal = key;
            document.activeElement.dispatchEvent(oEvent);
        }

        function doKeyChangeResolution(keyId) {
            // just verify that the click is not done on the same selected button ...
            var res = keyId.replace(/key/g, 'p');
            var storedResolution = localStorage.getItem('tvViewer_resolution') || 'res720p';
            if (res == storedResolution) {
                return ;
            }

            removeClass(document.getElementById('res720key'), 'focus');
            removeClass(document.getElementById('res1080key'), 'focus');
            removeClass(document.getElementById('res1440key'), 'focus');
            removeClass(document.getElementById('res2160key'), 'focus');
            removeClass(document.body, 'res720p');
            removeClass(document.body, 'res1080p');
            removeClass(document.body, 'res1440p');
            removeClass(document.body, 'res2160p');
            addClass(document.body, res);
            addClass(document.getElementById(keyId), 'focus');
            localStorage.setItem('tvViewer_resolution', res);
        }

        function generateButton(keyId, keyValue, optionClassName) {
            var keyButton = document.createElement('span');
            keyButton.setAttribute('id', keyId);
            keyButton.setAttribute('class', 'keybutton' + (optionClassName ? ' ' + optionClassName : ''));
            keyButton.addEventListener('click', function(event) {
                if (keyValue) {
                    doKeyPress(keyValue);
                } else if (typeof keyValue == 'undefined') {
                    doKeyChangeResolution(keyId);
                } else if (keyValue === '') {
                    if (document.isFullScreen || document.webkitIsFullScreen || document.mozIsFullScreen || document.msIsFullScreen) {
                        if (document.exitFullscreen) document.exitFullscreen();
                        if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                        if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                        if (document.msExitFullscreen) document.msExitFullscreen();
                    } else {
                        if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
                        if (document.documentElement.webkitRequestFullscreen) document.documentElement.webkitRequestFullscreen();
                        if (document.documentElement.mozRequestFullscreen) document.documentElement.mozRequestFullscreen();
                        if (document.documentElement.msRequestFullscreen) document.documentElement.msRequestFullscreen();
                    }
                }
            }.bind(this));
            var body = document.getElementsByTagName('body')[0];
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
        generateButton('redkey', redValue);
        generateButton('greenkey', greenValue);
        generateButton('yellowkey', yellowValue);
        generateButton('bluekey', blueValue);

        // add F11 and F12 buttons ...
        if (navigator.userAgent.indexOf('Android') == -1) {
            generateButton('f11key', '', 'btleftgradient btrightgradient');
            generateButton('f12key', null, 'btleftgradient btrightgradient');
        }

        // add resizing screen buttons ...
        generateButton('res720key');
        generateButton('res1080key');
        generateButton('res1440key');
        generateButton('res2160key');

        // add keyboard dedicated keys to colored buttons ...
        window.addEventListener('keypress', function keyhandler(evt) {
            var keyCode = evt.which || evt.keyCode;
            if (keyCode === 0x72) { // 'r' key on PC
                doKeyPress(redValue);
                evt.preventDefault();
            } else if (keyCode === 0x67) { // 'g' key on PC
                doKeyPress(greenValue);
                evt.preventDefault();
            } else if (keyCode === 0x79) { // 'y' key on PC
                doKeyPress(yellowValue);
                evt.preventDefault();
            } else if (keyCode === 0x62) { // 'b' key on PC
                doKeyPress(blueValue);
                evt.preventDefault();
            } else if (keyCode === 8) { // BACK on PC
                doKeyPress(window.KeyEvent.VK_BACK ? window.KeyEvent.VK_BACK : (typeof VK_BACK !== 'undefined' ? VK_BACK : 461));
                evt.preventDefault();
            }
        }, false);

        var pageResolution = localStorage.getItem('tvViewer_resolution') || 'res720p';
        addClass(document.body, pageResolution);

        var centeredPage = localStorage.getItem('tvViewer_centered') || 'centered';
        addClass(document.body, centeredPage);

        var resButton = document.getElementById(pageResolution.replace(/p/g, 'key'));
        addClass(resButton, 'focus');
    })(window.document);

    // OIPF objects mapping --------------------------------------------------------

    (function injectOipf(document) {
        //console.log('Checking for OIPF objects ...');
        window.oipf = window.oipf || {};

        var int_objs = [];
        var int_objTypes = {
            oipfAppMan: 'oipfApplicationManager',
            oipfAppConfig: 'oipfConfiguration',
            oipfAppCapObj: 'oipfCapabilities'
        };
        var int_objTypesClass = {
            oipfAppMan: window.oipfApplicationManager,
            oipfAppConfig: window.oipfConfiguration,
            oipfAppCapObj: window.oipfCapabilities
        };

        function mixin(source, target) { // FIXME: use ES6 Object.assign() and arrow functions
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
        }

        function isBroadcastVideo(type) {
            return (type === 'video/broadcast');
        }

        function isBroadbandVideo(type) {
            return (type === 'audio/mp4' ||
                    type === 'audio/mpeg' ||
                    type === 'video/mp4' ||
                    type === 'video/mpeg' ||
                    type === 'application/dash+xml');
        }

        // Introspection: looking for existing objects ...
        var objects = document.getElementsByTagName('object');
        for (var i = 0; i < objects.length; i++) {
            var oipfPluginObject = objects.item(i);
            var sType = oipfPluginObject.getAttribute('type');
            for (var eType in int_objTypes) {
                var objType = int_objTypes[eType];
                if (sType === 'application/' + objType) {
                    int_objs[objType] = oipfPluginObject;
                    if (objType === 'oipfApplicationManager') {
                        mixin(window.oipfApplicationManager, int_objs[objType]);
                        break;
                    } else if (objType === 'oipfConfiguration') {
                        mixin(window.oipfConfiguration, int_objs[objType]);
                        break;
                    } else if (objType === 'oipfCapabilities') {
                        mixin(window.oipfCapabilities, int_objs[objType]);
                        break;
                    }
                }
            }
            if (sType.indexOf('video/') !== -1) {
                if (isBroadcastVideo(sType)) {
                    window.oipf.videoObject = oipfPluginObject;
                    var currentChannel = {
                        'TYPE_TV': 12,
                        'channelType': 12,
                        'sid': 1,
                        'onid': 1,
                        'tsid': 1,
                        'name': 'test',
                        'ccid': 'ccid:dvbt.0',
                        'dsd': ''
                    };
                    oipfPluginObject.currentChannel = currentChannel;
                    oipfPluginObject.bindToCurrentChannel = function() {
                        return currentChannel;
                    };
                    oipfPluginObject.prevChannel = function() {
                        return currentChannel;
                    };
                    oipfPluginObject.nextChannel = function() {
                        return currentChannel;
                    };
                    function ChannelConfig() {
	                  }
                    ChannelConfig.prototype.channelList = {};
                    ChannelConfig.prototype.channelList._list = [];
                    ChannelConfig.prototype.channelList._list.push(currentChannel);
                    Object.defineProperties(ChannelConfig.prototype.channelList, {
                        'length': {
                            enumerable: true,
                            get : function length() {
                                return window.oipf.ChannelConfig.channelList._list.length;
                            }
                        }
                    });
                    ChannelConfig.prototype.channelList.item = function(index) {
                        return window.oipf.ChannelConfig.channelList._list[index];
                    };
                    ChannelConfig.prototype.channelList.getChannel = function(ccid) {
                        var channels = window.oipf.ChannelConfig.channelList._list;
                        for (var channelIdx in channels) {
                            var channel = channels[channelIdx];
                            if (ccid === channel.ccid)
                                return channel;
                        }
                        return null;
                    };
                    ChannelConfig.prototype.channelList.getChannelByTriplet = function(onid, tsid, sid, nid) {
                        var channels = window.oipf.ChannelConfig.channelList._list;
                        for (var channelIdx in channels) {
                            var channel = channels[channelIdx];
                            if (onid === channel.onid &&
                                tsid === channel.tsid &&
                                sid === channel.sid)
                                return channel;
                        }
                        return null;
                    };
                    window.oipf.ChannelConfig = new ChannelConfig();
                    oipfPluginObject.getChannelConfig = {}; // OIPF 7.13.9 getChannelConfig
                    Object.defineProperties(oipfPluginObject, {
                        'getChannelConfig': {
                            value : function() {
                                return window.oipf.ChannelConfig;
                            },
                            enumerable: true,
                            writable : false
                        }
                    });
                    oipfPluginObject.programmes = [];
                    oipfPluginObject.programmes.push({name:'Event 1, umlaut \u00e4',channelId:'ccid:dvbt.0',duration:600,startTime:Date.now()/1000,description:'EIT present event is under construction'});
                    oipfPluginObject.programmes.push({name:'Event 2, umlaut \u00f6',channelId:'ccid:dvbt.0',duration:300,startTime:Date.now()/1000+600,description:'EIT following event is under construction'});
                    console.info("BROADCAST VIDEO PLAYER ...");
                } else if (isBroadbandVideo(sType)) {
                    console.info("BROADBAND VIDEO PLAYER ...");
                    window.oipf.videoObject = oipfPluginObject;
                    oipfPluginObject.play = (function(speed) { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) player.play(); }).bind(oipfPluginObject);
                    oipfPluginObject.stop = (function() { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) player.stop(); }).bind(oipfPluginObject);
                    oipfPluginObject.seek = (function(pos) { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) player.currentTime=pos/1000; }).bind(oipfPluginObject);
                    oipfPluginObject.data = (function(src) { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) console.log(src); }).bind(oipfPluginObject);
                    oipfPluginObject.playState = (function() { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) console.log('state'); }).bind(oipfPluginObject);
                    oipfPluginObject.playPosition = (function() { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) console.log('pos='+(player.currentTime*1000)); }).bind(oipfPluginObject);
                    oipfPluginObject.speed = (function() { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) console.log('speed='+player.playbackRate); }).bind(oipfPluginObject);

                }

                // if video is broadcast or broadband one ... do the in-common video player injection ...
                /*if (isBroadcastVideo(sType) || isBroadbandVideo(sType)) {
                    var isVideoPlayerAlreadyAdded = oipfPluginObject.children.length > 0;
//console.warn('BROADCAST OR BROADBAND VIDEO PLAYER ... ',isVideoPlayerAlreadyAdded)
                    if (!isVideoPlayerAlreadyAdded) {
                        var videoTag = document.createElement('video');
                        videoTag.setAttribute('id', 'video-player');
                        videoTag.setAttribute('autoplay', '');
                        videoTag.setAttribute('style', 'postion:inherit; top:inherit; left:inherit; width:inherit; height:inherit;');
                        videoTag.src = 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4';
                        oipfPluginObject.appendChild(videoTag);
//console.warn('BROADCAST OR BROADBAND VIDEO PLAYER ... ADDED')
                        var canPlay = !!videoTag.canPlayType(sType);
                        if (!canPlay) { // if video type is not supported by HTML5 then use Video.JS ...
                            console.warn('Adding VIDEO.JS for video type ' + sType + ' ...');
                            var head = document.getElementsByTagName('head')[0];

                            var videoJsScript = document.createElement('script');
                            videoJsScript.setAttribute('type', 'text/javascript');
                            videoJsScript.setAttribute('src', 'https://unpkg.com/video.js/dist/video.js');
                            head.appendChild(videoJsScript);

                            videoJsScript = document.createElement('script');
                            videoJsScript.setAttribute('type', 'text/javascript');
                            videoJsScript.setAttribute('src', 'http://cdn.dashjs.org/latest/dash.all.debug.js');
                            head.appendChild(videoJsScript);

                            videoJsScript = document.createElement('script');
                            videoJsScript.setAttribute('type', 'text/javascript');
                            videoJsScript.setAttribute('src', 'https://unpkg.com/videojs-contrib-dash/dist/videojs-dash.js');
                            head.appendChild(videoJsScript);

                            videoJsScript = document.createElement('script');
                            videoJsScript.setAttribute('type', 'text/javascript');
                            videoJsScript.setAttribute('textContent', 'var player = videojs("example-video"); player.src({src:"http://itv.mit-xperts.com/video/dash/new.php/test.mpd",type:"application/dash+xml"});');
                            head.appendChild(videoJsScript);

                        }
                    }
                    // observe changes on this tag ...

                }*/
            }
        }
    })(window.document);

    //console.log('DOM HbbTV emulator added.');
}
