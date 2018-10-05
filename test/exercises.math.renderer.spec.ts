import { assert } from 'chai';
import { 
    makeSet,
    Exercise,
    ExerciseSet,
    Options, ExtensionType 
} from '../src/exercises.math';
import { 
    div_even 
} from '../src/exercises.math.options';
import {
    _exchangeTrailingZeros
} from '../src/exercises.math.renderer'

/**
 * Multiplication
 */
describe('Renderer Functions', function () {

    it('_exchangeTrailingZeros ([0,0,1])', () => {
        const actual =_exchangeTrailingZeros([0,0,1],false);
        assert.equal(actual, '  1');
    });

    it('_exchangeTrailingZeros ([0,0])', () => {
        const actual =_exchangeTrailingZeros([0,0],false);
        assert.equal(actual, ' 0');
    });

    it('_exchangeTrailingZeros ([0,0], true)', () => {
        const actual =_exchangeTrailingZeros([0,0],true);
        assert.equal(actual, '00');
    });

    it('_exchangeTrailingZeros ([0,6], true)', () => {
        const actual =_exchangeTrailingZeros([0,6],true);
        assert.equal(actual, '06');
    });
});
