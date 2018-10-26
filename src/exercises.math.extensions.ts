import {
    Expression,
    Exercise,
    Extension,
    ExtensionExpression,
    Fraction,
    MixedNumeral
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
 * @param m 
 * @param valueFunc 
 * @param carryFunc
 */
function calculateCarry(m: number[][],
    valueFunc: (row: number[], value: number) => number,
    carryFunc: (row: number[], value: number) => number): number[] {
    let smallestFit = [];
    let currentCarry = 0;

    for (let i = 0; i < m.length; i++) {
        smallestFit.unshift(currentCarry);

        let value = valueFunc(m[i], currentCarry);
        if (currentCarry > 0) {
            currentCarry = 0;
        }

        currentCarry = carryFunc(m[i], value);
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
    const m = o[0].length;
    // normalize
    const n: number[][] = o.map(value => _normalize(value, m, true));
    return n;
}

/**
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
    const m = dividend_in.map((v, i) => divisor * v * Math.pow(10, i)).map(x => _decompose_digit(x));
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
            // otherwise running into lots of 'undefineds' with trailing "0"s 
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
 * Compose Number up to the m-th index from ns dividend_in sum from 0 to m using ns.c * 10^(m-ns.i)
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


/**
 * Extension for Fraction API
 */
export function extendAddFraction(exercise: Exercise): Exercise {
    const _e: Expression = exercise.expression
    exercise.extension = createExtensionAddFraction(_e)
    return exercise
}

export function createExtensionAddFraction(expression: Expression): ExtensionExpression {
    let ops = []
    const s1: Fraction = <Fraction>expression.operands[0]
    const s2: Fraction = <Fraction>expression.operands[1]
    ops.push([s1[0], s2[1]], [s1[1], s2[0]], [s1[1], s2[1]])
    const _d = s1[1] * s2[1]
    ops.push([s1[0] * s2[1], s2[0] * s1[1]], _d)
    // handle possible kuerzen
    const _r: Fraction = [s1[0] * s2[1] + s2[0] * s1[1], _d]
    if (gcd(_r[0], _r[1]) > 1) {
        ops.push(_r)
    }

    const e: ExtensionExpression = {
        type: 'ADD_FRACTION',
        extensions: [
            {
                operands: ops,
                value: <[number, number]>expression.value
            }
        ]
    }
    return e
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
export function rationalize(f: Fraction): Fraction {
    const [a, b] = f;
    const _gcd = gcd(a, b);
    if (_gcd > 1) {
        return [a / _gcd, b / _gcd];
    }
    return f;
}
export function canonize(f: Fraction): MixedNumeral {
    const [n, d] = f;
    // cornercase denominNator === 1, since n % 1 => 0
    if (d === 1) {
        return [n, [n, d]];
    }
    const diff = n % d;
    let i = 0;
    let _n = n;
    while (_n > d) {
        _n -= d;
        i++;
    }
    return [i, [_n, d]];
}
