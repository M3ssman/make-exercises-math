import {
    Options,
    Range,
    ExtensionType
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
    level: 1,
    operations: ['add'],
    operands: [
        { rangeN: rangeN80N10, greaterThanIndex: 1 },
        { rangeN: rangeN10 }
    ]
};
export const addN50N25Nof10: Options = {
    quantity: 12,
    set: 'N',
    level: 1,
    operations: ['add'],
    operands: [
        { rangeN: rangeN50N10, greaterThanIndex: 1 },
        { rangeN: rangeN25N5 }
    ],
    result: { multipleOf: 10 }
};
export const addN50N19: Options = {
    quantity: 12,
    set: 'N',
    level: 1,
    operations: ['add'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN50N10 },
        { rangeN: rangeN20 }
    ]
};

export const subN99N10Nof10: Options = {
    quantity: 12,
    set: 'N',
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN99N10 },
        { rangeN: rangeN10 }
    ],
    result: { multipleOf: 10 }
};
export const subN50N10: Options = {
    quantity: 12,
    set: 'N',
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN99N10 },
        { rangeN: rangeN10 }
    ]
};
export const subN99N19: Options = {
    quantity: 12,
    set: 'N',
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN99N10 },
        { rangeN: rangeN20 }
    ]
};
export const subN99N19Nof10: Options = {
    quantity: 12,
    set: 'N',
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN99N10 },
        { rangeN: rangeN20 }
    ],
    result: { multipleOf: 10 }
};

export const multN10N10: Options = {
    quantity: 12,
    set: 'N',
    level: 1,
    operations: ['mult'],
    operands: [
        { greaterThanIndex: 1, rangeN: rangeN10 },
        { rangeN: rangeN10 }
    ]
};

export const add_add_: Options = {
    quantity: 12, 
    set: 'N',
    level: 1,
    operations: ['add', 'add'],
    operands: [
        { rangeN: rangeN100 },
        { rangeN: rangeN50N10 },
        { rangeN: rangeN25N5 }
    ]
};

export const addN50N25subN20: Options = {
    quantity: 12, 
    set: 'N',
    level: 1,
    operations: ['add', 'sub'],
    operands: [
        { rangeN: rangeN50N10 },
        { rangeN: rangeN25N5 },
        { rangeN: rangeN20 }
    ]
};

export const divN100WithRest: Options = {
    set: 'N',
    operations: ['div']
};

export const add_add_carry: Options = {
    quantity: 6,
    set: 'N',
    level: 2,
    operations: ['add', 'add'],
    operands: [
        { rangeN: { min: 500, max: 9999 } },
        { rangeN: { max: 1500 } },
        { rangeN: { max: 100 } }
    ]
};

export const sub_carry: Options = {
    quantity: 6,
    set: 'N',
    level: 3,
    extension: 'SUB_CARRY',
    operations: ['sub'],
    operands: [
        { rangeN: { min: 1500, max: 9999 }, greaterThanIndex: 1 },
        { rangeN: { max: 1500 } }
    ]
};

export const mult_N999_N9: Options = {
    quantity: 6,
    set: 'N',
    level: 4,
    extension: 'MULT_MULT',
    operations: ['mult'],
    operands: [
        { rangeN: { min: 100, max: 999 } },
        { rangeN: { min: 1, max: 10 } }
    ]
};

export const mult_N999_N99: Options = {
    quantity: 3,
    set: 'N',
    level: 4,
    extension: 'MULT_MULT',
    operations: ['mult'],
    operands: [
        { rangeN: { min: 100, max: 999 } },
        { rangeN: { min: 10, max: 99 } }
    ]
};

export const mult_N999_N999: Options = {
    quantity: 3,
    set: 'N',
    level: 4,
    extension: 'MULT_MULT',
    operations: ['mult'],
    operands: [
        { rangeN: { min: 100, max: 999 } },
        { rangeN: { min: 100, max: 999 } }
    ]
};

export const div_even: Options = {
    quantity: 4,
    set: 'N',
    level: 4,
    extension: 'DIV_EVEN',
    operations: ['div'],
    operands: [
        { rangeN: { min: 50, max: 256 } },
        { rangeN: { min: 2, max: 12 } },
    ]
};

/**
 * 
 * @deprecated
 * 
 */
/* export function multN10Nof2(): ExerciseMath {
    return multN10ofX(2);
}

export function multN10Nof5(): ExerciseMath {
    return multN10ofX(5);
}

export function multN10Nof10(): ExerciseMath {
    return multN10ofX(10);
} */

/* export function multN10ofX(x: number): ExerciseMath {
    const constraints: Constraint[] = [
        { exactMatchOf: x },
        { rangeN: rangeN10 }
    ];
    const e: Expression = generateExpression([mult], constraints, null);
    return new ExerciseMath(e, new SimpleExpressionResultRenderer(), generateExtensionsDefault);
}

export function multN3_100(): ExerciseMath {
    const constraints: Constraint[] = [
        { rangeN: rangeN20 },
        { rangeN: rangeN20 },
        { rangeN: rangeN100 }
    ];
    const e: Expression = generateExpression([mult], constraints, null);
    return new ExerciseMath(e, new SimpleExpressionResultRenderer(), generateExtensionsDefault);
} */
