import { assert, expect } from 'chai';
import { ExerciseMath, ExerciseType } from '../src/exercises.math';
import { makeSet, addN50N25Nof10, subN99N19Nof10, multN10N10 , divN100WithRest} from '../src/exercises.math';

/**
 * 
 * Test given ExerciseTypes
 * 
 */
describe('ExerciseTypes', function () {
    it('should generate 12 Exercises from addN50N25Nof10 with result mult of 10', function (done) {
        const exercises = makeSet([addN50N25Nof10]);
        exercises.then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    assert.equal(12, exercises[e].length);
                    let ex: ExerciseMath = exercises[e][f];
                    let renderOut = ex.get()[0];
                    let opOffset = renderOut.indexOf('+');
                    assert.isTrue(opOffset > 0);
                    let exprValue = ex.expression.value;
                    assert.isTrue(<number>exprValue % 10 === 0);
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

    it('should generate 12 Exercises from subN99N19Nof10 with result mult of 10', function (done) {
        const exercises = makeSet([subN99N19Nof10]);
        exercises.then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    assert.equal(12, exercises[e].length);
                    let ex: ExerciseMath = exercises[e][f];
                    let renderOut = ex.get()[0];
                    assert.isTrue(renderOut.indexOf('-') > 0);
                    let exprValue = <number>ex.expression.value;
                    assert.isTrue(exprValue % 10 === 0);
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

    it('should generate 12 Exercises from multN10N10', function (done) {
        const exercises = makeSet([multN10N10]);
        exercises.then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    assert.equal(12, exercises[e].length);
                    let ex: ExerciseMath = exercises[e][f];
                    let renderOut = ex.get()[0];
                    assert.isTrue(renderOut.indexOf('*') > 0);
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

    it('should generate 12 Division Exercises', function (done) {
        const exercises = makeSet([divN100WithRest]);
        exercises.then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    assert.equal(12, exercises[e].length);
                    let ex: ExerciseMath = exercises[e][f];
                    let renderOut = ex.get()[0];
                    assert.isTrue(renderOut.indexOf(':') > 1);
                }
            }
        done();
        });
    });
});
