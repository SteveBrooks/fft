'use strict';
/*jshint node:true, expr:true*/

//var fft = function fft() {

    function transform(data) {
        return nrfft(data, 1);
    }

    function inverse(data) {
        return nrfft(data, -1);
    }

    function nrfft(data, iSign) {
        var nn = data.length / 2;
        var n = nn << 1;

        // data = (R1,I1),(R2,I2),(R3,I3)... 
        // Real components in (1,3,5,...),
        // Imaginary components in (2,4,6,...).

        function orderComplexPairs() {
            var i;
            var j = 1;
            var n;
            var m;

            function swap(i,j) {
                var temp;
                temp = data[j];
                data[j] = data[i];
                data[i] = temp;
            }

            for(i=1; i<n; i+=2) {
                if(j > i) {
                    // Swap real part
                    swap(i,j);
                    // Swap imaginary part
                    swap(i+1, j+1);
                }
                m = n >> 1;
                while((m>=2) && (j>m)) {
                    j -= m;
                    m >>= 1;
                }
                j += m;
            }
        }

        function danielsonLanczos() {
            var i;
            var j;
            var m;
            var iStep;
            var mmax;
            var theta;
            var wtemp;
            var wpr;
            var wpi; 
            var wr;
            var wi;
            var tempr;
            var tempi;

            mmax = 2;
            while(n>mmax) {
                iStep = mmax << 1;
                theta = iSign * (2.0 * Math.PI / mmax);
                wtemp = Math.sin(0.5 * theta);
                wpr = -2.0 * wtemp * wtemp;
                wpi = Math.sin(theta);
                wr = 1.0;
                wi = 0.0;

                for(m=1; m<mmax; m+=2) {
                    for(i=m; i<=n; i+=iStep) {
                        j = i + mmax;
                        tempr = ( wr*data[j] - wi*data[j+1] );
                        tempi = ( wr*data[j+1] + wi*data[j] );
                        data[j] = data[i] - tempr;
                        data[j+1] = data[i+1] - tempi;
                        data[i] += tempr;
                        data[i+1] += tempi;
                    }
                    wtemp = wr;
                    wr = wtemp*wpr-wi*wpi+wr;
                    wi = wi*wpr+wtemp*wpi+wi;
                }
                mmax = iStep;
            }
        }

        function normalize() {
            var i;
            var N = (data.length / 2.0) - 1.0;
            for(i=1; i<data.length/2; i+=2) {
                data[i] /= N;
            }
        }

        orderComplexPairs();
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
//};


