import { assert, expect } from 'chai';
import { ExerciseMath } from '../src/exercises.math';
import { makeSet, addN50N25Nof10, subN99N19Nof10, multN10N10 , divN100} from '../src/exercises.math';

/**
 * Test Set Interface
 */
describe('Test Set with default Options', function () {
    it('should generate 12 default Exercises that contain symbol "+"', function (done) {
        const exercises = makeSet();
        exercises.then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    assert.equal(12, exercises[e].length);
                    let ex: ExerciseMath = exercises[e][f];
                    let renderOut = ex.get()[0];
                    assert.isTrue(renderOut.indexOf('+') > 1);
                }
            }
        });
        done();
    });

    it('should generate 12 Exercises from addN50N25Nof10 with result mult of 10', function (done) {
        const exercises = makeSet([addN50N25Nof10]);
        exercises.then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    assert.equal(12, exercises[e].length);
                    let ex: ExerciseMath = exercises[e][f];
                    let renderOut = ex.get()[0];
                    assert.isTrue(renderOut.indexOf('+') > 1);
                    let exprValue = ex.expression.value;
                    assert.isTrue(exprValue % 10 === 0);
                }
            }
        });
        done();
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
                    assert.isTrue(renderOut.indexOf('-') > 1);
                    let exprValue = ex.expression.value;
                    assert.isTrue(exprValue % 10 === 0);
                }
            }
        });
        done();
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
                    assert.isTrue(renderOut.indexOf('*') > 1);
                }
            }
        });
        done();
    });

    it('should generate 12 Exercises from divN100', function (done) {
        const exercises = makeSet([divN100]);
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
        });
        done();
    });

    
});
