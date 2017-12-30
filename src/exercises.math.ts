import { generateExpression, generateDivisionWithRest } from './exercises.math.generator';
import {
    funcMap, add, sub, mult,
    Renderer,
    SimpleExpressionResultRenderer,
    AdditionWithCarryResultRenderer
} from './exercises.math.renderer';

/**
 * Numeric Bounds
 */
export class NumBounds {
    constructor(public max: number, public min?: number) { }
}

/**
 * Basic Numerical Ranges
 */
export const rangeN5N1 = new NumBounds(5, 1)
export const rangeN10 = new NumBounds(10);
export const rangeN20 = new NumBounds(20);
export const rangeN25N5 = new NumBounds(25, 5);
export const rangeN50 = new NumBounds(50);
export const rangeN50N10 = new NumBounds(50, 10);
export const rangeN80N10 = new NumBounds(80, 10);
export const rangeN99N10 = new NumBounds(99, 10);
export const rangeN100 = new NumBounds(100);

/**
 * 
 * Numerical Constraints
 * 
 */
export class NumConstraint {
    greaterThanIndex?: number;
    exactMatchOf?: number;
    range?: NumBounds;
    multipleOf?: number;
    toString(): string {
        return JSON.stringify(this);
    }
}

/**
 * Defines a single Exercise of Addition, etc.
 */
export interface ExerciseType {
    operations: ["add" | "sub" | "mult" | "div"];
    quantity?: number;
    level?: number;
    operands?: NumConstraint[];
    result?: NumConstraint;
}

export interface Expression {
    operands: number[];
    operations: string[];
    eq: string;
    value: number | number[];
    toString(): string;
    toMaskedString?(): string;
}

/**
 * Exercise Math Declarations
 */
export interface ExerciseMath {
    rendered: string[];
    expression: Expression;
    get(): string[];
}
export class ExerciseMathImpl implements ExerciseMath {
    rendered: string[] = [];
    constructor(public expression: Expression, public renderer: Renderer) { }
    get() {
        if (this.rendered.length === 0) {
            if (this.renderer['toMaskedString'] !== undefined) {
                this.rendered.push(this.renderer.toMaskedString(this.expression));
            }
            if (this.renderer['toRenderedParts'] !== undefined) {
                this.rendered = this.rendered.concat(this.renderer.toRenderedParts(this.expression));
            }
        }
        return this.rendered;
    }
}

/**
 * 
 * Create Expression Level 1
 * 
 * @param exerciseTypes 
 */
export function makeSet(exerciseTypes?: ExerciseType[]): Promise<ExerciseMath[][]> {
    return new Promise((resolve, reject) => {
        const exercises: ExerciseMath[][] = [];
        const optionsIn = exerciseTypes ? exerciseTypes : [defaultAdd];
        let numberOfSets: number = optionsIn.length;

        for (let a = 0; a < numberOfSets; a++) {
            const exercise: ExerciseMath[] = [];
            let e: ExerciseType = optionsIn[a];

            for (let i = 0; i < e.quantity; i++) {

                // get constraints for operands and result
                const constraints: NumConstraint[] = e.operands;
                const resultConstraint: NumConstraint = e.result;
                const renderer: Renderer = determineRenderer(e.level);

                // get operations
                let functs: ((a: number, b: number) => number)[] = [];
                // all but div
                e.operations.filter(op => !(op === 'div')).map(op => functs.push(funcMap[op].func));
                let exp: Expression = generateExpression(functs, constraints, resultConstraint);
                const em: ExerciseMath = new ExerciseMathImpl(exp, renderer);
                exercise.push(em);
            }
            exercises.push(exercise);

            // handle divisionWithRest
            if (e.operations[0] === 'div') {
                const divExprs: Expression[] = genDivWithRest(e.operands);
                const renderer: Renderer = determineRenderer(e.level);
                for (let j = 0; j < divExprs.length; j++) {
                    exercise.push(new ExerciseMathImpl(divExprs[j], renderer));
                }
            }
        }
        if (exercises.length === 0) {
            reject('Unable to create Exercises: null or empty!');
        } else {
            resolve(exercises);
        }
    });
}

function determineRenderer(level: number): Renderer {
    if (level === 2) {
        return new AdditionWithCarryResultRenderer();
    }
    return new SimpleExpressionResultRenderer();
}

/**
 * Default ExerciseType
 */
export const defaultAdd: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['add'],
    operands: [
        { range: rangeN20, greaterThanIndex: 1 },
        { range: rangeN20 }
    ]
}

/**
 * More ExerciseTypes
 */
export const addN50N10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['add'],
    operands: [
        { range: rangeN80N10, greaterThanIndex: 1 },
        { range: rangeN10 }
    ]
};
export const addN50N25Nof10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['add'],
    operands: [
        { range: rangeN50N10, greaterThanIndex: 1 },
        { range: rangeN25N5 }
    ],
    result: { multipleOf: 10 }
};
export const addN50N19: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['add'],
    operands: [
        { greaterThanIndex: 1, range: rangeN50N10 },
        { range: rangeN20 }
    ]
};

export const subN99N10Nof10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, range: rangeN99N10 },
        { range: rangeN10 }
    ],
    result: { multipleOf: 10 }
};
export const subN50N10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, range: rangeN99N10 },
        { range: rangeN10 }
    ]
};
export const subN99N19: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, range: rangeN99N10 },
        { range: rangeN20 }
    ]
};
export const subN99N19Nof10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['sub'],
    operands: [
        { greaterThanIndex: 1, range: rangeN99N10 },
        { range: rangeN20 }
    ],
    result: { multipleOf: 10 }
};

export const multN10N10: ExerciseType = {
    quantity: 12,
    level: 1,
    operations: ['mult'],
    operands: [
        { greaterThanIndex: 1, range: rangeN10 },
        { range: rangeN10 }
    ]
};

export const add_add_: ExerciseType = {
    quantity: 12, level: 1,
    operations: ['add', 'add'],
    operands: [
        { range: rangeN100 },
        { range: rangeN50N10 },
        { range: rangeN25N5 }
    ]
};

export const addN50N25subN20: ExerciseType = {
    quantity: 12, level: 1,
    operations: ['add', 'sub'],
    operands: [
        { range: rangeN50N10 },
        { range: rangeN25N5 },
        { range: rangeN20 }
    ]
};

export const divN100WithRest: ExerciseType = {
    operations: ['div']
};

export const add_add_carry: ExerciseType = {
    quantity: 12,
    level: 2,
    operations: ['add', 'add'],
    operands: [
        { range: { min: 500, max: 9999 } },
        { range: { max: 1500 } },
        { range: { max: 100 } }
    ]
};

/**
 * 
 * @deprecated
 * 
 */
export function multN10Nof2(): ExerciseMath {
    return multN10ofX(2);
}

export function multN10Nof5(): ExerciseMath {
    return multN10ofX(5);
}

export function multN10Nof10(): ExerciseMath {
    return multN10ofX(10);
}

export function multN10ofX(x: number): ExerciseMath {
    const constraints: NumConstraint[] = [
        { exactMatchOf: x },
        { range: rangeN10 }
    ];
    const e: Expression = generateExpression([mult], constraints, null);
    return new ExerciseMathImpl(e, new SimpleExpressionResultRenderer());
}

export function multR100(): ExerciseMath {
    const constraints: NumConstraint[] = [
        { range: rangeN20 },
        { range: rangeN20 },
        { range: rangeN100 }
    ];
    const e: Expression = generateExpression([mult], constraints, null);
    return new ExerciseMathImpl(e, new SimpleExpressionResultRenderer());
}



/**
 * Generate Division Exercises with optional Rest
 */
function genDivWithRest(constraints?: NumConstraint[], count?: number): Expression[] {
    const constrs: NumConstraint[] = constraints || [{ range: { max: 100, min: 10 } }, { range: { max: 12, min: 2 } }];
    const divIterator = generateDivisionWithRest(constrs);
    const max = count || 12;
    const exprs = [];
    for (let i = 0; i < max; i++) {
        exprs.push(divIterator.next().value);
    }
    return exprs;
}
