import {
    Expression,
    Exercise,
    Extension
} from './exercises.math';

/**
 * Basic Binary Functions
 */
export function add(a: number, b: number): number { return a + b }
export function sub(a: number, b: number): number { return a - b }
export function mult(a: number, b: number): number { return a * b }
export function div(a: number, b: number): number { return a / b }

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
    (exercise: Exercise): Exercise;
}

/**
 * Default Render Implementation
 */
export function renderDefault(exercise: Exercise): Exercise {
    let maskChar = "_";
    let mask = '';
    let expression: Expression = exercise.expression;
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
    const result: string = '' + xpr + ' = ' + mask;
    exercise.rendered.push(result);
    return exercise;
}

/**
 * 
 * Advanced Rendering of Addition with Carry
 * 
 */
export function renderExtensionsAdditionCarry(exercise: Exercise): Exercise {
    let result = [];
    if (exercise.expression.operands && exercise.expression.value) {
        const str_op = funcMap[exercise.expression.operations[0]].label;
        const str_ops = (<number[]>exercise.expression.operands).map(o => o.toString());

        const _v: number | number[] = exercise.extension.extensions[0].carry || [];
        const cr = (_v instanceof Array) ? _v.reduce((p, c) => p + c, '') : '';
        const renderedCarry = maskCarry(cr, '_');
        const str_val = exercise.expression.value.toString();
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
    exercise.rendered = exercise.rendered.concat(result);
    return exercise;
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


export function renderExtensionsSubtractionCarry(exercise: Exercise): Exercise {
    let result = [];
    if (exercise.expression.operands && exercise.expression.value) {
        const str_op = funcMap[exercise.expression.operations[0]].label;
        const str_ops = (<number[]>exercise.expression.operands).map(o => o.toString());
        const _v: number | number[] = exercise.extension.extensions[0].carry || [];
        const renderedCarry = (_v instanceof Array) ? _v.reduce((p, c) => p + c, '') : '';

        const str_val = exercise.expression.value.toString();
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
    exercise.rendered = exercise.rendered.concat(result);
    return exercise;
}


export function renderExtensionsMultiplication(exercise: Exercise): Exercise {
    let result = [];
    if (exercise.expression.operands && exercise.extension && exercise.expression.value) {
        const str_op = funcMap[exercise.expression.operations[0]].label;
        const str_ops: string[] = (<number[]>exercise.expression.operands).map(o => o.toString());
        // render exercises first row
        const rowOne = str_ops[0] + ' ' + str_op + ' ' + str_ops[1];
        result.push(rowOne);
        // first row must be the longest row
        const max_len = rowOne.length;

        (<number[][]>exercise.extension.extensions[0].operands)
            .map(op => op.reduce((pop, cop) => pop + cop.toString(), ''))
            .map(opStr => replaceLeadingZeros(opStr))
            .map(opStr2 => prepend_ws(max_len, opStr2))
            .map(opStr3 => opStr3.replace(/[1-9]/g, '_'))
            .forEach(ops => result.push(ops));

        let carryStr = '';
        const str_val = exercise.expression.value.toString();
        if (exercise.extension.extensions[0].carry && exercise.extension.extensions[0].carry.filter(d => d > 0).length > 0) {
            carryStr = exercise.extension.extensions[0].carry.reduce((p, c) => p + c, '') || '';
            if (carryStr && carryStr.trim().length > 0) {
                result.push(maskCarry(prepend_ws(max_len, carryStr), '_'));
            }
        }

        // fill whitespaces
        const filled_val = prepend_ws(max_len, str_val);

        // mask result
        result.push(filled_val.replace(/[0-9]/g, '_'));
    }
    // push value at last
    //return result;
    exercise.rendered = exercise.rendered.concat(result);
    return exercise;
}

function replaceLeadingZeros(s: string): string {
    let t: string[] = [];
    let i = 0;
    while (s.charAt(i) === '0') {
        t[i++] = ' ';
    }
    let ts = t.reduce((p, c) => p + c, '');
    return ts.concat(s.substring(i));
}



/**
 * 
 * Rendering for Division Extensions
 * 
 */
export function renderExtensionsDivEven(exercise: Exercise): Exercise {
    let result: string[] = [];
    if (_isValid(exercise)) {
        const expr = exercise.expression;
        const gap = '  '
        const dividend = expr.operands[0];
        const divisor = expr.operands[1];
        const firstRow = gap + dividend.toString() + ' : ' + divisor + ' = ' + expr.value;
        result.push(firstRow);
        if (exercise.extension.extensions.length > 0) {
            const gapMap : {[key:number]: number} = {}
            exercise.extension.extensions
                .forEach((e, i, es) => result = result.concat(_renderExtensionDiv(e, i, es, gapMap)));
        }
    }
    exercise.rendered = exercise.rendered.concat(result);
    return exercise;
}

function _isValid(exercise: Exercise) {
    return exercise.expression && exercise.extension;
}

const signToken = '- '
function _renderExtensionDiv(e: Extension, i: number, es: Extension[], gapMap: {[key:number]: number}): string[] {
    const r: string[] = [];
    let _g = ''

    const subtrah = e.operands[0].join('')
    const minuend = e.operands[1].join('')
    
    // we dont want first row subtrahend, this is already rendered
    if (i === 0) {
        r.push(signToken + minuend);
        gapMap[0] = 2
    }
    
    // handle subtrahend + minuend
    if (i > 0) {
        let ng = _calculateGap(e, i, es[i-1].value, gapMap);
        gapMap[i] = ng
        const g: string = _fillSpace(ng)
        r.push(_keepLastZero(g + subtrah, es[i - 1]));
        r.push(_exchangeSign(g + minuend));
        // store for final result
        _g = g
    }
    
    // only use value for very last entry
    let differe = e.value.join('')
    if (Number.parseInt(differe) === 0) {
        differe = _fillSpace(differe.length - 1) + '0'
    }
    if (i === (es.length - 1)) {
        r.push(_g + differe);
    }
    return r;
}

/**
 * 
 * @param nrs data
 * @param iFirst First operand saves all trailing zeros
 */
export function _exchangeTrailingZeros(nrs: number[], isFirst: boolean): string {
    const _asString = nrs.join('');
    let rawNumber = Number.parseInt(_asString);
    let whiteZeros = '';
    if (isFirst && _asString.startsWith('0')) {
        return _asString;
    }
    for (let i = 0; nrs[i] <= 0 && i < nrs.length - 1; i++) {
        whiteZeros += ' ';
    }
    return whiteZeros + rawNumber;
}

export function _calculateGap(e: Extension, i: number, es: number[],gapMap: {[key:number]: number}): number {
    const subtrah = e.operands[0].join('')
    const prevValStr = es.join('')
    const previousVal = Number.parseInt(prevValStr)

    // start value for gap, move 1 column to the right
    let len = 0
    if( previousVal !== 0) {
        len = gapMap[i-1] + (1 - Math.abs(subtrah.length - prevValStr.length))
    } else { // previousVal was "0"
        len = gapMap[i-1] + prevValStr.length
    }
    return len
}

function _keepLastZero(s: string, last: Extension): string {
    const previousVal = last.value.join('')
    const _prevNumeric = Number.parseInt(previousVal)
    if (_prevNumeric === 0 /*&& _currNumeric !== 0*/) {
        return s.replace(/\s(\w)/, '0$1')
    }
    return s
}

function _exchangeSign(m: string): string {
    const _r = m.replace(/\s\s(\w)/, '- $1')
    return _r
}

function _fillSpace(i: number): string {
    let _space = ''
    for (let _i = 0; _i < i; _i++) {
        _space += ' '
    }
    return _space
}
