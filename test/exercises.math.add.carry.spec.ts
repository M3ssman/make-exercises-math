import { assert, expect } from 'chai';
import { ExerciseMath, ExerciseType } from '../src/exercises.math';
import { makeSet, addN50N25Nof10, subN99N19Nof10, multN10N10 } from '../src/exercises.math';

/**
 * Test Addition with Carry
 * 
 *  
 */
describe('Addition with Carry', function () {
    const opts: ExerciseType = {
        quantity: 1, level: 2,
        operations: ['add', 'add' ],
        operands: [ {exactMatchOf: 9903}, {exactMatchOf: 819}, {exactMatchOf: 77}]
    };
    const carry = '11 1 ';

    it('should generate 1 Addition with Carry '+carry, function (done) {
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    assert.equal(1, exercises[e].length);
                    const result = exercises[e][f].get();
                    assert.equal(5, result.length);
                    const actual = result[result.length-2];
                    assert.isTrue(typeof actual === 'string');
                    const plusOffset = actual.indexOf('0');
                    assert.isTrue(plusOffset === -1);
                    assert.equal(carry, actual);
                }
            }
            done();
        }).catch( err => {
            if(console) {
                console.log(err);
            }
            done(err);
        });
    });
});
