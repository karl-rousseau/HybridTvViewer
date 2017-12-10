require('./stub/domMock.js');

var hbbtv = require('../js/hbbtv.js');
var should = require('should'); // see: http://unitjs.com/guide/should-js.html

describe('hbbtv.js', function() {
    beforeEach(function() {
        //console.log('');

        // global.window.localStorage = (function() {
        //     var storage = {};
        //     return {
        //         setItem: function(key, value) {
        //             storage[key] = value || '';
        //         },
        //         getItem: function(key) {
        //             return key in storage ? storage[key] : null;
        //         },
        //         removeItem: function(key) {
        //             delete storage[key];
        //         },
        //         get length() {
        //             return Object.keys(storage).length;
        //         },
        //         key: function(i) {
        //             var keys = Object.keys(storage);
        //             return keys[i] || null;
        //         }
        //     };
        // })();
    });

    it('declare an oipf object', function() {
        var result = window && window.oipf;
        result.should.be.an.instanceOf(Object);
    });


    it('provide an oipf channelList object (from DVB SD&S information)', function() {
        var result = window && window.oipf && window.oipf.channelList;
        result.should.be.an.instanceOf(Object);
    });

    it('provide an oipf channelList object with a getChannel() method', function() {
        var result = window && window.oipf && window.oipf.channelList.getChannel;
        result.should.be.a.Method;
    });

    it('provide an oipf channelList object with getChannel() method returning an object', function() {
        var result = window && window.oipf && window.oipf.channelList.getChannel(0);
        result.should.be.type('object');
    });

    it('provide an oipf object with a getCurrentTVChannel() method', function() {
        var result = window && window.oipf && window.oipf.getCurrentTVChannel;
        result.should.be.a.Method;
    });

    it('provide an oipf object with a getCurrentTVChannel() method returning an object', function() {
        var result = window && window.oipf && window.oipf.getCurrentTVChannel();
        result.should.be.type('object');
    });

    it('provide an oipf object with a programmes structure', function() {
        var result = window && window.oipf && window.oipf.programmes;
        result.should.be.an.instanceOf(Array);
    });

    it('provide an oipf object with a programmes with EIT presend and following events', function() {
        var result = window && window.oipf && window.oipf.programmes.length;
        result.should.be.equal(2);
    });

});
