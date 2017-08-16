import { assert, expect } from 'chai';
import { ExerciseMath } from '../src/exercises.math';
import { makeSet, addN50N25Nof10 } from '../src/exercises.math';

/**
 * Test Set Interface
 */
describe('Test Set with default Options', function () {
    it('should generate 12 default Exercises that contain a "+"', function (done) {
        const exercises = makeSet();
        exercises.then((exercises: ExerciseMath[]) => {
            assert.equal(12, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                let ex: ExerciseMath = exercises[e];
                let renderOut = ex.get()[0];
                assert.isTrue(renderOut.indexOf('+') > 1);
            }
        });
        done();
    });

    it('should generate 12 Exercises from addN50N25Nof10 with result mult of 10', function (done) {
        const exercises = makeSet(addN50N25Nof10);
        exercises.then((exercises: ExerciseMath[]) => {
            assert.equal(12, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                let ex: ExerciseMath = exercises[e];
                let renderOut = ex.get()[0];
                let exprValue = ex.expression.value.n;
                assert.isTrue( exprValue % 10 === 0);
            }
        });
        done();
    });
});
