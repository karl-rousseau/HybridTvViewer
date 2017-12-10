const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><object id="live" type="video/broadcast"></object></body></html>');
//import xmldom from 'xmldom'; // ES6 module
const xmldom = require('xmldom');
//const { DOMParser } = xmldom;
const DOMParser = xmldom.DOMParser;
const XMLSerializer = xmldom.XMLSerializer;
//const { XMLSerializer } = xmldom;

global.window = {};
global.window.localStorage = {};
global.window.localStorage.getItem = function(key) {
    return 'true';
};
global.window.Document = dom.window.document;//{};
global.window.Document.prototype = {};
global.window.document = global.window.Document;
global.window.document.addEventListener = function() {};
global.window.addEventListener = function() {};
global.window.CSS = {};
global.window.CSS.supports = function() { return true; };
global.window.DOMParser = DOMParser;
global.window.XMLSerializer = XMLSerializer;
