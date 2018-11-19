import {
    Expression,
    Exercise,
    Extension,
    ExtensionExpression,
    Fraction,
} from './exercises.math';

/** 
 * 
 * API for Functions to generate intermediate Calculation Steps
 * 
*/
export interface Extensioneer {
    (exercise: Exercise): Exercise;
}

export function extendOneLine(exercise: Exercise): Exercise {
    const ext: Extension[] = [];
    if (exercise.expression) {
        const steps = [];
        (<number[]>exercise.expression.operands).reduce((p, c, i) => {
            if (exercise.expression.operations[i] && exercise.expression.operations[i] === '-') {
                p = p - c;
            } else {
                p = p + c;
            }
            steps.push(p);
            return p;
        });
        ext.push({ carry: steps, value: _decompose_digit(<number>exercise.expression.value) });
    }
    exercise.extension = { extensions: ext, type: 'SINGLE_LINE' }
    return exercise;
}

export function extendAddCarry(exercise: Exercise): Exercise {
    const ext: Extension[] = [];
    const operandsMatrix: number[][] = calculateOperandsMatrix(<number[]>exercise.expression.operands);
    const carry = calculateCarry(_invert(operandsMatrix), _addValueFunc, _addCarryFunc);
    ext.push({ operands: operandsMatrix, carry: carry, value: _decompose_digit(<number>exercise.expression.value) });
    exercise.extension = { type: 'ADD_CARRY', extensions: ext }
    return exercise;
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

export function extendSubCarry(exercise: Exercise): Exercise {
    const ext: Extension[] = [];
    const operandsMatrix: number[][] = calculateOperandsMatrix(<number[]>exercise.expression.operands);
    const carry: number[] = calculateCarry(_invert(operandsMatrix), _subValFunc, _subCarryFunc);
    ext.push({ operands: operandsMatrix, carry: carry, value: _decompose_digit(<number>exercise.expression.value) });
    exercise.extension = { type: 'SUB_CARRY', extensions: ext }
    return exercise
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
 * @param o2 
 * @param valueFunc 
 * @param carryFunc
 */
function calculateCarry(o2: number[][],
    valueFunc: (row: number[], value: number) => number,
    carryFunc: (row: number[], value: number) => number): number[] {
    let smallestFit = [];
    let currentCarry = 0;

    for (let i = 0; i < o2.length; i++) {
        smallestFit.unshift(currentCarry);

        let value = valueFunc(o2[i], currentCarry);
        if (currentCarry > 0) {
            currentCarry = 0;
        }

        currentCarry = carryFunc(o2[i], value);
    }
    return smallestFit;
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
    let smallestFit = a.length;

    const result: number[] = [];
    for (let i = 0; i < smallestFit; i++) {
        result[i] = Number.parseInt(a[i]);
    }

    return result;
}

function _normalize_digit_tab(dt: number[][]): number[][] {
    // sort by number with max figures
    const o = dt.sort((a: number[], divisor: number[]) => divisor.length - a.length);
    // get max
    const o2 = o[0].length;
    // normalize
    const n: number[][] = o.map(value => _normalize(value, o2, true));
    return n;
}

/**
 * @param o2 
 */
function _normalize(vals: number[], o2: number, left: boolean): number[] {
    const d = o2 - vals.length;
    if (d > 0) {
        if (left) {
            const n = vals.concat(new Array(d));
            return n.fill(0, vals.length);
        } else {
            const o2 = new Array(d).fill(0);
            return o2.concat(vals);
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
            if (ns[mr] !== undefined && ns[mr][mc] !== undefined) {
                i.push(ns[mr][mc]);
            } else {
                console.log('[WARN] invalid ns = ' + JSON.stringify(ns) + ' at mr = ' + mr + ', mc = ' + mc + ' !');
            }
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
export function extendMultCarry(exercise: Exercise): Exercise {

    const a: number = <number>exercise.expression.operands[0];
    const smallestFit: number[] = _enhance(_decompose_digit((<number[]>exercise.expression.operands)[1]).reverse());
    const ext: Extension[] = generateMultMatrizies(smallestFit, a, exercise.expression);

    // requires aggregation stage since smallestFit divisor is supposed to be at least 2-digit
    if (smallestFit.length > 1) {
        const vstmp: number[][] = ext.map(e => e.value);
        const max: number = vstmp.map(v => v.length).reduce((p, c) => p > c ? p : c);
        const vsnorm: number[][] = vstmp.map(r => _normalize(r, max, false));

        // critical since plain reverse() operates on reference level!
        const vsrev = vsnorm.map(v => [].concat(v).reverse());
        const vsrevinvert: number[][] = _invert(vsrev);
        const carry = calculateCarry(vsrevinvert, _addValueFunc, _addCarryFunc);
        ext.push({ operands: vsnorm, carry: carry, value: _decompose_digit(<number>exercise.expression.value) });
    }
    exercise.extension = { type: 'MULT_MULT', extensions: ext }
    return exercise
}

function _enhance(es: number[]): number[] {
    return es.map((v, i) => v * Math.pow(10, i));
}

function generateMultMatrizies(divisor: number[], a: number, expr: Expression) {
    const ext: Extension[] = [];
    for (let g = 0; g < divisor.length; g++) {
        const operandsMatrix: number[][] = calculateMultOperandsMatrix(a, divisor[g]);
        const invertedMatrix: number[][] = _invert(operandsMatrix);
        const revertedMatrix: number[][] = [].concat(invertedMatrix).reverse();
        const result: Extension = { operands: operandsMatrix, value: _decompose_digit(<number>expr.value) };
        const c: number[] = calculateCarry(revertedMatrix, _addValueFunc, _addCarryFunc);

        invertedMatrix.forEach((row, i) => row.push(c[i]));

        // sum matrix
        const v: number[] = invertedMatrix.map(row => (_getLastDigit(row)));

        // remove trailing '0'
        let i = 0;
        while (v[i] === 0) {
            v.shift();
        }
        ext.push({ operands: operandsMatrix, carry: c, value: v });
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
    const dividend_in: number[] = _decompose_digit(a).reverse();
    const o2 = dividend_in.map((v, i) => divisor * v * Math.pow(10, i)).map(x => _decompose_digit(x));
    const max: number = o2.map(os => os.length).reduce((p, c) => p < c ? c : p);
    const normM = o2.map(_os => _normalize(_os, max, false));
    return normM;
}


/**
 * 
 * API Entry for Division Extensions
 * 
 * @param expr 
 */
export function extendDivEven(exercise: Exercise): Exercise {
    const result: Extension[] = [];
    const dividend_in: number[] = _decompose_digit(<number>exercise.expression.operands[0]);
    const divisor_in: number[] = _decompose_digit(<number>exercise.expression.operands[1]);
    const divisor = <number>exercise.expression.operands[1];
    let v = [];
    let _parts: number[] = [];
    let firstRun = true

    for (let i = 0; i < dividend_in.length;) {
        _parts.push(dividend_in[i]);
        i++;

        // if we have a value, prepend it - holds true for everey succeeding run
        if (v.length > 0) {
            v.reverse().forEach(_v => _parts.unshift(_v));
            v = [];
        }

        // search proper entry point, but only at first run
        // all preceeding runs consume only 1 digit / run
        if (firstRun) {
            // consume dividend_in while current part is < divisor
            // additional check if something left for next round second to last
            // otherwise running into lots of 'undefineds' with trailing "0"o1 
            while (_greater(divisor_in, _parts) && i < dividend_in.length) {
                _parts.push(dividend_in[i]);
                i++;
            }
            firstRun = false
        }

        const divPart = _toNumber(_parts);
        let smallestFit = divisor * _how_often(divPart, <number>divisor);
        const diff = divPart - smallestFit;
        let subExtension: Extension = createExtensionDivision(divPart, smallestFit, diff);
        result.push(subExtension);

        // prepare next iteration
        v = _decompose_digit(diff);
        _parts = [];
    }

    exercise.extension = { type: 'DIV_EVEN', extensions: result }
    return exercise
}

/**
 * Check whether as is greater than bs
 * @param as 
 * @param bs 
 */
export function _greater(as: number[], bs: number[]): boolean {
    if (as.length > bs.length) {
        return true;
    } else if (as.length < bs.length) {
        return false;
    } else {
        return as.map((n, i) => n > bs[i]).reduce((p, c) => p || c);;
    }
}

export function _toNumber(ns: number[]): number {
    return _compose_digit(ns, ns.length - 1);
}

function createExtensionDivision(d: number, smallestFit: number, v: number) {
    const decomD = _decompose_digit(d);
    let decomS = _decompose_digit(smallestFit);
    if (decomS.length < decomD.length) {
        let diff = decomD.length - decomS.length;
        while (diff-- > 0) {
            decomS.unshift(0);
        }
    }
    const decomV = _decompose_digit(v);
    let normalizedValue = _normalize(decomV, decomD.length, false);

    let subExtension: Extension = { operands: [decomD, decomS], value: normalizedValue };
    return subExtension;
}

/**
 * 
 * Compose Number up to the o2-th index from ns dividend_in sum from 0 to o2 using ns.c * 10^(o2-ns.i)
 * 
 * @param ns 
 * @param o2 
 */
export function _compose_digit(ns: number[], o2: number): number {
    return ns.reduce((p, c, i) => (i <= o2) ? p + c * Math.pow(10, o2 - i) : p, 0);
}

export function _how_often(a: number, b: number): number {
    let i = 0;
    while (a >= b) {
        a = a - b;
        i++;
    }
    return i;
}


/**
 * Extension for Fraction API
 */
export function extendAddFraction(exercise: Exercise): Exercise {
    const _e: Expression = exercise.expression
    const ops = createExtensionAddFractionOperands(_e)
    const e: ExtensionExpression = {
        type: 'ADD_FRACTION',
        extensions: [{
            operands: ops,
            value: <[number, number]>_e.value
        }]
    }
    exercise.extension = e
    return exercise
}

/**
 * 
 * Create Extensions for add and sub which 
 * 
 * @param f function
 * @param expression 
 */
function _createExtensionOperands01(f: (a: number, b: number) => number, expression: Expression): any[] {
    let ops = []
    const o1: Fraction = <Fraction>expression.operands[0]
    const o2: Fraction = <Fraction>expression.operands[1]

    // 1st term
    _enrich1stTermExtensions(ops, o1, o2);

    // 2nd term
    // extension 4 = o1[0] * o2[1], o2[0] * o1[1]
    // extension 5 = denominator
    const _d = o1[1] * o2[1]
    ops.push([o1[0] * o2[1], o2[0] * o1[1]], _d)

    // handle possible kuerzen
    // const _r: Fraction = [f(o1[0] * o2[1] + o2[0] * o1[1], _d]
    const _r: Fraction = [f(o1[0] * o2[1], o2[0] * o1[1]), _d]
    if (gcd(_r[0], _r[1]) > 1) {
        // extension 6 = rationalize (_r)
        ops.push(_r)
    }
    return ops
}

const _add = (a: number, b: number) => { return a + b }
const _sub = (a: number, b: number) => { return a - b }
const createExtensionAddFractionOperands: (Expression) => any[] = _createExtensionOperands01.bind(null, _add);
const createExtensionSubFractionOperands: (Expression) => any[] = _createExtensionOperands01.bind(null, _sub);

/**
 * 
 * Enrich 1st term (o1_0 * o2_1) f (o1_1 * o2_0) / (o1_1 * o2_1) as Extensions
 * for Terms which must be 'normalized'
 * 
 * extension 0 = o1_0 ,  o2_1
 * extension 1 = o1_1 ,  o2_0
 * extension 2 = o1_1 ,  o2_1
 * 
 * @param ops 
 * @param o1 
 * @param o2 
 */
function _enrich1stTermExtensions(ops: any[], o1: [number, number], o2: [number, number]) {
    ops.push([o1[0], o2[1]], [o1[1], o2[0]], [o1[1], o2[1]]);
}

/**
 * Greatest Common Divisor
 * @param a numerator
 * @param b denominNator
 */
export function gcd(a: number, b: number): number {
    if (a < b) {
        let smallestFit = a;
        a = b;
        b = smallestFit;
    }
    while ((a - b) > 0) {
        a = a - b;
        if (a < b) {
            let smallestFit = a;
            a = b;
            b = smallestFit;
        }
    }
    return a;
}

export function extendSubFraction(exercise: Exercise): Exercise {
    const _e: Expression = exercise.expression
    const ops = createExtensionSubFractionOperands(_e)
    const e: ExtensionExpression = {
        type: 'SUB_FRACTION',
        extensions: [{
            operands: ops,
            value: <[number, number]>_e.value
        }]
    }

    exercise.extension = e
    return exercise
}

export function extendMultFraction(exercise: Exercise): Exercise {
    const _e: Expression = exercise.expression
    const ops = createExtensionMultFractionOperands(_e)
    const e: ExtensionExpression = {
        type: 'MULT_FRACTION',
        extensions: [{
            operands: ops,
            value: <[number, number]>_e.value
        }]
    }

    exercise.extension = e
    return exercise
}

function createExtensionMultFractionOperands(expression: Expression): any[] {
    let ops = []
    const o1: Fraction = <Fraction>expression.operands[0]
    const o2: Fraction = <Fraction>expression.operands[1]
    // 1st term
    _enrich1stTermExtensionsMult(ops, o1, o2)

    // 2nd term
    const _2nd: [number, number] = [o1[0] * o2[0], o1[1] * o2[1]]
    ops.push(_2nd)

    // required kueren?
    _handlePossibleKuerzen(_2nd, expression, ops)
    return ops
}

function _handlePossibleKuerzen(_2nd: [number, number], expression: Expression, ops: any[]) {
    const _gcd = gcd(_2nd[0], _2nd[1]);
    if (_gcd > 1) {
        const _r: [number, number] = [_2nd[0] / _gcd, _2nd[1] / _gcd];
        if (_differ(_r, <[number, number]>expression.value)) {
            ops.push(_r);
        }
    }
}

function _differ(f1: Fraction, f2: Fraction): boolean {
    return f1[0] !== f2[0] && f1[1] !== f2[1]
}

export function extendDivFraction(exercise: Exercise): Exercise {
    const _e: Expression = exercise.expression
    const ops = createExtensionDivFractionOperands(_e)
    const e: ExtensionExpression = {
        type: 'DIV_FRACTION',
        extensions: [{
            operands: ops,
            value: <[number, number]>_e.value
        }]
    }
    exercise.extension = e
    return exercise
}

function createExtensionDivFractionOperands(expression: Expression): any[] {
    let ops = []
    const o1: Fraction = <Fraction>expression.operands[0]
    const o2: Fraction = <Fraction>expression.operands[1]
    // 1st term a - invert ops
    const _o1 = o1
    const _o2: [number, number] = [o2[1], o2[0]]
    ops.push(_o1, _o2)

    // 1st term b - move on with multFraction 1st step
    _enrich1stTermExtensionsMult(ops, _o1, _o2)

    // 2nd term
    const _2nd: [number, number] = [_o1[0] * _o2[0], _o1[1] * _o2[1]]
    ops.push(_2nd)

    // maybe kuerzen?
    _handlePossibleKuerzen(_2nd, expression, ops)

    return ops
}

function _enrich1stTermExtensionsMult(ops: any[], o1: [number, number], o2: [number, number]) {
    ops.push([o1[0], o2[0]], [o1[1], o2[1]])
}