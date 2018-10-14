import { assert } from 'chai';
import {
    Exercise,
    Constraint,
    Expression,
    Options,
    makeSet,
    add,
    sub,
    addQ
} from '../src/exercises.math';
import {
    generateExpression,
    generateRationalExpression
} from '../src/exercises.math.generator'

/**
 * Generator API
 */
describe('Generation with Constraints', () => {
    it('should generate Expression with 25<=x<=50, y=24, z<=18 and result x10', () => {
        const constraintsOPs = [
            { rangeN: { min: 25, max: 50 } },
            { exactMatchOf: 24 },
            { rangeN: { max: 18 } }
        ]
        const constraintsR = {
            multipleOf: 10
        }
        const expr: Expression = generateExpression([add, sub], constraintsOPs, constraintsR)
        const x = expr.operands[0];
        const y = expr.operands[1];
        const z = expr.operands[2];
        const r = expr.value;
        assert.isTrue(25 <= x && x <= 50, 'expect 25 <= x <= 50, but x was ' + x);
        assert.equal(y, 24, 'expect y = 24, but y was: ' + y);
        assert.isTrue(z <= 18, 'expect z <= 18, but z was ' + z);
        assert.isTrue(<number>r % 10 == 0, 'expect r % 10 == 0, but r was ' + r);
    });

    it('should generate Expression with x_1 > x_2', () => {
        const operandConstraints: Constraint[] = [
            { rangeN: { min: 25, max: 50 }, greaterThanIndex: 1 },
            { exactMatchOf: 47 }
        ]
        const expr: Expression = generateExpression([add], operandConstraints, {})
        assert.isObject(expr)
        const x = expr.operands[0];
        const y = expr.operands[1];
        const r = expr.value;
        assert.isTrue(x >= 48, 'expect x => 48, but x was ' + x);
        assert.equal(y, 47);
        assert.isTrue(r >= 90 && r <= 100)
    });

    xit('should generate Rational Expression with x_1 between [1/3 .. 3/4] and x_1 > 1/2', () => {
        const operandConstraints: Constraint[] = [
            { rangeQ: { min: [1, 3], max: [3, 4] }, greaterThanIndex: 1 },
            { exactMatchOf: [1,2] }
        ]

        const expr: Expression = generateRationalExpression([addQ], operandConstraints, {})
        const x = expr.operands[0];
        const y = expr.operands[1];
        assert.isTrue(x >= [1,2], 'expect x >= 1/2, but x was ' + x);
        assert.equal(y, [1,2])
    });
});
