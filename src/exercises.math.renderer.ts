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
                    const r = expression.value[1];
                    mask += ' R ';
                    for (let i = 0; i < r.toString().length; i++) {
                        mask += maskChar;
                    }
                }
            }
        }

        let ops = expression.operations.map(op => funcMap[op].label);
        let xpr = '';
        xpr += expression.operands[0];
        for (let o = 0, r = 1; o < ops.length; o++ , r++) {
            if (ops[o]) {
                xpr += ops[o];
            }
            if (expression.operands[r]) {
                xpr += expression.operands[r];
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
            const addCarryFunc: (r: number[], v: number) => number = _addCarryFunc;
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

function _addCarryFunc(r: number[], v: number): number {
    if (v >= 10) {
        return Math.floor(v / 10);
    } else {
        return 0;
    }
}

function _addValueFunc(row: number[], car: number): number {
    return row.reduce((p, c) => p + c, car);
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
    return ops.concat(args).reduce((p, c) => {
        if (c.length > p) {
            return c.length;
        } else {
            return p;
        }
    },
        0);
}

function maskCarry(carry: string, mask: string): string {
    return carry.replace(/0/g, ' ').replace(/[1-9]/g, mask);
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

    // normalize carry Tab
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
    const n: number[][] = o.map(v => __normalize(v, m));
    return n;
}

function __normalize(v: number[], m: number) {
    const d = m - v.length;
    if (d > 0) {
        const n = v.concat(new Array(d));
        return n.fill(0, v.length);
    }
    else {
        return v;
    }
}

function _invert(ns: number[][]): number[][] {
    const is = [];
    const dimR = ns.length;
    const dimC = ns[0].length;
    for (let c = 0; c < dimC; c++) {
        let i = [];
        for (let r = 0; r < dimR; r++) {
            i.push(ns[r][c]);
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
    valueFunc: (row: number[], carry: number) => number,
    carryFunc: (row: number[], value: number) => number): string {
    let s = '';
    let c = 0;

    for (let i = 0; i < cs.length; i++) {
        s = c + s;
        if (c > 0) {
            c = 0;
        }

        let v = valueFunc(cs[i], c);
        c = carryFunc(cs[i], v);
    }
    return s;
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

function _subCarryFunc(row: number[], car: number): number {
    if (row.length !== 2) {
        return;
    } else {
        const s = row[0];
        const m = row[1] + car;
        return s >= m ? 0 : 1;;
    }
}

function _subValFunc(row: number[], car: number): number {
    if (row.length !== 2) {
        return;
    } else {
        const s = row[0];
        const m = row[1] + car;
        return s >= m ? s - m : (s + 10) - m;
    }
}
