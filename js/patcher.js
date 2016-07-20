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
        'ohtv': 'application/vnd.ohtv',
        'bml': 'text/X-arib-bml'
        //'mheg': 'application/x-mheg-5',
        //'aitx': 'application/vnd.dvb.ait'
    };

    if (typeof String.prototype.endsWith !== 'function') { // don't use ES6 if CHROME is older than V41 ... then use a polyfill
        String.prototype.endsWith = function(suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }

    function isUrlStored(url) {
        var urlFound = false;
        var hybridPages = localStorage.getItem("tvViewer_tabs");
        hybridPages = hybridPages ? JSON.parse(hybridPages) : [];

        for (var i = 0; i < hybridPages.length; i++) {
            if (url.indexOf(hybridPages[i]) > -1) {
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
        var hybridPages = localStorage.getItem("tvViewer_tabs");
        hybridPages = hybridPages ? JSON.parse(hybridPages) : [];

        var domainOnly = getUrlDomain(url);
        var urlFound = isUrlStored(domainOnly);
        if (!urlFound) {
            hybridPages.push(domainOnly); // TODO: add the type of recognized hybrid technology (to update setBadgeText)
            localStorage.setItem("tvViewer_tabs", JSON.stringify(hybridPages)); // store patched URL (for tabs retrieval)
        } else if (forceToDelete) {
            var idx = hybridPages.indexOf(domainOnly);
            hybridPages.splice(idx, 1);
            localStorage.setItem("tvViewer_tabs", JSON.stringify(hybridPages));
        }
        return urlFound;
    }

    function injectCss(tabId, fileName, succeededMessage) {
        var injectedPath = chrome.extension.getURL(fileName);
        var injectedFile = "(function(d){var e=d.createElement('link');e.setAttribute('rel','stylesheet');";
        injectedFile += "e.setAttribute('type','text/css');e.setAttribute('href','" + injectedPath + "');d.head.insertBefore(e,d.head.firstChild)}(document));";
        chrome.tabs.executeScript(tabId, {
            code: injectedFile,
            runAt: "document_start"
        }, function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                console.log(succeededMessage);
            }
        });
    }

    function injectJs(tabId, fileName, succeededMessage, addedToHead, addedAsFirstChild, withOption) {
        var pluginPath = chrome.extension.getURL(fileName);
        var injectedScript = "(function(d){var e=d.createElement('script');";
        injectedScript += (withOption ? "e.setAttribute('" + withOption + "', '" + withOption + "');" : "");
        injectedScript += "e.setAttribute('type','text/javascript');e.setAttribute('src','" + pluginPath + "');";
        injectedScript += (addedToHead ? "d.head" : "d.body");
        injectedScript += (addedAsFirstChild ? ".insertBefore(e,d.head.firstChild)" : ".appendChild(e)");
        injectedScript += "}(document));";
        chrome.tabs.executeScript(tabId, {
            code: injectedScript,
            runAt: "document_end"
        }, function() {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                console.log(succeededMessage);
            }
        });
    }

    // -- Filtering browser's HTTP headers -------------------------------------

    var callback = function(info) {
        var url = (info.url || '');
        var headers = info.responseHeaders;

        // if (info.url.indexOf(".cehtml") > -1) { // if URL is ended with .cehtml like some ARTE pages then we do the injection ...
        //     console.log("CE HTML found !");
        //
        // }

        if (url.indexOf(".json") > -1 || // also .jsonp
            url.endsWith(".ico") ||
            url.endsWith(".js") ||
            url.endsWith(".css") ||
            url.endsWith(".jpg") ||
            url.endsWith(".png") ||
            url.endsWith(".gif") ||
            url.endsWith(".webp") ||
            url.endsWith(".m3u8") ||
            url.endsWith(".mpd") ||
            url.endsWith(".ts") ||
            url.endsWith(".mpg") ||
            url.endsWith(".mp3") ||
            url.endsWith(".mp4") ||
            url.endsWith(".mov") ||
            url.endsWith(".avi") ||
            url.endsWith(".pdf") ||
            url.endsWith(".ppt") ||
            url.endsWith(".pptx") ||
            url.endsWith(".xls") ||
            url.endsWith(".xlsx") ||
            url.endsWith(".doc") ||
            url.endsWith(".docx") ||
            url.endsWith(".zip") ||
            url.endsWith(".rar") ||
            url.endsWith(".7z") // FIXME: put those extensions in an array to scan
        ) { // already parsed, detected and stored URL page or un-wanted one ?
            return {
                responseHeaders: headers
            };
        }

        //console.log("onHeadersReceived: " + Math.round(info.timeStamp) + " url: " + url);

        headers.forEach(function(header) {
            var headerWithHbbtv = header.value.substring(0, knownMimeTypes.hbbtv.length) === knownMimeTypes.hbbtv;
            var headerWithCeHtml = header.value.substring(0, knownMimeTypes.cehtml.length) === knownMimeTypes.cehtml;
            var headerWithOhtv = header.value.substring(0, knownMimeTypes.ohtv.length) === knownMimeTypes.ohtv;
            var headerWithBml = header.value.substring(0, knownMimeTypes.bml.length) === knownMimeTypes.bml;
            switch (header.name.toLowerCase()) {
                case 'content-type':
                    if (headerWithHbbtv || headerWithCeHtml || headerWithOhtv || headerWithBml) {
                        console.log("onHeadersReceived -> hybrid url: " + getUrlDomain(url));

                        chrome.browserAction.setIcon({
                            path: "./img/tv-icon128-on.png"
                        });

                        checkAndStoreUrl(url);

                        header.value = 'text/html'; // override current content-type to avoid CHROME automatic download
                    }
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

    // chrome.webRequest.onCompleted.addListener(
    //     function(details) {
    //       console.log("onCompleted: ", details);
    //
    //       // TODO: filter the URL as done before in the header analysis
    //
    //       var xmlRequest = new XMLHttpRequest();
    //       xmlRequest.open('GET', details.url, true); // Ajax call to preload content to seek META tag content ... downside: heavy network usage :(
    //       xmlRequest.send();
    //
    //       xmlRequest.onreadystatechange = function() {
    //           if (xmlRequest.readyState==4 && xmlRequest.status==200) {
    //               var text = xmlRequest.responseText;
    //               console.log("URL XML length=" + text.length);
    //               if (text.indexOf("application/vnd.hbbtv.xhtml+xml") !== -1) {
    //                  chrome.tabs.query({ url: details.url }, function(tabs) {
    //                       console.log(tabs);
    //                       if (tabs && tabs.length > 0 && tabs[0].id) {
    //                           selectedTabId = tabs[0].id;
    //
    //                           var pluginPath = chrome.extension.getURL("js/hbbtv.js");
    //                           console.log("=> JS PATH: " + pluginPath);
    //                           var injectedScript = "(function(d){var e=d.createElement('script');";
    //                           injectedScript += "e.setAttribute('type','text/javascript');e.setAttribute('src','" + pluginPath + "');d.head.insertBefore(e,d.head.firstChild)}(document));";
    //                           console.log(injectedScript);
    //                           chrome.tabs.executeScript(selectedTabId, { code: injectedScript }, function() {
    //                               console.log("=> HbbTV JS injection done.");
    //                           });
    //                       }
    //                   });
    //               }
    //           }
    //       };
    //     },
    //     filter,
    //     ["responseHeaders"]
    // );

    // -- User-Agent change on recognized URL ... -----------------------------

    chrome.webRequest.onBeforeSendHeaders.addListener(
        function(details) {
            if (details.method === 'GET') {
                var urlFound = isUrlStored(details.url);
                if (urlFound) {
                  var notFound = true;
                  var customizedUserAgent = "Mozilla/5.0 (Linux mipsel; U; HbbTV/1.1.1 (; TOSHIBA; DTV_L7300; 7.2.67.14.01.1; a5; ) ; ToshibaTP/2.0.0 (+DRM) ; xx) AppleWebKit/537.4 (KHTML, like Gecko) TOSHIBA-DTV (DTV_L7300; 7.2.67.14.01.1; 2013A; NA)";
                  for (var i = 0; i < details.requestHeaders.length; ++i) {
                      if (details.requestHeaders[i].name === "User-Agent") {
                          details.requestHeaders[i].value = customizedUserAgent;
                          notFound = false;
                          break;
                      }
                  }
                  if (notFound) { // otherwise just add it ...
                      details.requestHeaders.push({
                        'name': "User-Agent",
                        'value': customizedUserAgent
                      });
                  }
                  return { requestHeaders: details.requestHeaders };
                }
            }
        },
        { urls: [ "<all_urls>" ] },
        [ "blocking", "requestHeaders" ]
    );

    // -- Listen to active TAB ... ---------------------------------------------
    // if page is an hybrid one, we active the extension icon with a text ...

    chrome.tabs.onActivated.addListener(function(activeInfo) {
        chrome.tabs.getSelected(null, function(tabInfo) {
          console.warn("Selected TAB: ", tabInfo);
            var urlFound = isUrlStored(tabInfo.url);

            chrome.browserAction.setIcon({
                path: "./img/tv-icon128-" + (urlFound ? "on" : "off") + ".png"
            });
        });
    });

    // -- Listen to TAB update (F5 or JavaScript reload) ... -------------------

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if ((changeInfo && changeInfo.favIconUrl) || tab.url.indexOf("chrome://") !== -1) {
            return;
        }

        console.log("TAB UPDATE: ", tab.url, changeInfo);

        var urlFound = isUrlStored(tab.url);
        if (urlFound && tab.status === "loading") { // page is loading ... then inject JS lib and CSS ...
            //injectCss(tabId, "css/injector.css", "HbbTV CSS injection done.");
            injectJs(tabId, "js/hbbtv.js", "HbbTV JS injection done.", true, true);
            injectJs(tabId, "js/hbbdom.js", "HbbTV DOM JS injection done.", true, true, 'async');
        }

        if (urlFound && tab.status === "complete") { // page has been fully reloaded ... then inject JS simulator ...
//            injectJs(tabId, "js/hbbdom.js", "HbbTV DOM JS injection done.", true, false, 'async');
        }
    });

    // -- Listen to ICON click ... ---------------------------------------------

    chrome.browserAction.onClicked.addListener(function(tabInfo) {
        var urlFound = checkAndStoreUrl(tabInfo.url, true);

        console.log("onclick urlFound=" + urlFound + " url=" + tabInfo.url);

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
