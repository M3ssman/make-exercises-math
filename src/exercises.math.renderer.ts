import { Expression } from './exercises.math';

/**
 * Basic Binary Functions
 */
export function add(a: number, b: number): number { return a + b }
export function sub(a: number, b: number): number { return a - b }
export function mult(a: number, b: number): number { return a * b }

export interface OpEntry {
    label: string;
    func: (a: number, b: number) => number;
}
export const funcMap: { [key: string]: OpEntry } = {
    'add': { label: '+', func: add },
    'sub': { label: '-', func: sub },
    'mult': { label: '*', func: mult },
    'div': { label: ':', func: mult }
};

/**
 * Renderer Declaration
 */
export interface Renderer {
    toMaskedString?(expression: Expression, maskChar: string): string;
    toRenderedParts?(expression: Expression): string[];
}

/**
 * Default Render Implementation
 */
export class SimpleExpressionResultRenderer implements Renderer {
    toMaskedString(expression: Expression, maskChar: string): string {
        let mask = '';
        if (typeof expression.value === 'number') {
            for (let i = 0; i < expression.value.toString().length; i++) {
                mask += maskChar;
            }

            // handle rendering of division with optional Rest part
        } else if (typeof expression.value === 'object' && expression.operations[0] === 'div') {
            if (expression.value.length !== undefined) {
                const q = expression.value[0];
                for (let i = 0; i < q.toString().length; i++) {
                    mask += maskChar;
                }
                if (expression.value.length == 2) {
                    const ow = expression.value[1];
                    mask += ' R ';
                    for (let i = 0; i < ow.toString().length; i++) {
                        mask += maskChar;
                    }
                }
            }
        }

        let ops = expression.operations.map(op => funcMap[op].label);
        let xpr = '';
        xpr += expression.operands[0];
        for (let o = 0, ow = 1; o < ops.length; o++ , ow++) {
            if (ops[o]) {
                xpr += ops[o];
            }
            if (expression.operands[ow]) {
                xpr += expression.operands[ow];
            }
        }
        return '' + xpr + ' = ' + mask;
    }
}

/**
 * 
 * Advanced Rendering of Addition with Carry
 * 
 */
export class AdditionWithCarryExpressionRenderer implements Renderer {
    toRenderedParts(expression: Expression): string[] {
        let result = [];
        if (expression.operands && expression.value) {
            const str_add = funcMap[expression.operations[0]].label;
            const str_ops = expression.operands.map(o => o.toString());
            const operandsMatrix: number[][] = calculateOperandsMatrix(expression.operands);
            const addCarryFunc: (ow: number[], value: number) => number = _addCarryFunc;
            const carryRaw = renderCarry(operandsMatrix, _addValueFunc, addCarryFunc);
            const renderedCarry = maskCarry(carryRaw, '_');
            const str_val = expression.value.toString();
            const max_len = calculateMaxLen(str_ops, str_val, renderedCarry);

            // respect operator and whitespace after operator
            const tar_len = max_len + 2;

            // fill whitespaces
            const filled_ops = str_ops.map(op => prepend_ws(tar_len, op));
            const filled_val = prepend_ws(tar_len, str_val);

            // where to prepend the operator char
            let tmp_carry = '';
            if (renderedCarry.trim().length > 0) {
                tmp_carry = prepend_ws(tar_len, renderedCarry);
                tmp_carry = str_add + ' ' + tmp_carry.substring(2);
            } else {
                const l = filled_ops.length - 1;
                filled_ops[l] = str_add + ' ' + filled_ops[l].substring(2);
            }

            // collect final results
            result = [].concat(filled_ops);
            if (tmp_carry.trim().length > 0) {
                result.push(tmp_carry);
            }
            // mask result
            result.push(filled_val.replace(/[0-9]/g, '_'));
        }
        // push value at last
        return result;
    }
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

function prepend_ws(tar_len: number, op: string) {
    const cur_diff = tar_len - op.length;
    let s = '';
    for (let i = 0; i < cur_diff; i++) {
        s += ' ';
    }
    return s + op;
}

function calculateMaxLen(ops: string[], ...args: string[]): number {
    return ops.concat(args).reduce((p, currentCarry) => {
        if (currentCarry.length > p) {
            return currentCarry.length;
        } else {
            return p;
        }
    },
        0);
}

function maskCarry(value: string, mask: string): string {
    return value.replace(/0/g, ' ').replace(/[1-9]/g, mask);
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
    // invert tab
    return _invert(norm_tab);
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

/**
 * 
 * Calculate Carry String from provided Digit-Matrix with given Value-Function
 * 
 * @param cs 
 * @param valueFunc 
 */
function renderCarry(cs: number[][],
    valueFunc: (row: number[], value: number) => number,
    carryFunc: (row: number[], value: number) => number): string {
    let s = [];
    let currentCarry = 0;

    for (let i = 0; i < cs.length; i++) {
        s.unshift(currentCarry);

        let value = valueFunc(cs[i], currentCarry);
        if (currentCarry > 0) {
            currentCarry = 0;
        }

        currentCarry = carryFunc(cs[i], value);
    }
    return s.reduce((p,c) => p +c , '');
}


export class SubtractionWithCarryExpressionRenderer implements Renderer {
    toRenderedParts(expression: Expression): string[] {
        let result = [];
        if (expression.operands && expression.value) {
            const str_add = funcMap[expression.operations[0]].label;
            const str_ops = expression.operands.map(o => o.toString());
            const operandsMatrix: number[][] = calculateOperandsMatrix(expression.operands);

            const carryRaw = renderCarry(operandsMatrix, _subValFunc, _subCarryFunc);
            const renderedCarry = maskCarry(carryRaw, '_');
            const str_val = expression.value.toString();
            const max_len = calculateMaxLen(str_ops, str_val, renderedCarry);

            // respect operator and whitespace after operator
            const tar_len = max_len + 2;

            // fill whitespaces
            const filled_ops = str_ops.map(op => prepend_ws(tar_len, op));
            const filled_val = prepend_ws(tar_len, str_val);

            // where to prepend the operator char
            let tmp_carry = '';
            if (renderedCarry.trim().length > 0) {
                tmp_carry = prepend_ws(tar_len, renderedCarry);
                tmp_carry = str_add + ' ' + tmp_carry.substring(2);
            } else {
                const l = filled_ops.length - 1;
                filled_ops[l] = str_add + ' ' + filled_ops[l].substring(2);
            }

            // collect final results
            result = [].concat(filled_ops);
            if (tmp_carry.trim().length > 0) {
                result.push(tmp_carry);
            }
            // mask result
            result.push(filled_val.replace(/[0-9]/g, '_'));
        }
        // push value at last
        return result;
    }
}

function _subValFunc(row: number[], carry: number): number {
    return row[0] - (row[1] + carry);
}
function _subCarryFunc(row: number[], value: number): number {
    return (row[0] >= row[1] - value) ? 0 : 1;
}

