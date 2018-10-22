import { assert } from 'chai';
import {
    addFraction,
    Fraction,
    Exercise,
    ExerciseSet,
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
 * Test Exercise Functions
 */
describe('Rational Functions', function () {
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
            quantity: 2, level: 1, set: "N",
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
            quantity: 2, level: 1, set: "N",
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
            level: 1, quantity: 1, set: "N",
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
            level: 2,
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
            level: 2,
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
            level: 2,
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
            level: 2,
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
            level: 3,
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
            level: 3,
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
            level: 3,
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

    it('bugfix test: 4252 - 929 should generate maskedCarryStr 0110', async () => {
        const opts: Options = {
            quantity: 1,
            set: "N",
            level: 3,
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
            level: 4,
            extension: 'MULT_MULT',
            set: "N",
            operations: ['mult'],
            operands: [{ exactMatchOf: 755 }, { exactMatchOf: 6 }]
        };

        const _sets = await makeSet([opts])
        const exercise = _sets[0].exercises[0]
        assert.isNotNull(exercise.expression.value);
        const actualExtensions = exercise.extension.extensions;
        const actRendStrs: Rendered[] = exercise.rendered
        //console.log('### API ' + JSON.stringify(actRendStrs))
        assert.equal(actRendStrs[0].rendered, '755 * 6');
        assert.isDefined(actRendStrs[1])
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
        assert.equal(5, exercise.rendered.length);
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
        assert.equal(7, exercise.rendered.length);
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
