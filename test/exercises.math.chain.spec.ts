import { assert, expect } from 'chai';
import { ExerciseMath, ExerciseType } from '../src/exercises.math';
import { makeSet } from '../src/exercises.math';


describe('ChainOperators', function () {
    it('should generate 2 Exercises with 3 operands and 2x add', function (done) {
        const opts: ExerciseType = {
            quantity: 2, level: 1,
            operations: ['add', 'add']
        };
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    assert.equal(2, exercises[e].length);
                    let ex: ExerciseMath = exercises[e][f];
                    let renderOut = ex.get()[0];
                    assert.isTrue(renderOut.indexOf('+') > 0);
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

    it('should generate 2 Exercises with 3 operands, add and sub', function (done) {
        const opts: ExerciseType = {
            quantity: 2, level: 1,
            operations: ['add', 'sub'],
            operands: [
                { range: { min: 20, max: 50 } },
                { range: { min: 10, max: 25 } },
                { range: { max: 20 } }
            ]
        };

        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    assert.equal(2, exercises[e].length);
                    let ex: ExerciseMath = exercises[e][f];
                    let renderOut = ex.get()[0];
                    assert.isTrue(renderOut.indexOf('+') > 0);
                    assert.isTrue(renderOut.indexOf('-') > 0);
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

    it('should generate Exercise with 4x mult', function (done) {
        const opts: ExerciseType = {
            level: 1, quantity: 1,
            operations: ['mult', 'mult', 'mult', 'mult'],
            operands: [
                { range: { max: 5 } },
                { range: { max: 4 } }
            ]
        };

        // act
        makeSet([opts]).then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            let ex: ExerciseMath = exercises[0][0];
            let renderOut = ex.get()[0];
            assert.isTrue(renderOut.split('*').length == 5, 'expect 5 parts of *, but found: ' + renderOut);
            done();
        }).catch(err => {
            if (console) {
                console.log(err);
            }
            done(err);
        });
    });
});
