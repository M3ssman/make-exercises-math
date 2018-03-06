import { assert, expect } from 'chai';
import { ExerciseMath, Expression, ExtensionExpression } from '../src/exercises.math';
import { generateExtensionsCarryMult } from '../src/exercises.math.generator';


describe('Generator', function () {
    it('should generate correct matrix for 432*8', function () {
        const expr: Expression = {
            operands: [432, 8],
            operations: ['mult'],
            value: 3456
        };
        const exts: ExtensionExpression[] = generateExtensionsCarryMult(expr);
        assert.equal(1, exts.length);
        assert.equal(3, exts[0].operands.length);
        assert.equal('0,0,1,6', exts[0].operands[0].toString());
        assert.equal('0,2,4,0', exts[0].operands[1].toString());
        assert.equal('3,2,0,0', exts[0].operands[2].toString());
        assert.equal('0,0,0,0', exts[0].carry.toString());
        assert.equal('3,4,5,6', exts[0].value.toString());
    });
});
