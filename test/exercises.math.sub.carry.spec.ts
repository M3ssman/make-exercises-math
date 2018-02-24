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
        const carry = '-  __ ';
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    const result = exercises[e][f].get();
                    const actual = result[result.length - 2];
                    const value = result[result.length - 1];

                    assert.equal(4, result.length);
                    assert.isTrue(typeof actual === 'string');
                    assert.equal(actual, carry);
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

    it('regression test 7413 - 415 should generate carry 1110', function (done) {
        const opts: ExerciseType = {
            quantity: 1,
            level: 3,
            operations: ['sub'],
            operands: [
                { exactMatchOf: 7413 },
                { exactMatchOf: 415 }
            ]
        };
        const carry = '- ___ ';
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    const result = exercises[e][f];
                    const resultStr = result.get();
                    const value = result.expression.value;
                    assert.equal(6998, value);
                    assert.equal(4, resultStr.length);
                    assert.equal(resultStr[2], carry);
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

    it('regression test 100 - 95 should generate carry 110', function (done) {
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
                    const resultStr = result.get();
                    const value = result.expression.value;
                    assert.equal(5, value);
                    assert.equal(4, resultStr.length);
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

    it('regression test 4252 - 929 should generate carry 0110', function (done) {
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
