require('./stub/domMock.js');

var hbbtv = require('../js/hbbtv.js');
var should = require('should'); // see: http://unitjs.com/guide/should-js.html

describe('oipfApplicationManager', function() {

    it('declare an oipfApplicationManager object', function() {
        var result = window && window.oipfApplicationManager;
        result.should.be.an.instanceOf(Object);
    });

    it('provide a onLowMemory method', function() {
        var result = window && window.oipfApplicationManager && window.oipfApplicationManager.onLowMemory;
        result.should.be.a.Function;
    });

    it('provide a getOwnerApplication method', function() {
        var result = window && window.oipfApplicationManager && window.oipfApplicationManager.getOwnerApplication;
        result.should.be.a.Function;
    });

    it('provide a getOwnerApplication method which returns an application class', function() {
        var result = window && window.oipfApplicationManager && window.oipfApplicationManager.getOwnerApplication();
        result.should.be.an.instanceOf(Object);
    });

    it('declare an oipf application class', function() {
        var result = window && window.Application;
        result.should.be.an.instanceOf(Object);
    });



});
