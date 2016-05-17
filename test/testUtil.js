'use strict';
/*jshint node:true, expr:true, mocha:true*/

var chai = require('chai');

chai.Assertion.addMethod('eqlWithinError', function(value, delta, msg){
    if (msg) chai.util.flag(this, 'message', msg);
    var obj = chai.util.flag(this, 'object');
    var start = value-delta;
    var finish = value + delta;
    var range = start + '..' + finish;
    if (chai.util.flag(this, 'doLength')) {
        new chai.Assertion(obj, msg).to.have.property('length');
        var len = obj.length;
        this.assert(
            len >= start && len <= finish,
                'expected #{this} to have a length within ' + range,
                'expected #{this} to not have a length within ' + range
        );
    } else {
        this.assert(
            obj >= start && obj <= finish,
                'expected #{this} to be within ' + range,
                'expected #{this} to not be within ' + range
        );
    }
});

