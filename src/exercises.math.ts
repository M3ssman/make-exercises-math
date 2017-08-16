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
    exercises: Exercise[];
    total?: number;
}

/**
 * Defines a single Exercise of Addition, etc.
 */
export interface Exercise {
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

/**
 * Number Declaration
 */
export interface Number {
    n: number;
}

/**
 * Operation Declarations
 */
export interface Operation {
    (operands: Number[]): Number
}

export interface BinaryOperation extends Operation {
    (x: Number, y: Number): Number;
}


/**
 * Expression Declarations
 */
export interface Term {
    x: Term | Number;
    operation: Operation | string;
    y: Term | Number;
}
export interface Expression {
    term: Term;
}
export interface BinaryExpression extends Expression {
    eq: string;
    value: Number;
    toString(): string;
    toMaskedString?(): string;
}
export class BinaryExpressionImpl implements BinaryExpression {
    value: Number;
    term: Term;
    eq: string;
    constructor(public expression: BinaryExpression, public renderer: Renderer) {
        this.value = expression.value;
        this.term = expression.term;
        this.eq = expression.eq;
    }
    toMaskedString(): string {
        return this.renderer.toMaskedString(this);
    }
    toString(): string {
        return '(' + (<Number>this.expression.term.x).n + ' tratra ' + this.expression.term.operation.toString() + ' ' + (<Number>this.expression.term.y).n +
            ') => ' + (<Number>this.expression.value).n;
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
 * @param options 
 */
export function makeSet(options?: Options): Promise<ExerciseMath[]> {
    return new Promise((resolve, reject) => {
        const exercises: ExerciseMath[] = [];

        // process Settings
        const optionsIn = options ? options : defaultOptions;

        while (optionsIn.total-- > 0) {
            for (let i = 0; i < optionsIn.exercises.length; i++) {
                let e: Exercise = optionsIn.exercises[i];
                const constraints: NumConstraint[] = _extractConstraints(e);
                const funct: (a: number, b: number) => number = funcMap[e.operations[0]].func;
                const be: BinaryExpression = generateExpression(funct, constraints);
                const em: ExerciseMath = new ExerciseMathImpl(be, new BinaryExpressionRender());
                exercises.push(em);
            }
        }

        if (exercises === null || exercises.length === 0) {
            reject('Unable to create Exercises: null or empty!');
        } else {
            resolve(exercises);
        }
    });
}

function _extractConstraints(e: Exercise): NumConstraint[] {
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
 * Default Options
 */
export const defaultOptions: Options = {
    exercises: [{
        quantity: 12,
        level: 1,
        operations: ['add'],
        operands: [
            { range: rangeN20, greaterThanIndex: 1 },
            { range: rangeN10 }
        ]
    }],
    total: 12
};

export const addN50N10: Options = {
    exercises: [{
        quantity: 12,
        level: 1,
        operations: ['add'],
        operands: [
            { range: rangeN80N10, greaterThanIndex: 1 },
            { range: rangeN10 }
        ]
    }],
    total: 12
};

export const addN50N25Nof10: Options = {
    exercises: [{
        quantity: 12,
        level: 1,
        operations: ['add'],
        operands: [
            { range: rangeN50N10, greaterThanIndex: 1 },
            { range: rangeN25N5 },
            { multipleOf: 10 }
        ]
    }],
    total: 12
};

export function addN50N19(): ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: rangeN50N10 },
        { appliesToIndex: 1, range: rangeN20 }
    ];
    const be: BinaryExpression = generateExpression(add, constraints);
    return new ExerciseMathImpl(be, new BinaryExpressionRender());
}

export function subN99N10Nof10(): ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: rangeN99N10 },
        { appliesToIndex: 1, range: rangeN10 },
        { appliesToIndex: 2, multipleOf: 10 }
    ];
    const be: BinaryExpression = generateExpression(sub, constraints);
    return new ExerciseMathImpl(be, new BinaryExpressionRender());
}

export function subN50N10(): ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: rangeN50N10 },
        { appliesToIndex: 1, range: rangeN10 }
    ]
    const be: BinaryExpression = generateExpression(sub, constraints);
    return new ExerciseMathImpl(be, new BinaryExpressionRender());
}

export function subN99N19(): ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: rangeN99N10 },
        { appliesToIndex: 1, range: rangeN20 }
    ];
    const be: BinaryExpression = generateExpression(sub, constraints);
    return new ExerciseMathImpl(be, new BinaryExpressionRender());
}

export function subN99N19Nof10(): ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: rangeN99N10 },
        { appliesToIndex: 1, range: rangeN20 },
        { appliesToIndex: 2, multipleOf: 10 }
    ];
    const be: BinaryExpression = generateExpression(sub, constraints);
    return new ExerciseMathImpl(be, new BinaryExpressionRender());
}

export function multN10N10(): ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: rangeN10 },
        { appliesToIndex: 1, range: rangeN10 }
    ];
    const be: BinaryExpression = generateExpression(mult, constraints);
    return new ExerciseMathImpl(be, new BinaryExpressionRender());
}

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

export function divR100(x?: number, shuffle?: boolean): ExerciseMath {
    const ex: ExerciseMath = x ? multN10ofX(x) : multN10N10();
    let x1 = ex.expression.term.x;
    let x2 = ex.expression.term.y;
    if (shuffle) {
        const chance: number = Math.random();
        if (chance >= .5) {
            x1 = ex.expression.term.y;
            x2 = ex.expression.term.x;
        }
    }
    let expr1: BinaryExpression = { term: { x: x1, y: x2, operation: ':' }, value: ex.expression.value, eq: '=' };
    return new ExerciseMathImpl(expr1, new BinaryExpressionRender());
}

export function divN100(): ExerciseMath {
    const mult: ExerciseMath = multR100();
    const expr: BinaryExpression = {
        term: { x: mult.expression.value, y: mult.expression.term.y, operation: ':' },
        eq: '=',
        value: mult.expression.value
    };
    return new ExerciseMathImpl(expr, new BinaryExpressionRender());
}

export function setOfMult(): Promise<ExerciseMath[]> {
    return new Promise((resolve, reject) => {
        const exercises: ExerciseMath[] = [];
        if (exercises === null) {
            reject('Unable to create Exercises!');
        } else {
            resolve(exercises);
        }
    });
}

export function setOf(): Promise<ExerciseMath[]> {
    const exercises: ExerciseMath[] = [];
    return new Promise((resolve, reject) => {
        const exercises: ExerciseMath[] = [];
        if (exercises === null) {
            reject('Unable to create Exercises!');
        } else {
            resolve(exercises);
        }
    });
}

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
