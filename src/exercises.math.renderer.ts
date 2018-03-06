import { Expression, ExerciseMath } from './exercises.math';

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
    renderExtensions?(exerc: ExerciseMath): string[];
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
    renderExtensions(exerc: ExerciseMath): string[] {
        let result = [];
        if (exerc.expression.operands && exerc.expression.value) {
            const str_add = funcMap[exerc.expression.operations[0]].label;
            const str_ops = exerc.expression.operands.map(o => o.toString());

            const _v : number | number[] = exerc.extensions[0].carry || [];
            const cr = (_v instanceof Array ) ? _v.reduce((p, c) => p + c, ''): '';
            const renderedCarry = maskCarry(cr, '_');
            const str_val = exerc.expression.value.toString();
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



export class SubtractionWithCarryExpressionRenderer implements Renderer {
    renderExtensions(exerc: ExerciseMath): string[] {
        let result = [];
        if (exerc.expression.operands && exerc.expression.value) {
            const str_add = funcMap[exerc.expression.operations[0]].label;
            const str_ops = exerc.expression.operands.map(o => o.toString());
            const _v : number | number[] = exerc.extensions[0].carry || [];
            const renderedCarry = (_v instanceof Array ) ? _v.reduce((p, c) => p + c, ''): '';

            const str_val = exerc.expression.value.toString();
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
                result.push(maskCarry(tmp_carry, '_'));
            }
            // mask result
            result.push(filled_val.replace(/[0-9]/g, '_'));
        }
        // push value at last
        return result;
    }
}

