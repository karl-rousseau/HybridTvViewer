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
(function(view) {
    'use strict';
    var $ = document.querySelector.bind(document);
    var doc = view.document;
    var selectedTabId = -1;
    var knownMimeTypes = {
        'hbbtv': 'application/vnd.hbbtv.xhtml+xml',
        'cehtml': 'application/ce-html+xml',
        'bml': 'text/X-arib-bml',
        'ohtv': 'application/vnd.ohtv',
        'mheg': 'application/x-mheg-5',
        'aitx': 'application/vnd.dvb.ait'
    };

    // -- Filtering browser's HTTP headers -------------------------------------

    var callback = function(info) {
        console.log("onHeadersReceived: " + Math.round(info.timeStamp) + " url: " + (info.url ? info.url : ''));

        // if (info.url.indexOf(".cehtml")) { // if URL is ended with .cehtml like ARTE page then we do the injection ...
        //     console.log("CE HTML found !");
        //
        // }

        var headers = info.responseHeaders;
        headers.forEach(function(header) {
            var headerWithHbbtv = header.value.substring(0, knownMimeTypes.hbbtv.length) === knownMimeTypes.hbbtv;
            switch (header.name.toLowerCase()) {
                case 'content-type':
                    if (headerWithHbbtv) {
                        console.log("onHeadersReceived : url: " + (info.url ? info.url : ''));

                        chrome.browserAction.setIcon({
                            path: "./img/tv-icon128-on.png"
                        });

                        var tabs = [];
                        tabs.push(info.url); // TODO: add the type of recognized hybrid technology (to update setBadgeText)
                        localStorage.setItem("tvViewer_tabs", JSON.stringify(tabs)); // store patched URL (for tabs retrieval)

                        header.value = 'text/html'; // override current content-type to avoid CHROME automatic download

                    }
                    /*else if (header.value.substring(0, 'application/xhtml+xml'.length) === 'application/xhtml+xml') {
                        console.log("onHeadersReceived : checking content of url " + (info.url ? info.url : ''));

                        var xmlRequest = new XMLHttpRequest();
                        xmlRequest.open('GET', info.url, true); // Ajax call to preload content to seek META tag content ... downside: heavy network usage :(
                        xmlRequest.send();

                        xmlRequest.onreadystatechange = function() {
                            if (xmlRequest.readyState==4 && xmlRequest.status==200) {
                                var text = xmlRequest.responseText;
                                console.log("URL XML length=" + text.length);
                                if (text.indexOf("application/vnd.hbbtv.xhtml+xml") !== -1) {
                                   chrome.tabs.query({ url: info.url }, function(tabs) {
                                        console.log(tabs);
                                        if (tabs && tabs.length > 0 && tabs[0].id) {
                                            selectedTabId = tabs[0].id;

                                            var pluginPath = chrome.extension.getURL("js/hbbtv.js");
                                            console.log("=> JS PATH: " + pluginPath);
                                            var injectedScript = "(function(d){var e=d.createElement('script');";
                                            injectedScript += "e.setAttribute('type','text/javascript');e.setAttribute('src','" + pluginPath + "');d.head.insertBefore(e,d.head.firstChild)}(document));";
                                            console.log(injectedScript);
                                            chrome.tabs.executeScript(selectedTabId, { code: injectedScript }, function() {
                                                console.log("=> HbbTV JS injection done.");
                                            });
                                        }
                                    });
                                }
                            }
                        };
                    }*/
                    break;
            }
        });
        return {
            responseHeaders: headers
        };
    };
    var filter = {
        urls: ["<all_urls>"]
    };
    var opt_extraInfoSpec = ["blocking", "responseHeaders"];

    chrome.webRequest.onHeadersReceived.addListener(
        callback,
        filter,
        opt_extraInfoSpec
    ); // filtering headers of each browser request ...

    // -- Listen to active TAB ... ---------------------------------------------
    // if page is an hybrid one, we active the extension icon with a text ...

    chrome.tabs.onActivated.addListener(function(activeInfo) {
        chrome.tabs.getSelected(null, function(tabInfo) {
            var urlFound = false;
            var hybridPages = localStorage.getItem("tvViewer_tabs");
            hybridPages = hybridPages ? JSON.parse(hybridPages) : [];
            console.log("HYBRIDS: ", hybridPages);
            if (hybridPages) {
                for (var i = 0; i < hybridPages.length; i++) {
                    if (tabInfo.url == hybridPages[i]) { // current tab = same page as previously found as Hybrid ?
                        urlFound = true;
                        break;
                    }
                }
            }

            chrome.browserAction.setIcon({
                path: "./img/tv-icon128-" + (urlFound ? "on" : "off") + ".png"
            });
        });
    });

    // -- Listen to TAB update (F5 or JavaScript reload) ... -------------------

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        chrome.tabs.getSelected(null, function(selectedTab) {
            console.log("TAB UPDATE: ", tab.url, changeInfo);

            if (tab.url === selectedTab.url && tab.status === "complete") { // page has been fully reloaded ... then inject JS simulator ...
                var urlFound = false;
                var hybridPages = localStorage.getItem("tvViewer_tabs");
                hybridPages = hybridPages ? JSON.parse(hybridPages) : [];
                for (var i = 0; i < hybridPages.length; i++) {
                    if (hybridPages[i] == tab.url) {
                        urlFound = true;
                        break;
                    }
                }

                if (urlFound) {
                    var pluginPath = chrome.extension.getURL("js/hbbtv.js");
                    console.log("JS PATH: " + pluginPath);
                    var injectedScript = "(function(d){var e=d.createElement('script');";
                    injectedScript += "e.setAttribute('type','text/javascript');e.setAttribute('src','" + pluginPath + "');d.head.insertBefore(e,d.head.firstChild)}(document));";
                    chrome.tabs.executeScript(null, {
                        code: injectedScript,
                        runAt: "document_end"
                    }, function() {
                        console.log("HbbTV JS injection done.");
                    });
                }
            }
        });
    });

    // -- Listen to ICON click ... ---------------------------------------------

    chrome.browserAction.onClicked.addListener(function(tabInfo) {
        // TODO: refactor this code inside a proper method for re-use (here used three times)
        var urlFound = false;
        var hybridPages = localStorage.getItem("tvViewer_tabs");
        hybridPages = hybridPages ? JSON.parse(hybridPages) : [];
        for (var i = 0; i < hybridPages.length; i++) {
            if (hybridPages[i] == tabInfo.url) {
                urlFound = true;
                break;
            }
        }
        if (!urlFound) {
            hybridPages.push(tabInfo.url);
        } else {
            hybridPages.splice(i, 1);
        }
        localStorage.setItem("tvViewer_tabs", JSON.stringify(hybridPages)); // store patched URL (for tabs retrieval)

        console.log("onclick urlFound=" + urlFound);

        chrome.browserAction.setIcon({
            path: "./img/tv-icon128-" + (urlFound === false ? "on" : "off") + ".png"
        });

        chrome.tabs.executeScript({
            'file': './js/activate.js'
        });
    });

})(
    typeof self !== "undefined" && self ||
    typeof window !== "undefined" && window ||
    this.content
);
