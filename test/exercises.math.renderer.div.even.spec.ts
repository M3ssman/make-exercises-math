import { assert } from 'chai';
import {
    Exercise,
    ExtensionExpression,
    Extension
} from '../src/exercises.math';
import {
    div_even
} from '../src/exercises.math.options';
import {
    renderExtensionsDivEven,
    _calculateGap
} from '../src/exercises.math.renderer';

/**
 * Division Render API
 */
describe('Renderer Division even', function () {

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
        assert.equal(actRendStrs[0], '  2607 : 11 = 237');
        assert.equal(actRendStrs[1], '- 22');
        assert.equal(actRendStrs[2], '   40');
        assert.equal(actRendStrs[3], ' - 33')
        assert.equal(actRendStrs[4], '    77')
        assert.equal(actRendStrs[5], '  - 77')
        assert.equal(actRendStrs[6], '     0')
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
        assert.equal(actRendStrs[0], '  605 : 11 = 55');
        assert.equal(actRendStrs[1], '- 55');
        assert.equal(actRendStrs[2], '   55');
        assert.equal(actRendStrs[3], ' - 55')
        assert.equal(actRendStrs[4], '    0')
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
        assert.equal(actRendStrs[0], '  990 : 11 = 90');
        assert.equal(actRendStrs[1], '- 99');
        assert.equal(actRendStrs[2], '   00');
        assert.equal(actRendStrs[3], '  - 0')
        assert.equal(actRendStrs[4], '    0')
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
        //console.log('### RENDERED ' + JSON.stringify(actRendStrs))
        assert.equal(actRendStrs.length, 5);
        assert.equal(actRendStrs[0], '  902 : 11 = 82');
        assert.equal(actRendStrs[1], '- 88');
        assert.equal(actRendStrs[2], '   22');
        assert.equal(actRendStrs[3], ' - 22')
        assert.equal(actRendStrs[4], '    0')
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
        assert.equal(actRendStrs[0], '  450 : 3 = 150');
        assert.equal(actRendStrs[1].length, 3);
        assert.equal(actRendStrs[1], '- 3');
        assert.equal(actRendStrs[2].length, 4);
        assert.equal(actRendStrs[2], '  15');
        assert.equal(actRendStrs[3].length, 4);
        assert.equal(actRendStrs[3], '- 15')
        assert.equal(actRendStrs[4].length, 5);
        assert.equal(actRendStrs[4], '   00')
        assert.equal(actRendStrs[5].length, 5);
        assert.equal(actRendStrs[5], '  - 0')
        assert.equal(actRendStrs[6].length, 5);
        assert.equal(actRendStrs[6], '    0')
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
        assert.equal(actRendStrs[0], '  1100 : 10 = 110');
        assert.equal(actRendStrs[1].length, 4);
        assert.equal(actRendStrs[1], '- 10');
        assert.equal(actRendStrs[2].length, 5);
        assert.equal(actRendStrs[2], '   10');
        assert.equal(actRendStrs[3].length, 5);
        assert.equal(actRendStrs[3], ' - 10')
        assert.equal(actRendStrs[4].length, 6);
        assert.equal(actRendStrs[4], '    00')
        assert.equal(actRendStrs[5].length, 6);
        assert.equal(actRendStrs[5], '   - 0')
        assert.equal(actRendStrs[6].length, 6);
        assert.equal(actRendStrs[6], '     0')
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
        assert.equal(actRendStrs[0], '  1899 : 9 = 211');
        assert.equal(actRendStrs[1], '- 18');
        assert.equal(actRendStrs[2], '   09');
        assert.equal(actRendStrs[3], '  - 9')
        assert.equal(actRendStrs[4].length, 6);
        assert.equal(actRendStrs[4], '    09')
        assert.equal(actRendStrs[5], '   - 9')
        assert.equal(actRendStrs[6], '     0')
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
        assert.equal(actRendStrs[0].length, 16);
        assert.equal(actRendStrs[0], '  1012 : 4 = 253');
        assert.equal(actRendStrs[1], '- 08');
        assert.equal(actRendStrs[2], '   21');
        assert.equal(actRendStrs[3], ' - 20')
        assert.equal(actRendStrs[4], '    12')
        assert.equal(actRendStrs[5], '  - 12')
        assert.equal(actRendStrs[6], '     0')
        assert.equal(actRendStrs[1].length, 4);
        assert.equal(actRendStrs[2].length, 5);
        assert.equal(actRendStrs[3].length, 5);
        assert.equal(actRendStrs[4].length, 6);
        assert.equal(actRendStrs[5].length, 6);
        assert.equal(actRendStrs[6].length, 6);
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
        assert.equal(actRendStrs[0].length, 15);
        assert.equal(actRendStrs[0], '  636 : 6 = 106');
        assert.equal(actRendStrs[1], '- 6');
        assert.equal(actRendStrs[2].length, 4)
        assert.equal(actRendStrs[2], '  03');
        assert.equal(actRendStrs[3].length, 4)
        assert.equal(actRendStrs[3], ' - 0')
        assert.equal(actRendStrs[4].length, 5)
        assert.equal(actRendStrs[4], '   36')
        assert.equal(actRendStrs[5].length, 5)
        assert.equal(actRendStrs[5], ' - 36')
        assert.equal(actRendStrs[6], '    0')
        assert.equal(actRendStrs[6].length, 5)
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
        assert.equal(actRendStrs[0], '  627 : 11 = 57');
        assert.equal(actRendStrs[1], '- 55');
        assert.equal(actRendStrs[2], '   77');
        assert.equal(actRendStrs[3], ' - 77');
        assert.equal(actRendStrs[4], '    0');
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
        assert.equal(actRendStrs[0].length, 14);
        assert.equal(actRendStrs[0], '  186 : 3 = 62');
        assert.equal(actRendStrs[1], '- 18');
        assert.equal(actRendStrs[2].length, 5)
        assert.equal(actRendStrs[2], '   06');
        assert.equal(actRendStrs[3].length, 5)
        assert.equal(actRendStrs[3], '  - 6')
        assert.equal(actRendStrs[4].length, 5)
        assert.equal(actRendStrs[4], '    0')
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
        assert.equal(actRendStrs[0], '  4096 : 64 = 64');
        assert.equal(actRendStrs[1], '- 384');
        assert.equal(actRendStrs[2], '   256');
        assert.equal(actRendStrs[3], ' - 256');
        assert.equal(actRendStrs[4], '     0');
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
        // console.log('### RENDERED "' + JSON.stringify(sets[0].exercises[0]) + '"')
        const actRendStrs = renderExtensionsDivEven(given).rendered
        assert.equal(5, actRendStrs.length);
        assert.equal(actRendStrs[0], '  630 : 9 = 70', 'failed != ' + actRendStrs[0]);
        assert.equal(actRendStrs[1], '- 63');
        assert.equal(actRendStrs[2], '   00');
        assert.equal(actRendStrs[3], '  - 0')
        assert.equal(actRendStrs[4], '    0')
    });

});
