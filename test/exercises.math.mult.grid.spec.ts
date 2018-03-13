import { assert, expect } from 'chai';
import { ExerciseMath, ExerciseType } from '../src/exercises.math';
import { makeSet, addN50N25Nof10, subN99N19Nof10, multN10N10 } from '../src/exercises.math';

/**
 * Multiplication
 */
describe('Multiplication with grid-like Extensions', function () {

    it('should generate 1 Mulitplication with f_1 {10..999} and f_2 {2..10}', function (done) {
        const opts: ExerciseType = {
            quantity: 1, level: 4,
            operations: ['mult'],
            operands: [ { range :{min: 10, max:999}}, {range: {min:2, max:10}}]
        };
        const carry = '+  _ _ ';
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    const exercise = exercises[e][f];
                    console.log('mult res? '+ JSON.stringify(exercise));

                    assert.isNotNull(exercise.expression.value);
                    
                    const actual = exercise.extensions;
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
