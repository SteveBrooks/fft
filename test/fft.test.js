'use strict';
/*jshint node:true, expr:true, mocha:true*/

var expect = require('chai').expect;

var testUtil = require('./testUtil.js');
var Complex = require('../lib/complex.js');
var fft = require('../lib/fft.js');

describe('fft2', function() {

    function createTestData( ) {
        var n = 4;
        var dt = 4 * Math.PI/n;
        var t = 0.0;
        var i;
        var data = new Array(2 * n + 1);

        data.fill(Complex());

        for(i=1; i<(data.length-1)/2; i++) {
            data[i] = Complex(Math.sin(t),0);
            t += dt;
        }
        return data;
    }

    function createTestData1( ) {
        var n = 256;
        var dt = 4 * Math.PI/n;
        var t = 0.0;
        var i;
        var data = new Array(2 * n + 1);

        data.fill(Complex());

        for(i=1; i<(data.length-1)/2; i++) {
            data[i] = Complex(Math.sin(2*t)+Math.sin(3*t/2),0);
            t += dt;
        }
        return data;
    }

    function createTestData2( ) {
        var i,n = 8;
        var data = new Array(2 * n + 1);
        data.fill(Complex());
        for(i=1; i<=n; i++) {
            data[i] = Complex(i,0);
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

    function assertArraysMatchWithin(d1, d2, delta) {
        expect(d1.length).to.be.eql(d2.length);
        d1.forEach(function(e1, index) {
            expect(d2[index].re).to.be.eqlWithinError(e1.re, delta);
            expect(d2[index].im).to.be.eqlWithinError(e1.im, delta);
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
                var expectedIntervals = n;
                var start = 2;
                var i, expected, test, testIndex;
                var z0, z1;


                for(i=start;i<=expectedIntervals; i++) {
                    z0 = transformed[i];
                    z1 = transformed[data.length-i+start-1];
                    expect(z0.abs()).to.be.eqlWithinError(z1.abs(), 1E-10);
                }
            });
        });
    });

    describe('Given a function consisting of two sinusoidal functions', function() {
        var data;
        var spectrum = [];
        before(function() {
            data = fft.transform(createTestData1()).slice(0);
            powerSpectrum(data);
        });

        function powerSpectrum(d) {
            var i, N = (d.length-1)/2;
            for(i=2; i<=N; i++) {
                d[i].divide(d[1]);
                //console.log(i, d[i].toString(2));
            }
            d[1].divide(d[1]);
            //console.log(1, d[1].toString(2));
            
            for(i=2; i<=N; i++) {
                spectrum.push(d[i].abs());
            }
        }

        it('should return the expected power spectrum', function() {
            spectrum.forEach(function(s,i){
                console.log(i, s);
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

