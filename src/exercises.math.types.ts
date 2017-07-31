import { NumBounds } from './exercises.math.constraints';


/**
 * Basic Binary Functions
 */
export function add(a: number, b: number): number { return a + b }
export function sub(a: number, b: number): number { return a - b }
export function mult(a: number, b: number): number { return a * b }

export const funcMap = { 'add': add, 'sub': sub, 'mult': mult};

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





///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

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
}
export class BinaryExpressionImpl implements BinaryExpression {
    value: Number;
    term: Term;
    eq: string;
    constructor(public expression: BinaryExpression) {
        this.value = expression.value;
        this.term = expression.term;
        this.eq = expression.eq;
    }
    toString(): string {
        return '(' + (<Number>this.expression.term.x).n + ',' + (<Number>this.expression.term.y).n +
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
    expression: BinaryExpression;
    render(): string;
}
export class ExerciseMathImpl implements ExerciseMath {
    private _render: string;
    constructor(public expression: BinaryExpression) { }
    render() {
        return this._render;
    }
}
