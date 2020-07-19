/*******************************************************************************

    HybridTvViewer - a browser extension to open HbbTV,CE-HTML,BML,OHTV webpages
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

    HomePage: https://github.com/karl-rousseau/HybridTvViewer
*/

// If the extension is not activated for this web page then we do nothing and
// wait for the user to click on the extension icon + provided button ... otherwise we inject stuff in the DOM
var pageActivated = localStorage.getItem('tvViewer_active') === 'true';
if (pageActivated) {
    function addClass(element, className) {
        if (element.classList && className !== '' && className !== null) {
            element.classList.add(className);
        } else {
            element.className += ' ' + className;
        }
    }

    function removeClass(element, className) {
        if (element.classList && className !== '' && className !== null) {
            element.classList.remove(className);
        }
    }

    (function injectClass(document) {
        // Just tag current page as activated and also do CSS injection at the same time ...
        addClass(document.documentElement, 'tvViewer');
    })(window.document);

    // Android zoom option ---------------------------------------------------------

    if (navigator.userAgent.includes('Android') && window.devicePixelRatio !== 1) {
        var head = document.getElementsByTagName('head')[0];
        if (head) {
            var isViewportAlreadySet = [].slice.call(head.getElementsByTagName('meta'));
            isViewportAlreadySet = isViewportAlreadySet.map(function(l) {
                return l.name.indexOf('viewport') !== -1;
            }).reduce(function(a,b) {
                return a || b;
            })===true;
            if (!isViewportAlreadySet) {
                var viewport = document.createElement('meta');
                viewport.setAttribute('name', 'viewport');
                viewport.setAttribute('content', 'width=device-width, user-scalable=yes, maximum-scale=4.0, minimum-scale=0, initial-scale=' + (1 / window.devicePixelRatio));
                head.appendChild(viewport);
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
            '2.0.2': '1.5.1',
            null: undefined
        };
        return versionMapping[hbbVersion];
    }

    try {
        var currentSystem = navigator.userAgent.split(/\s*[;)(]\s*/).slice(1,3).join(' ');
        var hbbtvVersion = toEtsiVersion(localStorage.getItem('tvViewer_hbbtv'));
        // FIXME: read user-agent values from localStorage ...
        //var newUserAgent = 'Mozilla/5.0 (' + currentSystem + '; U; HbbTV/' + hbbtvVersion + ' (; TOSHIBA; DTV_L7300; 7.2.67.14.01.1; a5; ) ; ToshibaTP/2.0.0 (+DRM) ; xx) AppleWebKit/537.4 (KHTML, like Gecko) TOSHIBA-DTV (DTV_L7300; 7.2.67.14.01.1; 2013A; NA)';
        var newUserAgent = 'HbbTV/' + hbbtvVersion + ' (+DRM;Samsung;SmartTV2015;T-HKM6DEUC-1490.3;;) HybridTvViewer';
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
                value: 'HbbTV/1.2.1 (+DRM;Samsung;SmartTV2015;T-HKM6DEUC-1490.3;;)',
                //value: 'AppleWebKit/537.4 (KHTML, like Gecko) TOSHIBA-DTV (DTV_L7300; 7.2.67.14.01.1; 2013A; NA)',
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

        if (document.getElementById('tvkeys')) {
            return ;
        } else {
            var tvkeys = document.createElement('div');
            tvkeys.setAttribute('id', 'tvkeys');
            var body = document.getElementsByTagName('body')[0];
            if (body) {
                body.appendChild(tvkeys);
            }
        }

        function getInjectedParams() {
            var scripts = document.head.getElementsByTagName('script');
            if (scripts.length === 0) {
                return;
            }
            scripts = [].slice.call(scripts).filter(function(l) { return l.src.indexOf('hbbdom.js') !== -1; });
            return scripts && scripts.length > 0 ? scripts[0].src : null;
        }

        function doKeyPress(key) {
            var oEvent = document.createEvent('KeyboardEvent');
            Object.defineProperty(oEvent, 'keyCode', { // for Chrome based browser
                get: function() { return this.keyCodeVal; }
            });
            Object.defineProperty(oEvent, 'which', {
                get: function() { return this.keyCodeVal; }
            });
            if (oEvent.initKeyboardEvent) {
                oEvent.initKeyboardEvent('keydown', true, true, document.defaultView, false, false, false, false, key, key);
            } else {
                oEvent.initKeyEvent('keydown', true, true, document.defaultView, false, false, false, false, key, 0);
            }

            oEvent.keyCodeVal = key;
            document.activeElement.dispatchEvent(oEvent);
        }

        function doKeyChangeResolution(keyId) {
            // just verify that the click is not done on the same selected button ...
            var res = keyId.replace(/key/g, 'p');
            var storedResolution = localStorage.getItem('tvViewer_resolution') || 'res720p';
            if (res === storedResolution) {
                return ;
            }

            removeClass(document.getElementById('res720key'), 'focus');
            removeClass(document.getElementById('res1080key'), 'focus');
            removeClass(document.getElementById('res1440key'), 'focus');
            removeClass(document.getElementById('res2160key'), 'focus');
            removeClass(document.getElementById('res2880key'), 'focus');
            removeClass(document.getElementById('res4320key'), 'focus');
            removeClass(document.body, 'res720p');
            removeClass(document.body, 'res1080p');
            removeClass(document.body, 'res1440p');
            removeClass(document.body, 'res2160p');
            removeClass(document.body, 'res2880p');
            removeClass(document.body, 'res4320p');
            addClass(document.body, res);
            addClass(document.getElementById(keyId), 'focus');
            localStorage.setItem('tvViewer_resolution', res);
        }

        function generateButton(keyId, keyValue, optionClassName, optionTooltip) {
            var keyButton = document.createElement('span');
            keyButton.setAttribute('id', keyId);
            keyButton.setAttribute('class', 'keybutton' + (optionClassName ? ' ' + optionClassName : ''));
            if (optionTooltip) {
                keyButton.setAttribute('title', optionTooltip);
            }
            keyButton.addEventListener('click', function(event) {
                if (keyValue) {
                    doKeyPress(keyValue);
                } else if (typeof keyValue === 'undefined') {
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
            var tvkeys = document.getElementById('tvkeys');
            if (tvkeys) {
                tvkeys.appendChild(keyButton);
            }
        }

        // warning: here for ARTE, we can't use the KeyEvent object but only the global VK_xx
        window.KeyEvent = window.KeyEvent || {};
        var redValue = window.KeyEvent.VK_RED ? window.KeyEvent.VK_RED : (typeof window.VK_RED !== 'undefined' ? window.VK_RED : 403);
        var greenValue = window.KeyEvent.VK_GREEN ? window.KeyEvent.VK_GREEN : (typeof window.VK_GREEN !== 'undefined' ? window.VK_GREEN : 404);
        var yellowValue = window.KeyEvent.VK_YELLOW ? window.KeyEvent.VK_YELLOW : (typeof window.VK_YELLOW !== 'undefined' ? window.VK_YELLOW : 405);
        var blueValue = window.KeyEvent.VK_BLUE ? window.KeyEvent.VK_BLUE : (typeof window.VK_BLUE !== 'undefined' ? window.VK_BLUE : 406);
        generateButton('redkey', redValue);
        generateButton('greenkey', greenValue);
        generateButton('yellowkey', yellowValue);
        generateButton('bluekey', blueValue);

        // add F11 and F12 buttons ...
        if (navigator.userAgent.indexOf('Android') === -1) {
            generateButton('f11key', '', 'btleftgradient btrightgradient');
            generateButton('f12key', null, 'btleftgradient btrightgradient');
        } else {
            var leftValue = window.KeyEvent.VK_LEFT ? window.KeyEvent.VK_LEFT : (typeof window.KeyEvent.VK_LEFT !== 'undefined' ? window.KeyEvent.VK_LEFT : 0x25);
            var upValue = window.KeyEvent.VK_UP ? window.KeyEvent.VK_UP : (typeof window.KeyEvent.VK_UP !== 'undefined' ? window.KeyEvent.VK_UP : 0x26);
            var rightValue = window.KeyEvent.VK_RIGHT ? window.KeyEvent.VK_RIGHT : (typeof window.KeyEvent.VK_RIGHT !== 'undefined' ? window.KeyEvent.VK_RIGHT : 0x27);
            var downValue = window.KeyEvent.VK_DOWN ? window.KeyEvent.VK_DOWN : (typeof window.KeyEvent.VK_DOWN !== 'undefined' ? window.KeyEvent.VK_DOWN : 0x28);
            var okValue = window.KeyEvent.VK_ENTER ? window.KeyEvent.VK_ENTER : (typeof window.KeyEvent.VK_ENTER !== 'undefined' ? window.KeyEvent.VK_ENTER : 13);
            var backValue = window.KeyEvent.VK_BACK ? window.KeyEvent.VK_BACK : (typeof window.KeyEvent.VK_BACK !== 'undefined' ? window.KeyEvent.VK_BACK : 461);
            generateButton('leftkey', leftValue);
            generateButton('okkey', okValue);
            generateButton('rightkey', rightValue);
            generateButton('downkey', downValue);
            generateButton('backkey', backValue);
            generateButton('upkey', upValue);
        }

        // add resizing screen buttons ...
        generateButton('res720key', undefined, undefined, 'HD');
        generateButton('res1080key', undefined, undefined, '2K Full HD');
        generateButton('res1440key', undefined, undefined, 'Quad HD');
        generateButton('res2160key', undefined, undefined, '4K UHD');
        generateButton('res2880key', undefined, undefined, '5K');
        generateButton('res4320key', undefined, undefined, '8K');

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
                doKeyPress(window.KeyEvent.VK_BACK ? window.KeyEvent.VK_BACK : (typeof window.VK_BACK !== 'undefined' ? window.VK_BACK : 461));
                evt.preventDefault();
            }
        }, false);

        var pageResolution = localStorage.getItem('tvViewer_resolution') || 'res720p';
        addClass(document.body, pageResolution);

        var currentPageUrl = getInjectedParams();
        var lightTheme = currentPageUrl.indexOf('light') !== -1 ? 'light' : '';
        addClass(document.documentElement, lightTheme);

        var centeredPage = currentPageUrl.indexOf('centered') !== -1 ? 'centered' : '';
        addClass(document.body, centeredPage);

        var overscanFlag = currentPageUrl.indexOf('overscan') !== -1 ? 'overscan' : '';
        addClass(document.body, overscanFlag);

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
                        Object.assign(int_objs[objType], window.oipfApplicationManager);
                        break;
                    } else if (objType === 'oipfConfiguration') {
                        Object.assign(int_objs[objType], window.oipfConfiguration);
                        break;
                    } else if (objType === 'oipfCapabilities') {
                        Object.assign(int_objs[objType], window.oipfCapabilities);
                        break;
                    }
                }
            }
            if (sType && sType.indexOf('video/') !== -1) {
                if (isBroadcastVideo(sType)) {
                    window.oipf.videoObject = oipfPluginObject;

                    //import { oipfBroadcastVideoMethods } from './videobc.mjs';
                    //oipfBroadcastVideoMethods(oipfPluginObject);

                    var currentChannel = {
                        TYPE_TV: 12,
                        channelType: 12,
                        sid: 1,
                        onid: 1,
                        tsid: 1,
                        name: 'test',
                        ccid: 'ccid:dvbt.0',
                        dsd: ''
                    };
                    oipfPluginObject.currentChannel = currentChannel;
                    oipfPluginObject.createChannelObject = function() {
                        console.timeStamp && console.timeStamp('bcVideo.createChannelObject');
                    };
                    oipfPluginObject.bindToCurrentChannel = function() {
                        console.timeStamp && console.timeStamp('bcVideo.bindToCurrentChannel');
                        var player = document.getElementById('video-player');
                        if (player) {
                            player.play();
                        }
                    };
                    oipfPluginObject.setChannel = function() {
                        console.timeStamp && console.timeStamp('bcVideo.setChannel');
                    };
                    oipfPluginObject.prevChannel = function() {
                        console.timeStamp && console.timeStamp('bcVideo.prevChannel');
                        return currentChannel;
                    };
                    oipfPluginObject.nextChannel = function() {
                        console.timeStamp && console.timeStamp('bcVideo.nextChannel');
                        return currentChannel;
                    };
                    oipfPluginObject.release = function() {
                        console.timeStamp && console.timeStamp('bcVideo.release');
                        var player = document.getElementById('video-player');
                        if (player) {
                            player.pause();
                            player.parentNode.removeChild(player);
                        }
                    };
                    function ChannelConfig() {
	                  }
                    ChannelConfig.prototype.channelList = {};
                    ChannelConfig.prototype.channelList._list = [];
                    ChannelConfig.prototype.channelList._list.push(currentChannel);
                    Object.defineProperties(ChannelConfig.prototype.channelList, {
                        length: {
                            enumerable: true,
                            get: function length() {
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
                    Object.defineProperty(oipfPluginObject, 'COMPONENT_TYPE_VIDEO', { value: 0, enumerable: true });
                    Object.defineProperty(oipfPluginObject, 'COMPONENT_TYPE_AUDIO', { value: 1, enumerable: true });
                    Object.defineProperty(oipfPluginObject, 'COMPONENT_TYPE_SUBTITLE', { value: 2, enumerable: true });
                    class AVComponent {
                        constructor() {
                            this.COMPONENT_TYPE_VIDEO = 0;
                            this.COMPONENT_TYPE_AUDIO = 1;
                            this.COMPONENT_TYPE_SUBTITLE = 2;
                            this.componentTag = 0;
                            this.pid = undefined;
                            this.type = undefined;
                            this.encoding = 'DVB-SUBT';
                            this.encrypted = false;
                        }
                    }
                    class AVVideoComponent extends AVComponent {
                        constructor() {
                            super();
                            this.type = this.COMPONENT_TYPE_VIDEO;
                            this.aspectRatio = 1.78;
                        }
                    }
                    class AVAudioComponent extends AVComponent {
                        constructor() {
                            super();
                            this.type = this.COMPONENT_TYPE_AUDIO;
                            this.language = 'eng';
                            this.audioDescription = false;
                            this.audioChannels = 2;
                        }
                    }
                    class AVSubtitleComponent extends AVComponent {
                        constructor() {
                            super();
                            this.type = this.COMPONENT_TYPE_SUBTITLE;
                            this.language = 'deu';
                            this.hearingImpaired = false;
                        }
                    }
                    class AVComponentCollection extends Array {
                        constructor(num) {
                            super(num);
                        }
                        item(idx) {
                            return idx < this.length ? this[idx] : [];
                        }
                    }
                    oipfPluginObject.getComponents = (function(type) {
                        return [
                            type === this.COMPONENT_TYPE_VIDEO ? new AVVideoComponent() :
                                type === this.COMPONENT_TYPE_AUDIO ? new AVAudioComponent() :
                                    type === this.COMPONENT_TYPE_SUBTITLE ? new AVSubtitleComponent() : null
                        ];
                    }).bind(oipfPluginObject);
                    // TODO: read those values from a message to the extension (+ using a dedicated worker to retrieve those values from the TS file inside broadcast_url form field)
                    oipfPluginObject.getCurrentActiveComponents = (function() { return [ new AVVideoComponent(), new AVAudioComponent(), new AVSubtitleComponent() ]; }).bind(oipfPluginObject);
                    oipfPluginObject.selectComponent = (function(cpt) { return true; }).bind(oipfPluginObject);
                    oipfPluginObject.unselectComponent = (function(cpt) { return true; }).bind(oipfPluginObject);
                    oipfPluginObject.setFullScreen = (function(state) { this.onFullScreenChange(state); var player = this.children.length > 0 ? this.children[0] : undefined; if (player && state) { player.style.width='100%'; player.style.height='100%'; } }).bind(oipfPluginObject);
                    oipfPluginObject.onFullScreenChange = function() {
                    };
                    oipfPluginObject.onChannelChangeError = function(channel, error) {
                    };
                    oipfPluginObject.onChannelChangeSucceeded = function(channel) {
                    };
                    oipfPluginObject.addStreamEventListener = function(url, eventName, listener) {

                    };
                    oipfPluginObject.removeStreamEventListener = function(url, eventName, listener) {

                    };
                    oipfPluginObject.addEventListener = function(type, listener, capture) {
                    };
                    oipfPluginObject.removeEventListener = function(type, listener, capture) {
                    };
                    //console.info('BROADCAST VIDEO PLAYER ...');

                } else if (isBroadbandVideo(sType)) {
                    //console.info('BROADBAND VIDEO PLAYER ...');
                    window.oipf.videoObject = oipfPluginObject;

                    //import { oipfBroadbandVideoMethods } from './videobb.mjs';
                    //oipfBroadbandVideoMethods(oipfPluginObject);

                    oipfPluginObject.play = (function(speed) { console.timeStamp && console.timeStamp('bbVideo.play('+speed+')'); var player = this.children.length > 0 ? this.children[0] : undefined; if (player) player.play(); }).bind(oipfPluginObject);
                    oipfPluginObject.stop = (function() { console.timeStamp && console.timeStamp('bbVideo.stop('+speed+')'); var player = this.children.length > 0 ? this.children[0] : undefined; if (player) player.stop(); }).bind(oipfPluginObject);
                    oipfPluginObject.seek = (function(pos) { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) player.currentTime=pos/1000; }).bind(oipfPluginObject);
                    //oipfPluginObject.data = (function(src) { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) console.log(src); }).bind(oipfPluginObject);
                    oipfPluginObject.playState = (function() { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) console.timeStamp && console.timeStamp('bbVideo.state'); }).bind(oipfPluginObject);
                    oipfPluginObject.playPosition = (function() { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) console.timeStamp && console.timeStamp('bbVideo.pos='+(player.currentTime*1000)); }).bind(oipfPluginObject);
                    oipfPluginObject.speed = (function() { var player = this.children.length > 0 ? this.children[0] : undefined; if (player) console.timeStamp && console.timeStamp('bbVideo.speed='+player.playbackRate); }).bind(oipfPluginObject);
                    oipfPluginObject.onPlayStateChange = (function(s) { console.timeStamp && console.timeStamp('bbVideo.playStateChange='+s); this.playState = s; }).bind(oipfPluginObject);
                    oipfPluginObject.onPlayPositionChanged = (function(p) { console.timeStamp && console.timeStamp('bbVideo.positionChange='+s); this.playPosition = p; }).bind(oipfPluginObject);
                    oipfPluginObject.onPlaySpeedChanged = (function(s) { console.timeStamp && console.timeStamp('bbVideo.positionChange='+s); this.speed = s; }).bind(oipfPluginObject);
                }

                // if video is broadcast or broadband one ... do the in-common video player injection ...
                if (isBroadcastVideo(sType) || isBroadbandVideo(sType)) {
                    var isVideoPlayerAlreadyAdded = oipfPluginObject.children.length > 0;
                    if (!isVideoPlayerAlreadyAdded) {
                        var videoTag = document.createElement('video');
                        videoTag.setAttribute('id', 'video-player');
                        //videoTag.setAttribute('autoplay', ''); // note: call to bindToCurrentChannel() or play() is doing it
                        videoTag.setAttribute('loop', '');
                        videoTag.setAttribute('muted', 'true');
                        videoTag.setAttribute('style', 'top:inherit; left:inherit; width:inherit; height:inherit;');
                        videoTag.src = localStorage.getItem('tvViewer_broadcast_url') || 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4';
                        oipfPluginObject.appendChild(videoTag);
                        //console.info('BROADCAST OR BROADBAND VIDEO PLAYER ... ADDED');
                    }
                    // observe this tag for attribute data changes ...
                    // TODO: register this tag by doing a call to hbbobj.js

                }
            } else if (sType && isBroadbandVideo(sType) && sType.indexOf('application/dash+xml') == 0) {
                //console.info('DASH PLAYER ...');
                oipfPluginObject.style.webkitAnimationPlayState = 'running'; // force animation that will be catched in hbbobj.js
            }
        }
    })(window.document);

    //console.log('DOM HbbTV emulator added.');
}
