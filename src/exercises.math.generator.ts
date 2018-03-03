// import { MathBaseOption } from './math.base-option';
import { NumConstraint } from './exercises.math';
import {
    Expression,
    ExtensionExpression,
    ExerciseMath,
    ExerciseMathImpl
} from './exercises.math';

/**
 * 
 * Generate Expression using provided Constraints with given Operations
 * 
 * @param operation 
 * @param operandsConstraints 
 */
export function generateExpression(
    operations: ((x: number, y: number) => number)[],
    operandsConstraints: NumConstraint[],
    resultConstraints: NumConstraint): Expression {

    let x = 0, y = 0, r = 0, operands = [], expression: Expression = {
        operands: [], operations: [], value: 0
    };
    let xConstr, yConstr;
    let nr_ok = false, r_ok = true, all_again = true;

    let n = 1;
    do {

        // get first two operand constraints, if any, to compute f(x,y)
        if (operandsConstraints !== undefined && operandsConstraints[0]) {
            xConstr = operandsConstraints[0];
        }
        x = _getNumber(xConstr);
        if (operandsConstraints !== undefined && operandsConstraints[1]) {
            yConstr = operandsConstraints[1];
        }
        y = _getNumber(yConstr);

        nr_ok = __holdXYoperandsConstraints(x, y, xConstr, yConstr);
        r = (operations[0])(x, y);

        // build expression
        expression.operands.push(x, y);
        expression.operations.push(operations[0].name);

        // with more than 1 operation do
        if (operations.length > 1) {
            for (let a = 2, o = 1; o < operations.length; o++ , a++) {
                if (operandsConstraints !== undefined && operandsConstraints[a]) {
                    yConstr = operandsConstraints[a];
                }
                y = _getNumber(yConstr);
                expression.operands.push(y);

                nr_ok = __holdXYoperandsConstraints(r, y, undefined, yConstr);
                r = (operations[o])(r, y);
                expression.operations.push(operations[o].name);
            }
        }
        // final result
        expression.value = r;

        // check result constraint
        const r_const: NumConstraint = resultConstraints;
        if (r_const) {
            r_ok = __holdResultConstraints(r, r_const)
        }
        // chek operandsConstraints
        if (nr_ok && r_ok) {
            all_again = false;
        } else {
            expression.operands = [];
            expression.operations = [];
            n++;
        }

    } while (all_again);
    // if (console) {
    //     console.log('needed ' + n + ' tries to calculate ' + JSON.stringify(expression));
    // }
    return expression;
}

function __holdXYoperandsConstraints(x: number, y: number, xConstr: NumConstraint, yConstr: NumConstraint): boolean {
    if (xConstr && xConstr.greaterThanIndex) {
        return x > y;
    } else if (yConstr && yConstr.greaterThanIndex) {
        return y > x;
    }
    return true;
}

function __holdResultConstraints(r: number, constraint: NumConstraint): boolean {
    if (constraint.multipleOf) {
        return (r % constraint.multipleOf) === 0;
    } else if (constraint.range) {
        const cr = constraint.range;
        if (cr.min) {
            return r >= cr.min && r <= cr.max;
        }
        return r <= cr.max;
    }
    return true;
}

function _getNumber(constraint?: NumConstraint): number {
    let result = 0;

    // sanitize
    if (constraint === undefined) {
        return __generateNumber(100, 1);
    }

    if (constraint.range) {
        const range = constraint.range;
        do {
            result = __generateNumber(range.max, range.min);
        } while (!__checkSingleConstraint(result, constraint));
    } else if (constraint.exactMatchOf) {
        return constraint.exactMatchOf;
    }
    return result;
}

function __checkSingleConstraint(n: number, constraint: NumConstraint): boolean {
    if (constraint.multipleOf) {
        return (n % constraint.multipleOf) === 0;
    }
    return true;
}

function __generateNumber(to: number, from?: number): number {
    if (from) {
        return to - Math.ceil(Math.random() * (to - from));
    }
    return Math.ceil(Math.random() * to);
}

/**
 * 
 * Generator Function for Division with optional Rest
 * 
 * @param constraints 
 */
export function* generateDivisionWithRest(constraints?: NumConstraint[]): IterableIterator<Expression> {
    // generator loop
    while (true) {
        const constrDividend = constraints[0];
        const constrDivisor = constraints[1];
        const dividend = __generateNumber(constrDividend.range.max, constrDividend.range.min);
        const divisor = __generateNumber(constrDivisor.range.max, constrDivisor.range.min);
        const divModulo = dividend % divisor;
        const val = (dividend - divModulo) / divisor;
        const vals = [val];
        if (divModulo !== 0) {
            vals.push(divModulo);
        }

        // yield expression
        yield { operands: [dividend, divisor], operations: ['div'], value: vals };
    }
}

/** 
 * 
 * Declare Interface for Extension Functions
 * 
*/
export interface GenerateExtensionsFunc {
    (expr: Expression): ExtensionExpression[];
}

export function generateExtensionsDefault(expr: Expression): ExtensionExpression[] {
    const ext: ExtensionExpression[] = [];
    if (expr.operands) {
        const steps = [];
        expr.operands.reduce((p, c, i) => {
            if (expr.operations[i] && expr.operations[i] === '-') {
                p = p - c;
            } else {
                p = p + c;
            }
            steps.push(p);
            return p;
        });
        ext.push({ operands: [], value: steps });
    }
    return ext;
}

export function generateExtensionsCarryAdd(expr: Expression): ExtensionExpression[] {
    const ext: ExtensionExpression[] = [];
    const operandsMatrix: number[][] = calculateOperandsMatrix(expr.operands);
    const carry = calculateCarry(_invert(operandsMatrix), _addValueFunc, _addCarryFunc);
    operandsMatrix.push(carry);
    ext.push({ operands: operandsMatrix, value: carry });
    return ext;
}

function _addCarryFunc(row: number[], value: number): number {
    if (value >= 10) {
        return Math.floor(value / 10);
    } else {
        return 0;
    }
}

function _addValueFunc(row: number[], value: number): number {
    return row.reduce((p, currentCarry) => p + currentCarry, value);
}

export function generateExtensionsCarrySub(expr: Expression): ExtensionExpression[] {
    const ext: ExtensionExpression[] = [];
    const operandsMatrix: number[][] = calculateOperandsMatrix(expr.operands);
    const carry: number[] = calculateCarry(_invert(operandsMatrix), _subValFunc, _subCarryFunc);
    ext.push({ operands: operandsMatrix, value: carry });
    return ext;
}

function _subValFunc(row: number[], carry: number): number {
    return row[0] - (row[1] + carry);
}
function _subCarryFunc(row: number[], value: number): number {
    return (row[0] >= row[1] - value) ? 0 : 1;
}

/**
 * 
 * Calculate Carry Array from provided Digit-Matrix with given Value and Carry Functions
 * 
 * @param m 
 * @param valueFunc 
 * @param carryFunc
 */
function calculateCarry(m: number[][],
    valueFunc: (row: number[], value: number) => number,
    // carryFunc: (row: number[], value: number) => number): string {
    carryFunc: (row: number[], value: number) => number): number[] {
    let s = [];
    let currentCarry = 0;

    for (let i = 0; i < m.length; i++) {
        s.unshift(currentCarry);

        let value = valueFunc(m[i], currentCarry);
        if (currentCarry > 0) {
            currentCarry = 0;
        }

        currentCarry = carryFunc(m[i], value);
    }
    return s;
}

function calculateOperandsMatrix(ops: number[]): number[][] {
    let digit_tab = [];
    // decompose integers
    for (let i = 0; i < ops.length; i++) {
        if (Number.isInteger(ops[i])) {
            const decomposition = _decompose_digit(ops[i]);
            const rev = decomposition.reverse();
            digit_tab[i] = rev;
        }
    }

    // normalize value Tab
    const norm_tab = _normalize_digit_tab(digit_tab);
    return norm_tab;
}

function _decompose_digit(z: number): number[] {
    let a = z.toString();
    let s = a.length;
    const result: number[] = [];
    for (let i = 0; i < s; i++) {
        result[i] = Number.parseInt(a[i]);
    }

    return result;
}

function _normalize_digit_tab(dt: number[][]): number[][] {
    // sort by number with max figures
    const o = dt.sort((a: number[], b: number[]) => b.length - a.length);
    // get max
    const m = o[0].length;
    // normalize
    const n: number[][] = o.map(value => __normalize(value, m));
    return n;
}

function __normalize(value: number[], m: number) {
    const d = m - value.length;
    if (d > 0) {
        const n = value.concat(new Array(d));
        return n.fill(0, value.length);
    }
    else {
        return value;
    }
}

function _invert(ns: number[][]): number[][] {
    const is = [];
    const dimR = ns.length;
    const dimC = ns[0].length;
    for (let currentCarry = 0; currentCarry < dimC; currentCarry++) {
        let i = [];
        for (let ow = 0; ow < dimR; ow++) {
            i.push(ns[ow][currentCarry]);
        }
        is.push(i);
    }
    return is;
}
