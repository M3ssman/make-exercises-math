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
            operands: [{ exactMatchOf: 64 }, { exactMatchOf: 64 }]
        };
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            const exercise = exercises[0][0];
            assert.isNotNull(exercise.expression.value);
            const actualExtensions = exercise.extensions;
            assert.isNotEmpty(actualExtensions);
            const actRendStrs: String[] = exercise.get();
            assert.equal(6, actRendStrs.length);
            assert.isTrue(actRendStrs[0].indexOf(':') > -1);
            assert.equal('  4096  : 64 = 64', actRendStrs[0]);
            assert.equal('  ___', actRendStrs[1]);
            assert.equal('- _  ', actRendStrs[2]);
            assert.equal('   ___', actRendStrs[3]);
            assert.equal(' - ___', actRendStrs[4]);
            assert.equal('     0', actRendStrs[5]);
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
                    assert.isNotNull(exercise.expression.value);
                    const actualExtensions = exercise.extensions;
                    assert.isNotEmpty(actualExtensions);
                    const actualRenderedStrings = exercise.get();
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

    it('reression test to fix undefined state at inversion for d_2 = 70 and q_0 = 9', function (done) {
        const opts: ExerciseType = {
            quantity: 1,
            level: 4,
            extensionType: ExtensionType.DIV,
            operations: ['div'],
            operands: [{ exactMatchOf: 70 }, { exactMatchOf: 9 }]
        };
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            const exercise = exercises[0][0];
            assert.isNotNull(exercise.expression.value);
            const actualExtensions = exercise.extensions;
            assert.isNotEmpty(actualExtensions);
            const actRendStrs: String[] = exercise.get();
            assert.equal(5, actRendStrs.length);
            assert.equal('  630  : 9 = 70', actRendStrs[0], 'failed: "" != '+ actRendStrs[0]);
            assert.equal('- __', actRendStrs[1]);
            assert.equal('   0', actRendStrs[2]);
            assert.equal(' - 0', actRendStrs[3])
            assert.equal('   ', actRendStrs[4])
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });
});
