&nbsp;
<p align="center">
<img src="img/tv-icon128-on.png">
</p>
<p align="center">
  <img src="https://img.shields.io/badge/release-v0.6-red.svg">&nbsp;&nbsp;&nbsp;
	<a href="https://travis-ci.org/karl-rousseau/HybridTvViewer" alt="Travis-CI"><img src="https://travis-ci.com/karl-rousseau/HybridTvViewer.svg?branch=master"></a>&nbsp;&nbsp;&nbsp;
  <img src="https://img.shields.io/badge/vanilla-JS-yellow.svg">&nbsp;&nbsp;&nbsp;
	<a href="https://github.com/karl-rousseau/HybridTvViewer/blob/master/LICENSE" alt="License:MIT"><img src="https://img.shields.io/badge/license-MIT-blue.svg"></a><br>
  <br>
</p>
A browser extension following such Hybrid interactive TV technologies:

![hbbtv](img/logo-hbbtv.png) &nbsp;&nbsp;&nbsp; ![oipf](img/logo-oipf.png) &nbsp;&nbsp;&nbsp; ![atsc3](img/logo-atsc.png) &nbsp;&nbsp;&nbsp; ![ohtv](img/logo-ohtv.png)


## Preamble

```
Be aware that if this browser extension version is still less than 1.0, do consider it as a prototype!
```
The purpose of this project is to avoid the default browser action which is to download various iTV (interactive television) application pages based on the HTML standard with some proprietary methods. Here this browser extension is detecting those pages and injecting during page load an emulation layer (plus a bottom UI toolbar). In addition, unrecognized video formats are also handled by external HTML5 video plugins.

This browser extension is available for free on those distribution platforms:

| Browser: | Mozilla Firefox (V57+) | Google Chrome | Apple Safari |
| -------- | -------- | ------ | ------ |
| Extension: | [<img  src="https://addons.cdn.mozilla.net/static/img/addons-buttons/AMO-button_2.png">](https://addons.mozilla.org/en-US/firefox/addon/hybridtvviewer/) | no free publishing.<br>See dev install in [wiki](https://github.com/karl-rousseau/HybridTvViewer/wiki/HowTo) | no support for [Web Extensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) yet |

Please note that not all video codecs are recognized in current (i.e. 2019) browsers:

| Browser: | Mozilla Firefox (V57+) | Google Chrome | Apple Safari |
| -------- | -------- | ------ | ------ |
| Codec [H.264](https://caniuse.com/#feat=mpeg4): | yes (embedded plugin by Cisco) | yes | yes |
| Codec [H.265](https://caniuse.com/#feat=hevc): | no (not free license) | [yes here](https://github.com/henrypp/chromium/releases) (win10+) | yes (MacOS 10.13+) |

If you need to create your own video stream (within TS or DASH container), I suggest you the well-known [FFMPEG](https://www.ffmpeg.org/) and [MP4BOX](https://gpac.wp.imt.fr/mp4box/) tools.

## Screenshot

![](img/screenshot_popup.png)

## Features

| Feature            | Description |
| ------------------ | ----------- |
| auto-detection     | an analysis of HTTP server headers plus inside HTML header & meta tags is performed |
| forced detection   | user on-clicked power button ![](https://www.iconfinder.com/icons/1608429/download/png/16) will force or disable iTV emulation (auto-saved in web extension local storage) |
| bottom bar  | underneath the screen rendering, the emulator is providing some buttons (colored keys, resolutions for zoomed rendering, ...) |
| iDTV customization | the extension enables customization of various parameters (user-agent, OIPF capabilities, country, CAS id, DVB channels, ...) |
| external inputs | it handles some external inputs such as CI+ APDU reply message, Stream-Event content customization & triggering, DVB channels with customized LCN, ... |
| video support | it handles the rendering of browser unrecognized broadcast video stream: Mpeg-TS and Mpeg-DASH (with the help of external libraries) |

## Usage

You can use the arrow keys <kbd>&leftarrow;</kbd>,<kbd>&rightarrow;</kbd>,<kbd>&uparrow;</kbd>,<kbd>&downarrow;</kbd>, <kbd>enter</kbd> and <kbd>backspace</kbd> keys to navigate inside the emulated iTV application.  
Colored keys are also mapped to <kbd>R</kbd>, <kbd>G</kbd>, <kbd>B</kbd> and <kbd>Y</kbd> keyboard keys.

For more info, have a look at the [Wiki](https://github.com/karl-rousseau/HybridTvViewer/wiki/HowTo) page.

## Examples

The purpose of this extension is mainly to validate the **MIT-xperts test suite** under CHROME and FIREFOX.  
Here are some example URLs that have been extracted from various sources:

| Name          | Source | URL |
| ------------- | ------ |---- |
| MIT-xperts HbbTV test suite | DTT & DVB-S [TS stream](https://github.com/mitxp/HbbTV-Testsuite/wiki) | http://itv.mit-xperts.com/hbbtvtest/ |
| ARTE HbbTV    | French DTT TS | http://www.arte.tv/hbbtvv2/index.html |
| ARTE CE-HTML  | Philips iDTV portal | http://cehtml.arte.tv/de/2764896.cehtml |
| ...           | Catalog (with dead ones) | http://urju.de/hbbtv/ |

If you want to create your own [HbbTV](https://www.hbbtv.org) application, you can start with such code:
```html
<!DOCTYPE html PUBLIC "-//HbbTV//1.1.1//EN" "http://www.hbbtv.org/dtd/HbbTV-1.1.1.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head>
<title>My 1st HbbTV app</title>
<meta http-equiv="Content-Type" content="application/vnd.hbbtv.xhtml+xml; charset=UTF-8" />
<meta http-equiv="pragma" content="no-cache" />
<style>* { margin:0; padding:0; background-repeat:no-repeat; font-family:"Tiresias Screenfont",sans-serif; }
#broadcast { position:absolute; top:0; left:0; width:1280px; height:720px; }
#title { position:absolute; top:200px; left:200px; width:100px; height:99px; font-size:32px; color:red; }</style>
<script type="text/javascript">
//<![CDATA[
window.onload = function() {
  var app = document.getElementById('oipfAppMan');
  if (app && app.getOwnerApplication) app = app.getOwnerApplication(document);
  if (app && app.show) app.show(); // needed to show the HbbTV app on screen
  if (app && app.activate) app.activate();
  if (app && app.privateData) app.privateData.keyset.setValue(0x11f);
  window.addEventListener('keydown', function() { // needed for HbbTV 2.0+
    if (!this._done && navigator.userAgent.test(/HbbTV\/1\.([3-9])\.1/g)) {
      this._done=true;
      app.privateData.keyset.setValue(0x11f);
      console.log('HbbTV2 special keys activated');
    }
  }.bind(this), false);
  window.focus();
  // Here is you app code ...
  document.getElementById('title').textContent = 'Hello from HbbTV';
};
//]]>
</script>
</head><body>
<object id="broadcast" type="video/broadcast"></object>
<object id="oipfAppMan" type="application/oipfApplicationManager" style="width:0; height:0;"></object>
<object id="oipfConfig" type="application/oipfConfiguration" style="width:0; height:0;"></object>

<div id="title"></div>
</body></html>
```
Please note that there are more information on the [Wiki page](https://github.com/karl-rousseau/HybridTvViewer/wiki/HowTo).  
You can also check your page validity content on this [HbbTV validator](http://hbbtv-live.irt.de/validator/).  
I also recommend you the [BBC Tal framework](http://www.bbc.co.uk/opensource/projects/TAL) which handles HbbTV devices through configuration files.

## Dependencies

This project is not modifying those libraries and only doing a dynamic dependency call at runtime on their CDN releases.
- [DASH.js 2.0](https://github.com/Dash-Industry-Forum/dash.js): reference client to decode DASH manifest files and provide DASH segments to HTML5 EME video player
  * Copyright 2015 Dash Industry Forum with BSD license
- [MUX.js](https://github.com/videojs/mux.js): useful library to transmux Mpeg-TS to MP4 on the fly
  * Copyright 2015 Brightcove with APACHE 2.0 license

## Abbreviations

- iTV: Interactive TeleVision
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
- EIT: Event Information Table (can be **P**resent / **F**ollowing / **Sch**edule events)
- LCN: Logical Channel Number (using 3 or 4 digits)

## References

- MHP (Multimedia Home Platform) : Based on SUN JAVA technology working on [GEM-MHP](https://en.wikipedia.org/wiki/Globally_Executable_MHP) middleware
  * initialy defined by [ETSI TS 101 812](http://www.etsi.org/deliver/etsi_ts/101800_101899/101812/01.02.01_60/ts_101812v010201p.pdf) documentation
- **HbbTV** (Hybrid Broadband Broadcast TeleVision) :
  * defined by current [ETSI TS 102 796 V1.3.1](http://www.etsi.org/deliver/etsi_ts/102700_102799/102796/01.03.01_60/ts_102796v010301p.pdf) specifications (aka HbbTV V2.0)
    * bringing **HTML5 video tag** notation within [HbbTV V2.0 only](https://www.hbbtv.org/resource-library/#specifications)
  * following old MHP AITX structure
  * handling some CEA-2014 notations
  * implementing a subset of OIPF objects (with optional ones: +PVR +DL ...)
  * replacing device manufacturer's portal using [OpApps TS 103 606](https://www.hbbtv.org/resource-library/specifications/#spec-operator-applications-opapps) features
- OHTV (Open Hybrid TV) : similar to HbbTV and used for example at [iCON TV](http://able.kbs.co.kr/enter/tal_view.php?mseq=16&pcg=&pgseq=&no=270211) in KOREA by the national broadcaster *KBS* since 2010. Since 2016, it is now named IBB (Integrated Broadcast Broadband) defined by [ITU-R BT.2267-6](https://www.itu.int/dms_pub/itu-r/opb/rep/R-REP-BT.2267-6-2016-PDF-E.pdf)
- BML (Broadcast Markup Language) : similar to HbbTV and defined by ARIB STD B-24 standard used in JAPAN over ISDB-T broadcasted channels like [*NHK*](https://www.nhk.or.jp/strl/publica/bt/en/fe0003-1.html)
- CE-HTML (Consumer Electronics HTML) : nowadays less used and only found on old devices.
- OIPF (Open IPTV Forum) : used on some STB. Since 2014 activities have been transfered to HbbTV association.
- **ATSC** (Advanced Television Systems Committee) : broadcast standard in USA where [ATSC V3](https://www.atsc.org/standards/atsc-3-0-standards/) follows HbbTV V2
- [OpenCaster](https://github.com/aventuri/opencaster) : if you want to broadcast your application using an USB modulator (such as next Hides Inc one), you can package your TS file and broadcast it using this free software.
- [Hides Inc](http://www.hides.com.tw/product_opencaster_eng.html) : this company is selling an USB DVB-T modulator named UT-100C.
