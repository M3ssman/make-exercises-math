import { assert } from 'chai';
import { 
    Exercise,
    ExerciseSet, 
    Options 
} from '../src/exercises.math';
import { makeSet } from '../src/exercises.math';


describe('ChainOperators', function () {
    it('should generate 2 Exercises with 3 operands and 2x add', function (done) {
        const opts: Options = {
            quantity: 2, level: 1,set: "N",
            operations: ['add', 'add']
        };
        makeSet([opts]).then((set: ExerciseSet[]) => {
            assert.equal(1, set.length);
            assert.equal(2, set[0].exercises.length);
            for (let f = 0; f < set[0].exercises.length; f++) {
                let ex: Exercise = set[0].exercises[f];
                let renderOut = ex.rendered[0];
                assert.isTrue(renderOut.indexOf('+') > 0);
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
        const opts: Options = {
            quantity: 2, level: 1,set: "N",
            operations: ['add', 'sub'],
            operands: [
                { rangeN: { min: 20, max: 50 } },
                { rangeN: { min: 10, max: 25 } },
                { rangeN: { max: 20 } }
            ]
        };

        makeSet([opts]).then((set: ExerciseSet[]) => {
            assert.equal(1, set.length);
            assert.equal(2, set[0].exercises.length);
            for (let f = 0; f < set[0].exercises.length; f++) {
                let ex: Exercise = set[0].exercises[f];
                let renderOut = ex.rendered[0];
                assert.isTrue(renderOut.indexOf('+') > 0);
                assert.isTrue(renderOut.indexOf('-') > 0);
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
        const opts: Options = {
            level: 1, quantity: 1,set: "N",
            operations: ['mult', 'mult', 'mult', 'mult'],
            operands: [
                { rangeN: { max: 5 } },
                { rangeN: { max: 4 } }
            ]
        };

        // act
        makeSet([opts]).then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            let ex: Exercise = sets[0].exercises[0];
            let renderOut = ex.rendered[0];
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
