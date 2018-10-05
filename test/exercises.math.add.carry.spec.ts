import { assert } from 'chai';
import { 
    Exercise,
    ExerciseSet,
    Options, 
    makeSet 
} from '../src/exercises.math';

/**
 * Test Addition with Carry
 * 
 *  
 */
describe('Addition with Carry', function () {

    it('should generate 1 Addition with Carry ', function (done) {
        const opts: Options = {
            quantity: 1, 
            set: 'N',
            extension: 'ADD_CARRY',
            level: 2,
            operations: ['add', 'add'],
            operands: [{ exactMatchOf: 9903 }, { exactMatchOf: 819 }, { exactMatchOf: 77 }]
        };
        const carry = '+  _ _ ';
        makeSet([opts]).then((exerciseSets: ExerciseSet[]) => {
            assert.equal(1, exerciseSets.length);
            const result = exerciseSets[0].exercises[0].rendered;
            const actual = result[result.length - 2];
            const value = result[result.length - 1];

            assert.equal(5, result.length);
            assert.equal(actual, carry);
            assert.equal('  _____', value);
            assert.equal(actual.length, value.length);
            assert.equal(actual.length, result[0].length);
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

    it('regression test 601+373+83 should generate carry 100', function (done) {
        const opts: Options = {
            quantity: 1, 
            extension: 'ADD_CARRY',
            level: 2,
            set: "N",
            operations: ['add', 'add'],
            operands: [{ exactMatchOf: 601 }, { exactMatchOf: 373 }, { exactMatchOf: 83 }]
        };
        const carry = '+  _  ';
        makeSet([opts]).then((exerciseSets: ExerciseSet[]) => {
            assert.equal(1, exerciseSets.length);
            const result = exerciseSets[0].exercises[0].rendered;
            const actual = result[result.length - 2];
            const value = result[result.length - 1];

            assert.equal(5, result.length);
            assert.isTrue(typeof actual === 'string');
            assert.equal(actual, carry);
            assert.equal('  ____', value);
            assert.equal(actual.length, value.length);
            assert.equal(actual.length, result[0].length);
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

    it('regression test 4250+314+80 should generate carry 100', function (done) {
        const opts: Options = {
            quantity: 1, 
            level: 2,
            extension: 'ADD_CARRY',
            set: "N",
            operations: ['add', 'add'],
            operands: [{ exactMatchOf: 4250 }, { exactMatchOf: 314 }, { exactMatchOf: 80 }]
        };
        const carry = '+  _  ';
        makeSet([opts]).then((exerciseSets: ExerciseSet[]) => {
            assert.equal(1, exerciseSets.length);
            const result = exerciseSets[0].exercises[0].rendered;
            const actual = result[result.length - 2];
            const value = result[result.length - 1];

            assert.equal(5, result.length);
            assert.isTrue(typeof actual === 'string');
            assert.equal(actual, carry);
            assert.equal('  ____', value);
            assert.equal(actual.length, value.length);
            assert.equal(actual.length, result[0].length);
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

    it('regression test 6714+306+75 should generate carry 1010', function (done) {
        const opts: Options = {
            quantity: 1, 
            level: 2,
            extension: 'ADD_CARRY',
            set: "N",
            operations: ['add', 'add'],
            operands: [{ exactMatchOf: 6714 }, { exactMatchOf: 306 }, { exactMatchOf: 75 }]
        };
        const carry = '+ _ _ ';
        makeSet([opts]).then((exerciseSets: ExerciseSet[]) => {
            assert.equal(1, exerciseSets.length);
            const result = exerciseSets[0].exercises[0];
            const resultStr = result.rendered;
            const actual = resultStr[resultStr.length - 2];
            const value = result.expression.value;

            assert.equal(5, resultStr.length);
            assert.isTrue(typeof actual === 'string');
            assert.equal(7095, value);
            assert.equal(actual.length, resultStr[0].length);
            assert.equal(actual, carry);
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });
});
