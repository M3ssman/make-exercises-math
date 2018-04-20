import { Expression, ExerciseMath, ExtensionExpression } from './exercises.math';

/**
 * Basic Binary Functions
 */
export function add(a: number, b: number): number { return a + b }
export function sub(a: number, b: number): number { return a - b }
export function mult(a: number, b: number): number { return a * b }
export function div(a:number, b:number): number { return a / b}

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

export interface Renderer {

}

/**
 * StringRenderer Declaration
 */
export interface StringRenderer extends Renderer {
    toMaskedString?(expression: Expression, maskChar: string): string;
    toRenderedParts?(expression: Expression): string[];
    renderExtensions?(exerc: ExerciseMath): string[];
}

/**
 * Default Render Implementation
 */
export class SimpleExpressionResultRenderer implements StringRenderer {
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
export class AdditionWithCarryExpressionRenderer implements StringRenderer {
    renderExtensions(exerc: ExerciseMath): string[] {
        let result = [];
        if (exerc.expression.operands && exerc.expression.value) {
            const str_op = funcMap[exerc.expression.operations[0]].label;
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
                tmp_carry = str_op + ' ' + tmp_carry.substring(2);
            } else {
                const l = filled_ops.length - 1;
                filled_ops[l] = str_op + ' ' + filled_ops[l].substring(2);
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



export class SubtractionWithCarryExpressionRenderer implements StringRenderer {
    renderExtensions(exerc: ExerciseMath): string[] {
        let result = [];
        if (exerc.expression.operands && exerc.expression.value) {
            const str_op = funcMap[exerc.expression.operations[0]].label;
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
                tmp_carry = str_op + ' ' + tmp_carry.substring(2);
            } else {
                const l = filled_ops.length - 1;
                filled_ops[l] = str_op + ' ' + filled_ops[l].substring(2);
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


export class SimpleMultiplicationExtensionRenderer implements StringRenderer {
    renderExtensions(exerc: ExerciseMath): string[] {
        let result = [];
        if (exerc.expression.operands && exerc.extensions && exerc.expression.value) {
            const str_op = funcMap[exerc.expression.operations[0]].label;
            const str_ops: string[] = exerc.expression.operands.map(o => o.toString());
            // render exercises first row
            const rowOne = str_ops[0] + ' ' + str_op + ' ' + str_ops[1];
            result.push(rowOne);
            // first row must be the longest row
            const max_len = rowOne.length;

            exerc.extensions[0].operands
                .map( op => op.reduce((pop, cop) => pop + cop.toString(), ''))
                .map( opStr => replaceLeadingZeros(opStr))
                .map( opStr2 => prepend_ws(max_len, opStr2))
                .map( opStr3 => opStr3.replace(/[1-9]/g,'_'))
                .forEach( ops => result.push(ops));

            let carryStr = '';
            const str_val = exerc.expression.value.toString();
            if(exerc.extensions[0].carry && exerc.extensions[0].carry.filter( d => d > 0).length > 0) {
                carryStr = exerc.extensions[0].carry.reduce((p,c) => p+c ,'') || '';
                if(carryStr && carryStr.trim().length > 0) {
                    result.push(maskCarry(prepend_ws(max_len, carryStr), '_'));
                }
            }

            // fill whitespaces
            const filled_val = prepend_ws(max_len, str_val);

            // mask result
            result.push(filled_val.replace(/[0-9]/g, '_'));
        }
        // push value at last
        return result;
    }
}

function replaceLeadingZeros(s: string): string {
    let t: string[] = [];
    let i = 0;
    while(s.charAt(i) === '0') {
        t[i++] = ' ';
    }
    let ts = t.reduce( (p,c) => p + c, '');
    return ts.concat(s.substring(i));
}


const signWithSpace = '- ';
/**
 * 
 * Rendering for Division Extensions
 * 
 */
export class DivisionExtensionRenderer implements StringRenderer {
    renderExtensions(exerc: ExerciseMath): string[] {
        let result: string [] = [];
        if(_isValid(exerc)) {
            const expr = exerc.expression;
            const exts = exerc.extensions;
            const gap = _calculateGap(signWithSpace.length);
            const fillSpaces = _calculateFillString(exerc.extensions);
            const firstRow = gap + expr.operands[0] + fillSpaces + ': ' + expr.operands[1] + ' = ' + expr.value;
            result.push(firstRow);

            if(exerc.extensions.length > 0) {
                exerc.extensions.forEach((e, i, es) => result = result.concat(renderExtStr(e,i,es)));
            }
        }

        return result;
    }
}

function _isValid(exerc: ExerciseMath) {
    return exerc.expression && exerc.expression.operands && exerc.expression.value && exerc.extensions;
}

function _calculateFillString(exts: ExtensionExpression[]): string {
    return exts.reduce((p, _) => p += ' ', '');
}

function renderExtStr(e: ExtensionExpression, i: number, es: ExtensionExpression[]): string[] {
    const r: string[] = [];

    if(e.operands && e.value) {
        let gap: string = _calculateGap(signWithSpace.length + i);  
        if(i !== 0) {
            const s = gap + e.operands[0].join('').replace(/[1-9]/g,'_');
            r.push(s);
        }
        let m: string = e.operands[1].join('').replace(/[1-9]/g,'_');
        let c = undefined;
        if(e.carry) {
            c = signWithSpace + e.carry.join('');
            r.push(gap + m);
        } else {
            r.push(_calculateGap(i) + signWithSpace + m);
        }
        if(c) {
            r.push(c.replace(/[1-9]/g, '_').replace(/0/g, ' '));
        }
        // only use value if last entry
        if(i === (es.length -1) ) {
            const _v = gap + e.value.join('');
            let v = '';
            for(let i = 0; i< _v.length-1; i++) {
                if(_v[i] !== ' ' && v[i] !== '0') {
                    v = v.concat(_calculateGap(_v.length - _v.substr(i-1).length), _v[_v.length-1]);
                    break;
                } else {
                    v = v.concat(_v[i]);
                }
            }
            r.push(v);
        }
    }
    return r;
}

function _calculateGap(i: number) : string {
    let s = '';
    while(i-- > 0) {
        s += ' ';
    }
    return s;
}