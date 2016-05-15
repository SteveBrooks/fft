'use strict';
/*jshint node:true, expr:true, mocha:true*/

var expect = require('chai').expect;

var testUtil = require('./testUtil.js');

var fft = require('../lib/fft.js');

describe('fft', function() {

    function createTestData( ) {
        var n = 8;
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
        data[3] = 1;
        data[5] = 2;
        data[7] = 3;
        data[9] = 4;
        data[11] = 5;
        data[13] = 6;
        data[15] = 7;
        return data;
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
            expect(d2[index]).to.be.eqlWithinError(e1, delta);
        });
    }

    describe('#transform', function() {
        var data = createTestData();
        var transformed;
        var inverse;

        describe('Given the transform of data', function() {
            before(function() {
               transformed = fft.transform(data).slice(0);
           });

            it('should have the expected mirrored frequency structure', function() {
                var n = (data.length-1)/2;
                var expectedIntervals = n / 2;
                var start = 3;
                var i, expected, test, testIndex;
                var r0, i0, r1, i1, m0, m1;

                for(i=start;i<=expectedIntervals; i+=2) {
                    // (r0,i0) = -(r1,i1)
                    r0 = transformed[i];
                    i0 = transformed[i+1];
                    r1 = transformed[data.length-i+start-2];
                    i1 = transformed[data.length-i+start-1];

                    // assert the magnitudes are equal
                    m0 = Math.sqrt(r0*r0+i0*i0);
                    m1 = Math.sqrt(r1*r1+i1*i1);
                    expect(m0).to.be.eqlWithinError(m1, 1E-10);
                }
            });
        });
    });

    describe('#inverse', function() {
        var data = createTestData2();
        var expected = data.slice(0);
        var transformed;
        var inverse;

        describe('Given the inverse of transformed data', function() {
            before(function() {
                transformed = fft.transform(data).slice(0);
                inverse = fft.inverse(transformed).slice(0);
            });

            it('should match the original data within 1E-12', function() {
                assertArraysMatchWithin(expected, inverse, 1E-12);
            });
        });
    });
});

