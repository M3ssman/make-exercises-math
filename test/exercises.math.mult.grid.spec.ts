import { assert } from 'chai';
import { 
    Exercise, 
    ExerciseSet,
    Options, 
    makeSet
} from '../src/exercises.math';
import { 
    mult_N999_N9, mult_N999_N99, mult_N999_N999 
} from '../src/exercises.math.options';

/**
 * Multiplication
 */
describe('Multiplication with grid-like Extensions', function () {

    it('should generate Mulitplication Extensions for f_1 = 755 , f_2 = 6', function (done) {
        const opts: Options = {
            quantity: 1,
            level: 4,
            extension: 'MULT_MULT',
            set: "N",
            operations: ['mult'],
            operands: [{ exactMatchOf: 755 }, { exactMatchOf: 6 }]
        };

        makeSet([opts]).then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            for (let f = 0; f < sets[0].exercises.length; f++) {
                const exercise = sets[0].exercises[f];
                assert.isNotNull(exercise.expression.value);
                const actualExtensions = exercise.extension.extensions;
                assert.isNotEmpty(actualExtensions);

                const actualexs: String[] = exercise.rendered;
                assert.isTrue(actualexs[0].indexOf('*') > -1);
                assert.equal(5, actualexs.length);
            }
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

    it('should generate 3 small Mulitplications with f_1 {10..999} and f_2 {2..10}', function (done) {
        makeSet([mult_N999_N9]).then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            for (let f = 0; f < sets[0].exercises.length; f++) {
                const exercise = sets[0].exercises[f];
                assert.isNotNull(exercise.expression.value);
                const actualExtensions = exercise.extension.extensions;
                assert.isNotEmpty(actualExtensions);
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
        makeSet([mult_N999_N99]).then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            for (let f = 0; f < sets[0].exercises.length; f++) {
                const exercise = sets[0].exercises[f];
                assert.isNotNull(exercise.expression.value);
                const actualExtensions = exercise.extension.extensions;
                assert.isNotEmpty(actualExtensions);
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
        makeSet([mult_N999_N999]).then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            for (let f = 0; f < sets[0].exercises.length; f++) {
                const exercise = sets[0].exercises[f];
                assert.isNotNull(exercise.expression.value);
                const actualExtensions = exercise.extension.extensions;
                assert.isNotEmpty(actualExtensions);

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
