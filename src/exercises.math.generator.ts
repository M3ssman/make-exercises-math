import {
    Constraint,
    Expression,
    Range,
    Q
} from './exercises.math';

/**
 * 
 * Generate Expression using provided Constraints with given Operations
 * 
 * @param operation 
 * @param operandsConstraints 
 */
export function generateExpression(
    operations: ((x: number, y: number) => number)[],
    operandsConstraints: Constraint[],
    resultConstraints: Constraint): Expression {

    let x;
    let y;
    let r;
    let expression: Expression = {
        operands: [], operations: [], value: 0
    };
    let xConstr, yConstr;
    let nr_ok = false, r_ok = true, not_finished = true;

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
        (<number[]>expression.operands).push(x, y);
        expression.operations.push(operations[0].name);

        // with more than 1 operation do
        if (operations.length > 1) {
            for (let a = 2, o = 1; o < operations.length; o++ , a++) {
                if (operandsConstraints !== undefined && operandsConstraints[a]) {
                    yConstr = operandsConstraints[a];
                }
                y = _getNumber(yConstr);
                (<number[]>expression.operands).push(y);

                nr_ok = __holdXYoperandsConstraints(r, y, undefined, yConstr);
                r = (operations[o])(r, y);
                expression.operations.push(operations[o].name);
            }
        }
        // final result
        expression.value = r;

        // check result constraint
        const r_const: Constraint = resultConstraints;
        if (r_const) {
            r_ok = __holdResultConstraints(r, r_const)
        }
        // check operandConstraints
        if (nr_ok && r_ok) {
            not_finished = false;
        } else {
            expression.operands = [];
            expression.operations = [];
        }

    } while (not_finished);
    return expression;
}

export function generateRationalExpression(
    operations: ((x: Q, y: Q) => Q)[],
    operandsConstraints: Constraint[],
    resultConstraints: Constraint): Expression {

    let x;
    let y;
    let r;
    let expression: Expression = {
        operands: [], operations: [], value: 0
    };
    let xConstr, yConstr;
    let nr_ok = false, r_ok = true, not_finished = true;

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
        (<number[]>expression.operands).push(x, y);
        expression.operations.push(operations[0].name);

        // with more than 1 operation do
        if (operations.length > 1) {
            for (let a = 2, o = 1; o < operations.length; o++ , a++) {
                if (operandsConstraints !== undefined && operandsConstraints[a]) {
                    yConstr = operandsConstraints[a];
                }
                y = _getNumber(yConstr);
                (<number[]>expression.operands).push(y);

                nr_ok = __holdXYoperandsConstraints(r, y, undefined, yConstr);
                r = (operations[o])(r, y);
                expression.operations.push(operations[o].name);
            }
        }
        // final result
        expression.value = r;

        // check result constraint
        const r_const: Constraint = resultConstraints;
        if (r_const && !Object.keys(r_const).length) {
            r_ok = __holdResultConstraints(r, r_const)
        }
        // check operandConstraints
        if (nr_ok && r_ok) {
            not_finished = false;
        } else {
            expression.operands = [];
            expression.operations = [];
        }

    } while (not_finished);
    return expression;
}

function __holdXYoperandsConstraints(x: number, y: number, xConstr: Constraint, yConstr: Constraint): boolean {
    if (xConstr && xConstr.greaterThanIndex) {
        return x > y;
    } else if (yConstr && yConstr.greaterThanIndex) {
        return y > x;
    }
    return true;
}

function __holdResultConstraints(r: number, constraint: Constraint): boolean {
    if (constraint.multipleOf) {
        return (r % <number>constraint.multipleOf) === 0;
    } else if (constraint.rangeN) {
        const cr: Range = constraint.rangeN;
        if (cr.min) {
            return r >= cr.min && r <= cr.max;
        }
        return r <= cr.max;
    }
    return true;
}

function _getNumber(constraint?: Constraint): number | [number, number] {
    let result;

    // sanitize
    if (constraint === undefined) {
        return __generateN(100, 1).next().value;
    }

    if (constraint.rangeN) {
        do {
            result = __generateN(constraint.rangeN.max, constraint.rangeN.min).next().value;
        } while (!__checkSingleConstraint(result, constraint));
    } else if (constraint.rangeQ) {
        do {
            result = __generateQ(constraint.rangeQ.max, constraint.rangeQ.min).next().value;
        } while (!__checkSingleConstraint(result, constraint));
    } else if (constraint.exactMatchOf) {
        return constraint.exactMatchOf;
    }
    return result;
}

function __checkSingleConstraint(n: number | [number, number], constraint: Constraint): boolean {
    if (constraint.multipleOf) {
        if (constraint.rangeN) {
            return (<number>n % <number>constraint.multipleOf) === 0;
        }
    }
    return true;
}

function* __generateN(to: number, from?: number): IterableIterator<number> {
    if (from) {
        yield to - Math.ceil(Math.random() * (to - from));
    }
    yield Math.ceil(Math.random() * to);
}

function* __generateQ(to: [number, number], from: [number, number]): IterableIterator<[number, number]> {
    if (from) {
        yield [Math.ceil(Math.random() * (to[0] - from[0])), Math.ceil(Math.random() * (to[1] - from[1]))];
    }
    yield [Math.ceil(Math.random() * to[0]), Math.ceil(Math.random() * to[1])];
}

/**
 * 
 * Generator Function for Division with optional Rest
 * 
 * @param constraints 
 */
export function* generateDivisionWithRest(constraints?: Constraint[]): IterableIterator<Expression> {
    // generator loop
    while (true) {
        const c1 = constraints[0];
        const c2 = constraints[1];
        const dividend = __generateN(c1.rangeN.max, c1.rangeN.min).next().value;
        const divisor = __generateN(c2.rangeN.max, c2.rangeN.min).next().value;
        const divModulo = <number>dividend % <number>divisor;
        const val = (<number>dividend - divModulo) / <number>divisor;
        const vals = [val];
        if (divModulo !== 0) {
            vals.push(divModulo);
        }

        // yield expression
        yield { operands: [<number>dividend, <number>divisor], operations: ['div'], value: <number[]>vals };
    }
}
