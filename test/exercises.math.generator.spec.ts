import { assert } from 'chai';
import {
    Exercise,
    Constraint,
    Expression,
    Options,
    makeSet,
    add,
    sub,
    addFraction
} from '../src/exercises.math';
import {
    generateExpression,
    generateRationalExpression,
    _gen
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

    it('generate default 2 Expression with 3 operands from 2x add', () => {
        const expr: Expression = generateExpression([add, add], [], {})
        assert.equal(3, expr.operands.length);
        assert.isTrue(<number>expr.operands[0] < 101)
    });

    it('generate Rational Expression with x_1 in [1/4 .. 3/4] and x_1 > 1/2', () => {
        const operandConstraints: Constraint[] = [
            { rangeQ: { min: [1, 4], max: [3, 4] }, greaterThanIndex: 1 },
            { exactMatchOf: [2, 4] }
        ]

        const expr: Expression = generateRationalExpression([addFraction], operandConstraints, {})
        const x = expr.operands[0];
        const y: [number, number] = <[number, number]>expr.operands[1];
        assert.isTrue(x >= [1, 2], 'expect x >= 1/2, but x was ' + x);
        assert.deepEqual<[number, number]>(y, [1, 2])
        assert.deepEqual<[number, number]>(<[number, number]>expr.value, [5, 4])
    });

    it('should generate valid n in [1/6 .. 6/12]', () => {
        const actual = _gen(1,6)
        assert.isTrue(actual >= 1 && actual <= 6, '1 <= ' + actual + ' <= 6')
    })

    it('should generate valid n in [2/6 .. 6/12]', () => {
        const actual = _gen(2,6)
        assert.isTrue(actual >= 2 && actual <= 6, '2 <= ' + actual + ' <= 6')
    })

    it('generate Rational Expression with x_1 in  [1/3 .. 3/2] and x_2 in [1/6 .. 1/2]', () => {
        const operandConstraints: Constraint[] = [
            { rangeQ: { min: [1, 3], max: [3, 2] } },
            { rangeQ: { min: [1, 6], max: [1, 2] } }
        ]

        //console.log('### GIVEN ' + JSON.stringify(operandConstraints))
        const expr: Expression = generateRationalExpression([addFraction], operandConstraints, {})
        assert.exists(expr)

        const dx = 6, dy = 6
        let x: [number, number] = <[number, number]>expr.operands[0]
        let y: [number, number] = <[number, number]>expr.operands[1]
        const _dx = x[1], _dy = y[1]
        // sanitze x if 1/1
        if (x[0] === 1 && x[1] === 1) {
            x = [dx, dx]
        }
        // compare bounds
        let xe_0 = [2, dx], xe_1 = [9, dx]
        let ye_0 = [1, dy], ye_1 = [3, dy]
        // make same denominator
        if (x[1] !== xe_0[1]) {
            xe_0 = [xe_0[0] * _dx, xe_0[1] * _dx]
            xe_1 = [xe_1[0] * _dx, xe_1[1] * _dx]
            x = [x[0] * dx, _dx * dx]
        }
        if (y[1] !== ye_0[1]) {
            ye_0 = [ye_0[0] * _dy, ye_0[1] * _dy]
            ye_1 = [ye_1[0] * _dy, ye_1[1] * _dy]
            y = [y[0] * dy, _dy * dy]
        }
        assert.isTrue(x[0] >= xe_0[0] && x[0] <= xe_1[0], 'expect x: ' + xe_0 + ' <= ' + x + ' <= ' + xe_1);
        assert.isTrue(y[0] >= ye_0[0] && y[0] <= ye_1[0], 'expect y: ' + ye_0 + ' <= ' + y + ' <= ' + ye_1)
    });

    
   it('generate Expression with x_1 in  [1/8 .. 16/8] and x_2 in [1/12 .. 24/12]', () => {
    const operandConstraints: Constraint[] = [
        { rangeQ: { min: [1, 8], max: [16, 8] } },
        { rangeQ: { min: [1, 12], max: [24, 12] } }
    ]

    const expr: Expression = generateRationalExpression([addFraction], operandConstraints, {})
    assert.exists(expr)

    const dx = 8, dy = 12
    let x: [number, number] = <[number, number]>expr.operands[0]
    let y: [number, number] = <[number, number]>expr.operands[1]
    const _dx = x[1], _dy = y[1]

    // sanitze x if 1/1
    if (x[0] === 1 && x[1] === 1) {
        x = [dx, dx]
    }
    // compare bounds
    let xe_0 = [1, dx], xe_1 = [16, dx]
    let ye_0 = [1, dy], ye_1 = [24, dy]
    // make same denominator
    if (x[1] !== xe_0[1]) {
        xe_0 = [xe_0[0] * _dx, xe_0[1] * _dx]
        xe_1 = [xe_1[0] * _dx, xe_1[1] * _dx]
        x = [x[0] * dx, _dx * dx]
    }
    if (y[1] !== ye_0[1]) {
        ye_0 = [ye_0[0] * _dy, ye_0[1] * _dy]
        ye_1 = [ye_1[0] * _dy, ye_1[1] * _dy]
        y = [y[0] * dy, _dy * dy]
    }
    assert.isTrue(x[0] >= xe_0[0] && x[0] <= xe_1[0], 'expect x: ' + xe_0 + ' <= ' + x + ' <= ' + xe_1);
    assert.isTrue(y[0] >= ye_0[0] && y[0] <= ye_1[0], 'expect y: ' + ye_0 + ' <= ' + y + ' <= ' + ye_1)
});

   // TODO corner case x = 1/1
});
