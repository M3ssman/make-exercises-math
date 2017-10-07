import { assert, expect } from 'chai';
import { ExerciseMath, ExerciseType } from '../src/exercises.math';
import { makeSet, addN50N25Nof10, subN99N19Nof10, multN10N10 } from '../src/exercises.math';

/**
 * Test Exercise Types Exported Types
 */
describe('DefaultOptions', function () {
    it('should generate 12 default Exercises that contain symbol "+"', function (done) {
        makeSet().then((exercises: ExerciseMath[][]) => {
            assert.equal(1, exercises.length);
            for (let e = 0; e < exercises.length; e++) {
                for (let f = 0; f < exercises[e].length; f++) {
                    assert.equal(12, exercises[e].length);
                    let ex: ExerciseMath = exercises[e][f];
                    let renderOut = ex.get()[0];
                    let opOffset = renderOut.indexOf('+');
                    assert.isTrue(opOffset > 0);
                }
            }
            done();
        }).catch( err => {
            if(console) {
                console.log(err);
            }
            done(err);
        });
    });
});
