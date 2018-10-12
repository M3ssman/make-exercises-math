import { assert } from 'chai';
import { 
    Exercise,
    Extension
} from '../src/exercises.math';
import {
    _exchangeTrailingZeros,
    renderExtensionsMultiplication,
    renderExtensionsDivEven,
    _calculateGap
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

/**
 * Multiplication Render API
 */
describe('Render Multiplication Grids', function () {

    it('bugfix test 500 * 4 = 2000', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [500, 4], value: 2000, operations: ['mult']
            },
            extension: {
                type: 'MULT_MULT',
                extensions: [{
                    operands: [[0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 0, 0]],
                    value: [2, 0, 0, 0]
                }]
            }
        }
        const actRendStrs = renderExtensionsMultiplication(given).rendered
        assert.equal(actRendStrs.length, 5);
        assert.equal(actRendStrs[0].rendered, '500 * 4');
        assert.equal(actRendStrs[1].rendered, '      0');
        assert.equal(actRendStrs[2].rendered, '     00');
        assert.equal(actRendStrs[3].rendered, '   2000')
        assert.equal(actRendStrs[4].rendered, '   2000')
    });
});


/**
 * Division Render API
 */
describe('Render Division even', function () {

    it('_calculateGap for [10,10] in r 1', () => {
        const exp: Extension = {
            operands: [[1, 0], [1, 0]], value: [0, 0]
        }
        const gap = _calculateGap(exp, 1, [0, 1], { 0: 2 })
        assert.equal(gap, 3)
    })
    it('_calculateGap for [0,0] in r 2', () => {
        const e1: Extension = {
            operands: [[0], [0]], value: [0]
        }
        const gap1 = _calculateGap(e1, 2, [0, 0], { 0: 2, 1: 2 })
        assert.equal(gap1, 4)
    })
    it('_calculateGap for [9,9] in r 2', () => {
        const e3: Extension = {
            operands: [[9], [9]], value: [0]
        }
        const gap3 = _calculateGap(e3, 2, [0], { 0: 2, 1: 4 })
        assert.equal(gap3, 5)
    })

    it('bugfix test 2607 : 11 = 237', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [2607, 11], value: 237, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[2,6], [2,2]], value: [0,4]
                },
                {
                    operands: [[4,0], [3,3]], value: [0,7]
                },
                {
                    operands: [[7,7], [7,7]], value: [0,0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(actRendStrs.length, 7);
        assert.equal(actRendStrs[0].rendered, '  2607 : 11 = 237');
        assert.equal(actRendStrs[1].rendered, '- 22');
        assert.equal(actRendStrs[2].rendered, '   40');
        assert.equal(actRendStrs[3].rendered, ' - 33')
        assert.equal(actRendStrs[4].rendered, '    77')
        assert.equal(actRendStrs[5].rendered, '  - 77')
        assert.equal(actRendStrs[6].rendered, '     0')
    });

    it('bugfix test 605 : 11 = 55', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [605, 11], value: 55, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[6,0], [5,5]], value: [0,5]
                },
                {
                    operands: [[5,5], [5,5]], value: [0,0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(actRendStrs.length, 5);
        assert.equal(actRendStrs[0].rendered, '  605 : 11 = 55');
        assert.equal(actRendStrs[1].rendered, '- 55');
        assert.equal(actRendStrs[2].rendered, '   55');
        assert.equal(actRendStrs[3].rendered, ' - 55')
        assert.equal(actRendStrs[4].rendered, '    0')
    });

    it('bugfix test 990 : 11 = 90', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [990, 11], value: 90, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[9,9], [9,9]], value: [0,0]
                },
                {
                    operands: [[0], [0]], value: [0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(actRendStrs.length, 5);
        assert.equal(actRendStrs[0].rendered, '  990 : 11 = 90');
        assert.equal(actRendStrs[1].rendered, '- 99');
        assert.equal(actRendStrs[2].rendered, '   00');
        assert.equal(actRendStrs[3].rendered, '  - 0')
        assert.equal(actRendStrs[4].rendered, '    0')
    });

    it('bugfix test 902 : 11 = 82', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [902, 11], value: 82, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[9,0], [8,8]], value: [0,2]
                },
                {
                    operands: [[2,2], [2,2]], value: [0,0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(actRendStrs.length, 5);
        assert.equal(actRendStrs[0].rendered, '  902 : 11 = 82');
        assert.equal(actRendStrs[1].rendered, '- 88');
        assert.equal(actRendStrs[2].rendered, '   22');
        assert.equal(actRendStrs[3].rendered, ' - 22')
        assert.equal(actRendStrs[4].rendered, '    0')
    });

    it('bugfix test 450 : 3 = 150', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [450, 3], value: 150, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[4], [3]], value: [1]
                },
                {
                    operands: [[1, 5], [1, 5]], value: [0, 0]
                },
                {
                    operands: [[0], [0]], value: [0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        //console.log('### RENDERED ' + JSON.stringify(actRendStrs))
        assert.equal(7, actRendStrs.length);
        assert.equal(actRendStrs[0].rendered, '  450 : 3 = 150');
        assert.equal(actRendStrs[1].rendered, '- 3');
        assert.equal(actRendStrs[2].rendered, '  15');
        assert.equal(actRendStrs[3].rendered, '- 15')
        assert.equal(actRendStrs[4].rendered, '   00')
        assert.equal(actRendStrs[5].rendered, '  - 0')
        assert.equal(actRendStrs[6].rendered, '    0')
    });

    it('bugfix test 1100 : 10 = 110', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [1100, 10], value: 110, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[1, 1], [1, 0]], value: [0, 1]
                },
                {
                    operands: [[1, 0], [1, 0]], value: [0, 0]
                },
                {
                    operands: [[0], [0]], value: [0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(7, actRendStrs.length);
        assert.equal(actRendStrs[0].rendered, '  1100 : 10 = 110');
        assert.equal(actRendStrs[1].rendered, '- 10');
        assert.equal(actRendStrs[2].rendered, '   10');
        assert.equal(actRendStrs[3].rendered, ' - 10')
        assert.equal(actRendStrs[4].rendered, '    00')
        assert.equal(actRendStrs[5].rendered, '   - 0')
        assert.equal(actRendStrs[6].rendered, '     0')
    });

    it('bugfix test 1899 : 9 = 211', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [1899, 9], value: 211, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[1, 8], [1, 8]], value: [0, 0]
                },
                {
                    operands: [[9], [9]], value: [0]
                },
                {
                    operands: [[9], [9]], value: [0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(7, actRendStrs.length);
        assert.equal(actRendStrs[0].rendered, '  1899 : 9 = 211');
        assert.equal(actRendStrs[1].rendered, '- 18');
        assert.equal(actRendStrs[2].rendered, '   09');
        assert.equal(actRendStrs[3].rendered, '  - 9')
        assert.equal(actRendStrs[4].rendered, '    09')
        assert.equal(actRendStrs[5].rendered, '   - 9')
        assert.equal(actRendStrs[6].rendered, '     0')
    });

    it('bugfix test 1012 : 4 = 253', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [1012, 4], value: 253, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[1, 0], [0, 8]], value: [0, 2]
                },
                {
                    operands: [[2, 1], [2, 0]], value: [0, 1]
                },
                {
                    operands: [[1, 2], [1, 2]], value: [0, 0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(7, actRendStrs.length);
        assert.equal(actRendStrs[0].rendered.length, 16);
        assert.equal(actRendStrs[0].rendered, '  1012 : 4 = 253');
        assert.equal(actRendStrs[1].rendered, '- 08');
        assert.equal(actRendStrs[2].rendered, '   21');
        assert.equal(actRendStrs[3].rendered, ' - 20')
        assert.equal(actRendStrs[4].rendered, '    12')
        assert.equal(actRendStrs[5].rendered, '  - 12')
        assert.equal(actRendStrs[6].rendered, '     0')
    });

    it('bugfix test 636 : 6 = 106', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [636, 6], value: 106, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[6], [6]], value: [0]
                },
                {
                    operands: [[3], [0]], value: [3]
                },
                {
                    operands: [[3, 6], [3, 6]], value: [0, 0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(7, actRendStrs.length);
        assert.equal(actRendStrs[0].rendered.length, 15);
        assert.equal(actRendStrs[0].rendered, '  636 : 6 = 106');
        assert.equal(actRendStrs[1].rendered, '- 6');
        assert.equal(actRendStrs[2].rendered, '  03');
        assert.equal(actRendStrs[3].rendered, ' - 0')
        assert.equal(actRendStrs[4].rendered, '   36')
        assert.equal(actRendStrs[5].rendered, ' - 36')
        assert.equal(actRendStrs[6].rendered, '    0')
    });

    it('bugfix test 627 : 11 = 57', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [627, 11], value: 57, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[6, 2], [5, 5]], value: [0, 7]
                },
                {
                    operands: [[7, 7], [7, 7]], value: [0, 0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(5, actRendStrs.length);
        assert.equal(actRendStrs[0].rendered, '  627 : 11 = 57');
        assert.equal(actRendStrs[1].rendered, '- 55');
        assert.equal(actRendStrs[2].rendered, '   77');
        assert.equal(actRendStrs[3].rendered, ' - 77');
        assert.equal(actRendStrs[4].rendered, '    0');
    });

    it('bugfix test 186 : 3 = 62', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [186, 3], value: 62, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[1, 8], [1, 8]], value: [0, 0]
                },
                {
                    operands: [[6], [6]], value: [0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(5, actRendStrs.length);
        assert.equal(actRendStrs[0].rendered.length, 14);
        assert.equal(actRendStrs[0].rendered, '  186 : 3 = 62');
        assert.equal(actRendStrs[1].rendered, '- 18');
        assert.equal(actRendStrs[2].rendered, '   06');
        assert.equal(actRendStrs[3].rendered, '  - 6')
        assert.equal(actRendStrs[4].rendered, '    0')
    });

    it('should generate Division with Extensions for d_2 = 64 and q_0 = 64', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [4096, 64], value: 64, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[4, 0, 9], [3, 8, 4]], value: [0, 2, 5]
                },
                {
                    operands: [[2, 5, 6], [2, 5, 6]], value: [0, 0, 0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(5, actRendStrs.length);
        assert.equal(actRendStrs[0].rendered, '  4096 : 64 = 64');
        assert.equal(actRendStrs[1].rendered, '- 384');
        assert.equal(actRendStrs[2].rendered, '   256');
        assert.equal(actRendStrs[3].rendered, ' - 256');
        assert.equal(actRendStrs[4].rendered, '     0');
    });


    it('bugfix test undefined state at inversion for d_2 = 70 and q_0 = 9', () => {
        const given: Exercise = {
            rendered: [],
            expression: {
                operands: [630, 9], value: 70, operations: ['div']
            },
            extension: {
                type: 'DIV_EVEN',
                extensions: [{
                    operands: [[6, 3], [6, 3]], value: [0, 0]
                },
                {
                    operands: [[0], [0]], value: [0]
                }]
            }
        }
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(5, actRendStrs.length);
        assert.equal(actRendStrs[0].rendered, '  630 : 9 = 70', 'failed != ' + actRendStrs[0].rendered);
        assert.equal(actRendStrs[1].rendered, '- 63');
        assert.equal(actRendStrs[2].rendered, '   00');
        assert.equal(actRendStrs[3].rendered, '  - 0')
        assert.equal(actRendStrs[4].rendered, '    0')
    });

});
