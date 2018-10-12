import {
    generateExpression,
    generateDivisionWithRest,
} from './exercises.math.generator';
import {
    funcMap,
    Renderer,
    Rendered,
    renderDefault,
    renderExtensionsAdditionCarry,
    renderExtensionsSubtractionCarry,
    renderExtensionsMultiplication,
    renderExtensionsDivEven
} from './exercises.math.renderer';
import {
    Extensioneer,
    extendOneLine,
    extendAddCarry,
    extendSubCarry,
    extendMultCarry,
    extendDivEven,
    extendAddFraction
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
export type Z = N;
export type Q = [N, N];
export type Fraction = [number, number];
export type MixedNumeral = [number, Fraction];
export type Set = "Q" | "Z" | "N";
export type Operation = "add" | "sub" | "mult" | "div";

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
    exactMatchOf?: number;
    rangeN?: Range;
    rangeZ?: Range;
    rangeQ?: RangeQ;
    multipleOf?: number;
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
    'ADD_FRACTION': extendAddFraction
}

const rendererMap: { [key: string]: Renderer } = {
    'DIV_EVEN': renderExtensionsDivEven,
    'ADD_CARRY': renderExtensionsAdditionCarry,
    'SUB_CARRY': renderExtensionsSubtractionCarry,
    'MULT_MULT': renderExtensionsMultiplication,
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
                //const _props : Properties = {set : "N", level: option.level, operations: option.operations}; 
                const _props: Properties = option;
                const _q = option.quantity || 12;
                for (let i = 0; i < _q; i++) {
                    const functs: ((a: number, b: number) => number)[] = option.operations.map(operation => funcMap[operation].func);
                    if (functs.length > 0) {
                        let exp: Expression = generateExpression(functs, option.operands, option.result);
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
                        let multFunc: ((a: number, b: number) => number) = funcMap['mult'].func;
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
