'use strict';
/*jshint node:true, expr:true*/

function Complex(a,b) {
    if(this === undefined) {
        return new Complex(a,b);
    }
    this.re = validate(a, 'Real');
    this.im = validate(b, 'Imaginary');

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function validate(x,m) {
        if(x === undefined) {
            x = 0;
        } else if (!isNumeric(x)) {
            throw new Error(m + ' input is NAN');
        }
        return x;
    }

    function isComplex(c) {
        return (typeof c === 'object') &&
           c.hasOwnProperty('re') &&
           c.hasOwnProperty('im');
    }

    function validateComplex(c) {
        if(!isComplex(c)) {
            throw new Error('Parameter is not Complex');
        }
    }

    Complex.prototype.toString = function toString(dec) {
        if(dec) {
            return '('+this.re.toFixed(dec)+','+this.im.toFixed(dec)+')';
        }
        return '('+this.re+','+this.im+')';
    };

    Complex.prototype.conjugate = function conjugate() {
        return new Complex(this.re, -this.im);
    };

    Complex.prototype.add = function add(c) {
        validateComplex(c);
        this.re += c.re;
        this.im += c.im;
        return this;
    };

    Complex.prototype.subtract = function subtract(c) {
        validateComplex(c);
        this.re -= c.re;
        this.im -= c.im;
        return this;
    };

    Complex.prototype.multiply = function multiply(c) {
        validateComplex(c);
        var r = this.re * c.re - this.im * c.im;
        var i = this.im * c.re + this.re * c.im;
        this.re = r;
        this.im = i;
        return this;
    };

    Complex.prototype.divide = function multiply(c) {
        validateComplex(c);
        var d = (c.re * c.re + c.im * c.im);
        var r = (this.re * c.re + this.im * c.im) / d;
        var i = (this.im * c.re - this.re * c.im) / d;
        this.re = r;
        this.im = i;
        return this;
    };

}

module.exports = Complex;
