import { generateExpression } from './exercises.math.generator';
import { funcMap, add, sub, mult, Renderer, ExpressionRender } from './exercises.math.renderer';

/**
 * Numeric Bounds
 */
export class NumBounds {
    constructor(public max: number, public min?: number) { }
}

/**
 * Basic Numerical Ranges
 */
export const rangeN5N1 = new NumBounds(5, 1)
export const rangeN10 = new NumBounds(10);
export const rangeN20 = new NumBounds(20);
export const rangeN25N5 = new NumBounds(25, 5);
export const rangeN50 = new NumBounds(50);
export const rangeN50N10 = new NumBounds(50, 10);
export const rangeN80N10 = new NumBounds(80, 10);
export const rangeN99N10 = new NumBounds(99, 10);
export const rangeN100 = new NumBounds(100);

/**
 * 
 * Numerical Constraints
 * 
 */
export class NumConstraint {
    greaterThanIndex?: number;
    exactMatchOf?: number;
    range?: NumBounds;
    multipleOf?: number;
    toString(): string {
        return JSON.stringify(this);
    }
}

/**
 * Defines a single Exercise of Addition, etc.
 */
export interface ExerciseType {
    quantity: number;
    level: number;
    operations: ["add" | "sub" | "mult" | "div"];
    operands?: NumConstraint[];
    result?: NumConstraint;
    resultMultipleOf?: number;
}

export interface Range {
    from: number;
    to: number;
    greaterThanIndex?: number;
}

export interface Expression {
    operands: number[];
    operations: string[];
    eq: string;
    value: number;
    toString(): string;
    toMaskedString?(): string;
}

/**
 * Exercise Math Declarations
 */
export interface ExerciseMath {
    rendered: string[];
    expression: Expression;
    get(): string[];
}
export class ExerciseMathImpl implements ExerciseMath {
    rendered: string[] = [];
    constructor(public expression: Expression, public renderer: Renderer) { }
    get() {
        if (this.rendered.length === 0) {
            this.rendered.push(this.renderer.toMaskedString(this.expression));
        }
        return this.rendered;
    }
}

/**
 * 
 * Create Expression Level 1
 * 
 * @param exerciseTypes 
 */
export function makeSet(exerciseTypes?: ExerciseType[]): Promise<ExerciseMath[][]> {
    return new Promise((resolve, reject) => {
        const exercises: ExerciseMath[][] = [];
        const optionsIn = exerciseTypes ? exerciseTypes : [defaultAdd];
        let numberOfSets: number = optionsIn.length;

        for (let a = 0; a < numberOfSets; a++) {
            const exercise: ExerciseMath[] = [];
            let e: ExerciseType = optionsIn[a];

            for (let i = 0; i < e.quantity; i++) {

                // get constraints for operands and result
                const constraints: NumConstraint[] = e.operands;
                const resultConstraint: NumConstraint = e.result;

                // get operations
                let functs: ((a: number, b: number) => number)[] = [];
                e.operations.map(op => functs.push(funcMap[op].func));

                let exp: Expression = generateExpression(functs, constraints, resultConstraint);
                const em: ExerciseMath = new ExerciseMathImpl(exp, new ExpressionRender());
                exercise.push(em);
            }
            exercises.push(exercise);
        }
        if (exercises.length === 0) {
            reject('Unable to create Exercises: null or empty!');
        } else {
            resolve(exercises);
        }
    });
}

/**
 * Default ExerciseType
 */
export const defaultAdd: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['add'],
    operands: [
        { range: rangeN20, greaterThanIndex: 1 },
        { range: rangeN20 }
    ]
}

/**
 * More ExerciseTypes
 */
export const addN50N10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['add'],
    operands: [
        { range: rangeN80N10, greaterThanIndex: 1 },
        { range: rangeN10 }
    ]
};
export const addN50N25Nof10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['add'],
    operands: [
        { range: rangeN50N10, greaterThanIndex: 1 },
        { range: rangeN25N5 }
    ],
    result: { multipleOf: 10 }
};
export const addN50N19: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['add'],
    operands: [
        { greaterThanIndex: 1, range: rangeN50N10 },
        { range: rangeN20 }
    ]
};

export const subN99N10Nof10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, range: rangeN99N10 },
        { range: rangeN10 }
    ],
    result: { multipleOf: 10 }
};
export const subN50N10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, range: rangeN99N10 },
        { range: rangeN10 }
    ]
};
export const subN99N19: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, range: rangeN99N10 },
        { range: rangeN20 }
    ]
};
export const subN99N19Nof10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, range: rangeN99N10 },
        { range: rangeN20 }
    ],
    result: { multipleOf: 10 }
};

export const multN10N10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['mult'],
    operands: [
        { greaterThanIndex: 1, range: rangeN10 },
        { range: rangeN10 }
    ]
};

export const add_add_: ExerciseType = {
    quantity: 2, level: 1,
    operations: ['add', 'add']
};

export const addN50N25subN20: ExerciseType = {
    quantity: 2, level: 1,
    operations: ['add', 'sub'],
    operands: [
        { range: rangeN50N10 },
        { range: rangeN25N5 },
        { range: rangeN20 }
    ]
};

/**
 * 
 * @deprecated
 * 
 */
export function multN10Nof2(): ExerciseMath {
    return multN10ofX(2);
}

export function multN10Nof5(): ExerciseMath {
    return multN10ofX(5);
}

export function multN10Nof10(): ExerciseMath {
    return multN10ofX(10);
}

export function multN10ofX(x: number): ExerciseMath {
    const constraints: NumConstraint[] = [
        { exactMatchOf: x },
        { range: rangeN10 }
    ];
    const e: Expression = generateExpression([mult], constraints, null);
    return new ExerciseMathImpl(e, new ExpressionRender());
}

function multN10ofXofY(x: number, y: number): ExerciseMath {
    const constraints: NumConstraint[] = [
        { exactMatchOf: x },
        { exactMatchOf: y }
    ];
    const e: Expression = generateExpression([mult], constraints, null);
    return new ExerciseMathImpl(e, new ExpressionRender());
}

export function multR100(): ExerciseMath {
    const constraints: NumConstraint[] = [
        { range: rangeN20 },
        { range: rangeN20 },
        { range: rangeN100 }
    ];
    const e: Expression = generateExpression([mult], constraints, null);
    return new ExerciseMathImpl(e, new ExpressionRender());
}

/**
 * 
 * @deprecated
 * 
 * @param xs 
 * 
 * 
 */
export function setOfMultN10(xs: number[]): ExerciseMath[] {
    let r = [];
    let ms = {};
    let ns = [];
    xs.forEach(x => {
        ms[x] = generateArrayValues(10);
    });
    const mks = Object.keys(ms);
    mks.map(x => {
        ms[x].map(y => r.push(multN10ofXofY(parseInt(x), y)));
    });
    return r;
}

/**
 * 
 * Generate some Values with optinal step size
 * 
 * @param limit 
 * @param step 
 */
function generateArrayValues(limit: number, step?: number): number[] {
    let values = [];
    const it = generatorFnc(1);
    while (limit-- > 0) {
        values.push(it.next().value);
    }
    return values;
}

/**
 * 
 * Generator Function
 * 
 * @param count 
 * @param step 
 */
function* generatorFnc(count: number, step?: number): IterableIterator<number> {
    const s = step ? step : 1;
    while (true) {
        yield count;
        count = count + s;
    }
}
