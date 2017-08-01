import { assert, expect } from 'chai';
import { ExerciseMath, ExerciseMathImpl } from '../src/exercises.math';
import * as exercise from '../src/exercises.math';

/**
 * Test Set Interface
 */
describe('Test Set with default Options', function () {
    it('should generate 12 Exercises', function (done) {
        const exercises = exercise.makeSet();
        exercises.then((exercises: ExerciseMath[]) => {
            assert.equal(12, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                console.log(exercises[e].expression.toString());
            }
        });
        done();
    });
});
