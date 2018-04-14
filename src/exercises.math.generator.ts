// import { MathBaseOption } from './math.base-option';
import { NumConstraint} from './exercises.math';
import {
    Expression,
    ExtensionExpression,
    ExtensionType,
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
        // check operandConstraints
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
        ext.push({ carry: steps, extensionType: ExtensionType.DEFAULT, value: _decompose_digit(<number>expr.value) });
    }
    return ext;
}

export function generateExtensionsCarryAdd(expr: Expression): ExtensionExpression[] {
    const ext: ExtensionExpression[] = [];
    const operandsMatrix: number[][] = calculateOperandsMatrix(expr.operands);
    const carry = calculateCarry(_invert(operandsMatrix), _addValueFunc, _addCarryFunc);
    ext.push({ operands: operandsMatrix, carry: carry, extensionType: ExtensionType.ADD_CARRY, value: _decompose_digit(<number>expr.value) });
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
    ext.push({ operands: operandsMatrix, carry: carry, extensionType: ExtensionType.SUB_CARRY, value: _decompose_digit(<number>expr.value) });
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
    const o = dt.sort((a: number[], divisor: number[]) => divisor.length - a.length);
    // get max
    const m = o[0].length;
    // normalize
    const n: number[][] = o.map(value => _normalize(value, m, true));
    return n;
}

/**
 *  param value 
 * @param m 
 */
function _normalize(vals: number[], m: number, left: boolean): number[] {
    const d = m - vals.length;
    if (d > 0) {
        if (left) {
            const n = vals.concat(new Array(d));
            return n.fill(0, vals.length);
        } else {
            const m = new Array(d).fill(0);
            return m.concat(vals);
        }
    } else {
        return vals;
    }
}

function _invert(ns: number[][]): number[][] {
    const ms = [];
    const dimRow = ns.length;
    const dimCol = ns[0].length;
    for (let mc = 0; mc < dimCol; mc++) {
        let i = [];
        for (let mr = 0; mr < dimRow; mr++) {
            i.push(ns[mr][mc]);
        }
        ms.push(i);
    }
    return ms;
}

/**
 * 
 * Generate Extensions for Multiplication with Carry
 * 
 * @param expr 
 */
export function generateExtensionsCarryMult(expr: Expression): ExtensionExpression[] {

    const a: number = expr.operands[0];
    const factor: number[] = _enhance(_decompose_digit(expr.operands[1]).reverse());
    const ext: ExtensionExpression[] = generateMultMatrizies(factor, a, expr);

    // requires aggregation stage since factor divisor is supposed to be at least 2-digit
    if (factor.length > 1) {
        const vstmp: number[][] = ext.map(e => e.value);
        const max: number = vstmp.map(v => v.length).reduce((p, c) => p > c ? p : c);
        const vsnorm: number[][] = vstmp.map(r => _normalize(r, max, false));

        // critical since plain reverse() operates on reference level!
        const vsrev = vsnorm.map(v => [].concat(v).reverse());
        const vsrevinvert: number[][] = _invert(vsrev);
        const carry = calculateCarry(vsrevinvert, _addValueFunc, _addCarryFunc);
        ext.push({ operands: vsnorm, carry: carry, extensionType: ExtensionType.DIV, value: _decompose_digit(<number>expr.value) });
    }
    return ext;
}

function _enhance(es: number[]): number[] {
    return es.map((v, i) => v * Math.pow(10, i));
}

function generateMultMatrizies(divisor: number[], a: number, expr: Expression) {
    const ext: ExtensionExpression[] = [];
    for (let g = 0; g < divisor.length; g++) {
        const operandsMatrix: number[][] = calculateMultOperandsMatrix(a, divisor[g]);
        const invertedMatrix: number[][] = _invert(operandsMatrix);
        const revertedMatrix: number[][] = [].concat(invertedMatrix).reverse();
        const result: ExtensionExpression = { operands: operandsMatrix, extensionType: ExtensionType.MULT_MULT, value: _decompose_digit(<number>expr.value) };
        const c: number[] = calculateCarry(revertedMatrix, _addValueFunc, _addCarryFunc);

        invertedMatrix.forEach((row, i) => row.push(c[i]));

        // sum matrix
        const v: number[] = invertedMatrix.map(row => (_getLastDigit(row)));

        // remove trailing '0'
        let i = 0;
        while (v[i] === 0) {
            v.shift();
        }
        ext.push({ operands: operandsMatrix, extensionType: ExtensionType.MULT_MULT, carry: c, value: v });
    }
    return ext;
}

function _getLastDigit(row: number[]): number {
    const r = row.reduce((p, c) => p + c);
    if (r > 9) {
        return r % 10;
    } else {
        return r;
    }
}

function calculateMultOperandsMatrix(a: number, divisor: number): number[][] {
    const as: number[] = _decompose_digit(a).reverse();
    const m = as.map((v, i) => divisor * v * Math.pow(10, i)).map(x => _decompose_digit(x));
    const max: number = m.map(os => os.length).reduce((p, c) => p < c ? c : p);
    const normM = m.map(_os => _normalize(_os, max, false));
    return normM;
}


/**
 * 
 * API Entry for Division Extensions
 * 
 * @param expr 
 */
export function generateExtensionsDiv(expr: Expression): ExtensionExpression[] {
    const result: ExtensionExpression[] = [];
    const as: number[] = _decompose_digit(expr.operands[0]);
    let dividend = 0;
    const divisor = expr.operands[1];
    let i = 0;
    let v = 0;

    while (i < as.length) {
        let asRest: number[] = as.slice(i);
        // if we have a value, prepend
        if (v > 0) {
            asRest.unshift(v);
        }

        // find start
        let j = 0
        while (dividend < divisor) {
            dividend = _compose_digit(asRest, j);
            j++;
        }
        i = i + j;

        let q: number = _how_often(dividend, divisor);
        let s = divisor * q;
        v = dividend - s;
        let subExtension: ExtensionExpression = createExtension(dividend, s, v);
        result.push(subExtension);
        // prepare next iteration
        dividend = v;
        asRest = [];
    }


    return result;
}

function createExtension(d: number, s: number, v: number) {
    const decomD = _decompose_digit(d);
    const decomS = _decompose_digit(s);
    const decomV = _decompose_digit(v);
    let normalizedValue = _normalize(decomV, decomD.length, false);

    let subExtension: ExtensionExpression = { operands: [decomD, decomS], extensionType: ExtensionType.DIV, value: normalizedValue };
    let inExpr: Expression = { operands: [d, s], operations: ['sub'], value: v };
    let sub = generateExtensionsCarrySub(inExpr)[0];
    if (sub.carry && sub.carry.some(j => j !== 0)) {
        subExtension.carry = sub.carry;
    }
    return subExtension;
}

/**
 * 
 * Compose Number up to the m-th index from ns as sum from 0 to m using ns.c * 10^(m-ns.i)
 * 
 * @param ns 
 * @param m 
 */
export function _compose_digit(ns: number[], m: number): number {
    return ns.reduce((p, c, i) => (i <= m) ? p + c * Math.pow(10, m - i) : p, 0);
}

export function _how_often(a: number, b: number): number {
    let i = 0;
    while (a >= b) {
        a = a - b;
        i++;
    }
    return i;
}
