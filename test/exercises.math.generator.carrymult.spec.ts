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

    it('should generate correct 3-row-matrix for 64*64', function () {
        const expr: Expression = {
            operands: [64, 64],
            operations: ['mult'],
            value: 4096
        };
        const exts: ExtensionExpression[] = generateExtensionsCarryMult(expr);
        assert.equal(3, exts.length);

        // fist part
        assert.equal('0,1,6', exts[0].operands[0].toString());
        assert.equal('2,4,0', exts[0].operands[1].toString());
        assert.equal('0,0,0', exts[0].carry.toString());
        assert.equal('2,5,6', exts[0].value.toString());
        assert.equal(2, exts[0].operands.length);
        
        // second part
        assert.equal('0,2,4,0', exts[1].operands[0].toString());
        assert.equal('3,6,0,0', exts[1].operands[1].toString());
        assert.equal('0,0,0,0', exts[1].carry.toString());
        assert.equal('3,8,4,0', exts[1].value.toString());

    });

    it('should generate correct 4-row-matrix for 512*512', function () {
        const expr: Expression = {
            operands: [512, 512],
            operations: ['mult'],
            value: 262144
        };
        const exts: ExtensionExpression[] = generateExtensionsCarryMult(expr);
        assert.equal(4, exts.length);

        // fist part
        assert.equal(3, exts[0].operands.length);
        assert.equal('0,0,0,4', exts[0].operands[0].toString());
        assert.equal('0,0,2,0', exts[0].operands[1].toString());
        assert.equal('1,0,0,0', exts[0].operands[2].toString());
        assert.equal('0,0,0,0', exts[0].carry.toString());
        assert.equal('1,0,2,4', exts[0].value.toString());

        // second part
        assert.equal('0,0,2,0', exts[1].operands[0].toString());
        assert.equal('0,1,0,0', exts[1].operands[1].toString());
        assert.equal('5,0,0,0', exts[1].operands[2].toString());
        assert.equal('0,0,0,0', exts[1].carry.toString());
        assert.equal('5,1,2,0', exts[1].value.toString());

        // third part
        assert.equal('0,0,1,0,0,0', exts[2].operands[0].toString());
        assert.equal('0,0,5,0,0,0', exts[2].operands[1].toString());
        assert.equal('2,5,0,0,0,0', exts[2].operands[2].toString());
        assert.equal('0,0,0,0,0,0', exts[2].carry.toString());
        assert.equal('2,5,6,0,0,0', exts[2].value.toString());

        // fourth part
        assert.equal('0,0,1,0,2,4', exts[3].operands[0].toString());
        assert.equal('0,0,5,1,2,0', exts[3].operands[1].toString());
        assert.equal('2,5,6,0,0,0', exts[3].operands[2].toString());
        assert.equal('0,1,0,0,0,0', exts[3].carry.toString());
        assert.equal('2,6,2,1,4,4', exts[3].value.toString());
    });
});
