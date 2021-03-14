require('./stub/domMock.js');

var hbbtv = require('../js/hbbtv.js');
var should = require('should'); // see: http://unitjs.com/guide/should-js.html

describe('oipfObjectFactory', function() {

    it('declare an oipfObjectFactory object', function() {
        var result = window && window.oipfObjectFactory;
        // var expected = {};
        // expected.isObjectSupported = function(mimeType) {};
        // expected.createVideoBroadcastObject = function() {};
        // expected.createVideoMpegObject = function() {};
        // expected.onLowMemory = function() {};
        // var expected = {
        //     isObjectSupported: function isObjectSupported(mimeType) {},
        //     createVideoBroadcastObject: function createVideoBroadcastObject() {},
        //     createVideoMpegObject: function createVideoMpegObject() {},
        //     onLowMemory: function onLowMemory() {}
        // };
        //result.should.eql(expected);
        result.should.be.an.instanceOf(Object);
    });

    it('provide a method isObjectSupported', function() {
        var result = window && window.oipfObjectFactory;
        result.should.have.property('isObjectSupported');
    });

    it('provide a method createVideoBroadcastObject', function() {
        var result = window && window.oipfObjectFactory;
        result.should.have.property('createVideoBroadcastObject');
    });

    it('support BROADCAST video type', function() {
        var result = window && window.oipfObjectFactory && window.oipfObjectFactory.isObjectSupported('video/broadcast');
        result.should.be.true;
    });

    it('support BROADBAND mpeg video type', function() {
        var result = window && window.oipfObjectFactory && window.oipfObjectFactory.isObjectSupported('video/mpeg');
        result.should.be.true;
    });

    it('provide a BROADCAST video object factory method', function() {
        var result = window && window.oipfObjectFactory && window.oipfObjectFactory.createVideoBroadcastObject;
        result.should.be.an.instanceOf(Object);
    });

    it('return a BROADCAST video object factory method with the wanted object', function() {
        var result = window && window.oipfObjectFactory && window.oipfObjectFactory.createVideoBroadcastObject();
        result.should.have.properties({ type: 'video/broadcast' });
    });

    it('provide a BROADBAND mpeg video object factory method', function() {
        var result = window && window.oipfObjectFactory && window.oipfObjectFactory.createVideoMpegObject;
        result.should.be.an.instanceOf(Object);
    });

    it('return a BROADBAND mpeg video object factory method with the wanted object', function() {
        var result = window && window.oipfObjectFactory && window.oipfObjectFactory.createVideoMpegObject();
        result.should.have.properties({ name: 'VideoMpegObject' });
    });

});
