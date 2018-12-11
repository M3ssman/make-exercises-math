import {
    Options,
    Range
} from './exercises.math';

/**
 * Define common Ranges
 */
export const rangeN5N1: Range = { max: 5, min: 1 }
export const rangeN10: Range = { max: 10 };
export const rangeN20: Range = { max: 20 };
export const rangeN25N5: Range = { max: 25, min: 5 };
export const rangeN50: Range = { max: 50 };
export const rangeN50N10: Range = { max: 50, min: 10 };
export const rangeN80N10: Range = { max: 80, min: 10 };
export const rangeN99N10: Range = { max: 99, min: 10 };
export const rangeN100: Range = { max: 100 };


/**
 * Define common Option Examples
 */
export const addN50N10: Options = {
    label: "addN50N10", 
    quantity: 12,
    set: 'N',
    operations: ['add'],
    operands: [
        { rangeN: rangeN80N10, greaterThanIndex: 1 },
        { rangeN: rangeN10 }
    ]
};
export const addN50N25Nof10: Options = {
    label: 'addN50N25Nof10',
    quantity: 12,
    set: 'N',
    operations: ['add'],
    operands: [
        { rangeN: rangeN50N10, greaterThanIndex: 1 },
        { rangeN: rangeN25N5 }
    ],
    result: { multipleOf: 10 }
};
export const addN50N19: Options = {
    label: 'addN50N19',
    quantity: 12,
    set: 'N',
    operations: ['add'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN50N10 },
        { rangeN: rangeN20 }
    ]
};

export const subN99N10Nof10: Options = {
    label: 'subN99N10Nof10',
    quantity: 12,
    set: 'N',
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN99N10 },
        { rangeN: rangeN10 }
    ],
    result: { multipleOf: 10 }
};
export const subN50N10: Options = {
    label: 'subN50N10',
    quantity: 12,
    set: 'N',
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN99N10 },
        { rangeN: rangeN10 }
    ]
};
export const subN99N19: Options = {
    label: 'subN99N19',
    quantity: 12,
    set: 'N',
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN99N10 },
        { rangeN: rangeN20 }
    ]
};
export const subN99N19Nof10: Options = {
    label: 'subN99N19Nof10',
    quantity: 12,
    set: 'N',
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN99N10 },
        { rangeN: rangeN20 }
    ],
    result: { multipleOf: 10 }
};

export const multN10N10: Options = {
    label: 'multN10N10',
    quantity: 12,
    set: 'N',
    operations: ['mult'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN10 },
        { rangeN: rangeN10 }
    ]
};

export const add_add_: Options = {
    label: 'add_add_',
    quantity: 12, 
    set: 'N',
    operations: ['add', 'add'],
    operands: [
        { rangeN: rangeN100 },
        { rangeN: rangeN50N10 },
        { rangeN: rangeN25N5 }
    ]
};

export const addN50N25subN20: Options = {
    label: 'addN50N25subN20',
    quantity: 12, 
    set: 'N',
    operations: ['add', 'sub'],
    operands: [
        { rangeN: rangeN50N10 },
        { rangeN: rangeN25N5 },
        { rangeN: rangeN20 }
    ]
};

export const divN100WithRest: Options = {
    label: 'divN100WithRest',
    set: 'N',
    operations: ['div']
};

export const add_add_carry: Options = {
    label: 'add_add_carry',
    quantity: 6,
    set: 'N',
    operations: ['add', 'add'],
    extension: "ADD_CARRY",
    operands: [
        { rangeN: { min: 500, max: 9999 } },
        { rangeN: { max: 1500 } },
        { rangeN: { max: 100 } }
    ]
};

export const sub_carry: Options = {
    label: 'sub_carry',
    quantity: 6,
    set: 'N',
    extension: 'SUB_CARRY',
    operations: ['sub'],
    operands: [
        { rangeN: { min: 1500, max: 9999 }, greaterThanIndex: 1 },
        { rangeN: { max: 1500 } }
    ]
};

export const mult_N999_N9: Options = {
    label: 'mult_N999_N9',
    quantity: 6,
    set: 'N',
    extension: 'MULT_MULT',
    operations: ['mult'],
    operands: [
        { rangeN: { min: 100, max: 999 } },
        { rangeN: { min: 1, max: 10 } }
    ]
};

export const mult_N999_N99: Options = {
    label: 'mult_N999_N99',
    quantity: 3,
    set: 'N',
    extension: 'MULT_MULT',
    operations: ['mult'],
    operands: [
        { rangeN: { min: 100, max: 999 } },
        { rangeN: { min: 10, max: 99 } }
    ]
};

export const mult_N999_N999: Options = {
    label: 'mult_N999_N999',
    quantity: 3,
    set: 'N',
    extension: 'MULT_MULT',
    operations: ['mult'],
    operands: [
        { rangeN: { min: 100, max: 999 } },
        { rangeN: { min: 100, max: 999 } }
    ]
};

export const div_even: Options = {
    label: 'div_even',
    quantity: 4,
    set: 'N',
    extension: 'DIV_EVEN',
    operations: ['div'],
    operands: [
        { rangeN: { min: 50, max: 256 } },
        { rangeN: { min: 2, max: 12 } },
    ]
};

export const add_fraction: Options = {
    label: 'add_fraction',
    quantity: 8,
    set: 'Q',
    extension: 'ADD_FRACTION',
    operations: ['addQ'],
    operands: [
        { rangeQ: { min: [1,8], max: [16,8] } },
        { rangeQ: { min: [1,12], max: [24,12] } },
    ]
};

export const sub_fraction: Options = {
    label: 'sub_fraction',
    quantity: 8,
    set: 'Q',
    extension: 'SUB_FRACTION',
    operations: ['subQ'],
    operands: [
        { rangeQ: { min: [1, 8], max: [64, 8] } },
        { rangeQ: { min: [1, 12], max: [24, 12] } },
    ]
};

export const mult_fraction: Options = {
    label: 'mult_fraction',
    quantity: 8,
    set: 'Q',
    extension: 'MULT_FRACTION',
    operations: ['multQ'],
    operands: [
        { rangeQ: { min: [1,12], max: [36,12] } },
        { rangeQ: { min: [1,12], max: [24,12] } },
    ]
}

export const div_fraction: Options = {
    label: 'div_fraction',
    quantity: 8,
    set: 'Q',
    extension: 'DIV_FRACTION',
    operations: ['ratio'],
    operands: [
        { rangeQ: { min: [1,12], max: [36,12] } },
        { rangeQ: { min: [1,12], max: [24,12] } },
    ]
}
