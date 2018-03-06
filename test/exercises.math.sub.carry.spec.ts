import { assert, expect } from 'chai';
import { ExerciseMath, ExerciseType } from '../src/exercises.math';
import { makeSet, sub_carry } from '../src/exercises.math';

/**
 * Test Subtraction with Carry
 * 
 *  
 */
describe('Subtraction with Carry', function () {

    it('should generate 1 Subtraction with Carry ', function (done) {
        const opts: ExerciseType = {
            quantity: 1,
            level: 3,
            operations: ['sub'],
            operands: [
                { exactMatchOf: 9903 },
                { exactMatchOf: 8195 }
            ]
        };
        const maskedCarryStr = '-  __ ';
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    const result = exercises[e][f].get();
                    const actual = result[result.length - 2];
                    const value = result[result.length - 1];

                    assert.equal('0,1,1,0', exercises[e][f].extensions[0].carry.toString());
                    assert.equal(4, result.length);
                    assert.isTrue(typeof actual === 'string');
                    assert.equal(actual, maskedCarryStr);
                    assert.equal('  ____', value);
                    assert.equal(actual.length, value.length);
                    assert.equal(actual.length, result[0].length);
                }
            }
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

    it('regression test 7413 - 415 should generate maskedCarryStr 1110', function (done) {
        const opts: ExerciseType = {
            quantity: 1,
            level: 3,
            operations: ['sub'],
            operands: [
                { exactMatchOf: 7413 },
                { exactMatchOf: 415 }
            ]
        };
        const maskedCarryStr = '- ___ ';
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    const result = exercises[e][f];
                    const ext = result.extensions[0].carry;
                    assert.equal('1,1,1,0', ext.toString());
                    
                    const value = result.expression.value;
                    assert.equal(6998, value);
                    
                    const resultStr = result.get();
                    assert.equal(4, resultStr.length);
                    assert.equal(resultStr[2], maskedCarryStr);
                }
            }
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

    it('regression test 100 - 95 should generate maskedCarryStr 110', function (done) {
        const opts: ExerciseType = {
            quantity: 1,
            level: 3,
            operations: ['sub'],
            operands: [
                { exactMatchOf: 100 },
                { exactMatchOf: 95 }
            ]
        };
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    const result = exercises[e][f];
                    const value = result.expression.value;
                    assert.equal(5, value);

                    const resultStr = result.get();
                    assert.equal(4, resultStr.length);

                    const ext = result.extensions;
                    assert.equal('1,1,0', ext[0].carry.toString());
                    assert.equal(resultStr[2], '- __ ');
                }
            }
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

    it('regression test 4252 - 929 should generate maskedCarryStr 0110', function (done) {
        const opts: ExerciseType = {
            quantity: 1,
            level: 3,
            operations: ['sub'],
            operands: [
                { exactMatchOf: 4252 },
                { exactMatchOf: 928 }
            ]
        };
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    const result = exercises[e][f];
                    const resultStr = result.get();
                    const value = result.expression.value;
                    assert.equal(3324, value);
                    assert.equal(4, resultStr.length);
                    assert.equal(resultStr[2], '- _ _ ');
                }
            }
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

});
