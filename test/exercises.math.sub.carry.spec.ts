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
                    console.log('result? ' + JSON.stringify(result));
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

});
