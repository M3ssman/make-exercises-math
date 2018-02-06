// import { MathBaseOption } from './math.base-option';
import { NumConstraint } from './exercises.math';
import { Expression, ExerciseMath, ExerciseMathImpl } from './exercises.math';

/**
 * 
 * Generate Expression using provided Constraints with given Operations
 * 
 * @param operation 
 * @param operandsConstraints 
 */
export function generateExpression(
    operations: ((x: number, y: number) => number)[],
    operandsConstraints: NumConstraint[],
    resultConstraints: NumConstraint): Expression {

    let x = 0, y = 0, r = 0, operands = [], expression: Expression = {
        operands: [], operations: [], value: 0
    };
    let xConstr, yConstr;
    let nr_ok = false, r_ok = true, all_again = true;

    let n = 1;
    do {

        // get first two operand constraints, if any, to compute f(x,y)
        if (operandsConstraints !== undefined && operandsConstraints[0]) {
            xConstr = operandsConstraints[0];
        }
        x = _getNumber(xConstr);
        if (operandsConstraints !== undefined && operandsConstraints[1]) {
            yConstr = operandsConstraints[1];
        }
        y = _getNumber(yConstr);

        nr_ok = __holdXYoperandsConstraints(x, y, xConstr, yConstr);
        r = (operations[0])(x, y);

        // build expression
        expression.operands.push(x, y);
        expression.operations.push(operations[0].name);

        // with more than 1 operation do
        if (operations.length > 1) {
            for (let a = 2, o = 1; o < operations.length; o++ , a++) {
                if (operandsConstraints !== undefined && operandsConstraints[a]) {
                    yConstr = operandsConstraints[a];
                }
                y = _getNumber(yConstr);
                expression.operands.push(y);

                nr_ok = __holdXYoperandsConstraints(r, y, undefined, yConstr);
                r = (operations[o])(r, y);
                expression.operations.push(operations[o].name);
            }
        }
        // final result
        expression.value = r;

        // check result constraint
        const r_const: NumConstraint = resultConstraints;
        if (r_const) {
            r_ok = __holdResultConstraints(r, r_const)
        }
        // chek operandsConstraints
        if (nr_ok && r_ok) {
            all_again = false;
        } else {
            expression.operands = [];
            expression.operations = [];
            n++;
        }

    } while (all_again);
    // if (console) {
    //     console.log('needed ' + n + ' tries to calculate ' + JSON.stringify(expression));
    // }
    return expression;
}

function __holdXYoperandsConstraints(x: number, y: number, xConstr: NumConstraint, yConstr: NumConstraint): boolean {
    if (xConstr && xConstr.greaterThanIndex) {
        return x > y;
    } else if (yConstr && yConstr.greaterThanIndex) {
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

function _getNumber(constraint?: NumConstraint): number {
    let result = 0;

    // sanitize
    if (constraint === undefined) {
        return __generateNumber(100, 1);
    }

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

/**
 * 
 * Generator Function for Division with optional Rest
 * 
 * @param constraints 
 */
export function* generateDivisionWithRest(constraints?: NumConstraint[]): IterableIterator<Expression> {
    // generator loop
    while (true) {
        const constrDividend = constraints[0];
        const constrDivisor = constraints[1];
        const dividend = __generateNumber(constrDividend.range.max, constrDividend.range.min);
        const divisor = __generateNumber(constrDivisor.range.max, constrDivisor.range.min);
        const divModulo = dividend % divisor;
        const val = (dividend - divModulo) / divisor;
        const vals = [val];
        if (divModulo !== 0) {
            vals.push(divModulo);
        }

        // yield expression
        yield { operands: [dividend, divisor], operations: ['div'], value: vals };
    }
}