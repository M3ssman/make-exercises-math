import { assert } from 'chai';
import { 
    Exercise, 
    ExerciseSet,
    makeSet 
} from '../src/exercises.math';
import { 
    addN50N25Nof10, 
    subN99N19Nof10, 
    multN10N10 , 
    divN100WithRest
} from '../src/exercises.math.options';

/**
 * 
 * Test given ExerciseTypes
 * 
 */
describe('ExerciseTypes', function () {
    it('should generate 12 Exercises from addN50N25Nof10 with result mult of 10', function (done) {
        const exercises = makeSet([addN50N25Nof10]);
        exercises.then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            assert.equal(12, sets[0].exercises.length);
            for (let f = 0; f < sets[0].exercises.length; f++) {
                let ex: Exercise = sets[0].exercises[f];
                let renderOut = ex.rendered[0];
                let opOffset = renderOut.indexOf('+');
                assert.isTrue(opOffset > 0);
                let exprValue = ex.expression.value;
                assert.isTrue(<number>exprValue % 10 === 0);
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
        exercises.then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            assert.equal(12, sets[0].exercises.length);
            for (let f = 0; f < sets[0].exercises.length; f++) {
                let ex: Exercise = sets[0].exercises[f];
                let renderOut = ex.rendered[0];
                assert.isTrue(renderOut.indexOf('-') > 0);
                let exprValue = <number>ex.expression.value;
                assert.isTrue(exprValue % 10 === 0);
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
        exercises.then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            assert.equal(12, sets[0].exercises.length);
            for (let f = 0; f < sets[0].exercises.length; f++) {
                let ex: Exercise = sets[0].exercises[f];
                let renderOut = ex.rendered[0];
                assert.isTrue(renderOut.indexOf('*') > 0);
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
        exercises.then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            assert.equal(12, sets[0].exercises.length);
            for (let f = 0; f < sets[0].exercises.length; f++) {
                let ex: Exercise = sets[0].exercises[f];
                let renderOut = ex.rendered[0];
                assert.isTrue(renderOut.indexOf(':') > 1);
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
