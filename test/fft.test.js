'use strict';
/*jshint node:true, expr:true, mocha:true*/

var expect = require('chai').expect;

var fft = require('../lib/fft.js');

describe('fft', function() {
    
    function createTestData( ) {
        var n = 8;
        var dt = (2.0 * Math.PI)/( n / 2.0);
        var t = 0.0;
        var i;
        var data = new Array(2 * n + 1);

        data.fill(0.0);

        for(i=1; i<data.length/2; i+=2) {
            data[i] = 0.0 + Math.sin(t);
            console.log(data[i]);
            t += dt;
        }
        return data;
    }

    it('should be an object', function() {
        expect(fft).to.be.an('object');

        expect(fft).to.have.ownProperty('transform');
        expect(fft.transform).to.be.a('function');
        expect(fft).to.have.ownProperty('inverse');
        expect(fft.inverse).to.be.a('function');
    });

    describe('#transform', function() {
        var data = createTestData();
        var expected = data.slice(0);
        var transformed;
        var inverse;

        before(function() {
            console.log('original:' + JSON.stringify(expected));
            transformed = fft.transform(data).slice(0);
            console.log('transformed:' + JSON.stringify(transformed));
            inverse = fft.inverse(transformed).slice(0);
            console.log('inverted:' + JSON.stringify(inverse));
        });

        it('should return the expected transformed data', function() {
            expect(expected).to.be.eql(inverse);
        });
    });

    describe('#inverse', function() {
        var data = [];
        var inverted;

        before(function() {
            //inverted = fft.inverse(data);
        });

        it('should return the expected inverse transform data', function() {
            expect(true).to.be.false;
        });
    });
});

