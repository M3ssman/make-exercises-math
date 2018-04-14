import { assert, expect } from 'chai';
import { ExerciseMath, ExerciseType, div_even, ExtensionType } from '../src/exercises.math';
import { makeSet, mult_N999_N9, mult_N999_N99, mult_N999_N999 } from '../src/exercises.math';

/**
 * Multiplication
 */
describe('Division without rest and their Extensions', function () {
    it('should generate Division with Extensions for d_2 = 64 and q_0 = 64', function (done) {
        const opts: ExerciseType = {
            quantity: 1,
            level: 4,
            extensionType: ExtensionType.DIV,
            operations: ['div'],
            operands: [{ exactMatchOf: 64 },{exactMatchOf: 64}]
        };
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                assert.equal(exercises[e].length, 1);
                for (let f = 0; f < exercises[e].length; f++) {
                    const exercise = exercises[e][f];
                    assert.isNotNull(exercise.expression.value);
                    const actualExtensions = exercise.extensions;
                    assert.isNotEmpty(actualExtensions);
                    const actualexs: String[] = exercise.get();
                    assert.isTrue(actualexs.length > 0, 'expect size of extensions > 0, actual: '+ actualexs.length);
                    assert.isTrue(actualexs[0].indexOf(':') > -1);
                    assert.equal(5, actualexs.length);
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

    it('should generate 3 even divisions with d_2 in {50 .. 99} and q_0 {2..99}', function (done) {
        makeSet([div_even]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                assert.equal(exercises[e].length, 3);
                for (let f = 0; f < exercises[e].length; f++) {
                    const exercise = exercises[e][f];
                    console.log('exercise '+f+' '+ JSON.stringify(exercise));
                    assert.isNotNull(exercise.expression.value);
                    const actualExtensions = exercise.extensions;
                    assert.isNotEmpty(actualExtensions);
                    const actualRenderedStrings = exercise.get();
                    // assert.isTrue( actualRenderedStrings.length > 2);
                    console.log('actualRenderedStrings '+f+' '+ JSON.stringify(actualRenderedStrings));
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
