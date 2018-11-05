import {
    Expression,
    Exercise,
    Extension,
    funcMap,
    ExtensionExpression
} from './exercises.math';

export type RenderedType =
    'FIRST_ROW'
    | 'OPERAND'
    | 'INTERMEDIATE'
    | 'CARRY'
    | 'VALUE'
    | 'FRACTION_NOMINATOR'
    | 'FRACTION_STRIKE'
    | 'FRACTION_DENOMINATOR'

export interface Rendered {
    rendered: string
    type: RenderedType
}

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
    exercise.rendered.push({ rendered: result, type: 'FIRST_ROW' });
    return exercise;
}

/**
 * 
 * Advanced Rendering of Addition with Carry
 * 
 */
export function renderExtensionsAdditionCarry(exercise: Exercise): Exercise {
    let result: Rendered[];
    if (exercise.expression.operands && exercise.expression.value) {
        const str_op = funcMap[exercise.expression.operations[0]].label;
        const str_ops: string[] = (<number[]>exercise.expression.operands).map(o => o.toString());

        const _v: number | number[] = exercise.extension.extensions[0].carry || [];
        // if carry exists and is Array, reduce it to string row
        const cr = (_v instanceof Array) ? _v.reduce((p, c) => p + c, '') : '';
        //const renderedCarry = maskCarry(cr, '_');
        const str_val = exercise.expression.value.toString();
        // calculate max length of Operators
        const max_len = calculateMaxLen(str_ops, str_val, cr);
        // respect operator and whitespace after operator
        const tar_len = max_len + 2;
        // fill whitespaces for Operators
        const _filled_ops: string[] = str_ops.map(op => prepend_ws(tar_len, op))
        // fill whitespaces for final Value
        const filled_val = prepend_ws(tar_len, str_val);

        // where to prepend the operator char
        let tmp_carry = '';
        // if (renderedCarry.trim().length > 0) {
        if (cr.trim().length > 0) {
            tmp_carry = prepend_ws(tar_len, cr);
            tmp_carry = str_op + ' ' + tmp_carry.substring(2);
        } else {
            // if no carry exists, prepend "+"-Sign before last Operand
            const l = _filled_ops.length - 1;
            _filled_ops[l] = str_op + ' ' + _filled_ops[l].substring(2);
        }

        // push intermediate Results
        const _i: RenderedType = 'OPERAND'
        const rendered_ops: Rendered[] = _filled_ops.map(_s => {
            return { type: _i, rendered: _s }
        });
        result = [].concat(rendered_ops);
        // collect carry if exists
        if (tmp_carry.trim().length > 0) {
            result.push({ type: 'CARRY', rendered: tmp_carry });
        }
        // collect result
        result.push({ type: 'VALUE', rendered: filled_val });
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


export function renderExtensionsSubtractionCarry(exercise: Exercise): Exercise {
    let result: Rendered[] = [];
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
        const filled_ops: string[] = str_ops.map(op => prepend_ws(tar_len, op))

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
        // map to Rendered
        const to: RenderedType = 'OPERAND'
        const _rs: Rendered[] = filled_ops.map(fo => {
            return { type: to, rendered: fo }
        })

        // collect operand rows
        result = result.concat(_rs);
        // collect carry if exists
        if (tmp_carry.trim().length > 0) {
            result.push({ type: 'CARRY', rendered: tmp_carry })
        }
        // get result
        result.push({ type: 'VALUE', rendered: filled_val })
    }
    exercise.rendered = exercise.rendered.concat(result);
    return exercise;
}


export function renderExtensionsMultiplication(exercise: Exercise): Exercise {
    let result: Rendered[] = [];
    if (exercise.expression.operands && exercise.extension && exercise.expression.value) {
        const str_op = funcMap[exercise.expression.operations[0]].label;
        const str_ops: string[] = (<number[]>exercise.expression.operands).map(o => o.toString());
        // render exercises first row
        const fr: RenderedType = 'FIRST_ROW'
        const im: RenderedType = 'INTERMEDIATE'
        const rowOne = { type: fr, rendered: str_ops[0] + ' ' + str_op + ' ' + str_ops[1] };
        result.push(rowOne);
        // first row must be the longest row
        const max_len = rowOne.rendered.length;

        (<number[][]>exercise.extension.extensions[0].operands)
            //.map(op => op.reduce((pop, cop) => pop + cop.toString(), ''))
            .map(op => op.reduce((pop, cop) => pop + cop.toString(), ''))
            .map((opStr: string, i: number) => replaceLeadingZeros(opStr, i))
            .map(_s3 => prepend_ws(max_len, _s3))
            .forEach(_s4 => result.push({ type: im, rendered: _s4 }))

        let carryStr = '';
        const str_val = exercise.expression.value.toString();
        if (exercise.extension.extensions[0].carry && exercise.extension.extensions[0].carry.filter(d => d > 0).length > 0) {
            carryStr = exercise.extension.extensions[0].carry.reduce((p, c) => p + c, '') || '';
            // handle carry if exists
            if (carryStr && carryStr.trim().length > 0) {
                const car: Rendered = { type: 'CARRY', rendered: prepend_ws(max_len, carryStr) }
                result.push(car)
            }
        }

        // fill whitespaces
        const filled_val = prepend_ws(max_len, str_val);

        // get result
        const val: Rendered = { type: 'VALUE', rendered: filled_val }
        result.push(val)
    }
    // push value at last
    exercise.rendered = exercise.rendered.concat(result);
    return exercise;
}

function replaceLeadingZeros(s: string, index?: number): string {
    const t: string[] = [];
    let i = 0;
    // track reverted count var j
    let j = s.length - index
    // as long as charAt i is Zero AND we havent reached the zero to keep index
    while (s.charAt(i) === '0' && i <= j) {
        t[i++] = ' '
        j--
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
    let result: Rendered[] = [];
    if (_isValid(exercise)) {
        const _expr = exercise.expression;
        const gap = '  '
        const dividend = _expr.operands[0];
        const divisor = _expr.operands[1];
        const first = gap + dividend.toString() + ' : ' + divisor + ' = ' + _expr.value;
        result.push({ rendered: first, type: 'FIRST_ROW' });
        if (exercise.extension.extensions.length > 0) {
            const gapMap: { [key: number]: number } = {}
            exercise.extension.extensions
                .forEach((e, i, es) => result = result.concat(_renderExtensionDiv(e, i, es, gapMap)));
        }
    }
    exercise.rendered = exercise.rendered.concat(result);
    return exercise;
}

function _isValid(exercise: Exercise) {
    return exercise && exercise.expression && exercise.extension;
}

const signToken = '- '
function _renderExtensionDiv(e: Extension, i: number, es: Extension[], gapMap: { [key: number]: number }): Rendered[] {
    const r: Rendered[] = [];
    let _g = ''

    const subtrah = e.operands[0].join('')
    const minuend = e.operands[1].join('')

    // we dont want first row subtrahend, this is already rendered
    if (i === 0) {
        r.push({ rendered: signToken + minuend, type: 'INTERMEDIATE' });
        gapMap[0] = 2
    }

    // handle subtrahend + minuend
    if (i > 0) {
        let ng = _calculateGap(e, i, es[i - 1].value, gapMap);
        gapMap[i] = ng
        const g: string = _fillSpace(ng)
        r.push({ rendered: _keepLastZero(g + subtrah, es[i - 1]), type: 'INTERMEDIATE' });
        r.push({ rendered: _exchangeSign(g + minuend), type: 'INTERMEDIATE' });
        // store for final result
        _g = g
    }

    // only use value for very last entry
    let differe = e.value.join('')
    if (Number.parseInt(differe) === 0) {
        differe = _fillSpace(differe.length - 1) + '0'
    }
    if (i === (es.length - 1)) {
        r.push({ rendered: _g + differe, type: "VALUE" });
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

export function _calculateGap(e: Extension, i: number, es: number[], gapMap: { [key: number]: number }): number {
    const subtrah = e.operands[0].join('')
    const prevValStr = es.join('')
    const previousVal = Number.parseInt(prevValStr)

    // start value for gap, move 1 column to the right
    let len = 0
    if (previousVal !== 0) {
        len = gapMap[i - 1] + (1 - Math.abs(subtrah.length - prevValStr.length))
    } else { // previousVal was "0"
        len = gapMap[i - 1] + prevValStr.length
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

// function _fillSpace(i: number): string {
//     let _space = ''
//     for (let _i = 0; _i < i; _i++) {
//         _space += ' '
//     }
//     return _space
// }

function _fillWith(t: string, i: number): string {
    let _space = ''
    for (let _i = 0; _i < i; _i++) {
        _space += t
    }
    return _space
}

const _fillSpace: (i: number) => string = _fillWith.bind(null, ' ')
const _fillLine: (i: number) => string = _fillWith.bind(null, '-')

/**
 * Rendering API Fraction Addition
 * @param exercise 
 */
export function renderExtensionFractionAdd(exercise: Exercise): Exercise {
    let result: Rendered[] = [];
    if (!_isValid(exercise)) {
        console.error('return invalid exercise ' + JSON.stringify(exercise) + ', no Fraction Renderings done!')
        return exercise
    }

    const _expr: Expression = exercise.expression
    const _exts: [number, number][] = <[number, number][]>exercise.extension.extensions[0].operands
    const _val = exercise.extension.extensions[0].value

    // prepare all 3 rendered rows
    let first = '', secon = '', third = ''

    // prepare tokens
    const t0 = { n: _expr.operands[0][0].toString(), d: _expr.operands[0][1].toString() }
    const t1 = { n: _expr.operands[1][0].toString(), d: _expr.operands[1][1].toString() }
    const t2 = { n: '(' + _exts[0][0] + '*' + _exts[0][1] + ')+(' + _exts[1][0] + '*' + _exts[1][1] + ')', d: _exts[2][0] + '*' + _exts[2][1] }
    // attention! beware of plain numbers!
    const _d4 = _exts[4] instanceof Array ? _exts[4][0].toString() : _exts[4]
    const t3 = { n: _exts[3][0] + '+' + _exts[3][1], d:  _d4}
    const t4 = _exts[5] ? { n: _exts[5][0].toString(), d: _exts[5][1].toString() } : undefined

    // prepare spaces
    const t0abs = Math.abs(t0.n.length-t0.d.length)
    let sn0 = t0.n.length === t0.d.length ? 0 : t0abs
    let lt0 = t0.n.length > t0.d.length ? t0.n.length : t0.d.length
    let sd0 = t0.n.length > t0.d.length ? t0abs : 0

    const t1abs = Math.abs(t1.n.length-t1.d.length)
    let sn1 = t1.n.length === t1.d.length ? 0 : 1
    let lt1 = t1.n.length > t1.d.length ? t1.n.length : t1.d.length
    let sd1 = t1.n.length > t1.d.length ? t1abs : 0

    // third term
    let sn2 = t2.n.length === t2.d.length ? 0 : 1
    let lt2 = t2.n.length > t2.d.length ? t2.n.length : t2.d.length
    let sd2 = 0
    if (t2.n.length !== t2.d.length) {
        sd2 = Math.ceil(t2.n.length / 2) - Math.ceil(t2.d.length / 2)
    }

    // fourth term
    let sn3 = t3.n.length === t3.d.length ? 0 : 1
    let lt3 = t3.n.length > t3.d.length ? t3.n.length : t3.d.length
    let sd3 = 0 
    if (t3.n.length !== t3.d.length) {
        sd3 = Math.floor(t3.n.length / 2) - Math.ceil(t3.d.length / 2)
    }
    // some special case with rather short strikes
    const sd3WasOdd: boolean = t3.n.length % 2 === 1
    const someExtraSpace = sd3WasOdd ? 1 : 0

    first = _fillSpace(sn0) + t0.n + ' ' + _fillSpace(sn1) + t1.n + ' ' + t2.n + ' ' + t3.n
    secon = _fillLine(lt0) + '+' + _fillLine(lt1) + '=' + _fillLine(lt2) + '=' + _fillLine(lt3)
    third = _fillSpace(sd0) + t0.d + ' ' + _fillSpace(sd1) + t1.d + ' ' + _fillSpace(sd2) + t2.d + _fillSpace(sd2) + ' ' +_fillSpace(sd3) + t3.d + _fillSpace(sd3+someExtraSpace) 
    
    // possible shortening term
    if (t4) {
        let sn4 = t4.n.length === t4.d.length ? 0 : 1
        let lt4 = t4.n.length > t4.d.length ? t4.n.length : t4.d.length
        let sd4 = t4.n.length === t4.d.length ? 0 : 1
        first = first + ' ' + t4.n
        secon = secon + '=' + _fillLine(lt4)
        third = third + ' ' + t4.d
    }

    let vn = _val[0].toString().length === _val[0].toString().length ? 0 : 1
    let vl = _val[0].toString().length > _val[1].toString().length ? _val[0].toString().length : _val[1].toString().length
    let vd = _val[1].toString().length === _val[1].toString().length ? 0 : 1
    first = first + ' ' + _val[0]
    secon = secon + '=' + _fillLine(vl)
    third = third + ' ' + _val[1]

    result.push({ rendered: first, type: 'FRACTION_NOMINATOR' });
    result.push({ rendered: secon, type: 'FRACTION_STRIKE' });
    result.push({ rendered: third, type: 'FRACTION_DENOMINATOR' });

    // sanitize
    if (!Array.isArray(exercise.rendered)) {
        exercise.rendered = []
    }
    exercise.rendered = exercise.rendered.concat(result);
    return exercise;
}
