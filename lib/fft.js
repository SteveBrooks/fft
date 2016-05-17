'use strict';
/*jshint node:true, expr:true*/

var Complex = require('../lib/complex.js');

function transform(data) {
    return fft(data, 1);
}

function inverse(data) {
    return fft(data, -1);
}

function fft(data, iSign) {
    var nn = (data.length-1) / 2;
    var n = nn << 1;

    // data = Complex(),Complex(),...

    function bitReverse() {
        var i;
        var j = 1;
        var m;

        function swap(x,y) {
            var temp;
            temp = data[y];
            data[y] = data[x];
            data[x] = temp;
        }

        for(i=1; i<n; i++) {
            if(j > i) {
                swap(j,i);
            }
            m = (n >> 1);
            while((m >= 2) && (j > m)) {
                j -= m;
                m >>= 1;
            }
            j += m;
        }
    }

    function danielsonLanczos() {
        var i, j, m, iStep, mmax, theta, wtemp, wpr, wpi, wr, wi, tempr, tempi;

        mmax = 2;
        while(n > mmax) {
            iStep = mmax << 1;
            theta = iSign * (2.0 * Math.PI / mmax);
            wtemp = Math.sin(0.5 * theta);
            wpr = -2.0 * wtemp * wtemp;
            wpi = Math.sin(theta);
            wr = 1.0;
            wi = 0.0;

            for(m=1; m<mmax; m++) {
                for(i=m; i<=n; i+=iStep) {
                    j = i + mmax;
                    tempr = wr*data[j].re - wi*data[j].im;
                    tempi = wr*data[j].im + wi*data[j].re;
                    data[j].re = data[i].re - tempr;
                    data[j].im = data[i].im - tempi;
                    data[i].re += tempr;
                    data[i].im += tempi;
                }
                wtemp = wr;
                wr = wr*wpr-wi*wpi+wr;
                wi = wi*wpr+wtemp*wpi+wi;
            }
            mmax = iStep;
        }
    }

    function normalize() {
        var i;
        var n = (data.length - 1) / 2.0;
        for(i=1; i<n; i+=2) {
            data[i].re /= n;
            data[i].im /= n;
        }
    }

    bitReverse();
    danielsonLanczos();
    if(iSign === -1) {
        normalize();
    }
    return data;
}

module.exports = {
    transform: transform,
    inverse: inverse
};


