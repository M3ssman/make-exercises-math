// import { MathBaseOption } from './math.base-option';
import { NumConstraint } from './exercises.math';
import { Term, Number, BinaryExpression, BinaryExpressionImpl, ExerciseMath, ExerciseMathImpl } from './exercises.math';
import {BinaryExpressionRender} from './exercises.math.renderer';


export function generate(operation: (x: number, y: number) => number, constraints: NumConstraint[]): ExerciseMath {
    const exp = _generateExpression(operation, constraints);
    const em = new ExerciseMathImpl(exp);
    return em;
}

function _generateExpression(operation: (x: number, y: number) => number,
    constraints: NumConstraint[]): BinaryExpression {

    let x = 0, y = 0, r = 0;
    let nr_ok = false, r_ok = true, all_again = true;

    do {
        x = _getNumber(constraints.filter(c => c.appliesToIndex === 0)[0]);
        y = _getNumber(constraints.filter(c => c.appliesToIndex === 1)[0]);
        nr_ok = __holdXYConstraints(x, y, constraints);
        r = operation(x, y);
        const r_const = constraints.filter(c => c.appliesToIndex === 2)[0];
        if (r_const) {
            r_ok = __holdResultConstraints(r, r_const)
        }

        if (nr_ok && r_ok) {
            all_again = false;
        }
    } while (all_again);

    let nX: Number = { n: x };
    let nY: Number = { n: y };
    let nV: Number = { n: r };
    let t: Term = { x: nX, y: nY, operation: operation.name };
    let be: BinaryExpression = { term: t, value: nV, eq: '=' };

    return new BinaryExpressionImpl(be, new BinaryExpressionRender());
}

function __holdXYConstraints(x: number, y: number, constraints: NumConstraint[]): boolean {
    const xConstr = constraints.filter(c => c.appliesToIndex === 0)[0];
    const yConstr = constraints.filter(c => c.appliesToIndex === 1)[0];
    if (xConstr.greaterThanIndex) {
        return x > y;
    } else if (yConstr.greaterThanIndex) {
        return y > x;
    }
    return true;
}

function __holdResultConstraints(r: number, constraint: NumConstraint): boolean {
    if (constraint.multipleOf) {
        return (r % constraint.multipleOf) === 0;
    } else if (constraint.range) {
        const cr = constraint.range;
        if (cr.min) {
            return r >= cr.min && r <= cr.max;
        }
        return r <= cr.max;
    }
    return true;
}

function _getNumber(constraint: NumConstraint): number {
    let result = 0;

    if (constraint.range) {
        const range = constraint.range;
        do {
            result = __generateNumber(range.max, range.min);
        } while (!__checkSingleConstraint(result, constraint));
    } else if (constraint.exactMatchOf) {
        return constraint.exactMatchOf;
    }

    return result;
}

function __checkSingleConstraint(n: number, constraint: NumConstraint): boolean {
    if (constraint.multipleOf) {
        return (n % constraint.multipleOf) === 0;
    }
    return true;
}

function __generateNumber(to: number, from?: number): number {
    if (from) {
        return to - Math.ceil(Math.random() * (to - from));
    }
    return Math.ceil(Math.random() * to);
}
