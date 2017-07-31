import { assert, expect } from 'chai';

import { ExerciseMath, ExerciseMathImpl } from '../src/exercises.math.types';
import * as exercise from '../src/exercises.math';

// describe('Multplication', function () {
//     [0, 1, 2, 3, 4].forEach(() => {
//         const em = exercise.multN10Nof2();
//         it('#multN10Nof2() => "' + em.expression.toString() + '"', function () {
//             const rest = em.expression.value.n % 2;
//             assert.isTrue(rest === 0);
//         });
//     });

//     [0, 1, 2, 3, 4].forEach(() => {
//         const em = exercise.multN10Nof5();
//         it('#multN10Nof5() => "' + em.expression.toString() + '"', function () {
//             const rest = em.expression.value.n % 5;
//             assert.isTrue(rest === 0);
//         });
//     });

//     [0, 1, 2, 3, 4].forEach(() => {
//         const em = exercise.multN10Nof10();
//         it('#multN10Nof10() => "' + em.expression.toString() + '"', function () {
//             const rest = em.expression.value.n % 10;
//             assert.isTrue(rest === 0);
//         });
//     });

//     [0, 1, 2, 3, 4].forEach(() => {
//         const em = exercise.multN10ofX(7);
//         it('#multN10ofX(7) => "' + em.expression.toString() + '"', function () {
//             const rest = em.expression.value.n % 7;
//             assert.isTrue(rest === 0);
//         });
//     });

//     [0, 1, 2, 3, 4].forEach(() => {
//         const em = exercise.multR100();
//         it('#multR100() => "' + em.expression.toString() + '"', function () {
//             assert.isTrue(em.expression.value.n <= 400);
//         });
//     });
// });

// describe('Division', function () {
//     [0, 1, 2, 3, 4].forEach(() => {
//         const em = exercise.divR100();
//         it('#divR100() => "' + em.expression.toString() + '"', function () {
//             assert.isTrue(em.expression.value.n <= 100);
//         });
//     });

//     [0, 1, 2, 3, 4].forEach(() => {
//         const em = exercise.divR100(5);
//         it('#divR100(5) => "' + em.expression.toString() + '"', function () {
//             assert.isTrue(em.expression.value.n <= 100);
//         });
//     });
// });

/**
 * Test Set Interface
 */
describe('Test Set with default Options', function () {
    it('should generate 12 Exercises', function (done) {
        const exercises = exercise.makeSet();
        exercises.then((exercises: ExerciseMath[]) => {
            assert.equal(12, exercises.length);
            for(let e=0; e < exercises.length; e++) {
                console.log('ex : ' + exercises[e].expression.toString());
            }
        });
        done();
    });
});
