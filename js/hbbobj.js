/** Listen to external <OBJECT> dynamic changes ... */
(function(window) {
    var _DEBUG_ = true;

    function mixin(source, target) { // FIXME: use ES6 Object.assign() and arrow functions
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                target[prop] = source[prop];
            }
        }
    }

    function injectBroadcastVideoMethods(oipfPluginObject) {
        var isVideoPlayerAlreadyAdded = oipfPluginObject.children.length > 0;
        if (!isVideoPlayerAlreadyAdded) {
            var videoTag = document.createElement('video');
            videoTag.setAttribute('id', 'video-player');
            videoTag.setAttribute('autoplay', ''); // note: call to bindToCurrentChannel() or play() is doing it
            videoTag.setAttribute('loop', '');
            videoTag.setAttribute('style', 'top:inherit; left:inherit; width:inherit; height:inherit;');
            videoTag.src = localStorage.getItem('tvViewer_broadcast_url') || 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4';
            oipfPluginObject.appendChild(videoTag);
            console.info('BROADCAST VIDEO PLAYER ... ADDED');
        }

        // inject OIPF methods ...
        
        //import import { injectBroadcastVideoMethods } from 'videobc.jsm';
        //injectBroadcastVideoMethods(oipfPluginObject);

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
        oipfPluginObject.createChannelObject = function() {
            console.log('<BroadcastVideo> createChannelObject() ...');
        };
        oipfPluginObject.bindToCurrentChannel = function() {
            console.log('<BroadcastVideo> bindToCurrentChannel() ...');
            var player = document.getElementById('video-player');
            if (player) {
                player.play();
                // TODO: If there is no channel currently being presented, the OITF SHALL dispatch an event to the onPlayStateChange listener(s) whereby the state parameter is given value 0 (“ unrealized ")
            }
            return ; // TODO: must return a Channel object
        };
        oipfPluginObject.setChannel = function() {
            console.log('<BroadcastVideo> setChannel() ...');
        };
        oipfPluginObject.prevChannel = function() {
            console.log('<BroadcastVideo> prevChannel() ...');
            return currentChannel;
        };
        oipfPluginObject.nextChannel = function() {
            console.log('<BroadcastVideo> nextChannel() ...');
            return currentChannel;
        };
        oipfPluginObject.release = function() {
            console.log('<BroadcastVideo> release() ...');
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
        };
        class AVVideoComponent extends AVComponent {
            constructor() {
                super();
                this.type = this.COMPONENT_TYPE_VIDEO;
                this.aspectRatio = 1.78;
            }
        };
        class AVAudioComponent extends AVComponent {
            constructor() {
                super();
                this.type = this.COMPONENT_TYPE_AUDIO;
                this.language = 'eng';
                this.audioDescription = false;
                this.audioChannels = 2;
            }
        };
        class AVSubtitleComponent extends AVComponent {
            constructor() {
                super();
                this.type = this.COMPONENT_TYPE_SUBTITLE;
                this.language = 'deu';
                this.hearingImpaired = false;
            }
        };
        class AVComponentCollection extends Array {
            constructor(num) {
                super(num);
            }
            item(idx) {
                return idx < this.length ? this[idx] : [];
            }
        };
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
    }

    /**
     * Method adding missing video player events to the user defined object one.
     * @param {object} objectElement A reference on the object tag.
     * @param {object} videoPlayer A reference on the Dash.JS player instance.
     */
    function registerOipfEventsToVideoPlayer(objectElement, videoPlayer) {
        // objectElement.onPlayStateChange = objectElement.onPlayStateChange || function(s) {
        //     _DEBUG_ && console.log('>>>>>> onPlayStateChange state= ', s);
        //     objectElement.playState = s;
        // };
        // objectElement.onPlaySpeedChanged = objectElement.onPlaySpeedChanged || function(speed) {
        //     _DEBUG_ && console.log(">>>>>> onPlaySpeedChanged speed= ", speed);
        //     objectElement.playSpeed = speed;
        // };
        // objectElement.onPlayPositionChanged = objectElement.onPlayPositionChanged || function(p) {
        //     _DEBUG_ && console.log('>>>>>> onPlayPositionChanged speed= ', p);
        //     objectElement.playPosition = p;
        //
        // };
        objectElement.play = objectElement.play || function(speed) {
            speed = typeof speed == 'number' ? speed : 1;
            _DEBUG_ && console.log('>>>>>> play with speed= ', speed);

            var videoTag = document.getElementById('dash-player') || document.getElementById('video-player');
            var videoPlayer = videoTag && videoTag == document.getElementById('dash-player') ? videoTag._player : videoTag;

            if (speed == 0) {
                _DEBUG_ && console.log('>>>>>> pausing ...');
                videoPlayer && videoPlayer.pause();
            } else if (videoPlayer) {
                _DEBUG_ && console.log('>>>>>> playing ...');
                videoPlayer.setPlaybackRate && videoPlayer.setPlaybackRate(speed);
                videoPlayer.play();
            }
        };
        // objectElement.pause = objectElement.pause || function() {
        //     _DEBUG_ && console.log(">>>>>> pause (method doesn't exist)");
        // };
        objectElement.stop = objectElement.stop || function() {
            _DEBUG_ && console.log('>>>>>> stop');
            // if (typeof objectElement.data !== 'undefined') {
            //     objectElement.data = null;
            // } else if (typeof objectElement.src !== 'undefined') {
            //     objectElement.src = null;
            // }
            var videoTag = document.getElementById('dash-player') || document.getElementById('video-player');
            var videoPlayer = videoTag && videoTag == document.getElementById('dash-player') ? videoTag._player : videoTag;

            if (videoPlayer) {
                _DEBUG_ && console.log('>>>>>> stopping ...');
                if (typeof videoPlayer.stop !== 'undefined') {
                    _DEBUG_ && console.log('>>>>>> HTML5 video stop ...');
                    videoPlayer.stop();
                } else {
                    _DEBUG_ && console.log('>>>>>> PLAYER reset ...');
                    //videoPlayer.reset();
                    videoPlayer.seek(videoPlayer.duration());
                    //videoPlayer.notify(MediaPlayer.dependencies.StreamController.eventList.ENAME_TEARDOWN_COMPLETE):
                }
            }
            objectElement._queue = [];
            objectElement.onPlayStateChange && objectElement.onPlayStateChange(0); // stopped
        };
        objectElement.release = objectElement.release || function() {
            _DEBUG_ && console.log('>>>>>> release');

        };
        objectElement.queue = objectElement.queue || function(url) {
            _DEBUG_ && console.log('>>>>>> queue url= ', url);
            if (url) {
                objectElement._queue = objectElement._queue || [];
                objectElement._queue.push(url);
            } else if (url == null) {
                _DEBUG_ && console.log('>>>>>> reset queue');
                objectElement._queue = [];
            }
        };
        objectElement.seek = objectElement.seek || function(pos) { // pos in milliseconds
            var videoTag = document.getElementById('dash-player');
            if (videoTag) {
                var videoPlayer = videoTag._player;
                var videoDuration = videoPlayer.duration() * 1000;
                _DEBUG_ && console.log('>>>>>> seek pos= ', pos, '/', videoDuration);
                if (videoPlayer && pos < videoDuration) {
                    videoPlayer.seek(pos / 1000); // relative time in seconds
                }
            } else {
                videoTag = document.getElementById('video-player');
                var videoPlayer = videoTag;
                _DEBUG_ && console.log('>>>>>> HTML5 seek pos= ', pos, '/', videoPlayer.duration);
                if (videoPlayer && pos < videoPlayer.duration) {
                    videoPlayer.currentTime = pos; // relative time in seconds
                }
            }
        };
        //  OIPF PLAYER    <->    DASH PLAYER   http://cdn.dashjs.org/latest/jsdoc/module-MediaPlayer.html
        // setComponent()  <-> setCurrentTrack(track instanceof MediaInfo)
        // getComponents() <-> getTracksFor(type)
        // ?? <-> setTextDefaultLanguage(lang)
        // ?? <-> enableText(false) or setTextTrack(-1)
    }

    /**
     * Method mapping the dash player events to the defined object one.
     * @param {object} objectElement A reference on the object tag.
     * @param {object} videoTag A reference on the dash player video tag
     */
    function registerDashVideoPlayerEvents(objectElement, videoTag) {
        videoTag.onwaiting = function(evt) {
            _DEBUG_ && console.log('>>>>>> onwaiting ', evt.timeStamp);
            objectElement.playState = 4; // buffering
            if (objectElement.onPlayStateChange) {
                console.log('>>>>>> dispatchEvent onPlayStateChange', objectElement.playState);
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        };
        videoTag.onplaying = function(evt) {
            objectElement.playTime = Math.floor(videoTag._player.duration() * 1000);
            _DEBUG_ && console.log('>>>>>> onplaying duration=', objectElement.playTime);
            objectElement.playState = 1;
            if (objectElement.onPlayStateChange) {
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        };
        videoTag.onpause = function(evt) {
            _DEBUG_ && console.log('>>>>>> onpause ', evt.timeStamp);
            objectElement.playState = 2;
            if (objectElement.onPlayStateChange) {
                console.log('>>>>>> dispatchEvent onPlayStateChange', objectElement.playState);
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        };
        videoTag.onloadstart = function(evt) {
            _DEBUG_ && console.log('>>>>>> onloadstart');
            objectElement.playState = 3; // connecting
            if (objectElement.onPlayStateChange) {
                console.log('>>>>>> dispatchEvent onPlayStateChange', objectElement.playState);
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        };
        // videoTag.onprogress = function(evt) {
        //     _DEBUG_ && console.log('>>>>>> onprogress ', evt);
        //     var pos = videoTag._player.time();
        //     objectElement.playState = 4; // buffering
        //     if (objectElement.onPlayPositionChanged) {
        //         objectElement.onPlayPositionChanged(pos);
        //     } else {
        //         console.log('>>>>>> dispatchEvent PlayPositionChanged', pos);
        //         var playerEvent = new Event('PlayPositionChanged');
        //         playerEvent.position = pos;
        //         objectElement.dispatchEvent(playerEvent);
        //     }
        // };
        videoTag.onended = function(evt) {
            _DEBUG_ && console.log('>>>>>> onended ', evt.timeStamp);
            objectElement.playState = 5;
            if (objectElement.onPlayStateChange) {
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        };
        videoTag.onerror = function(evt) {
            _DEBUG_ && console.log('>>>>>> onerror ', evt.timeStamp);
            objectElement.playState = 6;
            if (objectElement.onPlayStateChange) {
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        };
        videoTag.onratechange = function() {
            var playRate = videoTag._player.getPlaybackRate();
            _DEBUG_ && console.log('>>>>>> onratechange ', playRate);
            objectElement.playSpeed = playRate;
            if (objectElement.onPlaySpeedChanged) {
                objectElement.onPlaySpeedChanged(playRate);
            } else {
                console.log('>>>>>> dispatchEvent PlaySpeedChanged', objectElement.playSpeed);
                var playerEvent = new Event('PlaySpeedChanged');
                playerEvent.speed = objectElement.playSpeed;
                objectElement.dispatchEvent(playerEvent);
            }
        };
        videoTag.ontimeupdate = function(evt) {
            //_DEBUG_ && console.log(">>>>>> ontimeupdate ");
            var pos = Math.floor(videoTag._player.time() * 1000);
            objectElement.playPosition = pos;
            if (objectElement.onPlayPositionChanged) {
                objectElement.onPlayPositionChanged(pos);
            } else {
                console.log('>>>>>> dispatchEvent PlayPositionChanged', pos);
                var playerEvent = new Event('PlayPositionChanged');
                playerEvent.position = pos;
                objectElement.dispatchEvent(playerEvent);
            }
        };
        videoTag.onseeked = function(evt) {
            _DEBUG_ && console.log('>>>>>> onseeked ', evt);
            // var pos = videoTag._player.time();
            // if (objectElement.onPlayPositionChanged) {
            //     objectElement.onPlayPositionChanged(pos);
            // } else {
            //     console.log('>>>>>> dispatchEvent PlayPositionChanged', pos);
            //     var playerEvent = new Event('PlayPositionChanged');
            //     playerEvent.position = pos;
            //     objectElement.dispatchEvent(playerEvent);
            // }
        };
        videoTag.onseeking = function(evt) {
            _DEBUG_ && console.log('>>>>>> onseeking ', evt);
            // var pos = videoTag._player.time();
            // if (objectElement.onPlayPositionChanged) {
            //     objectElement.onPlayPositionChanged(pos);
            // } else {
            //     console.log('>>>>>> dispatchEvent PlayPositionChanged', pos);
            //     var playerEvent = new Event('PlayPositionChanged');
            //     playerEvent.position = pos;
            //     objectElement.dispatchEvent(playerEvent);
            // }
        };
        videoTag.onteardown = function(evt) {
            _DEBUG_ && console.log('>>>>>> onteardown ', evt);
            objectElement.playState = 0;
            if (objectElement.onPlayStateChange) {
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        };
    }

    /**
     * Method mapping the HTML5 player events to the defined object one.
     * @param {object} objectElement A reference on the object tag.
     * @param {object} videoTag A reference on the HTML5 player video tag
     */
    function registerVideoPlayerEvents(objectElement, videoTag) {
        videoTag && videoTag.addEventListener && videoTag.addEventListener('play', function() {
            _DEBUG_ && console.log(')))))) play');
            objectElement.playState = 1;
            if (objectElement.onPlayStateChange) {
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        }, false);

        videoTag && videoTag.addEventListener && videoTag.addEventListener('pause', function() {
            _DEBUG_ && console.log(')))))) pause');
            objectElement.playState = 2;
            if (objectElement.onPlayStateChange) {
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        }, false);

        videoTag && videoTag.addEventListener && videoTag.addEventListener('loadstart', function() {
            _DEBUG_ && console.log(')))))) loadstart');
            objectElement.playState = 3;
            if (objectElement.onPlayStateChange) {
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        }, false);

        // videoTag && videoTag.addEventListener && videoTag.addEventListener('progress', function() {
        //     _DEBUG_ && console.log(')))))) progress');
        //     objectElement.playState = 4;
        //     console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
        //     var playerEvent = new Event('PlayStateChange');
        //     playerEvent.state = objectElement.playState;
        //     objectElement.dispatchEvent(playerEvent);
        // }, false);

        videoTag && videoTag.addEventListener && videoTag.addEventListener('ended', function() {
            _DEBUG_ && console.log(')))))) ended');
            objectElement.playState = 5;
            if (objectElement.onPlayStateChange) {
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        }, false);

        videoTag && videoTag.addEventListener && videoTag.addEventListener('error', function() {
            _DEBUG_ && console.log(')))))) error');
            objectElement.playState = 6;
            if (objectElement.onPlayStateChange) {
                objectElement.onPlayStateChange(objectElement.playState);
            } else {
                console.log('>>>>>> dispatchEvent PlayStateChange', objectElement.playState);
                var playerEvent = new Event('PlayStateChange');
                playerEvent.state = objectElement.playState;
                objectElement.dispatchEvent(playerEvent);
            }
        }, false);

        videoTag && videoTag.addEventListener && videoTag.addEventListener('timeupdate', function() {
            //_DEBUG_ && console.log(')))))) timeupdate');
            var pos = Math.floor(videoTag.currentTime * 1000);
            if (objectElement.onPlayPositionChanged) {
                objectElement.playPosition = pos;
                objectElement.PlayPositionChanged(pos);
            } else {
                console.log('>>>>>> dispatchEvent PlayPositionChanged', pos);
                var playerEvent = new Event('PlayPositionChanged');
                playerEvent.position = pos;
                objectElement.dispatchEvent(playerEvent);
            }
        }, false);

        videoTag && videoTag.addEventListener && videoTag.addEventListener('ratechange', function() {
            _DEBUG_ && console.log(')))))) ratechange');
            var playSpeed = videoTag.playbackRate;

            console.log('>>>>>> dispatchEvent PlaySpeedChanged', playSpeed);
            var playerEvent = new Event('PlaySpeedChanged');
            playerEvent.speed = playSpeed;
            objectElement.dispatchEvent(playerEvent);

        }, false);

        videoTag && videoTag.addEventListener && videoTag.addEventListener('seeked', function() {
            _DEBUG_ && console.log(')))))) seeked');
            var pos = Math.floor(videoTag.currentTime * 1000);
            if (objectElement.onPlayPositionChanged) {
                objectElement.playPosition = pos;
                objectElement.PlayPositionChanged(pos);
            } else {
                console.log('>>>>>> dispatchEvent PlayPositionChanged', pos);
                var playerEvent = new Event('PlayPositionChanged');
                playerEvent.position = pos;
                objectElement.dispatchEvent(playerEvent);
            }
        }, false);
    }

    /**
     * Method mapping the internal embbeded player events to the defined object one.
     * @param {object} objectElement A reference on the object tag.
     * @param {=object} optionHtmlPlayer A reference on the embedded html player video tag.
     */
    function registerEmbeddedVideoPlayerEvents(objectElement, optionHtmlPlayer) {
        //console.log('>> registerEmbeddedVideoPlayerEvents', objectElement);
        var embbededDocument = objectElement.contentDocument;
        console.log('>> registerEmbeddedVideoPlayerEvents doc=', embbededDocument);
        // objectElement.onreadystatechange = function() {
        //   console.log("onreadystatechange state=", objectElement.readyState)
        // };

        if (optionHtmlPlayer) {
            registerVideoPlayerEvents(objectElement, optionHtmlPlayer); // same events for HTML5 video tag
            return;
        }

        // objectElement.onload/*objectElement.onDOMContentLoaded*/ = function(evt) {
        //     _DEBUG_ && console.log('>> HTML5 LOADED: ', evt);
        //     var player = evt.target.contentDocument && evt.target.contentDocument.document ? evt.target.contentDocument.document.getElementsByTagName('video') : null;
        //     player = evt.target.contentDocument && evt.target.contentDocument.body ? evt.target.contentDocument.body.getElementsByTagName('video') : null;
        //     _DEBUG_ && console.log('>> HTML5 PLAYER: ', player);
        //     if (player) {
        //         registerVideoPlayerEvents(objectElement, player);
        //         if (player.currentTime) {
        //             _DEBUG_ && console.log('>> HTML5 playing ...');
        //             objectElement.playState = 1;
        //             if (objectElement.onPlayStateChange) {
        //                 objectElement.onPlayStateChange(objectElement.playState);
        //             } else {
        //                 console.log('>> dispatchEvent PlayStateChange', objectElement.playState);
        //                 var playerEvent = new Event('PlayStateChange');
        //                 playerEvent.state = objectElement.playState;
        //                 objectElement.dispatchEvent(playerEvent);
        //             }
        //         }
        //     }
        // };

        /*var watchDogVideoTag = setInterval*/setTimeout(function () {
            var embbededDocument = document.getElementById(objectElement.id);
            embbededDocument = embbededDocument && embbededDocument.contentDocument ? embbededDocument.contentDocument : null;
            console.log('>> doc=', embbededDocument);
            if (embbededDocument) {
                var items = embbededDocument.body.children, player;
                function scanChildrenForPlayer(items) {
                    Array.from(items).forEach(function(item) {
                        if ('VIDEO' === item.tagName) {
                            player = item;
                        } else if (item.children) {
                            scanChildrenForPlayer(item.children);
                        }
                    });
                }
                scanChildrenForPlayer(items);
                console.log('>> PLAYER:', player);
                if (player) {
                    //clearInterval(watchDogVideoTag);
                    registerVideoPlayerEvents(objectElement, player); // same events for HTML5 video tag
                    if (typeof player.getAttribute('autoplay') !== 'undefined') {
                        objectElement.playState = 1;
                        if (objectElement.onPlayStateChange) {
                            objectElement.onPlayStateChange(objectElement.playState);
                        } else {
                            console.log('>> dispatchEvent PlayStateChange', objectElement.playState);
                            var playerEvent = new Event('PlayStateChange');
                            playerEvent.state = objectElement.playState;
                            objectElement.dispatchEvent(playerEvent);
                        }
                    }
                }
            }
        }, 200); // fixme: delay as inner document is not created so quickly by the browser or can take time to start ...
    }

    /**
     * Called for every <object> element in the page.
     * @param {object} elem An object element to analyse.
     */
    function watchObject(elem) {
        var mimeType = elem.type;
        _DEBUG_ && console.log('object mimetype=' + mimeType);

        mimeType = mimeType.toLowerCase(); // ensure lower case string comparison
        var srcAttribute = 'src' in elem ? 'src' : 'data'; // data attribute is most of time used
        var videoPath = elem[srcAttribute];
        _DEBUG_ && console.log('object url=' + videoPath);

        if (elem.__already_seen__) {
            console.log('object __already_seen__');
            return;
        }
        elem.__already_seen__ = true;

        if (mimeType.lastIndexOf('application/dash+xml', 0) == 0) {
            _DEBUG_ && console.warn('DASH VIDEO PLAYER ... ADDED');
            var videoTag = document.createElement('video');
            videoTag.setAttribute('id', 'dash-player');
            videoTag.setAttribute('style', 'top:inherit; left:inherit; width:inherit; height:inherit;');
            elem.appendChild(videoTag);
            if (dashjs) {
                _DEBUG_ && console.warn('starting DASH.JS video at url=' + videoPath + ' ...');
                videoTag._player = dashjs.MediaPlayer().create();
                videoTag._player.getDebug().setLogToBrowserConsole(false);
                videoTag._player.initialize(videoTag, videoPath, /*false*/true); // autostart as we can't grab the play() method call
                registerOipfEventsToVideoPlayer(elem, videoTag._player);
                registerDashVideoPlayerEvents(elem, videoTag);
            }

        } else if (mimeType.lastIndexOf('video/mpeg4', 0) == 0 ||
                   mimeType.lastIndexOf('video/mp4', 0) == 0 ||  // h.264 video
                   mimeType.lastIndexOf('audio/mp4', 0) == 0 ||  // aac audio
                   mimeType.lastIndexOf('audio/mpeg', 0) == 0) { // mp3 audio
            _DEBUG_ && console.warn('started ' + (mimeType.lastIndexOf('audio/') !== -1 ? 'audio' : 'video') + ' player ...');
            registerOipfEventsToVideoPlayer(elem);

            // checking if a VIDEO tag is not already present inside the object ... (issue under FIREFOX)
            var videoTag;
            // if (videoPath.indexOf('.php') == -1) { // a true file and not a PHP file returning an HTML page embedding a video tag
            //     videoTag = document.createElement('video');
            //     videoTag.setAttribute('id', 'video-player');
            //     videoTag.setAttribute('autoplay', ''); // setting src will start the video and send an event
            //     videoTag.setAttribute('style', 'top:inherit; left:inherit; width:inherit; height:inherit;');
            //     videoTag.src = videoPath; // copy object data url to html5 video tag src attribute ...
            //     elem.appendChild(videoTag);
            //     _DEBUG_ && console.warn('BROADBAND VIDEO PLAYER ... ADDED');
            // }

            registerEmbeddedVideoPlayerEvents(elem, videoTag); // videoTag = undefined when using a PHP link (i.e. scanning for inner video tag)

        } else if (mimeType.lastIndexOf('video/mpeg', 0) == 0) {
            _DEBUG_ && console.warn('TS VIDEO PLAYER ... (under construction)');

        } else if (mimeType.lastIndexOf('video/broadcast', 0) == 0) {
            _DEBUG_ && console.warn('LIVE BROADCAST VIDEO PLAYER ...');
            injectBroadcastVideoMethods(elem);

        } else if (mimeType.lastIndexOf('application/oipfConfiguration', 0) == 0) {
            _DEBUG_ && console.log('new application/oipfConfiguration object ...');
            if (window.oipfApplicationManager) {
                _DEBUG_ && console.log('adding methods to application/oipfConfiguration object ...');
                mixin(window.oipfApplicationManager, elem);
            }
        } else if (mimeType.lastIndexOf('application/oipfApplicationManager', 0) == 0) {
            _DEBUG_ && console.log('new application/oipfApplicationManager object ...');
            if (window.oipfConfiguration) {
                _DEBUG_ && console.log('adding methods to application/oipfConfiguration object ...');
                mixin(window.oipfConfiguration, elem);
            }
        } else if (mimeType.lastIndexOf('application/oipfCapabilities', 0) == 0) {
            _DEBUG_ && console.log('new application/oipfCapabilities object ...');
            if (window.oipfCapabilities) {
                _DEBUG_ && console.log('adding methods to application/oipfCapabilities object ...');
                mixin(window.oipfCapabilities, elem);
            }
        }

        function updateViewerFrame(mutationsList) {
            for (var mutation of mutationsList) {
                //console.log(mutation);
                if (mutation.attributeName === 'type') {
                    var videoType = mutation.target.type;
                    if (videoType.lastIndexOf('application/dash+xml', 0) == 0) {
                        _DEBUG_ && console.warn('DASH VIDEO PLAYER ... added');
                        var videoTag = document.createElement('video');
                        videoTag.setAttribute('id', 'dash-player');
                        videoTag.setAttribute('style', 'top:inherit; left:inherit; width:inherit; height:inherit;');
                        mutation.target.appendChild(videoTag);
                    }
                } else if (mutation.attributeName === 'data' && mutation.target.type.lastIndexOf('application/dash+xml', 0) == 0) {
                    var videoPath = mutation.target.data;
                    _DEBUG_ && console.warn('DASH VIDEO PLAYER source: ', videoPath);
                    var videoTag = document.getElementById('dash-player');
                    if (dashjs) {
                        _DEBUG_ && console.warn('DASH VIDEO PLAYER start ...');
                        videoTag._player = dashjs.MediaPlayer().create();
                        videoTag._player.getDebug().setLogToBrowserConsole(false);
                        videoTag._player.initialize(videoTag, videoPath, false); // don't autostart as play() will be called
                        videoTag._player.attachSource(videoPath);
                        //registerOipfEventsToVideoPlayer(mutation.target);
                        registerDashVideoPlayerEvents(mutation.target, videoTag);
                    }
                } else if (mutation.attributeName === 'data' && mutation.target.type.lastIndexOf('video/mpeg', 0) == 0) {
                    console.log('TAG:', mutation, ' has changed its data attribute ...');

                }
            }

            // TODO: notify extension to update url for such dynamic video allocation + notify web worker to handle TS analysis ...
            // chrome.runtime.sendMessage('hybridtvviewer@github.com', { videoUrl : videoPath }, function(response) {
            //     console.log(response);
            //     //if (!response.success) {}
            // });
        }

        // Watch for changes of the src/data/type attributes ...
        var srcObserver = new MutationObserver(updateViewerFrame);
        srcObserver.observe(elem, {
            'childList': false,
            'characterData': false,
            'attributes': true,
            'attributeFilter': [ srcAttribute, 'type' ]
        });
    }

    function onAnimationStart(event) {
        _DEBUG_ && console.info('object: ', event);
        if ('detected-object' === event.animationName) {
            watchObject(event.target);
        }
    }

    // just add a listener on new <OBJECT> tags that will be animated when newly created ...
    window.document.addEventListener(window.CSS.supports('animation', '0s') ? 'animationstart' : 'webkitAnimationStart', onAnimationStart, true);

})(
    typeof self !== 'undefined' && self ||
    typeof window !== 'undefined' && window ||
    typeof global !== 'undefined' && global || {}
);
