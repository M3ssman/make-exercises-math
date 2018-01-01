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
    const carry = '+ __ _ ';

    it('should generate 1 Addition with Carry '+carry, function (done) {
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    const result = exercises[e][f].get();
                    const actual = result[result.length-2];
                    const value = result[result.length-1];
                    
                    assert.equal(5, result.length);
                    assert.isTrue(typeof actual === 'string');
                    assert.equal(carry, actual);
                    assert.equal('  _____', value);
                    assert.equal(actual.length, value.length);
                    assert.equal(actual.length, result[0].length);
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
