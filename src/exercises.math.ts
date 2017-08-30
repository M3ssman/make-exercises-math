import { generateExpression } from './exercises.math.generator';
import { funcMap, add, sub, mult, Renderer, BinaryExpressionRender } from './exercises.math.renderer';

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
 * Unary and binary Constraints
 * 
 */
export class NumConstraint {
    appliesToIndex?: number;
    greaterThanIndex?: number;
    exactMatchOf?: number;
    range?: NumBounds;
    multipleOf?: number;
}

/**
 * Define a whole Set of Exercises with optional total Quantity
 * 
 * Defaults to a Set of Addition 12 Exercises
 *  
 */
export interface Options {
    exercises: ExerciseType[];
}

/**
 * Defines a single Exercise of Addition, etc.
 */
export interface ExerciseType {
    quantity: number;
    level: number;
    operations: ["add" | "sub" | "mult" | "div"];
    operands?: NumConstraint[];
    resultMultipleOf?: number;
}

export interface Range {
    from: number;
    to: number;
    greaterThanIndex?: number;
}

export interface BinaryExpression {
    x: number;
    operation : string;
    y: number;
    eq: string;
    value: number;
    toString(): string;
    toMaskedString?(): string;
}
export class BinaryExpressionImpl implements BinaryExpression {
    x:number; y: number; value: number;
    operation; eq;
    expr: BinaryExpression;
    constructor(expression: BinaryExpression, public renderer: Renderer) {
        this.expr = expression;
    }
    toMaskedString(): string {
        return this.renderer.toMaskedString(this);
    }
    toString(): string {
        return '(' + this.x + ' ' + this.operation + ' ' + this.y +') => ' + this.value;
    }
}

/**
 * Set Option Declaration
 */
export interface ExpressionSetOption {
}

/**
 * Exercise Math Declarations
 */
export interface ExerciseMath {
    rendered: string[];
    expression: BinaryExpression;
    get(): string[];
}
export class ExerciseMathImpl implements ExerciseMath {
    rendered: string[] = [];
    constructor(public expression: BinaryExpression, public renderer: Renderer) { }
    get() {
        if (this.rendered.length === 0) {
            this.rendered.push(this.renderer.toMaskedString(this.expression));
        }
        return this.rendered;
    }
}

interface ExerciseMakeFunc {
    (): ExerciseMath;
}

/**
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
                const constraints: NumConstraint[] = _extractConstraints(e);
                let funct: (a: number, b: number) => number = funcMap[e.operations[0]].func;
                let be: BinaryExpression = generateExpression(funct, constraints);
                if (e.operations[0] === 'div') {
                    funct = funcMap['mult'].func;
                    be = generateExpression(funct, constraints);
                    be = _swapTo(be,'div');
                }
                const em: ExerciseMath = new ExerciseMathImpl(be, new BinaryExpressionRender());
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

function _swapTo(exp: BinaryExpression, op: string): BinaryExpression {
    const next: BinaryExpression = {
        x: exp.value,
        operation: op,
        y: exp.y,
        eq: '=',
        value: exp.x
    };
    return next;
}

function _extractConstraints(e: ExerciseType): NumConstraint[] {
    let ncs: NumConstraint[] = [];
    const { quantity, level, operands } = e;
    const ops = e.operands;
    for (let i = 0; i < ops.length; i++) {
        let nc: NumConstraint = ops[i];
        nc.appliesToIndex = i;
        ncs.push(nc);
    }
    return ncs;
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
        { range: rangeN25N5 },
        { multipleOf: 10 }
    ]
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
        { range: rangeN10 },
        { multipleOf: 10 }
    ]
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
        { range: rangeN20 },
        { multipleOf: 10 }
    ]
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

export const divN100: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['div'],
    operands: [
        { greaterThanIndex: 1, range: rangeN10 },
        { range: rangeN10 }
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
        { appliesToIndex: 0, exactMatchOf: x },
        { appliesToIndex: 1, range: rangeN10 }
    ];
    const be: BinaryExpression = generateExpression(mult, constraints);
    return new ExerciseMathImpl(be, new BinaryExpressionRender());
}

function multN10ofXofY(x: number, y: number): ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, exactMatchOf: x },
        { appliesToIndex: 1, exactMatchOf: y }
    ];
    const be: BinaryExpression = generateExpression(mult, constraints);
    return new ExerciseMathImpl(be, new BinaryExpressionRender());
}

export function multR100(): ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, range: rangeN20 },
        { appliesToIndex: 1, range: rangeN20 },
        { appliesToIndex: 2, range: rangeN100 }
    ];
    const be: BinaryExpression = generateExpression(mult, constraints);
    return new ExerciseMathImpl(be, new BinaryExpressionRender());
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
