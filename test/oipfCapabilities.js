require('./stub/domMock.js');

var hbbtv = require('../js/hbbtv.js');
var should = require('should'); // see: http://unitjs.com/guide/should-js.html

describe('oipfCapabilities', function() {

    it('declare an oipfCapabilities object', function() {
        var result = window && window.oipfCapabilities;
        result.should.be.an.instanceOf(Object);
    });

    it('provide an oipfCapabilities object with hasCapability()', function() {
        var result = window && window.oipfCapabilities && window.oipfCapabilities.hasCapability;
        result.should.be.be.a.Function;
    });

    it.skip('provide an oipfCapabilities object with hasCapability() returning an object', function() {
        var result = window && window.oipfCapabilities && window.oipfCapabilities.hasCapability('+DRM');
        result.should.be.be.a.Boolean;
    });


});
