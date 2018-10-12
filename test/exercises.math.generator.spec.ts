import { assert } from 'chai';
import {
    Exercise,
    ExerciseSet,
    Expression,
    Options,
    makeSet
} from '../src/exercises.math';
import {
    addN50N25Nof10,
    subN99N19Nof10,
    multN10N10,
    divN100WithRest,
    mult_N999_N9,
    mult_N999_N99,
    mult_N999_N999,
    div_even
} from '../src/exercises.math.options';
import {
    Rendered
} from '../src/exercises.math.renderer'

/**
 * Generator API
 */
describe('Constraints', () => {
    it('should generate Exercise with 25<=x<=50, y=24, z<=18 and result x10', async () => {
        const type: Options = {
            quantity: 1, level: 2, operations: ['add', 'sub'], set: "N",
            operands: [
                { rangeN: { min: 25, max: 50 } },
                { exactMatchOf: 24 },
                { rangeN: { max: 18 } }
            ],
            result: { multipleOf: 10 }
        };

        const sets = await makeSet([type])
        let ex: Exercise = sets[0].exercises[0];
        const x = (<Expression>ex.expression).operands[0];
        const y = (<Expression>ex.expression).operands[1];
        const z = (<Expression>ex.expression).operands[2];
        const r = <number>ex.expression.value;
        assert.isTrue(25 <= x && x <= 50, 'expect 25 <= x <= 50, but x was ' + x);
        assert.equal(y, 24, 'expect y = 24, but y was: ' + y);
        assert.isTrue(z <= 18, 'expect z <= 18, but z was ' + z);
        assert.isTrue(r % 10 == 0, 'expect r % 10 == 0, but r was ' + r);
    });

    it('should generate Exercise with x_1 > x_2', async () => {
        const type: Options = {
            quantity: 1, level: 2, operations: ['add'], set: "N",
            operands: [
                { rangeN: { min: 25, max: 50 }, greaterThanIndex: 1 },
                { exactMatchOf: 47 }
            ]
        };

        const sets = await makeSet([type])
        let ex: Exercise = sets[0].exercises[0];
        const x = (<Expression>ex.expression).operands[0];
        const y = (<Expression>ex.expression).operands[1];
        const z = (<Expression>ex.expression).operands[2];
        const r = <number>ex.expression.value;
        assert.isTrue(x >= 48, 'expect x => 48, but x was ' + x);
        assert.equal(y, 47);
    });
});
