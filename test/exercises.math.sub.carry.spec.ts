import { assert, expect } from 'chai';
import { 
    ExerciseSet,
    Options,
    makeSet 
} from '../src/exercises.math';

/**
 * Test Subtraction with Carry
 */
describe('Subtraction with Carry', function () {

    it('should generate 1 Subtraction with Carry ', function (done) {
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
        const maskedCarryStr = '-  __ ';
        makeSet([opts]).then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            for (let f = 0; f < sets[0].exercises.length; f++) {
                const result = sets[0].exercises[f].rendered;
                const actual = result[result.length - 2];
                const value = result[result.length - 1];
                assert.equal('0,1,1,0', sets[0].exercises[f].extension.extensions[0].carry.toString());
                assert.equal(4, result.length);
                assert.isTrue(typeof actual === 'string');
                assert.equal(actual, maskedCarryStr);
                assert.equal('  ____', value);
                assert.equal(actual.length, value.length);
                assert.equal(actual.length, result[0].length);
            }
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

    it('regression test 7413 - 415 should generate maskedCarryStr 1110', function (done) {
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
        const maskedCarryStr = '- ___ ';
        makeSet([opts]).then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            for (let f = 0; f < sets[0].exercises.length; f++) {
                const result = sets[0].exercises[f];
                const ext = result.extension.extensions[0].carry;
                assert.equal('1,1,1,0', ext.toString());
                
                const value = result.expression.value;
                assert.equal(6998, value);
                
                const resultStr = result.rendered;
                assert.equal(4, resultStr.length);
                assert.equal(resultStr[2], maskedCarryStr);
            }
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

    it('regression test 100 - 95 should generate maskedCarryStr 110', function (done) {
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
        makeSet([opts]).then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            for (let f = 0; f < sets[0].exercises.length; f++) {
                const result = sets[0].exercises[f];
                const value = result.expression.value;
                assert.equal(5, value);

                const resultStr = result.rendered;
                assert.equal(4, resultStr.length);

                const ext = result.extension.extensions;
                assert.equal('1,1,0', ext[0].carry.toString());
                assert.equal(resultStr[2], '- __ ');
            }
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

    it('bugfix test: 4252 - 929 should generate maskedCarryStr 0110', async ()=> {
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
            assert.equal(3324, value);
            assert.equal(4, resultStr.length);
            assert.equal(resultStr[2], '- _ _ ');
        }
    });

});
