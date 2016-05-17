'use strict';
/*jshint node:true, expr:true, mocha:true*/

var expect = require('chai').expect;

var testUtil = require('./testUtil.js');

describe('testUtil', function() {
    describe('#eqlWithinError', function() {

        describe('positive tests', function() {
            [2,3,4,5,6].forEach(function(testCase){
                it('should assert true when value is within expected plus or minus error', function() {
                    expect(testCase).to.be.eqlWithinError(4,2,'oops');
                });
                it('should assert true when length is within expected plus or minus error', function() {
                    expect(new Array(testCase)).to.have.length.eqlWithinError(4,2,'oops');
                });
            });
        });

        describe('negative tests', function() {
            [-1,0,1,7,8,9].forEach(function(testCase){
                it('should assert false when value is not within expected plus or minus error', function() {
                    expect(function(){
                        expect(testCase).to.be.eqlWithinError(4,2);
                    }).to.throw();
                });
                it('should assert false when length is not within expected plus or minus error', function() {
                    expect(function(){
                        expect(new Array(testCase)).to.have.length.eqlWithinError(4,2);
                    }).to.throw();
                });
            });
        });
    });
});
