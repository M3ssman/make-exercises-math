import {
    generateExpression,
    generateDivisionWithRest,
    generateRationalExpression,
} from './exercises.math.generator';
import {
    Renderer,
    Rendered,
    renderDefault,
    renderExtensionsAdditionCarry,
    renderExtensionsSubtractionCarry,
    renderExtensionsMultiplication,
    renderExtensionsDivEven,
    renderExtensionFractionAdd,
    renderExtensionFractionSub
} from './exercises.math.renderer';
import {
    Extensioneer,
    extendOneLine,
    extendAddCarry,
    extendSubCarry,
    extendMultCarry,
    extendDivEven,
    extendAddFraction,
    extendSubFraction,
    extendMultFraction,
    gcd
} from './exercises.math.extensions';
import {
    mask
} from './exercises.math.maskeer';

/**
 * 
 * Define Numerical Sets and Util n-Tuples
 * 
 */
export type N = number[];
export type Q = [N, N];
export type Fraction = [number, number];
export type Set = 'Q' | 'N';
export type Operation = 'add' | 'sub' | 'mult' | 'div' | 'addQ' | 'subQ';

/**
 * What kind of Extension to generate
 */
export type ExtensionType =
    'SINGLE_LINE'
    | 'ADD_CARRY'
    | 'SUB_CARRY'
    | 'MULT_SINGLE'
    | 'MULT_MULT'
    | 'DIV_EVEN'
    | 'ADD_FRACTION'
    | 'SUB_FRACTION'
    | 'MULT_FRACTION'
    | 'DIV_FRACTION'

export type MaskType =
    ''
    | 'ALL'
    | 'NON_ZERO'
    | 'MASK_CARRY'

export interface Range {
    max: number;
    min?: number;
}
export interface RangeQ {
    max: [number, number];
    min?: [number, number];
}

export interface Constraint {
    greaterThanIndex?: number;
    exactMatchOf?: number | [number, number];
    rangeN?: Range;
    rangeZ?: Range;
    rangeQ?: RangeQ;
    multipleOf?: number | [number, number];
}

export interface Options {
    set: Set;
    operations: Operation[];
    label?: string;
    extension?: ExtensionType;
    maskeer?: MaskType;
    quantity?: number;
    level?: number;
    operands?: Constraint[];
    result?: Constraint;
}

export interface Properties {
    set: Set;
    operations: Operation[];
    label?: string;
    extension?: ExtensionType;
    maskeer?: MaskType;
    level?: number;
}

export interface Expression {
    operands: number[] | Fraction[];
    operations: string[];
    value: number | number[] | Fraction;
}

export interface ExtensionExpression {
    type: ExtensionType
    extensions: Extension[]
}

export interface Extension {
    operands?: number[][] | Fraction[];
    carry?: number[];
    value: number[] | Fraction;
}

export interface Exercise {
    expression?: Expression;
    rendered?: Rendered[];
    extension?: ExtensionExpression;
}

export interface ExerciseSet {
    exercises: Exercise[];
    properties: Properties;
}

const extensioneerMap: { [key: string]: Extensioneer } = {
    'SINGLE_LINE': extendOneLine,
    'ADD_CARRY': extendAddCarry,
    'DIV_EVEN': extendDivEven,
    'SUB_CARRY': extendSubCarry,
    'MULT_MULT': extendMultCarry,
    'ADD_FRACTION': extendAddFraction,
    'SUB_FRACTION': extendSubFraction,
    'MULT_FRACTION': extendMultFraction
}

const rendererMap: { [key: string]: Renderer } = {
    'DIV_EVEN': renderExtensionsDivEven,
    'ADD_CARRY': renderExtensionsAdditionCarry,
    'SUB_CARRY': renderExtensionsSubtractionCarry,
    'MULT_MULT': renderExtensionsMultiplication,
    'ADD_FRACTION': renderExtensionFractionAdd,
    'SUB_FRACTION': renderExtensionFractionSub,
    'SINGLE_LINE': renderDefault
}

/**
 * SINGLE_LINE Options
 */
const SINGLE_LINEAdd: Options = {
    quantity: 12,
    level: 1,
    set: "N",
    operations: ['add'],
    operands: [
        { rangeN: { max: 20 }, greaterThanIndex: 1 },
        { rangeN: { max: 20 } }
    ]
}
/**
 * 
 * Main API Entry
 * 
 * @param options 
 */
export function makeSet(opts?: Options[]): Promise<ExerciseSet[]> {
    return new Promise((resolve, reject) => {
        const options = (opts && opts.length > 0) ? opts : [SINGLE_LINEAdd];
        const excWithoutDiv: ExerciseSet[] = options
            .filter(option => option.operations.indexOf("div") < 0)
            .map(option => {
                const _exercises: Exercise[] = [];
                const _props: Properties = option;
                const _q = option.quantity || 12;
                for (let i = 0; i < _q; i++) {
                    let _funcMap: any = funcMap
                    let _generatorFunc: any = generateExpression
                    if (option.set === 'Q') {
                        _funcMap = funcMapQ
                        _generatorFunc = generateRationalExpression
                    }
                    const functs = option.operations.map(operation => _funcMap[operation].func);
                    if (functs.length > 0) {
                        let exp: Expression = _generatorFunc(functs, option.operands, option.result);
                        _exercises.push({ expression: exp, rendered: [] });
                    }
                }
                return { exercises: _exercises, properties: _props };
            });

        const excDiv: ExerciseSet[] = options
            .filter(option => option.operations.indexOf("div") > -1)
            .map(option => {
                const _exercise: Exercise[] = [];
                const _props: Properties = { set: "N", level: option.level, operations: option.operations };
                const _q = option.quantity || 12;
                if (option.extension) {
                    _props.extension = option.extension;
                }
                for (let i = 0; i < _q; i++) {
                    if (option.extension === 'DIV_EVEN') {
                        const multFunc = funcMap['mult'].func;
                        let _exp: Expression = generateExpression([multFunc], option.operands, option.result);
                        const exp: Expression = { operations: ['div'], value: _exp.operands[0], operands: <number[]>[<number>_exp.value, _exp.operands[1]] };
                        _exercise.push({ expression: exp, rendered: [] });
                    } else {
                        const constrs: Constraint[] = [{ rangeN: { max: 100, min: 10 } }, { rangeN: { max: 12, min: 2 } }];
                        const divExprs: Expression = generateDivisionWithRest(constrs).next().value;
                        _exercise.push({ expression: divExprs, rendered: [] });
                    }
                }
                return { exercises: _exercise, properties: _props };
            });

        const _exercises: ExerciseSet[] = excWithoutDiv.concat(excDiv);
        if (_exercises.length === 0) {
            reject('Unable to create basic Exercises with ' + JSON.stringify(opts) + ' !');
        } else {
            const exercises = _exercises
                .map(exerciseSet => {
                    let extensionType: ExtensionType = exerciseSet.properties.extension
                    if (!extensionType) {
                        extensionType = 'SINGLE_LINE'
                    }
                    const extFunc = extensioneerMap[extensionType]
                    if (extFunc) {
                        exerciseSet.exercises.map(exercise => extFunc(exercise))
                    }
                    return exerciseSet;
                })
                .map(exerciseSet => {
                    let extensionType: ExtensionType = exerciseSet.properties.extension
                    if (!extensionType) {
                        extensionType = 'SINGLE_LINE'
                    }
                    const rendFunc = rendererMap[extensionType]
                    if (rendFunc) {
                        exerciseSet.exercises = exerciseSet.exercises
                            .map(exercise => rendFunc(exercise));
                    }
                    return exerciseSet;
                })
                .map(exerciseSet => {
                    let maskType: MaskType = exerciseSet.properties.maskeer
                    if (!maskType) {
                        maskType = 'ALL'
                    }
                    exerciseSet.properties.maskeer = maskType
                    exerciseSet.exercises = exerciseSet.exercises.map(e => mask(e, maskType))
                    return exerciseSet
                });
            resolve(exercises);
        }
    });
}


/**
 * Basic Binary Operations
 */
export function add(a: number, b: number): number { return a + b }
export function sub(a: number, b: number): number { return a - b }
export function mult(a: number, b: number): number { return a * b }

export interface OpEntry {
    label: string;
    func: (a: number, b: number) => number;
}

export interface OpEntryQ {
    label: string;
    func: (a: Fraction, b: Fraction) => Fraction;
}

export const funcMap: { [key: string]: OpEntry } = {
    'add': { label: '+', func: add },
    'sub': { label: '-', func: sub },
    'mult': { label: '*', func: mult },
    'div': { label: ':', func: mult },
};


/**
 * 
 * Rational / Fraction Binary Operations
 * 
 */
export const addFraction: (a: Fraction, b: Fraction) => Fraction = _opFraction.bind(null, '+')

export const subFraction: (a: Fraction, b: Fraction) => Fraction = _opFraction.bind(null, '-')

export const multFraction: (a: Fraction, b: Fraction) => Fraction = _opFraction.bind(null, '*')

export const divFraction: (a: Fraction, b: Fraction) => Fraction = _opFraction.bind(null, ':')

export const funcMapQ: { [key: string]: OpEntryQ } = {
    'addQ': { label: '+', func: addFraction },
    'subQ': { label: '-', func: subFraction },
    'multQ': { label: '*', func: multFraction },
    'divQ': { label: ':', func: divFraction }
}

function _opFraction(sign: string, a: Fraction, b: Fraction): Fraction {
    if (sign === '*') {
        const r: [number, number] = [a[0] * b[0], a[1] * b[1]]
        return rationalize(r)
    } else if (sign === ':'){
        const r: [number, number] = [a[0] * b[1], a[1] * b[0]]
        return rationalize(r)
    } else {
        const _d1: number = a[0] * b[1]
        const _d2: number = b[0] * a[1]
        const _d: number = _op(_d1, _d2, sign)
        const _n = a[1] * b[1]
        const _r: [number, number] = [_d, _n]
        return rationalize(_r)
    }
}

function _op(d1: number, d2: number, s: string): number {
    if (s === '+') {
        return d1 + d2
    } else if (s === '-') {
        return d1 - d2
    } else {
        console.error('[ERROR] unknown operation sign "' + s + '" encountered, return "0"!')
        return 0
    }
}

export function rationalize(f: Fraction): Fraction {
    const [a, b] = f;
    const _gcd = gcd(a, b);
    if (_gcd > 1) {
        return [a / _gcd, b / _gcd];
    }
    return f;
}
