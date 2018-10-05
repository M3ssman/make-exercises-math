import { assert } from 'chai';
import { 
    ExerciseSet,
    makeSet
} from '../src/exercises.math';

/**
 * Test Exercise Types Exported Types
 */
describe('DefaultOptions', function () {
    it('should generate 12 default Exercises that contain symbol "+"', function (done) {
        makeSet().then((sets: ExerciseSet[]) => {
            assert.equal(1, sets.length);
            assert.equal(12, sets[0].exercises.length);
            sets[0].exercises.forEach(ex => {
                let renderOut = ex.rendered[0];
                let opOffset = renderOut.indexOf('+');
                assert.isTrue(opOffset > 0);
            });
            done();
        }).catch( err => {
            if(console) {
                console.log(err);
            }
            done(err);
        });
    });
});
