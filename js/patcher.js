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
(function(view) {
    'use strict';
    var _DEBUG_ = false;
    var $ = document.querySelector.bind(document);
    var doc = view.document;
    var knownMimeTypes = {
        'hbbtv': 'application/vnd.hbbtv.xhtml+xml',
        'cehtml': 'application/ce-html+xml',
        'ohtv': 'application/vnd.ohtv',
        'bml': 'text/X-arib-bml',
        'atsc': 'atsc-http-attributes'
        //'mheg': 'application/x-mheg-5',
        //'aitx': 'application/vnd.dvb.ait'
    };

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

    function isUrlStored(url) {
        var urlFound = false;
        var hybridPages = localStorage.getItem('tvViewer_tabs');
        hybridPages = hybridPages ? JSON.parse(hybridPages) : [];

        for (var i = 0, l = hybridPages.length; i < l; i++) {
            if (hybridPages[i] && hybridPages[i].indexOf(url) !== -1) {
                urlFound = true;
                break;
            }
        }
        return urlFound;
    }

    function getUrlDomain(url) {
        return url.split('/').slice(0, 3).join('/');
    }

    function checkAndStoreUrl(url, forceToDelete) {
        var hybridPages = localStorage.getItem('tvViewer_tabs');
        hybridPages = hybridPages ? JSON.parse(hybridPages) : [];

        var domainOnly = getUrlDomain(url);
        var urlFound = isUrlStored(domainOnly);
        if (!urlFound && url) {
            hybridPages.push(url); // TODO: add the type of recognized hybrid technology (to update setBadgeText)
            localStorage.setItem('tvViewer_tabs', JSON.stringify(hybridPages)); // store patched URL (for tabs retrieval)
        } else if (forceToDelete) {
            var idx = hybridPages.indexOf(domainOnly);
            hybridPages.splice(idx, 1);
            localStorage.setItem('tvViewer_tabs', JSON.stringify(hybridPages));
        }
        return urlFound;
    }

    function injectCss(tabId, fileName, succeededMessage) {
        var injectedPath = chrome.extension.getURL(fileName);
        var checkAlreadyInjected = 'if (d.head && d.head.getElementsByTagName("link").length>0 && [].slice.call(d.head.getElementsByTagName("link")).' +
        'map(function(l) { return l.href.indexOf("' + fileName + '")!==-1; }).reduce(function(a,b) { return a || b })==true) return;';
        var injectedFile = '(function(d){' + checkAlreadyInjected + 'var e=d.createElement("link");e.setAttribute("rel","stylesheet");' +
        'e.setAttribute("type","text/css");e.setAttribute("href","' + injectedPath + '");d.head.insertBefore(e,d.head.firstChild)}(document));';
        chrome.tabs.executeScript(tabId, {
            code: injectedFile,
            runAt: 'document_start'
        }, function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                _DEBUG_ && console.log(succeededMessage);
                //chrome.runtime.sendMessage({ toLog: { 'message': succeededMessage } });
            }
        });
    }

    function injectJs(tabId, fileName, succeededMessage, addedToHead, addedAsFirstChild, withOption) {
        var pluginPath = chrome.extension.getURL(fileName);
        var checkAlreadyInjected = 'if (d.head.getElementsByTagName("script").length>0 && [].slice.call(d.head.getElementsByTagName("script")).' +
        'map(function(l) { return l.src.indexOf("' + fileName + '")!==-1; }).reduce(function(a,b) { return a || b })==true) return;';
        var injectedScript = '(function(d){' + checkAlreadyInjected + 'var e=d.createElement("script");' +
        (withOption ? 'e.setAttribute("' + withOption + '", "' + withOption + '");' : '') +
        'e.setAttribute("type","text/javascript");e.setAttribute("src","' + pluginPath + '");' +
        (addedToHead ? 'd.head' : 'd.body') +
        (addedAsFirstChild ? '.insertBefore(e,d.head.firstChild)' : '.appendChild(e)') +
        '}(document));';
        chrome.tabs.executeScript(tabId, {
            code: injectedScript,
            runAt: 'document_end'
        }, function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                _DEBUG_ && console.log(succeededMessage);
                //chrome.runtime.sendMessage({ toLog: { 'message': succeededMessage } });
            }
        });
    }

    function getUserPreferences() {
        var preferences = localStorage.getItem('tvViewer_hbbtv') ? 'hbbtv=' + localStorage.getItem('tvViewer_hbbtv') : '';
        //preferences += '&device=' + localStorage.getItem('tvViewer_device');
        //preferences += '&model=' + localStorage.getItem('tvViewer_model');
        preferences += localStorage.getItem('tvViewer_ui_dark') === 'true' ? '' : '&light=true';
        preferences += localStorage.getItem('tvViewer_ui_centered') === 'true' ? '&centered=true' : '';
        preferences += localStorage.getItem('tvViewer_ui_overscan') === 'true' ? '&overscan=true' : '';
        return preferences;
    }

    // -- Filtering browser's HTTP headers -------------------------------------

    chrome.webRequest.onHeadersReceived.addListener(
        function(info) {
            var url = (info.url || ''), headers = info.responseHeaders;

            if (url.indexOf('http') !== 0) { // if URL is not starting by http(s) then exit ...
                return {
                    responseHeaders: headers
                };
            }

            if (url.indexOf('.cehtml') > -1) { // if URL is ended with .cehtml like some ARTE pages then we do the injection ...
                _DEBUG_ && console.log('CE HTML found !');
                //chrome.browserAction.setBadgeText && chrome.browserAction.setBadgeText({ text: 'ce' });
                chrome.browserAction.setIcon && chrome.browserAction.setIcon({ path: '../img/tv-icon128-on.png' });
                checkAndStoreUrl(url);
            }

            if (url.indexOf('view-source:') === 0 ||
                url.indexOf('.json') > -1 || // also .jsonp
                url.indexOf('.js') > -1 ||
                url.indexOf('.css') > -1 ||
                url.indexOf('.ico') > -1 ||
                url.indexOf('.jpg') > -1 ||
                url.indexOf('.png') > -1 ||
                url.indexOf('.gif') > -1 ||
                url.indexOf('.webp') > -1 ||
                url.indexOf('.m3u8') > -1 ||
                url.indexOf('.mpd') > -1 ||
                url.indexOf('.ts') > -1 ||
                url.indexOf('.mpg') > -1 ||
                url.indexOf('.mp3') > -1 ||
                url.indexOf('.mp4') > -1 ||
                url.indexOf('.mov') > -1 ||
                url.indexOf('.avi') > -1 ||
                url.indexOf('.pdf') > -1 ||
                url.indexOf('.ppt') > -1 ||
                url.indexOf('.pptx') > -1 ||
                url.indexOf('.xls') > -1 ||
                url.indexOf('.xlsx') > -1 ||
                url.indexOf('.doc') > -1 ||
                url.indexOf('.docx') > -1 ||
                url.indexOf('.zip') > -1 ||
                url.indexOf('.rar') > -1 ||
                url.indexOf('.7z') > -1
            ) { // already parsed, detected and stored URL page or un-wanted one ?
                return {
                    responseHeaders: headers
                };
            }

            headers.forEach(function(header) {
                var headerWithHbbtv = header.value.substring(0, knownMimeTypes.hbbtv.length) === knownMimeTypes.hbbtv ||
                                      header.name.toLowerCase().substring(0, knownMimeTypes.atsc.length) === knownMimeTypes.atsc;
                var headerWithCeHtml = header.value.substring(0, knownMimeTypes.cehtml.length) === knownMimeTypes.cehtml;
                var headerWithOhtv = header.value.substring(0, knownMimeTypes.ohtv.length) === knownMimeTypes.ohtv;
                var headerWithBml = header.value.substring(0, knownMimeTypes.bml.length) === knownMimeTypes.bml;
                _DEBUG_ && console.log('onHeadersReceived header: ', header);
                switch (header.name.toLowerCase()) {
                case knownMimeTypes.atsc:
                case 'content-type':
                    if (headerWithHbbtv || headerWithCeHtml || headerWithOhtv || headerWithBml) {
                        _DEBUG_ && console.log('onHeadersReceived -> hybrid url: ' + url);

                        chrome.browserAction.setIcon && chrome.browserAction.setIcon({ path: '../img/tv-icon128-on.png' });
                        checkAndStoreUrl(url);

                        header.value = 'application/xhtml+xml'; // override current content-type to avoid browser automatic download
                    }
                    break;
                }
            });
            return {
                responseHeaders: headers
            };
        },
        { urls: [ '<all_urls>' ] },
        [ 'blocking', 'responseHeaders' ]
    );

    // -- User-Agent change on recognized URL ... -----------------------------

    chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            if (details.method === 'GET') {
                var urlFound = isUrlStored(getUrlDomain(details.url || ''));
                if (urlFound) {
                    var notFound = true;
                    //var currentSystem = navigator.userAgent.split(/\s*[;)(]\s*/).slice(1,3).join(' ');
                    // var customizedUserAgent = 'Mozilla/5.0 (' + currentSystem + '; U; HbbTV/' +
                    //                           (toEtsiVersion(localStorage.getItem('tvViewer_hbbtv')) || '1.2.1') + ' (; ' +
                    //                           ' (; TOSHIBA; DTV_L7300; 7.2.67.14.01.1; a5; ) ; ToshibaTP/2.0.0 (+DRM) ; xx) HybridTvViewer';
                    var customizedUserAgent = 'HbbTV/' + (toEtsiVersion(localStorage.getItem('tvViewer_hbbtv')) || '1.2.1') + ' (+DRM;Samsung;SmartTV2015;T-HKM6DEUC-1490.3;;) HybridTvViewer';
                    for (var i = 0, len = details.requestHeaders.length; i < len; ++i) {
                        var header = details.requestHeaders[i];
                        if (header.name === 'User-Agent') {
                            header.value = customizedUserAgent;
                            notFound = false;
                            break;
                        }
                    }
                    if (notFound) { // otherwise just add it ...
                        details.requestHeaders.push({
                            'name': 'User-Agent',
                            'value': customizedUserAgent
                        });
                    }
                    return { requestHeaders: details.requestHeaders };
                }
            }
        },
        { urls: [ '<all_urls>' ] },
        [ 'blocking', 'requestHeaders' ] // blocking flag is needed to override user-agent header (see manifest.json webRequestBlocking flag)
    );

    // -- Listen to active TAB ... ---------------------------------------------
    // if page is an hybrid one, we active the extension icon ...

    chrome.tabs.onActivated.addListener(function(activeInfo) {
        _DEBUG_ && console.warn('Selected TAB: ', activeInfo);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var tab = tabs[0];
            if (tab.id == activeInfo.tabId) {
                var urlFound = isUrlStored(getUrlDomain(tab.url));
                _DEBUG_ && console.warn('FOUND TAB: ', tab, ' url:', tab.url, ' found:', urlFound);

                chrome.browserAction.setIcon && chrome.browserAction.setIcon({ path: '../img/tv-icon128-' + (urlFound ? 'on' : 'off') + '.png' });
            }
        });
    });

    // -- Listen to TAB update (F5 or JavaScript reload) ... -------------------

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

        if ((typeof browser !== 'undefined' && changeInfo && changeInfo.favIconUrl) ||
           (typeof browser !== 'undefined' && changeInfo && changeInfo.title) || // Firefox is showing title change as an event that we don't need
           (typeof browser !== 'undefined' && changeInfo && changeInfo.status === 'loading' && !changeInfo.url) || // Firefox is loading this step on refresh tab that we don't need
           tab.url.indexOf('chrome://') !== -1 ||
           tab.url.indexOf('about:') !== -1 ||
           tab.url.indexOf('moz-extension://') !== -1 ||
           tab.url.indexOf('view-source:') !== -1 ||
           tab.url.indexOf('ms-browser-extension://') !== -1 ||
           tab.url.indexOf('http') !== 0) { // if URL is not starting by http(s) then exit ...
            return;
        }

        _DEBUG_ && console.log('TAB UPDATE: ', tab.url, changeInfo);

        var storeParams = 'if (localStorage.getItem("tvViewer_active")==null) { localStorage.setItem("tvViewer_active","true"); ' +
                          'localStorage.setItem("tvViewer_hbbtv","1.5"); ' +
                          'localStorage.setItem("tvViewer_resolution","res720p"); ' +
                          'localStorage.setItem("tvViewer_caps","{lang:eng,caps:\'+DRM\'}"); ' +
                          'localStorage.setItem("tvViewer_broadcast_url","' +
                          (localStorage.getItem('tvViewer_broadcast_url') ? localStorage.getItem('tvViewer_broadcast_url') : 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4') + '"); }';
        var userPreferences = getUserPreferences();
        var url = getUrlDomain(tab.url);
        var urlFound = isUrlStored(url);
        if (urlFound && tab.status === 'loading') { // page is loading ... then add default storage, inject JS lib and CSS ...
            chrome.tabs.executeScript(tabId, {
                code: storeParams
            }, function() {
            //    if (chrome.runtime.lastError) {
            //        console.error(chrome.runtime.lastError.message);
            //    } else {
            //        _DEBUG_ && console.log('local storage injected.');
            //    }
            });
            injectJs(tabId, 'js/hbbtv.js', 'HbbTV JS injection done.', true, true);
            injectJs(tabId, 'js/hbbdom.js' + '?' + userPreferences, 'HbbTV DOM JS injection done.', true, true, 'async');
            injectJs(tabId, 'js/first.js', '', true, true, 'async');
        }

        if (urlFound && tab.status === 'complete') { // page has been fully reloaded ... then inject JS simulator ...
            injectCss(tabId, 'css/injector.css', 'HbbTV CSS injection done.');
            //injectJs(tabId, 'plugins/mux.min.js', 'mux.js injection done.', true, false, 'async');
            injectJs(tabId, 'https://cdn.dashjs.org/latest/dash.all.min.js', 'DASH.js injection done.', true, false, 'async');
            injectJs(tabId, 'js/hbbobj.js', 'HbbTV OBJECT injection done.', true, false, 'async');

        } else if (urlFound === false && tab.status === 'complete') { // page not recognized but loaded then analyze internal meta tags ...
            var checkForMetaTags = 'var r=false; if (document.head && document.head.getElementsByTagName("meta").length>0 && ' +
            '[].slice.call(document.head.getElementsByTagName("meta")).map(function(l) { return l.content.indexOf("vnd.hbbtv")!==-1 || l.content.indexOf("ce-html+xml")!==-1; }).' +
            'reduce(function(a,b) { return a || b })==true) { ' + storeParams + ' r=true; }; r;';
            // if meta with hbbtv notation is found then let a variable returned in order to store this new recognized page into local storage area
            chrome.tabs.executeScript(tabId, {
                code: checkForMetaTags
            }, function(result) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                } else {
                    _DEBUG_ && console.log('meta tags analyzed --> current page is recognized:', result);
                    if (result instanceof Array && result[0] === true) {
                        checkAndStoreUrl(tab.url); // store current tab url into extension local storage array
                        chrome.tabs.reload(tabId); // force reload in order to inject stuff
                    }
                }
            });
        }
    });

    // -- Listen to extension installation ... ---------------------------------

    chrome.runtime.onInstalled.addListener(function handleInstalled(details) {
        _DEBUG_ && console.log('Extension onInstalled event: ', details.reason);
        if (details.reason == 'install') {
            var testPage = 'https://karl-rousseau.github.io/HybridTvViewer/';
            checkAndStoreUrl(testPage);
            chrome.tabs.create({ url: testPage });
        }
    });

})(
    typeof self !== 'undefined' && self ||
    typeof window !== 'undefined' && window ||
    typeof global !== 'undefined' && global || {}
);
