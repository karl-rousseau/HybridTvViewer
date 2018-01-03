# HybridTvViewer ![](http://vanilla-js.com/assets/button.png) [<img align="right" src="https://img.shields.io/badge/License-MIT-yellow.svg">](https://github.com/karl-rousseau/HybridTvViewer/blob/master/LICENSE)

Embracing such Hybrid Interactive TV Technologies:

![](img/logo-hbbtv.png) &nbsp;&nbsp;&nbsp; ![](img/logo-atsc.png) &nbsp;&nbsp;&nbsp; ![](img/logo-ohtv.png) &nbsp;&nbsp;&nbsp; ![](img/logo-mhp.png) &nbsp;&nbsp;&nbsp; ![](img/logo-oipf.png)

## Preamble

```
This browser extension mimics the behavior of the good one called FireHbbTV available only for FIREFOX
```
I have decided to do it, as at work we are only using CHROME as a development tool on a daily basis and I am now used to it. Moreover I also wanted to avoid the default action of our browsers which is to download such iTV (interactive television) application pages (exposed by an URL or embedded inside a broadcast transport stream)

| Mozilla Firefox (V57+) | Opera (chrome based) | Google Chrome | Microsoft Edge | Apple Safari |
| -------- | ------- | ------ | ------ | ------ |
| [<img  src="https://addons.cdn.mozilla.net/static/img/addons-buttons/AMO-button_2.png">](https://addons.mozilla.org/en-US/firefox/addon/hybridtvviewer/) | [free](https://addons.opera.com/en/extensions/details/hybridtvviewer/) (ongoing publishing) | not free (5$ fee) | not tested + not free (19$ fee) | no support for Web Extensions yet |

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

```
If you have video Cross-Origin issues, you can temporary test your video by adding those parameters  
when launching your Chrome based browser: --disable-web-security --user-data-dir
```

## Examples

The purpose of this extension is mainly to validate the **MIT-xperts test suite** under CHROME and FIREFOX.  
Here are some example URL that have been extracted from various sources:

| Name          | Source | URL |
| ------------- | ------ |---- |
| MIT-xperts HbbTV test suite | [TS stream](https://github.com/mitxp/HbbTV-Testsuite/wiki) | http://itv.mit-xperts.com/hbbtvtest/ |
| ARTE HbbTV    | French DTT TS | http://www.arte.tv/redbutton/ |
| ARTE CE-HTML  | Philips iDTV portal | http://cehtml.arte.tv/de/2764896.cehtml |

More examples (with dead ones) can be found on this catalog: http://urju.de/hbbtv/

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
- OIPF (Open IPTV Forum) : used on some STB. Since 2014 activities have been transfered to HbbTV association
- ATSC (Advanced Television Systems Committee) : broadcast standard used in USA where [ATSC V3.0](https://www.atsc.org/standards/atsc-3-0-standards/) is based on HbbTV 2.0
