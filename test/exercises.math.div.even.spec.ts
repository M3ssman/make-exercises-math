import { assert } from 'chai';
import { 
    makeSet,
    Exercise,
    ExerciseSet,
    Options, ExtensionType 
} from '../src/exercises.math';
import { 
    div_even 
} from '../src/exercises.math.options';

/**
 * Multiplication
 */
describe('Division without rest API', function () {

    it('bugfix test 627 : 11 = 57', async () => {
        const opts: Options = {
            quantity: 1,
            level: 5,
            set: "N",
            extension: 'DIV_EVEN',
            operations: ['div'],
            operands: [{ exactMatchOf: 57 }, { exactMatchOf: 11 }]
        };
        const set = await makeSet([opts]);
        assert.exists(set[0]);
        const exercise = set[0].exercises[0];
        assert.isNotNull(exercise.expression.value);
        assert.equal(set[0].properties.extension, 'DIV_EVEN'); 
        const actualExtensions = exercise.extension.extensions;
        assert.isNotEmpty(actualExtensions);
        assert.equal(actualExtensions.length, 2);
        const actRendStrs: String[] = exercise.rendered;
        assert.equal(5, actRendStrs.length);
    });

    it('bugfix test 1012 : 4 = 253', async () => {
        const opts: Options = {
            quantity: 1,
            level: 5,
            set: "N",
            extension: 'DIV_EVEN',
            operations: ['div'],
            operands: [{ exactMatchOf: 253 }, { exactMatchOf: 4 }]
        };
        const set = await makeSet([opts]);
        assert.exists(set[0]);
        const exercise = set[0].exercises[0];
        assert.isNotNull(exercise.expression.value);
        assert.equal(set[0].properties.extension, 'DIV_EVEN'); 
        const actualExtensions = exercise.extension.extensions;
        assert.isNotEmpty(actualExtensions);
        assert.equal(actualExtensions.length, 3);
        const actRendStrs: String[] = exercise.rendered;
        assert.equal(7, actRendStrs.length);
    });
    
    it('should generate 3 even divisions with d_2 in {50 .. 99} and q_0 {2..99}', async function () {
        const sets = await makeSet([div_even])
        assert.equal(1, sets.length);
        assert.isTrue(sets[0].exercises.length > 2);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            const exercise = sets[0].exercises[f];
            assert.isNotNull(exercise.expression.value);
            const actualExtensions = exercise.extension.extensions;
            assert.isNotEmpty(actualExtensions);
        }
    });

});
