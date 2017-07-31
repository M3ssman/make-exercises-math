import { NumConstraint, NumBounds } from './exercises.math.constraints';
import * as types from './exercises.math.types';
import { ExerciseMath, ExerciseMathImpl } from './exercises.math.types';
import { generate } from './exercises.math.generator';

/**
 * Define a whole Set of Exercises with optional total Quantity
 * 
 * Defaults to a Set of Addition 12 Exercises
 *  
 */
export interface Options {
    exercises: Exercise[];
    total?: number;
}

/**
 * Defines a single Exercise of Addition, etc.
 */
export interface Exercise {
    quantity?: number;
    level?: number;
    operations: ["add" | "sub" | "mult" | "div"];
    operands?: NumConstraint[];
    resultMultipleOf?: number;
}

export interface Range {
    from: number;
    to: number;
    greaterThanIndex?: number;
}

interface ExerciseMakeFunc {
    (): types.ExerciseMath;
}

/**
 * Default Options
 */
const defaultOptions: Options = {
    exercises: [{
        quantity: 12,
        level: 1,
        operations: ["add"],
        operands: [
            { range: types.rangeN20, greaterThanIndex: 1 },
            { range: types.rangeN10 }
        ]
    }],
    total: 12
};

/**
 * 
 * @param options 
 */
export function makeSet(options?: Options): Promise<types.ExerciseMath[]> {
    return new Promise((resolve, reject) => {
        const exercises: ExerciseMath[] = [];

        // process Settings
        const optionsIn = options ? options : defaultOptions;
        console.log('found in : ' + optionsIn.total);

        while (optionsIn.total-- > 0) {
            for (let i = 0; i < optionsIn.exercises.length; i++) {
                let e: Exercise = optionsIn.exercises[i];
                // console.log("currently process " + i+ " with quantity " + e.quantity);
                const constraints: NumConstraint[] = _createConstraints(e);
                const func: (a: number, b: number) => number = types.funcMap[e.operations[0]];
                const em: ExerciseMath = generate(types.add, constraints);
                exercises.push(em);
            }
        }

        if (exercises === null || exercises.length === 0) {
            reject('Unable to create Exercises, because null or empty!' + exercises);
        } else {
            resolve(exercises);
        }
    });
}

function _createConstraints(e: Exercise): NumConstraint[] {
    let ncs: NumConstraint[] = [];

    const { quantity, level, operands } = e;
    const ops = e.operands;
    for (let i = 0; i < ops.length; i++) {
        let nc: NumConstraint = ops[i];
        nc.appliesToIndex = i;
        ncs.push(nc);
    }
    return ncs;
}

/**
 * 
 * Exercises Math 
 * 
 */
export function addN50N10(): types.ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: types.rangeN80N10 },
        { appliesToIndex: 1, range: types.rangeN10 }
    ];
    return generate(types.add, constraints);
}

export function addN50N25Nof10(): types.ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: types.rangeN50N10 },
        { appliesToIndex: 1, range: types.rangeN25N5 },
        { appliesToIndex: 2, multipleOf: 10 }
    ];
    return generate(types.add, constraints);
}

export function addN50N19(): types.ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: types.rangeN50N10 },
        { appliesToIndex: 1, range: types.rangeN20 }
    ];
    return generate(types.add, constraints);
}

export function subN99N10Nof10(): types.ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: types.rangeN99N10 },
        { appliesToIndex: 1, range: types.rangeN10 },
        { appliesToIndex: 2, multipleOf: 10 }
    ];
    return generate(types.sub, constraints);
}

export function subN50N10(): types.ExerciseMath {
    const subN50N10Nof1Constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: types.rangeN50N10 },
        { appliesToIndex: 1, range: types.rangeN10 }
    ]
    return generate(types.sub, subN50N10Nof1Constraints);
}

export function subN99N19(): types.ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: types.rangeN99N10 },
        { appliesToIndex: 1, range: types.rangeN20 }
    ];
    return generate(types.sub, constraints);
}

export function subN99N19Nof10(): types.ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: types.rangeN99N10 },
        { appliesToIndex: 1, range: types.rangeN20 },
        { appliesToIndex: 2, multipleOf: 10 }
    ];
    return generate(types.sub, constraints);
}

export function multN10N10(): types.ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, greaterThanIndex: 1, range: types.rangeN10 },
        { appliesToIndex: 1, range: types.rangeN10 }
    ];
    return generate(types.mult, constraints);
}

export function multN10Nof2(): types.ExerciseMath {
    return multN10ofX(2);
}

export function multN10Nof5(): types.ExerciseMath {
    return multN10ofX(5);
}

export function multN10Nof10(): types.ExerciseMath {
    return multN10ofX(10);
}

export function multN10ofX(x: number): types.ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, exactMatchOf: x },
        { appliesToIndex: 1, range: types.rangeN10 }
    ];
    return generate(types.mult, constraints);
}

function multN10ofXofY(x: number, y: number): types.ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, exactMatchOf: x },
        { appliesToIndex: 1, exactMatchOf: y }
    ];
    return generate(types.mult, constraints);
}

export function multR100(): types.ExerciseMath {
    const constraints: NumConstraint[] = [
        { appliesToIndex: 0, range: types.rangeN20 },
        { appliesToIndex: 1, range: types.rangeN20 },
        { appliesToIndex: 2, range: types.rangeN100 }
    ];
    return generate(types.mult, constraints);
}

export function divR100(x?: number, shuffle?: boolean): types.ExerciseMath {
    const ex: types.ExerciseMath = x ? multN10ofX(x) : multN10N10();
    let x1 = ex.expression.term.x;
    let x2 = ex.expression.term.y;
    if (shuffle) {
        const chance: number = Math.random();
        if (chance >= .5) {
            x1 = ex.expression.term.y;
            x2 = ex.expression.term.x;
        }
    }
    let expr1: types.BinaryExpression = { term: { x: x1, y: x2, operation: ':' }, value: ex.expression.value, eq: '=' };

    const expr2: types.BinaryExpression = new types.BinaryExpressionImpl(expr1);
    return new types.ExerciseMathImpl(expr2);
}

export function divN100(): types.ExerciseMath {
    const mult: types.ExerciseMath = multR100();
    const expr: types.BinaryExpression = {
        term: { x: mult.expression.value, y: mult.expression.term.y, operation: ':' },
        eq: '=',
        value: mult.expression.value,
    };
    return new types.ExerciseMathImpl(expr);
}


function createSetOfMult(): types.ExerciseMath[] {
    const exercises: types.ExerciseMath[] = [];
    return exercises;
}

export function setOfMult(): Promise<ExerciseMath[]> {
    return new Promise((resolve, reject) => {
        const exercises: ExerciseMath[] = [];
        if (exercises === null) {
            reject('Unable to create Exercises!');
        } else {
            resolve(exercises);
        }
    });
}

export function setOf(): Promise<ExerciseMath[]> {
    const exercises: ExerciseMath[] = [];
    return new Promise((resolve, reject) => {
        const exercises: ExerciseMath[] = [];
        if (exercises === null) {
            reject('Unable to create Exercises!');
        } else {
            resolve(exercises);
        }
    });
}

export function setOfMultN10(xs: number[]): ExerciseMath[] {
    let r = [];
    let ms = {};
    let ns = [];
    xs.forEach(x => {
        ms[x] = generateArrayValues(10);
    });
    const mks = Object.keys(ms);
    mks.map(x => {
        ms[x].map(y => r.push(multN10ofXofY(parseInt(x), y)));
    });
    return r;
}

export const type = types;

/**
 * 
 * Generate some Values with optinal step size
 * 
 * @param limit 
 * @param step 
 */
function generateArrayValues(limit: number, step?: number): number[] {
    let values = [];
    const it = generatorFnc(1);
    while (limit-- > 0) {
        values.push(it.next().value);
    }
    return values;
}

/**
 * 
 * Generator Function
 * 
 * @param count 
 * @param step 
 */
function* generatorFnc(count: number, step?: number): IterableIterator<number> {
    const s = step ? step : 1;
    while (true) {
        yield count;
        count = count + s;
    }
}
