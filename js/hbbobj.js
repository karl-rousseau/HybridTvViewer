/** Listen to external <OBJECT> dynamic changes ... */
(function(window) {
    var _DEBUG_ = true;

    /**
     * Method adding missing video player events to the user defined object one.
     * @param {object} objectElement A reference on the object tag.
     * @param {object} videoPlayer A reference on the Dash.JS player instance.
     */
    function registerOipfEventsToVideoPlayer(objectElement, videoPlayer) {
        objectElement.onPlayStateChange = objectElement.onPlayStateChange || function(s) {
            _DEBUG_ && console.log('>>>>>> onPlayStateChange state==', s);
            objectElement.playState = s;
        };
        objectElement.onPlaySpeedChanged = objectElement.onPlaySpeedChanged || function(speed) {
            _DEBUG_ && console.log(">>>>>> onPlaySpeedChanged speed= ", speed);
            objectElement.playSpeed = speed;
        };
        objectElement.onPlayPositionChanged = objectElement.onPlayPositionChanged || function(p) {
            _DEBUG_ && console.log('>>>>>> onPlayPositionChanged speed= ', p);
            objectElement.playPosition = p;

        };
        objectElement.play = objectElement.play || function(speed) {
            speed = speed || 1;
            _DEBUG_ && console.log(">>>>>> play with speed= ", speed);
            if (speed == 0) {
                videoPlayer.pause();
            } else if (videoPlayer) {
                _DEBUG_ && console.log(">>>>>> playing ...")
                videoPlayer.setPlaybackRate(speed);
                videoPlayer.play();
            }
        };
        // objectElement.pause = objectElement.pause || function() {
        //     _DEBUG_ && console.log(">>>>>> pause");
        //     if (speed) {
        //         objectElement.playSpeed = speed;
        //         objectElement.onPlaySpeedChanged(0);
        //         return false; // returns false if no trick play or timeshift
        //     }
        // };
        objectElement.stop = objectElement.stop || function() {
            _DEBUG_ && console.log(">>>>>> stop");
            objectElement._queue = [];
            //objectElement.onPlaySpeedChanged && objectElement.onPlaySpeedChanged(0);
        };
        objectElement.queue = objectElement.queue || function(url) {
            _DEBUG_ && console.log(">>>>>> queue url= ", url);
            if (url) {
                objectElement._queue = objectElement._queue || [];
                objectElement._queue.push(url);
            } else if (url == null) {
                _DEBUG_ && console.log(">>>>>> reset queue");
                objectElement._queue = [];
            }
        };
        objectElement.seek = objectElement.seek || function(pos) {
            _DEBUG_ && console.log(">>>>>> seek pos= ", url, "/", videoPlayer ? videoPlayer.duration() : null);
            if (videoPlayer && pos < videoPlayer.duration()) {
                videoPlayer.seek(pos); // relative time in seconds
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
            _DEBUG_ && console.log(">>>>>> onwaiting ", evt.timeStamp);
            objectElement.playState = 0; // stopped
            objectElement.onPlayStateChange && objectElement.onPlayStateChange();
        };
        videoTag.onplaying = function(evt) {
            _DEBUG_ && console.log(">>>>>> onplaying ", evt.timeStamp);
            objectElement.playState = 1;
            objectElement.onPlayStateChange && objectElement.onPlayStateChange();
        };
        videoTag.onpause = function(evt) {
            _DEBUG_ && console.log(">>>>>> onpause ", evt.timeStamp);
            objectElement.playState = 2;
            objectElement.onPlayStateChange && objectElement.onPlayStateChange();
        };
        videoTag.onloadstart = function(evt) {
            _DEBUG_ && console.log(">>>>>> onloadstart ", evt.timeStamp);
            objectElement.playState = 3; // connecting
            objectElement.onPlayStateChange && objectElement.onPlayStateChange();
        };
        // videoTag.onprogress = function(evt) {
        //     _DEBUG_ && console.log(">>>>>> onprogress ", evt);
        //     objectElement.playState = 4; // buffering
        //     objectElement.onPlayStateChange && objectElement.onPlayStateChange();
        // };
        videoTag.onended = function(evt) {
            _DEBUG_ && console.log(">>>>>> onended ", evt.timeStamp);
            objectElement.playState = 5;
            objectElement.onPlayStateChange && objectElement.onPlayStateChange();
        };
        videoTag.onerror = function(evt) {
            _DEBUG_ && console.log(">>>>>> onerror ", evt.timeStamp);
            objectElement.playState = 6;
            objectElement.onPlayStateChange && objectElement.onPlayStateChange(); // FIXME: add error message
        };
        videoTag.onratechange = function() {
            var playRate = videoTag._player.getPlaybackRate();
            _DEBUG_ && console.log(">>>>>> onratechange ", playRate);
            objectElement.playSpeed = playRate;
            objectElement.onPlaySpeedChanged && objectElement.onPlaySpeedChanged(playRate);
        };
    }

    /**
     * Method mapping the internal embbeded player events to the defined object one.
     * @param {object} objectElement A reference on the object tag.
     */
    function registerEmbeddedVideoPlayerEvents(objectElement) {
        var embbededDocument = objectElement.contentDocument;

        // objectElement.onload = function(evt) {
        //     _DEBUG_ && console.log(">>>>>>>>>>>>>>>>> HTML5 LOADED: ", evt);
        //     var player = evt.target.contentDocument && evt.target.contentDocument.document ? evt.target.contentDocument.document.getElementsByTagName('video') : null;
        //     if (player) {
        //         registerDashVideoPlayerEvents(objectElement, player);
        //         if (player.currentTime) {
        //             _DEBUG_ && console.log(">>>>>>>>>>>>>>>>> HTML5 playing ...");
        //             objectElement.playState = 1;
        //             objectElement.onPlayStateChange();
        //         }
        //     }
        // };

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
            //console.log("PLAYER:", player)
            if (player) {
                registerDashVideoPlayerEvents(objectElement, player); // same events for HTML5 video tag
            }
        }
    }

    /**
     * Called for every <object> element in the page.
     * @param {object} elem An object element to analyse.
     */
    function watchObject(elem) {
        var mimeType = elem.type;
        _DEBUG_ && console.log("object mimetype=" + mimeType);
        /*if (mimeType &&
            (mimeType.toLowerCase().lastIndexOf('video/', 0) !== 0 ||
             mimeType.toLowerCase().lastIndexOf('application/dash+xml', 0) !== 0)) {
            return;
        }*/
        mimeType = mimeType.toLowerCase(); // ensure lower case string comparison
        var srcAttribute = 'src' in elem ? 'src' : 'data'; // data attribute is most of time used
        var videoPath = elem[srcAttribute];
        _DEBUG_ && console.log("object url=" + videoPath);

        if (elem.__already_seen__) {
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
                _DEBUG_ && console.warn('starting DASH.JS for video type ' + mimeType + ' at url=' + videoPath + ' ...');
                videoTag._player = dashjs.MediaPlayer().create();
                videoTag._player.getDebug().setLogToBrowserConsole(false);
                videoTag._player.initialize(videoTag, videoPath, /*false*/true); // autostart as we can't grab the play() method call
                registerOipfEventsToVideoPlayer(elem, videoTag._player);
                registerDashVideoPlayerEvents(elem, videoTag);
            }
        } else if (mimeType.lastIndexOf('video/mp4', 0) == 0 ||
                   mimeType.lastIndexOf('audio/mp4', 0) == 0 ||
                   mimeType.lastIndexOf('audio/mpeg', 0) == 0) {
            _DEBUG_ && console.warn('MP3 or MP4 VIDEO PLAYER ...');
            registerOipfEventsToVideoPlayer(elem);
            registerEmbeddedVideoPlayerEvents(elem);
            // elem && elem.playState && elem.playState = 1;
            // elem && elem.onPlayStateChange && elem.onPlayStateChange();

        } else if (mimeType.lastIndexOf('video/mpeg', 0) == 0) {
            _DEBUG_ && console.warn('TS VIDEO PLAYER ... (under construction)');

        } else if (mimeType.lastIndexOf('application/oipfConfiguration', 0) == 0) {

        } else if (mimeType.lastIndexOf('application/oipfApplicationManager', 0) == 0) {

        } else if (mimeType.lastIndexOf('application/oipfCapabilities', 0) == 0) {

        }

        // var lastSrc;
        // var isUpdating = false;

        // function updateViewerFrame() {
        //     if (!isUpdating) {
        //         isUpdating = true;
        //         try {
        //             if (lastSrc !== elem[srcAttribute]) {
        //                 updateObject(elem);
        //                 lastSrc = elem[srcAttribute];
        //             }
        //         } finally {
        //             isUpdating = false;
        //         }
        //     }
        //
        //     // TODO: notify extension to update url for such dynamic video allocation + notify web worker to handle TS analysis ...
        //     /*chrome.runtime.sendMessage("hybridtvviewer@github.com", { videoUrl : videoPath },
        //     function(response) {
        //         console.log(response)
        //         //if (!response.success)
        //     });*/
        // }

        //updateViewerFrame();

        // Watch for changes of the src/data attribute.
        // var srcObserver = new MutationObserver(updateViewerFrame);
        // srcObserver.observe(elem, {
        //     'childList': false,
        //     'characterData': false,
        //     'attributes': true,
        //     'attributeFilter': [ srcAttribute ]
        // });
    }

    function onAnimationStart(event) {
        _DEBUG_ && console.info("object: ", event);
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
