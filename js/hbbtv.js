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
/* global Application, oipfObjectFactory, oipfApplicationManager, oipfConfiguration, oipfCapabilities */

(function(window) {
    // If the extension is not activated for this web page then we do nothing and wait for the user to click on the extension icon ...
    var pageActivated = window.localStorage.getItem('tvViewer_active') == 'true';
    if (pageActivated) {
        console.log('injecting %c HbbTV %c %s ','color:#fff;background-color:#555555;border-radius:3px 0 0 3px;','color:#000;background-color:#ffc107;border-radius:0 3px 3px 0;',window.localStorage.getItem('tvViewer_hbbtv'));
        window.oipf = window.oipf || {};

        // 7.1 Object factory API ------------------------------------------------------

        (function(oipfObjectFactory) {

            oipfObjectFactory.isObjectSupported = function(mimeType) {
                console.timeStamp && console.timeStamp('isObjectSupported(' + mimeType + ')');
                return mimeType === 'video/broadcast' ||
                mimeType === 'video/mpeg' ||
                mimeType === 'application/oipfApplicationManager' ||
                mimeType === 'application/oipfCapabilities' ||
                mimeType === 'application/oipfConfiguration' ||
                mimeType === 'application/oipfDrmAgent' ||
                mimeType === 'application/oipfParentalControlManager' ||
                mimeType === 'application/oipfSearchManager';
            };
            oipfObjectFactory.createVideoBroadcastObject = function() {
                console.timeStamp && console.timeStamp('createVideoBroadcastObject'); //console.log('createVideoBroadcastObject() ...');
                var videoObj = window.document.createElement('video');
                videoObj.type = 'video/broadcast';
                videoObj.bindToCurrentChannel = function() { console.timeStamp && console.timeStamp('createVideoBroadcastObject.bindToCurrentChannel'); };
                videoObj.setChannel = function() { console.timeStamp && console.timeStamp('createVideoBroadcastObject.setChannel'); };
                videoObj.onBlur = videoObj.onblur = function(evt) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onBlur'); };
                videoObj.onFocus = videoObj.onfocus = function(evt) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onFocus'); };
                //videoObj.addEventListener(eventName, callback, useCapture) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.addEventListener'); }
                //videoObj.removeEventListener(eventName, callback, useCapture) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.removeEventListener'); }
                videoObj.onPlayStateChange = function(evt) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onPlayStateChange'); };
                videoObj.onPlaySpeedChanged = function(evt) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onPlaySpeedChanged'); };
                videoObj.onPlaySpeedsArrayChanged = videoObj.onplaySpeedsArrayChanged = function(evt) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onPlaySpeedsArrayChanged'); };
                videoObj.onPlayPositionChanged = function(evt) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onPlayPositionChanged'); };
                videoObj.onFullScreenChange = videoObj.onfullscreenChange = function(evt) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onFullScreenChange'); };
                videoObj.onParentalRatingChange = function(evt) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onParentalRatingChange'); };
                videoObj.onParentalRatingError = function(evt) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onParentalRatingError'); };
                videoObj.onDRMRightsError = function(evt) { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onDRMRightsError'); };
                videoObj.onChannelChangeSucceeded = function() { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onChannelChangeSucceeded'); };
                videoObj.onChannelChangeError = function() { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onChannelChangeError'); };
                videoObj.onSelectedComponentChanged = function() { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onSelectedComponentChanged'); };
                videoObj.onProgrammesChanged = function() { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onProgrammesChanged'); };
                videoObj.onRecordingEvent = function() { console.timeStamp && console.timeStamp('createVideoBroadcastObject.onRecordingEvent'); };
                return videoObj;
            };
            oipfObjectFactory.createVideoMpegObject = function() {
                console.timeStamp && console.timeStamp('createVideoMpegObject'); //console.log('createVideoMpegObject() ...');
                return class VideoMpegObject {
                    onblur(evt) { console.timeStamp && console.timeStamp('createVideoMpegObject.onblur'); }
                    onfocus(evt) { console.timeStamp && console.timeStamp('createVideoMpegObject.onfocus'); }
                    addEventListener(eventName, callback, useCapture) { console.timeStamp && console.timeStamp('createVideoMpegObject.addEventListener'); }
                    removeEventListener(eventName, callback, useCapture) { console.timeStamp && console.timeStamp('createVideoMpegObject.removeEventListener'); }
                    onPlayStateChange(evt) { console.timeStamp && console.timeStamp('createVideoMpegObject.onPlayStateChange'); }
                    onPlaySpeedChanged(evt) { console.timeStamp && console.timeStamp('createVideoMpegObject.onPlaySpeedChanged'); }
                    onPlaySpeedsArrayChanged(evt) { console.timeStamp && console.timeStamp('createVideoMpegObject.onPlaySpeedsArrayChanged'); }
                    onPlayPositionChanged(evt) { console.timeStamp && console.timeStamp('createVideoMpegObject.onPlayPositionChanged'); }
                    onFullScreenChange(evt) { console.timeStamp && console.timeStamp('createVideoMpegObject.onFullScreenChange'); }
                    onParentalRatingChange(evt) { console.timeStamp && console.timeStamp('createVideoMpegObject.onParentalRatingChange'); }
                    onParentalRatingError(evt) { console.timeStamp && console.timeStamp('createVideoMpegObject.onParentalRatingError'); }
                    onDRMRightsError(evt) { console.timeStamp && console.timeStamp('createVideoMpegObject.onDRMRightsError'); }
                };
                //return new VideoMpegObject();
            };
            oipfObjectFactory.onLowMemory = function() {
                console.timeStamp && console.timeStamp('onLowMemory');
                // FIXME: see when we can generate this event (maybe inside the Web Inspector panel)
            };

        })(window.oipfObjectFactory || (window.oipfObjectFactory = {}));

        // 7.2.1  The application/oipfApplicationManager embedded object ---------------

        (function(oipfApplicationManager) {
            Object.defineProperties(window.Document.prototype, {
                '_application': {
                    value: undefined,
                    writable: true,
                    enumerable: false
                }
            });

            oipfApplicationManager.onLowMemory = function() {
                console.timeStamp && console.timeStamp('oipfApplicationManager.onLowMemory');
                // FIXME: see when we can generate this event
            };

            oipfApplicationManager.getOwnerApplication = function(document) {
                console.timeStamp && console.timeStamp('oipfApplicationManager.getOwnerApplication');
                return window.Document._application || (window.Document._application = new window.Application(document));
            };

        })(window.oipfApplicationManager || (window.oipfApplicationManager = {}));

        // 7.2.2  The Application class ------------------------------------------------

        window.Application = {};
        (function(window) {
            function Application(doc) {
                this._document = doc;
            }
            Application.prototype.visible = undefined;
            Application.prototype.privateData = {};
            Application.prototype.privateData.keyset = {};
            var keyset = Application.prototype.privateData.keyset;
            keyset.RED = 0x1;
            keyset.GREEN = 0x2;
            keyset.YELLOW = 0x4;
            keyset.BLUE = 0x8;
            keyset.NAVIGATION = 0x10;
            keyset.VCR = 0x20;
            keyset.SCROLL = 0x40;
            keyset.INFO = 0x80;
            keyset.NUMERIC = 0x100;
            keyset.ALPHA = 0x200;
            keyset.OTHER = 0x400;
            keyset.value = null;
            keyset.setValue = function(value) {
                keyset.value = value;
            };
            Object.defineProperties(Application.prototype.privateData, {
                '_document': {
                    value: null,
                    writable: true,
                    enumerable: false
                }
            });
            Object.defineProperties(Application.prototype.privateData, {
                'currentChannel': {
                    enumerable: true,
                    get: function currentChannel() {
                        console.timeStamp && console.timeStamp('Application.currentChannel');
                        var currentCcid = window.oipf.getCurrentTVChannel().ccid; // FIXME: ccid is platform-dependent
                        return window.oipf.channelList.getChannel(currentCcid) || {};
                    }
                }
            });
            Application.prototype.privateData.getFreeMem = function() {
                console.timeStamp && console.timeStamp('Application.getFreeMem');
                return ((window.performance && window.performance.memory.usedJSHeapSize) || 0);
            };

            Application.prototype.show = function() {
                console.timeStamp && console.timeStamp('Application.show');
                if (this._document) {
                    this._document.body.style.visibility = 'visible';
                    return (this._visible = true);
                }
                return false;
            };

            Application.prototype.hide = function() {
                console.timeStamp && console.timeStamp('Application.hide');
                if (this._document) {
                    this._document.body.style.visibility = 'hidden';
                    this._visible = false;
                    return true;
                }
                return false;
            };

            Application.prototype.createApplication = function(uri, createChild) {
                console.timeStamp && console.timeStamp('Application.createApplication');
                this._applicationUrl = uri;
            };

            Application.prototype.destroyApplication = function() {
                console.timeStamp && console.timeStamp('Application.destroyApplication');
                delete this._applicationUrl;
            };

            window.Application = Application;
        })(window /*.Application || (window.Application = {})*/ );

        // 7.3.1  The application/oipfConfiguration embedded object --------------------

        (function(oipfConfiguration) {
            oipfConfiguration.configuration = {};
            oipfConfiguration.configuration.preferredAudioLanguage = window.localStorage.getItem('tvViewer_country') || 'ENG';
            oipfConfiguration.configuration.preferredSubtitleLanguage = window.localStorage.getItem('tvViewer_country') || 'ENG,FRA';
            oipfConfiguration.configuration.preferredUILanguage = window.localStorage.getItem('tvViewer_country') || 'ENG,FRA';
            oipfConfiguration.configuration.countryId = window.localStorage.getItem('tvViewer_country') || 'ENG';
            //oipfConfiguration.configuration.regionId = 0;
            if (window.localStorage.getItem('tvViewer_hbbtv') === '2.0.1' || window.localStorage.getItem('tvViewer_hbbtv') === '2.0.2') {
                oipfConfiguration.configuration.subtitlesEnabled = true;
                oipfConfiguration.configuration.audioDescriptionEnabled = true;
                oipfConfiguration.configuration.timeShiftSynchronized = true;
                oipfConfiguration.configuration.dtt_network_ids = [];
                oipfConfiguration.configuration.deviceId = 'abcdef12345';
                oipfConfiguration.configuration.requestAccessToDistinctiveIdentifier = function(cb) { if (cb) cb(true); };
                oipfConfiguration.localSystem = {};
                oipfConfiguration.localSystem.deviceID = 'no name';
                oipfConfiguration.localSystem.modelName = 'tv';
                oipfConfiguration.localSystem.vendorName = 'unknown';
                oipfConfiguration.localSystem.softwareVersion = '1.0.0';
                oipfConfiguration.localSystem.hardwareVersion = '1.0';
                oipfConfiguration.localSystem.serialNumber = '12345';
            }
            oipfConfiguration.getText = function(key) {

            };

            oipfConfiguration.setText = function(key, value) {

            };
        })(window.oipfConfiguration || (window.oipfConfiguration = {}));

        // 7.15.3 The application/oipfCapabilities embedded object ---------------------

        (function(oipfCapabilities) {
            var storedCapabilities = window.localStorage.getItem('tvViewer_capabilities'); // FIXME: use tvViewer_caps object
            var currentCapabilities = storedCapabilities ||
                '<profilelist>' +
                '<ui_profile name="OITF_HD_UIPROF+META_SI+META_EIT+TRICKMODE+RTSP+AVCAD+DRM+DVB_T">' +
                '<ext>' +
                '<colorkeys>true</colorkeys>' +
                '<video_broadcast type="ID_DVB_T" scaling="arbitrary" minSize="0">true</video_broadcast>' +
                '<parentalcontrol schemes="dvb-si">true</parentalcontrol>' +
                '</ext>' +
                '<drm DRMSystemID="urn:dvb:casystemid:19219">TS MP4</drm>' +
                '<drm DRMSystemID="urn:dvb:casystemid:1664" protectionGateways="ci+">TS</drm>' +
                '</ui_profile>' +
                '<audio_profile name=\"MPEG1_L3\" type=\"audio/mpeg\"/>' +
                '<audio_profile name=\"HEAAC\" type=\"audio/mp4\"/>' +
                '<video_profile name=\"TS_AVC_SD_25_HEAAC\" type=\"video/mpeg\"/>' +
                '<video_profile name=\"TS_AVC_HD_25_HEAAC\" type=\"video/mpeg\"/>' +
                '<video_profile name=\"MP4_AVC_SD_25_HEAAC\" type=\"video/mp4\"/>' +
                '<video_profile name=\"MP4_AVC_HD_25_HEAAC\" type=\"video/mp4\"/>' +
                '<video_profile name=\"MP4_AVC_SD_25_HEAAC\" type=\"video/mp4\" transport=\"dash\"/>' +
                '<video_profile name=\"MP4_AVC_HD_25_HEAAC\" type=\"video/mp4\" transport=\"dash\"/>' +
                '</profilelist>';
            var videoProfiles = currentCapabilities.split('video_profile');
            oipfCapabilities.xmlCapabilities = (new window.DOMParser()).parseFromString(currentCapabilities, 'text/xml');
            oipfCapabilities.extraSDVideoDecodes = videoProfiles.length > 1 ? videoProfiles.slice(1).join().split('_SD_').slice(1).length : 0;
            oipfCapabilities.extraHDVideoDecodes = videoProfiles.length > 1 ? videoProfiles.slice(1).join().split('_HD_').slice(1).length : 0;
            oipfCapabilities.hasCapability = function(capability) {
                return !!~new window.XMLSerializer().serializeToString(oipfCapabilities.xmlCapabilities).indexOf(capability.toString() || '??');
            };
        })(window.oipfCapabilities || (window.oipfCapabilities = {}));

        // 7.4.3 The application/oipfDownloadManager embedded object (+DL) -------------


        // 7.6.1 The application/oipfDrmAgent embedded object (+DRM and CI+) -----------


        // 7.9.1 The application/oipfParentalControlManager embedded object ------------


        // 7.10.1 The application/oipfRecordingScheduler embedded object (+PVR) --------


        // 7.12.1 The application/oipfSearchManager embedded object --------------------


        // 7.13.1 The video/broadcast embedded object ----------------------------------

        (function(oipf) {
            oipf.channelList = {};
            oipf.channelList._list = [];
            oipf.channelList._list.push({
                'id': '0',
                'idType' : 12,
                'name': 'channel0',
                'ccid': 'ccid:dvbt.0'
            });
            oipf.channelList.getChannel = function (id) {
                return window.oipf.channelList._list[id];
            };
            oipf.getCurrentTVChannel = function () {
                return window.oipf.channelList.getChannel(0);
            };
            oipf.programmes = [];
            oipf.programmes.push({name:'Event 1, umlaut \u00e4',channelId:'ccid:dvbt.0',duration:600,startTime:Date.now()/1000,description:'EIT present event is under construction'});
            oipf.programmes.push({name:'Event 2, umlaut \u00f6',channelId:'ccid:dvbt.0',duration:300,startTime:Date.now()/1000+600,description:'EIT following event is under construction'});
            oipf.onblur = function(evt) {};
            oipf.onfocus = function(evt) {};
            oipf.onPlayStateChange = function(evt) {};
            oipf.onPlaySpeedChanged = function(evt) {};
            oipf.onPlaySpeedsArrayChanged = function(evt) {};
            oipf.onPlayPositionChanged = function(evt) {};
            oipf.onFullScreenChange = function(evt) {};
            oipf.onParentalRatingChange = function(evt) {};
            oipf.onParentalRatingError = function(evt) {};
            oipf.onDRMRightsError = function(evt) {};

        })(window.oipf || (window.oipf = {}));

        // 7.13.9 Extensions to video/broadcast for channel list -----------------------


        // 7.13.6 Extensions to video/broadcast for DRM rights errors ------------------


        // 7.13.21 Extensions to video/broadcast for synchronization -------------------


        // 7.16.2.4 DVB-SI extensions to Programme -------------------------------------


        // 7.16.5 Extensions for playback of selected media components -----------------


        // Listening to external messages ----------------------------------------------

        /*(function(document) {
            window.addEventListener("message", function(event) {
                console.log("hbbtv event received: ", event);

            });
        })(window.document);*/

        //console.log("HbbTV emulator added !");
    }
})(
    typeof self !== 'undefined' && self ||
    typeof window !== 'undefined' && window ||
    typeof global !== 'undefined' && global || {}
);
