import { assert, expect } from 'chai';
import { ExerciseMath, ExerciseType, Expression } from '../src/exercises.math';
import { makeSet } from '../src/exercises.math';


describe('Constraints', function () {
    it('should generate Exercise with 25<=x<=50, y=24, z<=18 and result x10', function (done) {
        const type: ExerciseType = {
            quantity: 1, level: 2, operations: ['add', 'sub'],
            operands: [
                { range: { min: 25, max: 50 } },
                { exactMatchOf: 24 },
                { range: { max: 18 } }
            ],
            result: { multipleOf: 10 }
        };

        makeSet([type]).then((exercises: ExerciseMath[][]) => {
            let ex: ExerciseMath = exercises[0][0];
            const x = (<Expression>ex.expression).operands[0];
            const y = (<Expression>ex.expression).operands[1];
            const z = (<Expression>ex.expression).operands[2];
            const r = <number>ex.expression.value;
            assert.isTrue(25 <= x && x <= 50, 'expect 25 <= x <= 50, but x was ' + x);
            assert.equal(y, 24, 'expect y = 24, but y was: ' + y);
            assert.isTrue(z <= 18, 'expect z <= 18, but z was ' + z);
            assert.isTrue(r % 10 == 0, 'expect r % 10 == 0, but r was ' + r);
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });

    it('should generate Exercise with x_1 > x_2', function (done) {
        const type: ExerciseType = {
            quantity: 1, level: 2, operations: ['add'],
            operands: [
                { range: { min: 25, max: 50 }, greaterThanIndex:1 },
                { exactMatchOf: 47 }
            ]
        };

        makeSet([type]).then((exercises: ExerciseMath[][]) => {
            let ex: ExerciseMath = exercises[0][0];
            const x = (<Expression>ex.expression).operands[0];
            const y = (<Expression>ex.expression).operands[1];
            const z = (<Expression>ex.expression).operands[2];
            const r = <number>ex.expression.value;
            assert.isTrue( x >= 48, 'expect x => 48, but x was ' + x);
            assert.equal(y, 47);
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });
});
