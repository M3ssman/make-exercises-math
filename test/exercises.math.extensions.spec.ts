import { assert } from 'chai';
import {
    Expression,
    ExtensionExpression
} from '../src/exercises.math';
import {
    extendMultCarry,
    extendDivEven,
    extendAddFraction,
    _compose_digit,
    _how_often,
    _greater,
} from '../src/exercises.math.extensions';


describe('Extension Functions', () => {
    it('should hold: [6,2] > [1,1]', () => {
        assert.isTrue(_greater([6, 2], [1, 1]))
    })
    it('should hold: [6] < [1,1]', () => {
        assert.isFalse(_greater([6], [1, 1]))
    })
    it('should hold: [3,3,3] < [3,3,3]', () => {
        assert.isFalse(_greater([3, 3, 3], [3, 3, 3]))
    })
    it('should compose correct digital numbers as sum from 0 to m using c * 10^(m-i)', function () {
        const as = [4, 3, 2, 1];
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
});


describe('Extension API', function () {
    it('9/8 + 5/12 = (9*12 + 8*5)/(8*12) = 37/24', () => {
        const expr: Expression = {
            operations: ['add'],
            operands:[[9,8], [5,12]],
            value: [37, 24]
        };
        const ee: ExtensionExpression = extendAddFraction({ expression: expr }).extension;
        assert.equal(ee.extensions[0].operands.length, 6)
        assert.equal(ee.extensions[0].operands[0].toString(), '9,12');
        assert.equal(ee.extensions[0].operands[1].toString(), '8,5');
        assert.equal(ee.extensions[0].operands[2].toString(), '8,12');
        assert.equal(ee.extensions[0].operands[3].toString(), '108,40');
        assert.equal(ee.extensions[0].operands[4].toString(), '96');
        assert.equal(ee.extensions[0].operands[5].toString(), '148,96');
        assert.equal(ee.extensions[0].value.toString(), '37,24');
    });

    it('2/3 + 4/11 = (2*11 + 4*3)/(3*11) = 34/33', () => {
        const expr: Expression = {
            operations: ['add'],
            operands: [[2, 3], [4, 11]],
            value: [34, 33]
        };
        const ee: ExtensionExpression = extendAddFraction({ expression: expr }).extension;
        assert.equal(ee.extensions[0].operands.length, 5)
        assert.equal(ee.extensions[0].operands[0].toString(), '2,11');
        assert.equal(ee.extensions[0].operands[1].toString(), '3,4');
        assert.equal(ee.extensions[0].operands[2].toString(), '3,11');
        assert.equal(ee.extensions[0].operands[3].toString(), '22,12');
        assert.equal(ee.extensions[0].operands[4].toString(), '33');
        assert.equal(ee.extensions[0].value.toString(), '34,33');
    });

    it('2/3 + 1/6 = (2*6 + 3*1)/(3*6) = 5/6', () => {
        const expr: Expression = {
            operations: ['add'],
            operands: [[2, 3], [1, 6]],
            value: [5, 6]
        };
        const ee: ExtensionExpression = extendAddFraction({ expression: expr }).extension
        assert.equal(ee.extensions[0].operands.length, 6)
        assert.equal(ee.extensions[0].operands[0].toString(), '2,6');
        assert.equal(ee.extensions[0].operands[1].toString(), '3,1');
        assert.equal(ee.extensions[0].operands[2].toString(), '3,6');
        assert.equal(ee.extensions[0].operands[3].toString(), '12,3');
        assert.equal(ee.extensions[0].operands[4].toString(), '18');
        assert.equal(ee.extensions[0].operands[5].toString(), '15,18');
    });

    it('bugfix test 2222 : 11 = 202', () => {
        const expr: Expression = {
            operations: ['div'],
            operands: [2222, 11],
            value: 202
        };
        const ee: ExtensionExpression = extendDivEven({ expression: expr }).extension
        assert.equal(3, ee.extensions.length);
        assert.equal(ee.extensions[0].operands[0].toString(), '2,2');
        assert.equal(ee.extensions[0].operands[1].toString(), '2,2');
        assert.equal(ee.extensions[0].value.toString(), '0,0');
        assert.equal(ee.extensions[1].operands[0].toString(), '2');
        assert.equal(ee.extensions[1].operands[1].toString(), '0');
        assert.equal(ee.extensions[1].value.toString(), '2');
        assert.equal(ee.extensions[2].operands[0].toString(), '2,2');
        assert.equal(ee.extensions[2].operands[1].toString(), '2,2');
        assert.equal(ee.extensions[2].value.toString(), '0,0');
    });

    it('bugfix test 1100 : 10 = 110', () => {
        const expr: Expression = {
            operations: ['div'],
            operands: [1100, 10],
            value: 110
        };
        const ee: ExtensionExpression = extendDivEven({ expression: expr }).extension
        //console.log('### EXT ' + JSON.stringify(ee))
        assert.equal(3, ee.extensions.length);
        assert.equal(ee.extensions[0].operands[0].toString(), '1,1');
        assert.equal(ee.extensions[0].operands[1].toString(), '1,0');
        assert.equal(ee.extensions[0].value.toString(), '0,1');
        assert.equal(ee.extensions[1].operands[0].toString(), '1,0');
        assert.equal(ee.extensions[1].operands[1].toString(), '1,0');
        assert.equal(ee.extensions[1].value.toString(), '0,0');
        assert.equal(ee.extensions[2].operands[0].toString(), '0');
        assert.equal(ee.extensions[2].operands[1].toString(), '0');
        assert.equal(ee.extensions[2].value.toString(), '0');
    });

    it('bugfix test 636 : 6 = 106', () => {
        const expr: Expression = {
            operations: ['div'],
            operands: [636, 6],
            value: 106
        };
        const ee: ExtensionExpression = extendDivEven({ expression: expr }).extension
        assert.equal(3, ee.extensions.length);
        assert.equal(ee.extensions[0].operands[0].toString(), '6');
        assert.equal(ee.extensions[0].operands[1].toString(), '6');
        assert.equal(ee.extensions[0].value.toString(), '0');
        assert.equal(ee.extensions[1].operands[0].toString(), '3');
        assert.equal(ee.extensions[1].operands[1].toString(), '0');
        assert.equal(ee.extensions[1].value.toString(), '3');
        assert.equal(ee.extensions[2].operands[0].toString(), '3,6');
        assert.equal(ee.extensions[2].operands[1].toString(), '3,6');
        assert.equal(ee.extensions[2].value.toString(), '0,0');
    });

    it('bugfix test 549 : 3 = 183', () => {
        const expr: Expression = {
            operations: ['div'],
            operands: [549, 3],
            value: 183
        };
        const ee: ExtensionExpression = extendDivEven({ expression: expr }).extension
        assert.equal(3, ee.extensions.length);
        assert.equal(ee.extensions[0].operands[0].toString(), '5');
        assert.equal(ee.extensions[0].operands[1].toString(), '3');
        assert.equal(ee.extensions[0].value.toString(), '2');
        assert.equal(ee.extensions[1].operands[0].toString(), '2,4');
        assert.equal(ee.extensions[1].operands[1].toString(), '2,4');
        assert.equal(ee.extensions[1].value.toString(), '0,0');
        assert.equal(ee.extensions[2].operands[0].toString(), '9');
        assert.equal(ee.extensions[2].operands[1].toString(), '9');
        assert.equal(ee.extensions[2].value.toString(), '0');
    });

    it('bugfix test 627 : 11 = 57', () => {
        const expr: Expression = {
            operations: ['div'],
            operands: [627, 11],
            value: 57
        };
        const ee: ExtensionExpression = extendDivEven({ expression: expr }).extension
        assert.equal(2, ee.extensions.length);
        assert.equal(ee.extensions[0].operands[0].toString(), '6,2');
        assert.equal(ee.extensions[0].operands[1].toString(), '5,5');
    });

    it('bugfix generate correct extensions for 630 / 9', () => {
        const expr: Expression = {
            operands: [630, 9],
            operations: ['div'],
            value: 70
        };
        const ee: ExtensionExpression = extendDivEven({ expression: expr }).extension
        assert.equal(2, ee.extensions.length);

        assert.equal('6,3', ee.extensions[0].operands[0].toString());
        assert.equal('6,3', ee.extensions[0].operands[1].toString());
        assert.equal('0,0', ee.extensions[0].value.toString());

        assert.equal(ee.extensions[1].operands[0].toString(), '0');
        assert.equal(ee.extensions[1].operands[1].toString(), '0');
        assert.notExists(ee.extensions[1].carry);
        assert.equal(ee.extensions[1].value.toString(), '0');
    });

    it('bugfix generate correct extensions for 1012 / 4', () => {
        const expr: Expression = {
            operands: [1012, 4],
            operations: ['div'],
            value: 253
        };
        const ee: ExtensionExpression = extendDivEven({ expression: expr }).extension
        assert.equal(3, ee.extensions.length);

        assert.equal('1,0', ee.extensions[0].operands[0].toString());
        assert.equal('0,8', ee.extensions[0].operands[1].toString());
        assert.equal('0,2', ee.extensions[0].value.toString());

        assert.equal(ee.extensions[1].operands[0].toString(), '2,1');
        assert.equal(ee.extensions[1].operands[1].toString(), '2,0');
        assert.notExists(ee.extensions[1].carry);
        assert.equal(ee.extensions[1].value.toString(), '0,1');

        assert.equal(ee.extensions[2].operands[0].toString(), '1,2')
        assert.equal(ee.extensions[2].operands[1].toString(), '1,2')
        assert.notExists(ee.extensions[2].carry);
        assert.equal(ee.extensions[2].value.toString(), '0,0');
    });

    it('should generate correct extension set for 4096 / 64', function () {
        const expr: Expression = {
            operands: [4096, 64],
            operations: ['div'],
            value: 64
        };
        const ee: ExtensionExpression = extendDivEven({ expression: expr }).extension
        assert.equal(2, ee.extensions.length);

        assert.equal('4,0,9', ee.extensions[0].operands[0].toString());
        assert.equal('3,8,4', ee.extensions[0].operands[1].toString());
        assert.equal('0,2,5', ee.extensions[0].value.toString());

        assert.equal('2,5,6', ee.extensions[1].operands[0].toString());
        assert.equal('2,5,6', ee.extensions[1].operands[1].toString());
        assert.notExists(ee.extensions[1].carry);
        assert.equal('0,0,0', ee.extensions[1].value.toString());
    });

    it('should generate correct matrix for 432*8', function () {
        const expr: Expression = {
            operands: [432, 8],
            operations: ['mult'],
            value: 3456
        };
        const ee: ExtensionExpression = extendMultCarry({ expression: expr }).extension
        assert.equal(1, ee.extensions.length);
        assert.equal(3, ee.extensions[0].operands.length);
        assert.equal('0,0,1,6', ee.extensions[0].operands[0].toString());
        assert.equal('0,2,4,0', ee.extensions[0].operands[1].toString());
        assert.equal('3,2,0,0', ee.extensions[0].operands[2].toString());
        assert.equal('3,4,5,6', ee.extensions[0].value.toString());
    });

    it('should generate correct 3-row-matrix for 64*64', function () {
        const expr: Expression = {
            operands: [64, 64],
            operations: ['mult'],
            value: 4096
        };
        const ee: ExtensionExpression = extendMultCarry({ expression: expr }).extension
        assert.equal(3, ee.extensions.length);

        // fist part
        assert.equal('0,1,6', ee.extensions[0].operands[0].toString());
        assert.equal('2,4,0', ee.extensions[0].operands[1].toString());
        assert.equal('2,5,6', ee.extensions[0].value.toString());
        assert.equal(2, ee.extensions[0].operands.length);

        // second part
        assert.equal('0,2,4,0', ee.extensions[1].operands[0].toString());
        assert.equal('3,6,0,0', ee.extensions[1].operands[1].toString());
        assert.equal('3,8,4,0', ee.extensions[1].value.toString());

        // third part
        assert.equal('0,2,5,6', ee.extensions[2].operands[0].toString());
        assert.equal('3,8,4,0', ee.extensions[2].operands[1].toString());
        assert.equal('4,0,9,6', ee.extensions[2].value.toString());

    });

    it('should generate correct 4-row-matrix for 512*512', function () {
        const expr: Expression = {
            operands: [512, 512],
            operations: ['mult'],
            value: 262144
        };
        const ee: ExtensionExpression = extendMultCarry({ expression: expr }).extension
        assert.equal(4, ee.extensions.length);

        // fist part
        assert.equal(3, ee.extensions[0].operands.length);
        assert.equal('0,0,0,4', ee.extensions[0].operands[0].toString());
        assert.equal('0,0,2,0', ee.extensions[0].operands[1].toString());
        assert.equal('1,0,0,0', ee.extensions[0].operands[2].toString());
        assert.equal('1,0,2,4', ee.extensions[0].value.toString());

        // second part
        assert.equal('0,0,2,0', ee.extensions[1].operands[0].toString());
        assert.equal('0,1,0,0', ee.extensions[1].operands[1].toString());
        assert.equal('5,0,0,0', ee.extensions[1].operands[2].toString());
        assert.equal('5,1,2,0', ee.extensions[1].value.toString());

        // third part
        assert.equal('0,0,1,0,0,0', ee.extensions[2].operands[0].toString());
        assert.equal('0,0,5,0,0,0', ee.extensions[2].operands[1].toString());
        assert.equal('2,5,0,0,0,0', ee.extensions[2].operands[2].toString());
        assert.equal('2,5,6,0,0,0', ee.extensions[2].value.toString());

        // fourth part
        assert.equal('0,0,1,0,2,4', ee.extensions[3].operands[0].toString());
        assert.equal('0,0,5,1,2,0', ee.extensions[3].operands[1].toString());
        assert.equal('2,5,6,0,0,0', ee.extensions[3].operands[2].toString());
        assert.equal('2,6,2,1,4,4', ee.extensions[3].value.toString());
    });

    it('bugfix test for 375*4 => 1500', function () {
        const expr: Expression = {
            operands: [375, 4],
            operations: ['mult'],
            value: 1500
        };
        const ee: ExtensionExpression = extendMultCarry({ expression: expr }).extension
        assert.equal(1, ee.extensions.length);
        assert.equal(3, ee.extensions[0].operands.length);
        assert.equal('0,0,2,0', ee.extensions[0].operands[0].toString());
        assert.equal('0,2,8,0', ee.extensions[0].operands[1].toString());
        assert.equal('1,2,0,0', ee.extensions[0].operands[2].toString());
        assert.equal('1,5,0,0', ee.extensions[0].value.toString());
    });

    it('should generate correct extension set for 432 / 8', function () {
        const expr: Expression = {
            operands: [432, 8],
            operations: ['div'],
            value: 54
        };
        const ee: ExtensionExpression = extendDivEven({ expression: expr }).extension
        assert.equal(2, ee.extensions.length);

        assert.equal('4,3', ee.extensions[0].operands[0].toString());
        assert.equal('4,0', ee.extensions[0].operands[1].toString());
        assert.equal('0,3', ee.extensions[0].value.toString());

        assert.equal('3,2', ee.extensions[1].operands[0].toString());
        assert.equal('3,2', ee.extensions[1].operands[1].toString());
        assert.equal('0,0', ee.extensions[1].value.toString());
    });
});
