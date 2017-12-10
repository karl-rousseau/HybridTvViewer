# WEB extension

Embracing such Hybrid Interactive TV Technologies:

![](img/logo-hbbtv.png) &nbsp;&nbsp;&nbsp; ![](img/logo-ohtv.png) &nbsp;&nbsp;&nbsp; ![](img/logo-mhp.png) &nbsp;&nbsp;&nbsp; ![](img/logo-oipf.png)

## Preamble

```
This extension for CHROME & FIREFOX mimics the behavior of the good one called FireHbbTV available only for FIREFOX
```
I have decided to do it, as at work we are only using CHROME as a development tool on a daily basis and I am now used to it. Moreover I also wanted to avoid the default action of our browsers which is to download such iTV (interactive television) application pages (exposed by an URL or embedded inside a broadcast transport stream)

| Opera (chrome based)    | Firefox (V57+) | Google Chrome | Microsoft Edge | Safari |
| -------- | ------- | ------ | ------ | ------ |
| [free](https://addons.opera.com/en/extensions/details/hybridtvviewer/) | [free](https://addons.mozilla.org/en-US/firefox/addon/hybridtvviewer/) | not free :cry: | not tested and not free :cry: | no support for Web Extensions yet |

## Screenshot

![](img/screenshot_popup.png)

## Features

| Feature            | Description |
| ------------------ | ----------- |
| auto-detection     | an analysis of HTTP server headers plus inside header & meta tags is performed |
| forced detection   | user on-clicked power button will force the iTV emulation (auto-saved in web extension local storage) |
| bottom status bar  | underneath the screen rendering, the emulator is providing some buttons (colored keys, resolutions for zoomed rendering, ...) |
| iDTV customization | the extension enables customization of various parameters (user-agent, OIPF capabilities, country, CAS id, DVB channels, ...) |
| external inputs | it handles some external inputs such as CI+ APDU reply message, Stream-Event content customization & triggering, DVB channels with customized LCN, ... |
| video support | it will handle the rendering of browser unrecognized broadcast video stream: Mpeg-TS and Mpeg-DASH |

## Status

- [x] ~~removing CHROME warning popups for various undefined mime-types~~
- [x] ~~currently only as a prototype stage but the proof of concept has been validated and many features have been put in the options page~~.
- :skull: SUN MHP technology has been put aside as it will need to have a JVM installed with its associated plugin
  (a mess to install and moreover this technology is now replaced by the brand new one called HbbTV)
  I know [GINGA](https://en.wikipedia.org/wiki/Ginga_(middleware) is MHP based and still present in South America but for how long ...
- :satellite: **DVB-SI/PSI** tables (such as EIT & AIT) extraction inside MPEG-TS files, will be handle by an external Chrome application or ...
- :vhs: **MP4 Transport Stream** video (without DRM) might be supported using an external library:
  * will have to investigate :mag:  [upipe](https://github.com/cmassiot/upipe/tree/master/examples/chrome/player_chrome) Chrome NaCl rendering plugin
  * might also have a look at [Video.JS](https://github.com/videojs/video.js) library handling also HLS and DASH
  * Chrome V55+ can handle HEVC with HTML5 video tag but it need [to be recompiled](https://lexxai.blogspot.fr/2016/09/chromium-ubuntu-x265-hevc.html) with a proper FFmpeg
- :scissors: OIPF technology will not be fully implemented (only the HbbTV subset will be done)
- **HbbTV V2.0** might be present (with an exposed WebSocket server) when V1.5 implementation will be done
  * for the meantime, look at [node-hbbtv](https://github.com/fraunhoferfokus/node-hbbtv) from the well-known Fraunhofer (creator of MP3)
- [ ] CI+ HbbTV implementation is hereby emulated with a default code (can be customized)
- [ ] A dedicated tab will be added in [Chrome Web Inspector](https://developer.chrome.com/devtools) for user debugging purpose

```
If you have video Cross-Origin issues, you can temporary test your video by adding those parameters when launching your Chrome based browser: --disable-web-security --user-data-dir
```

## Detection and usage

In order to automatically activate the extension on an given web page, you need to follow
standard implementation as seen for example on SAMSUNG iDTV devices that are looking for
this HTTP header field:
```
Content-Type: application/vnd.hbbtv.xhtml+xml
```
This HTTP header response is coming from **the server side** where the page is hosted as you can see with such UNIX command:
```
curl -I http://www.arte.tv/redbutton/index.html
... (HTTP headers)
```

You can also add a defined META tag inside your page:

| Technology    | META tag |
| ------------- |:----------------:|
| *HbbTV*       | &lt;meta http-equiv="content-type" content="application/vnd.hbbtv.xhtml+xml; charset=UTF-8" /&gt; |
| *CE-HTML*     | &lt;meta http-equiv="content-type" content="application/ce-html+xml; charset=UTF-8" /&gt; |

and sometime with the addition of a given DOCTYPE:

| Technology    | DOCTYPE tag |
| ------------- |:------------------:|
| *HbbTV*       | &lt;!DOCTYPE html PUBLIC "-//HbbTV//1.1.1//EN" "http://www.hbbtv.org/dtd/HbbTV-1.1.1.dtd" &gt; |
| *BML*         | &lt;!DOCTYPE BML PUBLIC "+//ARIB STD-B24:1999//DTD BML Document//JA" "http://www.arib.or.jp/B24/DTD/BML_1_0.dtd" &gt; |

In other cases, you can also manually click on the extension icon inside the browser's bar to show a popup then by clicking on a power icon button, you can force the page to be interpreted as an Hybrid iTV page. (this action is saved in local storage for further visits)

## Examples

The purpose of this extension is mainly to validate the **MIT-xperts test suite** under CHROME and FIREFOX.
Here are some example URL that have been extracted from various sources:

| Name          | Source | URL |
| ------------- | ------ |---- |
| MIT-xperts HbbTV test suite | [TS stream](https://github.com/mitxp/HbbTV-Testsuite/wiki) | http://itv.mit-xperts.com/hbbtvtest/ |
| ARTE HbbTV    | French DTT TS | http://www.arte.tv/redbutton/ |
| ARTE CE-HTML  | Philips iDTV portal | http://cehtml.arte.tv/de/2764896.cehtml |

## Abbreviations

- iDTV: Integrated Digital TeleVision
- CI+: Common Interface
- HLS: HTTP Live Streaming
- DASH: Dynamic Adaptive Streaming over HTTP
- DVB: Digital Video Broadcasting
- DVB-T: Digital Video Broadcasting Terrestrial
- DVB-C: Digital Video Broadcasting Cable
- DVB-S: Digital Video Broadcasting Satellite
- DVB-SI: DVB Service Information
- AIT: Application Information Table
- EIT: Event Information Table
- LCN: Logical Channel Number

## References

- MHP (Multimedia Home Platform) : Based on SUN JAVA technology working on [GEM-MHP](https://en.wikipedia.org/wiki/Globally_Executable_MHP) middleware
  * initialy defined by [ETSI TS 101 812](http://www.etsi.org/deliver/etsi_ts/101800_101899/101812/01.02.01_60/ts_101812v010201p.pdf) documentation
- **HbbTV** (Hybrid Broadband Broadcast TeleVision) :
  * defined by current [ETSI TS 102 796 V1.3.1](http://www.etsi.org/deliver/etsi_ts/102700_102799/102796/01.03.01_60/ts_102796v010301p.pdf) specifications (aka HbbTV V2.0)
    * embracing **HTML5 video tag** notation within [HbbTV V2.0 only](https://www.hbbtv.org/resource-library/#specifications)
  * following old MHP AITX structure
  * handling some CEA-2014 notations
  * implementing a subset of OIPF objects
- OHTV (Open Hybrid TV) : similar to HbbTV and used for example at [iCON TV](http://able.kbs.co.kr/enter/tal_view.php?mseq=16&pcg=&pgseq=&no=270211) in KOREA by the national broadcaster *KBS* since 2010
- BML (Broadcast Markup Language) : similar to HbbTV and defined by ARIB STD B-24 standard used in JAPAN over ISDB-T broadcasted channels like [*NHK*](https://www.nhk.or.jp/strl/publica/bt/en/fe0003-1.html)
- CE-HTML (Consumer Electronics HTML) : nowadays less used and only found on old devices
- OIPF (Open IPTV Forum) : used on some STB and since 2014 activities have been transfered to HbbTV association
