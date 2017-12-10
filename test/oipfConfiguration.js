require('./stub/domMock.js');

var hbbtv = require('../js/hbbtv.js');
var should = require('should'); // see: http://unitjs.com/guide/should-js.html

describe('oipfConfiguration', function() {

    it('declare an oipfConfiguration object', function() {
        var result = window && window.oipfConfiguration;
        result.should.be.an.instanceOf(Object);
    });

    it('provide a configuration attribute', function() {
        var result = window && window.oipfConfiguration.configuration;
        result.should.be.an.instanceOf(Object);
    });

    it('provide a preferredAudioLanguage field', function() {
        var result = window && window.oipfConfiguration.configuration.preferredAudioLanguage;
        result.should.be.a.String;
    });

    it('provide a preferredSubtitleLanguage field', function() {
        var result = window && window.oipfConfiguration.configuration.preferredSubtitleLanguage;
        result.should.be.a.String;
    });

    it('provide a preferredUILanguage field', function() {
        var result = window && window.oipfConfiguration.configuration.preferredUILanguage;
        result.should.be.a.String;
    });

    it('provide a countryId field', function() {
        var result = window && window.oipfConfiguration.configuration.countryId;
        result.should.be.a.String;
    });

    it('provide a getter getText()', function() {
        var result = window && window.oipfConfiguration && window.oipfConfiguration.getText;
        result.should.be.a.Function;
    });

    it('provide a setter setText()', function() {
        var result = window && window && window.oipfConfiguration && window.oipfConfiguration.setText;
        result.should.be.a.Function;
    });

});
