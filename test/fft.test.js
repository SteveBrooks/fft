'use strict';
/*jshint node:true, expr:true, mocha:true*/

var expect = require('chai').expect;

var fft = require('../lib/fft.js');

describe('fft', function() {

    function createTestData( ) {
        var n = 16;
        var dt = 4 * Math.PI/n;
        var t = 0.0;
        var i;
        var data = new Array(2 * n + 1);

        data.fill(0.0);

        for(i=1; i<(data.length-1)/2; i+=2) {
            data[i] = Math.sin(t);
            t += dt;
        }
        return data;
    }

    function createTestData2( ) {
        var n = 8;
        var data = new Array(4 * n + 1);
        data.fill(0.0);
        data[1] = 1;
        data[5] = 1;
        data[9] = 1;
        data[13] = -3;
        return data;
    }

    function createTestData3( ) {
        var n = 8;
        var data = new Array(4 * n + 1);
        data.fill(0.0);
        data[3] = 1;
        data[5] = 2;
        data[7] = 3;
        data[9] = 4;
        data[11] = 5;
        data[13] = 6;
        data[15] = 7;
        return data;
    }

    function logData(msg,data,t) {
        function round() {
            return data.map(function(d){
                return d.toFixed(1);
            });
        }
       //console.log(msg + ':' + JSON.stringify(round()));
    }

    function power(data) {
        var i, j=0, n = (data.length-1) / 2;
        var result = new Array(n/2);
        for(i=1; i<=n; i+=2) {
            result[j] = Math.sqrt(data[i]*data[i] + data[i+1]*data[i+1]);
            j++;
        }
        return result;
    }

    it('should be an object', function() {
        expect(fft).to.be.an('object');

        expect(fft).to.have.ownProperty('transform');
        expect(fft.transform).to.be.a('function');
        expect(fft).to.have.ownProperty('inverse');
        expect(fft.inverse).to.be.a('function');
    });

    function assertArraysMatchWithin(d1, d2, delta) {
        expect(d1.length).to.be.eql(d2.length);
        d1.forEach(function(e1, index) {
            expect(Math.abs(e1 - d2[index])).to.be.below(delta, 'at index ' + index);
        });
    }

    describe('#transform', function() {
        var data = createTestData3();
        var expected = data.slice(0);
        var transformed;
        var inverse;
        var pwr;

        before(function() {
            logData('original', expected.slice(1));
            transformed = fft.transform(data).slice(0);
            logData('transformed',transformed.slice(1));
            pwr = power(transformed);
            logData('power',pwr.slice(0));
            inverse = fft.inverse(transformed).slice(0);
            logData('inverted',inverse.slice(1));
        });

        it('should return the expected transformed data', function() {
            assertArraysMatchWithin(expected, inverse, 1E-12);
        });
    });

    describe.skip('#inverse', function() {
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

