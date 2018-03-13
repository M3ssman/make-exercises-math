import { assert, expect } from 'chai';
import { ExerciseMath, ExerciseType } from '../src/exercises.math';
import { makeSet, mult_N999_N9, mult_N999_N99, mult_N999_N999 } from '../src/exercises.math';

/**
 * Multiplication
 */
describe('Multiplication with grid-like Extensions', function () {

    it('should generate 3 small Mulitplications with f_1 {10..999} and f_2 {2..10}', function (done) {
        makeSet([mult_N999_N9]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    const exercise = exercises[e][f];
                    assert.isNotNull(exercise.expression.value);
                    const actualExtensions = exercise.extensions;
                    assert.isNotEmpty(actualExtensions);
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

    it('should generate 3 medium Mulitplications with f_1 {100..999} and f_2 {10..99}', function (done) {
        makeSet([mult_N999_N99]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    const exercise = exercises[e][f];
                    assert.isNotNull(exercise.expression.value);
                    const actualExtensions = exercise.extensions;
                    assert.isNotEmpty(actualExtensions);
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

    it('should generate 3 large Mulitplications with f_1 {100..999} and f_2 {100..999}', function (done) {
        makeSet([mult_N999_N999]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    const exercise = exercises[e][f];
                    assert.isNotNull(exercise.expression.value);
                    const actualExtensions = exercise.extensions;
                    assert.isNotEmpty(actualExtensions);
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
