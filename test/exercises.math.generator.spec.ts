import { assert, expect } from 'chai';
import { ExerciseMath, Expression, ExtensionExpression } from '../src/exercises.math';
import {
    generateExtensionsCarryMult,
    generateExtensionsDiv,
    _compose_digit,
    _how_often
} from '../src/exercises.math.generator';


describe('Generator Functions', function () {
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

        // third part
        assert.equal('0,2,5,6', exts[2].operands[0].toString());
        assert.equal('3,8,4,0', exts[2].operands[1].toString());
        assert.equal('1,0,0,0', exts[2].carry.toString());
        assert.equal('4,0,9,6', exts[2].value.toString());

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

    it('Regression Extensions for 375*4 => 1500', function () {
        const expr: Expression = {
            operands: [375, 4],
            operations: ['mult'],
            value: 1500
        };
        const exts: ExtensionExpression[] = generateExtensionsCarryMult(expr);
        assert.equal(1, exts.length);
        assert.equal(3, exts[0].operands.length);
        assert.equal('0,0,2,0', exts[0].operands[0].toString());
        assert.equal('0,2,8,0', exts[0].operands[1].toString());
        assert.equal('1,2,0,0', exts[0].operands[2].toString());
        assert.equal('0,1,0,0', exts[0].carry.toString());
        assert.equal('1,5,0,0', exts[0].value.toString());
    });

    it('should generate correct extension set for 432 / 8', function () {
        const expr: Expression = {
            operands: [432, 8],
            operations: ['div'],
            value: 54
        };
        const exts: ExtensionExpression[] = generateExtensionsDiv(expr);
        console.log('exts? ' + JSON.stringify(exts));
        assert.equal(2, exts.length);
        
        assert.equal('4,3', exts[0].operands[0].toString());
        assert.equal('4,0', exts[0].operands[1].toString());
        assert.equal('0,3', exts[0].value.toString());

        assert.equal('3,2', exts[1].operands[0].toString());
        assert.equal('3,2', exts[1].operands[1].toString());
        assert.equal('0,0', exts[1].value.toString());
    });

    it('should compose correct digital numbers as sum from 0 to m using c * 10^(m-i)', function () {
        const as = [4,3,2,1];
        assert.equal(4321, _compose_digit(as, 3));
        assert.equal(432, _compose_digit(as, 2));
        assert.equal(43, _compose_digit(as, 1));
        assert.equal(4, _compose_digit(as, 0));
        assert.equal(0, _compose_digit([], 100));
    });

    it('should determine how often b fits into a', function () {
        assert.equal(4, _how_often(33, 8));
        assert.equal(4, _how_often(32, 8));
        assert.equal(3, _how_often(31, 8));
    });

    it('should generate correct extension set for 4096 / 64', function () {
        const expr: Expression = {
            operands: [4096, 64],
            operations: ['div'],
            value: 64
        };
        const exts: ExtensionExpression[] = generateExtensionsDiv(expr);
        console.log('exts? ' + JSON.stringify(exts));
        assert.equal(2, exts.length);
        
        assert.equal('4,0,9', exts[0].operands[0].toString());
        assert.equal('3,8,4', exts[0].operands[1].toString());
        assert.exists(exts[0].carry);
        assert.equal('1,0,0', exts[0].carry.toString());
        assert.equal('0,2,5', exts[0].value.toString());

        assert.equal('2,5,6', exts[1].operands[0].toString());
        assert.equal('2,5,6', exts[1].operands[1].toString());
        assert.notExists(exts[1].carry);
        assert.equal('0,0,0', exts[1].value.toString());
    });

});
