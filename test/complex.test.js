'use strict';
/*jshint node:true, expr:true, mocha:true*/

var chai = require('chai');
var expect = chai.expect;

var Complex = require('../lib/complex.js');

describe('Complex', function() {

    describe('construction', function() {

        it('should construct as a function', function() {
            var c = Complex();
            expect(c).to.be.an('object');
            expect(c.re).to.be.eql(0);
            expect(c.im).to.be.eql(0);
        });

        it('should construct as an object', function() {
            var c = Complex();
            expect(c).to.be.an('object');
            expect(c.re).to.be.eql(0);
            expect(c.im).to.be.eql(0);
        });

        it('should be 0+0i by default', function() {
            var c = new Complex();
            expect(c).to.be.an('object');
            expect(c.re).to.be.eql(0);
            expect(c.im).to.be.eql(0);
        });

        it('should return the provided inputs', function() {
            var c = new Complex(1,2);
            expect(c.re).to.be.eql(1);
            expect(c.im).to.be.eql(2);
        });

        it('should throw for non-numeric real input', function() {
            expect(function() {
                new Complex('x', 0);
            }).to.throw(/Real input is NAN/);
        });

        it('should throw for non-numeric imaginary input', function() {
            expect(function() {
                new Complex(0, 'x');
            }).to.throw(/Imaginary input is NAN/);
        });
    });

    describe('properties', function() {
        var c = new Complex();
        it('should have a re property', function() {
            expect(c).to.have.ownProperty('re');
            expect(c.re).to.be.a('number');
        });
        it('should have an im property', function() {
            expect(c).to.have.ownProperty('im');
            expect(c.im).to.be.a('number');
        });
    });

    function expectFunction(func){
        var c = new Complex();
        it('should have a ' + func + 'function', function() {
            expect(c).to.respondTo(func);
            expect(c[func]).to.be.a('function');
        });
    }

    describe('#toString', function() {
        var c = new Complex(1,1);

        expectFunction('toString');

        it('should return the expected default string', function() {
            expect(c.toString()).to.be.eql('(1,1)');
        });
        it('should return the expected formatted string', function() {
            expect(c.toString(2)).to.be.eql('(1.00,1.00)');
        });
    });

    describe('#conjugate', function() {
        var c = new Complex(10,20);

        expectFunction('conjugate');

        it('should return the expected value for the conjugate', function() {
            var cbar = c.conjugate();
            expect(cbar.re).to.be.eql(c.re);
            expect(cbar.im).to.be.eql(-c.im);
        });
    });

    describe('#abs', function() {
        var c = new Complex(1,2);

        expectFunction('abs');

        it('should return the expected value for abs', function() {
            var c0 = c.abs();
            expect(c0).to.be.eql(Math.sqrt(c.re*c.re + c.im*c.im));
        });
    });

    describe('#arg', function() {

        expectFunction('arg');

        [
            {test:Complex( 1, 1), result:Math.atan(1)},
            {test:Complex(-1, 1), result:(Math.atan(-1)+Math.PI)},
            {test:Complex(-1,-1), result:(Math.atan(1)-Math.PI)},
            {test:Complex( 0, 1), result:(Math.PI/2.0)},
            {test:Complex( 0,-1), result:(-Math.PI/2.0)},
        ].forEach(function(testCase) {
            it('should return the expected value for '+testCase.test.toString()+'.arg() to be '+testCase.result, function() {
                var arg = testCase.test.arg();
                expect(arg).to.be.eqlWithinError(testCase.result,1E-9);
            });
        });

        it('should return the expected value for (0,0).arg() to be undefined', function() {
            expect(Complex(0,0).arg()).to.be.undefined;
        });
    });

    describe('#add', function() {
        var c1 = new Complex(1,2);
        var c2 = new Complex(3,4);

        expectFunction('add');

        it('should return the complex sum', function() {
            var c3 = c1.add(c2);
            expect(c3.re).to.be.eql(4);
            expect(c3.im).to.be.eql(6);
        });

        it('should throw for an invalid addend', function() {
            expect(function(){
                c1.add('x');
            }).to.throw(/Parameter is not Complex/);
        });
    });

    describe('#subtract', function() {
        var c1 = new Complex(5,4);
        var c2 = new Complex(3,4);

        expectFunction('subtract');

        it('should return the complex difference', function() {
            var c3 = c1.subtract(c2);
            expect(c3.re).to.be.eql(2);
            expect(c3.im).to.be.eql(0);
        });

        it('should throw for an invalid subtrahend', function() {
            expect(function(){
                c1.subtract('x');
            }).to.throw(/Parameter is not Complex/);
        });
    });

    describe('#multiply', function() {
        var c1 = new Complex(1,2);
        var c2 = new Complex(3,4);

        expectFunction('multiply');

        it('should return the complex product for 1+2i * 2+4i', function() {
            var c3 = c1.multiply(c2);
            expect(c3.re).to.be.eql(-5);
            expect(c3.im).to.be.eql(10);
        });

        it('should return the complex product for i * i', function() {
            var c3 = Complex(0,1).multiply(Complex(0,1));
            expect(c3.re).to.be.eql(-1);
            expect(c3.im).to.be.eql(0);
        });

        it('should throw for an invalid multiplicand', function() {
            expect(function(){
                c1.multiply('x');
            }).to.throw(/Parameter is not Complex/);
        });
    });

    describe('#divide', function() {
        var c1 = new Complex(1,2);
        var c2 = new Complex(3,4);

        expectFunction('divide');

        it('should return the complex product', function() {
            var c3 = c1.divide(c2);
            expect(c3.re).to.be.eql(0.44);
            expect(c3.im).to.be.eql(0.08);
        });

        it('should throw for an invalid divisor', function() {
            expect(function(){
                c1.divide('x');
            }).to.throw(/Parameter is not Complex/);
        });
    });
});
