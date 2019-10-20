import { assert } from 'chai'
import * as fs from 'fs'

import {
    addFraction,
    subFraction,
    multFraction,
    divFraction,
    Fraction,
    Exercise,
    ExerciseSet,
    Options,
    makeSet,
    makeExercisePDF
} from '../src/exercises.math';
import {
    addN50N25Nof10,
    subN99N19Nof10,
    multN10N10,
    divN100WithRest,
    mult_N999_N9,
    mult_N999_N99,
    mult_N999_N999,
    div_even,
    add_fraction,
    mult_fraction,
    div_fraction
} from '../src/exercises.math.options';
import {
    Rendered
} from '../src/exercises.math.renderer'

/**
 * Test Exercise Functions
 */
describe('Rational Functions', () => {
    it('div rationales: 5/12 : 5/8 => 2/3', () => {
        const actual1: Fraction = divFraction([5, 12], [5, 8])
        const expected1: Fraction = [2, 3]
        assert.deepEqual(actual1, expected1)
    });
    it('mult rationales: 2/3 * 5/8 => 5/12', () => {
        const actual1: Fraction = multFraction([2, 3], [5, 8])
        const expected1: Fraction = [5, 12]
        assert.deepEqual(actual1, expected1)
    });
    it('sub rationales: 1/2 - 2/11 => 7/22', () => {
        const actual1: Fraction = subFraction([1, 2], [2, 11])
        const expected1: Fraction = [7, 22]
        assert.deepEqual(actual1, expected1)
    });
    it('add rationales: 1/3 + 1/4 => 13/12', () => {
        const actual1: Fraction = addFraction([1, 3], [3, 4])
        const expected1: Fraction = [13, 12]
        assert.deepEqual(actual1, expected1)
    });
    it('add rationales: 1/3 + 5/3 => 2/1', () => {
        const actual1: Fraction = addFraction([1, 3], [5, 3])
        const expected1: Fraction = [2, 1]
        assert.deepEqual(actual1, expected1)
    });
    it('add rationales: 2/3 + 4/11 => 34/33', () => {
        const actual1: Fraction = addFraction([2, 3], [4, 11])
        const expected1: Fraction = [34, 33]
        assert.deepEqual(actual1, expected1)
    });
    it('add rationales: 14/8 + 8/12 => 29/12', () => {
        const actual1: Fraction = addFraction([14, 8], [8, 12])
        const expected1: Fraction = [29, 12]
        assert.deepEqual(actual1, expected1)
    });
});

/**
 * Test Exercise Types Exported Types
 */
describe('DefaultOptions', function () {
    it('should generate 12 default Exercises that contain symbol "+"', async () => {
        const sets = await makeSet()
        assert.equal(1, sets.length);
        assert.equal(12, sets[0].exercises.length);
        sets[0].exercises.forEach(ex => {
            let renderOut = ex.rendered[0];
            let opOffset = renderOut.rendered.indexOf('+');
            assert.isTrue(opOffset > 0);
        });
    });
});

/**
 * 
 * Test given ExerciseTypes
 * 
 */
describe('ExerciseTypes', function () {
    it('should generate 12 Exercises from addN50N25Nof10 with result mult of 10', async () => {
        const sets = await makeSet([addN50N25Nof10]);
        assert.equal(1, sets.length);
        assert.equal(12, sets[0].exercises.length);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            let ex: Exercise = sets[0].exercises[f];
            let renderOut = ex.rendered[0];
            let opOffset = renderOut.rendered.indexOf('+');
            assert.isTrue(opOffset > 0);
            let exprValue = ex.expression.value;
            assert.isTrue(<number>exprValue % 10 === 0);
        }
    });

    it('should generate 12 Exercises from subN99N19Nof10 with result mult of 10', async () => {
        const sets = await makeSet([subN99N19Nof10]);
        assert.equal(1, sets.length);
        assert.equal(12, sets[0].exercises.length);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            let ex: Exercise = sets[0].exercises[f];
            let renderOut = ex.rendered[0];
            assert.isTrue(renderOut.rendered.indexOf('-') > 0);
            let exprValue = <number>ex.expression.value;
            assert.isTrue(exprValue % 10 === 0);
        }
    });

    it('should generate 12 Exercises from multN10N10', async () => {
        const sets = await makeSet([multN10N10]);
        assert.equal(1, sets.length);
        assert.equal(12, sets[0].exercises.length);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            let ex: Exercise = sets[0].exercises[f];
            let renderOut = ex.rendered[0];
            assert.isTrue(renderOut.rendered.indexOf('*') > 0);
        }
    });

    it('should generate 12 Division Exercises', async () => {
        const sets = await makeSet([divN100WithRest]);
        assert.equal(1, sets.length);
        assert.equal(12, sets[0].exercises.length);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            let ex: Exercise = sets[0].exercises[f];
            let renderOut = ex.rendered[0];
            assert.isTrue(renderOut.rendered.indexOf(':') > 1);
        }
    });
});

describe('ChainOperators', function () {
    it('should generate 2 Exercises with 3 operands and 2x add', async () => {
        const opts: Options = {
            quantity: 2, set: "N",
            operations: ['add', 'add']
        };
        const set = await makeSet([opts])
        assert.equal(1, set.length);
        assert.equal(2, set[0].exercises.length);
        for (let f = 0; f < set[0].exercises.length; f++) {
            let ex: Exercise = set[0].exercises[f];
            let renderOut = ex.rendered[0];
            assert.isTrue(renderOut.rendered.indexOf('+') > 0);
        }
    });

    it('should generate 2 Exercises with 3 operands, add and sub', async () => {
        const opts: Options = {
            quantity: 2, set: "N",
            operations: ['add', 'sub'],
            operands: [
                { rangeN: { min: 20, max: 50 } },
                { rangeN: { min: 10, max: 25 } },
                { rangeN: { max: 20 } }
            ]
        };

        const set = await makeSet([opts])
        assert.equal(1, set.length);
        assert.equal(2, set[0].exercises.length);
        for (let f = 0; f < set[0].exercises.length; f++) {
            let ex: Exercise = set[0].exercises[f];
            let renderOut = ex.rendered[0];
            assert.isTrue(renderOut.rendered.indexOf('+') > 0);
            assert.isTrue(renderOut.rendered.indexOf('-') > 0);
        }
    });

    it('should generate Exercise with 4x mult', async () => {
        const opts: Options = {
            quantity: 1, set: "N",
            operations: ['mult', 'mult', 'mult', 'mult'],
            operands: [
                { rangeN: { max: 5 } },
                { rangeN: { max: 4 } }
            ]
        };

        // act
        const sets = await makeSet([opts])
        assert.equal(1, sets.length);
        let ex: Exercise = sets[0].exercises[0];
        let renderOut = ex.rendered[0];
        assert.isTrue(renderOut.rendered.split('*').length == 5, 'expect 5 parts of *, but found: ' + renderOut);
    });
});

/**
 * Test Addition with Carry
 */
describe('Addition with Carry', function () {

    it('should generate 1 Addition with Carry ', async () => {
        const opts: Options = {
            quantity: 1,
            set: 'N',
            extension: 'ADD_CARRY',
            label: 'add_carry',
            operations: ['add', 'add'],
            operands: [{ exactMatchOf: 9903 }, { exactMatchOf: 819 }, { exactMatchOf: 77 }]
        };
        const _r: ExerciseSet[] = await makeSet([opts])
        const r: Rendered[] = _r[0].exercises[0].rendered;

        assert.equal(r[0].rendered, '   9903');
        assert.equal(r[1].rendered, '    819');
        assert.equal(r[2].rendered, '     77');
        assert.equal(r.find(_r => _r.type === 'CARRY').rendered, '+  ? ? ');
        assert.equal(r.find(_r => _r.type === 'VALUE').rendered, '  ?????');
    });

    it('regression test 601+373+83 should generate carry 100', async () => {
        const opts: Options = {
            quantity: 1,
            extension: 'ADD_CARRY',
            label: 'add_carry',
            set: "N",
            operations: ['add', 'add'],
            operands: [{ exactMatchOf: 601 }, { exactMatchOf: 373 }, { exactMatchOf: 83 }]
        };
        const carry = '+  ?  ';
        const actuals: ExerciseSet[] = await makeSet([opts])
        const r: Rendered[] = actuals[0].exercises[0].rendered;
        const carryactual = r.find(_r => _r.type === 'CARRY')
        const resultactual = r.find(_r => _r.type === 'VALUE')

        assert.equal(5, r.length);
        assert.isTrue(typeof carryactual.rendered === 'string');
        assert.equal(carryactual.rendered, carry);
        assert.equal('  ????', resultactual.rendered);
    });

    it('regression test 4250+314+80 should generate carry 100', async () => {
        const opts: Options = {
            quantity: 1,
            label: 'add_carry',
            extension: 'ADD_CARRY',
            set: "N",
            operations: ['add', 'add'],
            operands: [{ exactMatchOf: 4250 }, { exactMatchOf: 314 }, { exactMatchOf: 80 }]
        };
        const carry = '+  ?  ';
        const actuals = await makeSet([opts])
        const r = actuals[0].exercises[0].rendered;
        const carryactual = r[r.length - 2];
        const resultactual = r[r.length - 1];

        assert.equal(5, r.length);
        assert.isTrue(typeof carryactual.rendered === 'string');
        assert.equal(carryactual.rendered, carry);
        assert.equal('  ????', resultactual.rendered);
    });

    it('regression test 6714+306+75 should generate carry 1010', async () => {
        const opts: Options = {
            quantity: 1,
            label: 'add_carry',
            extension: 'ADD_CARRY',
            set: "N",
            operations: ['add', 'add'],
            operands: [{ exactMatchOf: 6714 }, { exactMatchOf: 306 }, { exactMatchOf: 75 }]
        };
        const carry = '+ ? ? ';
        const actuals = await makeSet([opts])
        const r = actuals[0].exercises[0];
        const carryactual = r.rendered.find(_r => _r.type === 'CARRY')
        const resultactual = r.rendered.find(_r => _r.type === 'VALUE')

        assert.equal(resultactual.rendered, "  ????")
        assert.equal(carryactual.rendered, carry)
    });
});

/**
 * Test Subtraction with Carry
 */
describe('Subtraction with Carry', function () {

    it('should generate 1 Subtraction with Carry ', async () => {
        const opts: Options = {
            quantity: 1,
            label: 'sub_carry',
            set: "N",
            extension: 'SUB_CARRY',
            operations: ['sub'],
            operands: [
                { exactMatchOf: 9903 },
                { exactMatchOf: 8195 }
            ]
        };
        const maskedCarryStr = '-  ?? ';
        const sets = await makeSet([opts])
        assert.equal(1, sets.length);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            const result = sets[0].exercises[f].rendered;
            const actual = result[result.length - 2];
            const value = result[result.length - 1];
            assert.equal('0,1,1,0', sets[0].exercises[f].extension.extensions[0].carry.toString());
            assert.equal(4, result.length);
            assert.isTrue(typeof actual === 'object');
            assert.equal(actual.rendered, maskedCarryStr);
            assert.equal('  ????', value.rendered);
        }
    });

    it('regression test 7413 - 415 should generate maskedCarryStr 1110', async () => {
        const opts: Options = {
            quantity: 1,
            set: "N",
            label: 'sub_carry',
            extension: 'SUB_CARRY',
            operations: ['sub'],
            operands: [
                { exactMatchOf: 7413 },
                { exactMatchOf: 415 }
            ]
        };
        const maskedCarryStr = '- ??? ';
        const sets = await makeSet([opts])
        assert.equal(1, sets.length);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            const result = sets[0].exercises[f];
            const ext = result.extension.extensions[0].carry;
            assert.equal(ext.toString(), '1,1,1,0');

            const value = result.expression.value;
            assert.equal(6998, value);

            const resultStr = result.rendered;
            assert.equal(resultStr.length, 4);
            assert.equal(resultStr[2].rendered, maskedCarryStr);
        }
    });

    it('regression test 100 - 95 should generate maskedCarryStr 110', async () => {
        const opts: Options = {
            quantity: 1,
            set: "N",
            label: 'sub_carry',
            extension: 'SUB_CARRY',
            operations: ['sub'],
            operands: [
                { exactMatchOf: 100 },
                { exactMatchOf: 95 }
            ]
        };
        const sets = await makeSet([opts])
        assert.equal(1, sets.length);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            const result = sets[0].exercises[f];
            const value = result.expression.value;
            assert.equal(5, value);

            const resultStr = result.rendered;
            assert.equal(4, resultStr.length);

            const ext = result.extension.extensions;
            assert.equal(ext[0].carry.toString(), '1,1,0');
            assert.equal(resultStr[2].rendered, '- ?? ');
        }
    });

    it('[BUGFIX] test: 4252 - 929 should generate maskedCarryStr 0110', async () => {
        const opts: Options = {
            quantity: 1,
            set: "N",
            label: 'sub_carry',
            extension: 'SUB_CARRY',
            operations: ['sub'],
            operands: [
                { exactMatchOf: 4252 },
                { exactMatchOf: 928 }
            ]
        };
        const sets = await makeSet([opts])
        assert.equal(1, sets.length);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            const result = sets[0].exercises[f];
            const resultStr = result.rendered;
            const value = result.expression.value;
            assert.equal(resultStr.length, 4);
            assert.equal(resultStr[2].rendered, '- ? ? ');
        }
    });
});

/**
 * Multiplication
 */
describe('Multiplication with grid-like Extensions', function () {

    it('should generate Mulitplication Extensions for f_1 = 755 , f_2 = 6', async () => {
        const opts: Options = {
            quantity: 1,
            extension: 'MULT_MULT',
            set: "N",
            operations: ['mult'],
            operands: [{ exactMatchOf: 755 }, { exactMatchOf: 6 }]
        };

        const _sets = await makeSet([opts])
        const exercise = _sets[0].exercises[0]
        assert.isNotNull(exercise.expression.value);
        const actRendStrs: Rendered[] = exercise.rendered
        assert.equal(actRendStrs[0].rendered, '755 * 6');
        assert.isDefined(actRendStrs[1])
        assert.equal(exercise.extension.extensions.length, 1)

        assert.equal(actRendStrs[1].rendered, '     ?0');
        assert.equal(actRendStrs[2].rendered, '    ?00');
        assert.equal(actRendStrs[3].rendered, '   ??00')
        assert.equal(actRendStrs[4].rendered, '   ????')
    });

    it('should generate 3 small Mulitplications with f_1 {10..999} and f_2 {2..10}', async () => {
        const sets = await makeSet([mult_N999_N9])
        assert.equal(1, sets.length);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            const exercise = sets[0].exercises[f];
            assert.isNotNull(exercise.expression.value);
            const actualExtensions = exercise.extension.extensions;
            assert.isNotEmpty(actualExtensions);
        }
    });

    it('should generate Mulitplications Extensions for f_1 = 755 , f_2 = 68', async () => {
        const opts: Options = {
            quantity: 1,
            extension: 'MULT_MULT',
            set: "N",
            operations: ['mult'],
            operands: [{ exactMatchOf: 755 }, { exactMatchOf: 68 }]
        };
        const sets = await makeSet([opts])
        assert.equal(1, sets.length);
        const exercise = sets[0].exercises[0]
        assert.isNotNull(exercise.expression.value);
        const actRendStrs: Rendered[] = exercise.rendered
        assert.equal(actRendStrs[0].rendered, '755 * 68');
        const _l = actRendStrs[0].rendered.length
        assert.equal(_l, 8)
        console.warn(JSON.stringify(exercise))
        assert.isDefined(actRendStrs[1])
        assert.equal(exercise.extension.extensions.length, 3)

        // detailed asserts
        assert.equal(actRendStrs[1].rendered.length, _l)
        assert.equal(actRendStrs[2].rendered.length, _l)
        assert.equal(actRendStrs[3].rendered.length, _l)
        assert.equal(actRendStrs[4].rendered.length, _l)
        assert.equal(actRendStrs[1].rendered, '    ?0?0');
        assert.equal(actRendStrs[2].rendered, '   ???00');
        assert.equal(actRendStrs[3].rendered, '   ?    ')

        // here all digits are to be replaced by default string renderer, 
        // therefore the last '?' which in reality is a trailing '0', too
        assert.equal(actRendStrs[4].rendered, '   ?????')
    });

    it('should generate 3 medium Mulitplications with f_1 {100..999} and f_2 {10..99}', async () => {
        const sets = await makeSet([mult_N999_N99])
        assert.equal(1, sets.length);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            const exercise = sets[0].exercises[f];
            assert.isNotNull(exercise.expression.value);
            const actualExtensions = exercise.extension.extensions;
            assert.isNotEmpty(actualExtensions);
        }
    });

    it('should generate 3 large Mulitplications with f_1 {100..999} and f_2 {100..999}', async () => {
        const sets = await makeSet([mult_N999_N999])
        assert.equal(1, sets.length);
        for (let f = 0; f < sets[0].exercises.length; f++) {
            const exercise = sets[0].exercises[f];
            assert.isNotNull(exercise.expression.value);
            const actualExtensions = exercise.extension.extensions;
            assert.isNotEmpty(actualExtensions);
        }
    });
});

/**
 * Division (even)
 */
describe('Division without rest API', function () {

    it('[BUGFIX] test 627 : 11 = 57', async () => {
        const opts: Options = {
            quantity: 1,
            label: 'div_even',
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
        assert.equal(5, exercise.rendered.length);
    });

    it('[BUGFIX] test 1012 : 4 = 253', async () => {
        const opts: Options = {
            quantity: 1,
            label: 'div_even',
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
        assert.equal(7, exercise.rendered.length);
    });

    it('should generate 3 even division exercises from options', async () => {
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

    it('should generate 1000 even divisions exercises', async () => {
        const os: Options = {
            quantity: 1000,
            set: 'N',
            label: 'div_even',
            extension: 'DIV_EVEN',
            operations: ['div'],
            operands: [
                { rangeN: { min: 50, max: 256 } },
                { rangeN: { min: 2, max: 12 } },
            ]
        };
        const sets = await makeSet([os])
        assert.equal(1, sets.length);
        assert.isTrue(sets[0].exercises.length === 1000);
        sets[0].exercises.forEach(exercise => assert.isDefined(exercise.rendered))
    });
})

describe('Fraction API', function () {
    it('should generate add fractions in q_1 {1/8 .. 16/8} and q_2 {1/12 .. 24/12}', async function () {
        const sets = await makeSet([add_fraction])
        assert.isTrue(sets[0].exercises.length > 1)
        for (let f = 0; f < sets[0].exercises.length; f++) {
            const exercise = sets[0].exercises[f];
            assert.isNotNull(exercise.expression.value);
            const actualExtensions = exercise.extension.extensions;
            assert.isNotEmpty(actualExtensions);
        }
    });

    it('should generate add fractions 13/8 + 7/4 = 27/8', async function () {
        const o: Options = {
            quantity: 1,
            set: 'Q',
            extension: 'ADD_FRACTION',
            operations: ['addQ'],
            operands: [
                { exactMatchOf: [1, 4] },
                { exactMatchOf: [1, 4] },
            ]
        }
        const sets = await makeSet([o])
        const rs: Rendered[] = sets[0].exercises[0].rendered
        assert.equal(rs[0].rendered, '1 1 (1*?)+(?*1) ?+?  ? 1')
        assert.equal(rs[1].rendered, '_+_=___________=___=__=_')
        assert.equal(rs[2].rendered, '4 4     ?*?      1? 1? ?')
    });

    it('should generate add fractions 13/8 + 7/4 = 27/8', async function () {
        const o: Options = {
            quantity: 1,
            set: 'Q',
            extension: 'ADD_FRACTION',
            operations: ['addQ'],
            operands: [
                { exactMatchOf: [13, 8] },
                { exactMatchOf: [7, 4] },
            ]
        }
        const sets = await makeSet([o])
        const rs: Rendered[] = sets[0].exercises[0].rendered
        assert.equal(rs[0].rendered, '13 7 (1?*?)+(?*?) ??+?? 10? ??')
        assert.equal(rs[1].rendered, '__+_=____________=_____=___=__')
        assert.equal(rs[2].rendered, ' 8 4     ?*?        ??   ??  ?')
    });

    it('should generate a sub fractions 1/2 - 2/11 = 7/22', async function () {
        const o: Options = {
            quantity: 1,
            set: 'Q',
            extension: 'SUB_FRACTION',
            operations: ['subQ'],
            operands: [
                { exactMatchOf: [1, 2] },
                { exactMatchOf: [2, 11] },
            ]
        }
        const sets = await makeSet([o])
        const rs: Rendered[] = sets[0].exercises[0].rendered
        assert.equal(rs[0].rendered, '1  2 (1*11)-(?*?) 11-?  ?')
        assert.equal(rs[1].rendered, '_-__=____________=____=__')
        assert.equal(rs[2].rendered, '2 11     ?*11      ??  ??')
    });

    it('should generate 1000 sub fractions exercises from options', async function () {
        const opts: Options = {
            quantity: 1000,
            set: 'Q',
            extension: 'SUB_FRACTION',
            operations: ['subQ'],
            operands: [
                { rangeQ: { min: [1, 8], max: [64, 8] } },
                { rangeQ: { min: [1, 12], max: [24, 12] } },
            ]
        };
        const sets = await makeSet([opts])
        sets[0].exercises.forEach(exercise => assert.isDefined(exercise.rendered))
    });

    it('should generate mult fraction 2/3 * 5/8 = 5/12', async function () {
        const o: Options = {
            quantity: 1,
            set: 'Q',
            extension: 'MULT_FRACTION',
            operations: ['multQ'],
            operands: [
                { exactMatchOf: [2, 3] },
                { exactMatchOf: [5, 8] },
            ]
        }
        const sets = await makeSet([o])
        const rs: Rendered[] = sets[0].exercises[0].rendered
        assert.equal(rs[0].rendered, '2 5 ?*? 10  ?')
        assert.equal(rs[1].rendered, '_*_=___=__=__')
        assert.equal(rs[2].rendered, '3 8 ?*? ?? 1?')
    });

    it('should generate mult fractions exercises from options', async function () {
        const sets = await makeSet([mult_fraction])
        sets[0].exercises.forEach(exercise => assert.isDefined(exercise.rendered))
    });

    it('should generate div fractions exercises from options', async () => {
        const sets = await makeSet([div_fraction])
        sets[0].exercises.forEach(exercise => assert.isDefined(exercise.rendered))
    });

    it('should generate 1000 div fraction exercises', async () => {
        const o: Options = {
            quantity: 1000,
            set: 'Q',
            extension: 'DIV_FRACTION',
            operations: ['ratio'],
            operands: [
                { rangeQ: { min: [1, 36], max: [144, 36] } },
                { rangeQ: { min: [1, 36], max: [72, 36] } },
            ]
        }
        const sets = await makeSet([o])
        sets[0].exercises.forEach(exercise => assert.isDefined(exercise.rendered))
    });

    it('[BUGFIX] should generate mult fraction 1/6 * 1/3 = 1/18', async function () {
        const o: Options = {
            quantity: 1,
            set: 'Q',
            extension: 'MULT_FRACTION',
            operations: ['multQ'],
            operands: [
                { exactMatchOf: [1, 6] },
                { exactMatchOf: [1, 3] },
            ]
        }
        const sets = await makeSet([o])
        const rs: Rendered[] = sets[0].exercises[0].rendered
        assert.equal(rs[0].rendered, '1 1 1*1  1')
        assert.equal(rs[1].rendered, '_*_=___=__')
        assert.equal(rs[2].rendered, '6 3 ?*? 1?')
    })

    const timestamp = Date.now()
    const exercises = 'div_even,mult_fraction'
    const fileName = 'test_make_exercises_serializer_' + timestamp + '.pdf'

    it('should serialize "' + exercises + '" NodeJS Stream to "' + fileName + '"', async () => {
        const fsStream: NodeJS.WritableStream = fs.createWriteStream(fileName)
        await makeExercisePDF(fsStream, exercises)
    })
})
