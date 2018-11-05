import {
    Constraint,
    Expression,
    Range,
    Fraction,
    rationalize
} from './exercises.math';

/**
 * 
 * Generate Expression using provided Constraints with given Operations
 * 
 * @param operation 
 * @param operandsConstraints 
 */
const MAX_TRIES = 999
export function generateExpression(
    operations: ((x: number, y: number) => number)[],
    operandsConstraints: Constraint[],
    resultConstraints: Constraint): Expression {

    let x;
    let y;
    let r;
    let _n: number = 0
    let expression: Expression = {
        operands: [], operations: [], value: 0
    };
    let xConstr: Constraint, yConstr: Constraint;
    let nr_ok = false, r_ok = true, loop_again = true;

    do {
        // get first two operand constraints, if any, to compute f(x,y)
        if (operandsConstraints !== undefined && operandsConstraints[0]) {
            xConstr = operandsConstraints[0];
        } else {
            xConstr = { rangeN: { max: 100 } }
        }
        x = _getNumber(xConstr);
        if (operandsConstraints !== undefined && operandsConstraints[1]) {
            yConstr = operandsConstraints[1];
        } else {
            yConstr = { rangeN: { max: 50 } }
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
                } else {
                    yConstr = { rangeN: { max: 50 } }
                }
                y = _getNumber(yConstr);
                (<number[]>expression.operands).push(y);

                nr_ok = __holdXYoperandsConstraints(r, y, xConstr, yConstr);
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
            loop_again = false;
        } else {
            expression.operands = [];
            expression.operations = [];
        }

        // safety break to prevent never ending loop
        if (_n >= MAX_TRIES) {
            loop_again = false
        }

        _n++
    } while (loop_again);
    //console.debug('### NEEDED TRIES ' + _n)
    return expression;
}

export function generateRationalExpression(
    operations: ((x: Fraction, y: Fraction) => Fraction)[],
    operandsConstraints: Constraint[],
    resultConstraints: Constraint): Expression {

    let x: Fraction;
    let y: Fraction;
    let r: Fraction;
    let _n: number = 0
    let expression: Expression = {
        operands: [], operations: [], value: 0
    };
    let xConstr: Constraint, yConstr: Constraint;
    let nr_ok = false, r_ok = true, loop_again = true;

    do {
        // increase numbers of tries
        _n++

        // get first two operand constraints, if any, to compute f(x,y)
        if (operandsConstraints !== undefined && operandsConstraints[0]) {
            xConstr = operandsConstraints[0];
        }
        x = <Fraction>_getNumber(xConstr);
        if (x === undefined) {
            console.error('[ERROR] no Fraction x_0 generated within 10 tries!')
            throw new Error('No Fraction x_0 generated within 10 tries!')
        }
        if (operandsConstraints !== undefined && operandsConstraints[1]) {
            yConstr = operandsConstraints[1];
        }

        y = <Fraction>_getNumber(yConstr);
        if (y === undefined) {
            console.error('[ERROR] no Fraction y_0 generated within 10 tries!')
            throw new Error('No Fraction y_0 generated within 10 tries!')
        }

        nr_ok = __holdXYoperandsConstraints(x, y, xConstr, yConstr);
        r = rationalize((operations[0])(x, y));

        // build expression
        (<Fraction[]>expression.operands).push(x, y);
        expression.operations.push(operations[0].name);

        // with more than 1 operation do
        if (operations.length > 1) {
            for (let a = 2, o = 1; o < operations.length; o++ , a++) {
                if (operandsConstraints !== undefined && operandsConstraints[a]) {
                    yConstr = operandsConstraints[a];
                }
                y = <Fraction>_getNumber(yConstr);
                if (y === undefined) {
                    console.error('[ERROR] no further Fraction y_' + a + ' generated within 10 tries!')
                    throw new Error('No further Fraction y_' + a + ' generated within 10 tries!')
                }
                (<Fraction[]>expression.operands).push(y);

                nr_ok = __holdXYoperandsConstraints(r, y, xConstr, yConstr);
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
            loop_again = false;
        } else {
            expression.operands = [];
            expression.operations = [];
        }

        // safety break to prevent never ending loop
        if (_n >= MAX_TRIES) {
            loop_again = false
            console.error('[ERROR] no valid Expression generated for operands ' + JSON.stringify(operandsConstraints) + ' and result ' + JSON.stringify(resultConstraints) + ' within ' + MAX_TRIES + ' tries')
            throw new Error('No valid Expression generated for operands ' + JSON.stringify(operandsConstraints) + ' and result ' + JSON.stringify(resultConstraints) + ' within ' + MAX_TRIES + ' tries')
        }
    } while (loop_again);
    if (expression.operands) {
        const _tmp: [number, number][] = <[number, number][]>expression.operands
        expression.operands = _tmp.map((op: [number, number]) => rationalize(op))
    }
    return expression;
}

function __holdXYoperandsConstraints(x: number | Fraction, y: number | Fraction, xConstr: Constraint, yConstr: Constraint): boolean {
    if (xConstr.rangeN) {
        if (xConstr && xConstr.greaterThanIndex) {
            return x > y;
        } else if (yConstr && yConstr.greaterThanIndex) {
            return y > x;
        }
    } else if (xConstr.rangeQ) {
        if (xConstr && xConstr.greaterThanIndex) {
            return isGreater(<Fraction>x, <Fraction>y)
        } else if (yConstr && yConstr.greaterThanIndex) {
            return isGreater(<Fraction>y, <Fraction>x)
        }
    }
    return true;
}

export function isGreater(a: Fraction, b: Fraction): boolean {
    if (a[1] === b[1]) {
        return a[0] > b[0]
    } else if (a[1] !== 0 && b[1] !== 0) {
        return a[0] * b[1] > b[0] * a[1]
    }
    return false
}

function __holdResultConstraints(r: number | Fraction, constraint: Constraint): boolean {
    if (constraint.multipleOf) {
        if (constraint.multipleOf instanceof Object) {
            // TODO
            return false
        } else {
            return (<number>r % <number>constraint.multipleOf) === 0;
        }
    }
    if (constraint.rangeN) {
        const cr: Range = constraint.rangeN;
        if (cr.min) {
            return r >= cr.min && r <= cr.max;
        }
        return r <= cr.max;
    } else if (constraint.rangeQ) {
        // TODO
        return false
    }
    return true;
}

function _getNumber(constraint?: Constraint): number | Fraction {
    let result;
    let _n = 0
    // sanitize
    if (constraint === undefined) {
        return __generateN(100, 1).next().value;
    }

    if (constraint.exactMatchOf) {
        return constraint.exactMatchOf;
    }

    if (constraint.rangeN) {
        do {
            result = __generateN(constraint.rangeN.max, constraint.rangeN.min).next().value;
            _n++
            if (_n >= MAX_TRIES) {
                console.error('[Error] Unable to generate Number within ' + _n + ' tries that fits ' + JSON.stringify(constraint))
                throw new Error('Unable to generate Number within ' + _n + ' tries that fits ' + JSON.stringify(constraint))
            }
        } while (!__checkSingleConstraint(result, constraint));
    } else if (constraint.rangeQ) {
        do {
            result = __generateQ(constraint.rangeQ.max, constraint.rangeQ.min).next().value;
            if (result === undefined) {
                console.error('[Error] Unable to generate valid Fraction that fits ' + JSON.stringify(constraint))
                throw new Error('Unable to generate valid Fraction that fits ' + JSON.stringify(constraint))
            }
            _n++
            if (_n >= MAX_TRIES) {
                console.error('[Error] Unable to generate Fraction within ' + _n + ' tries that fits ' + JSON.stringify(constraint))
                throw new Error('Unable to generate Fraction within ' + _n + ' tries that fits ' + JSON.stringify(constraint))
            }
        } while (!__checkSingleConstraint(result, constraint))
    }  
    return result;
}

function __checkSingleConstraint(n: number | [number, number], constraint: Constraint): boolean {
    if (constraint.rangeN) {
        if (constraint.multipleOf) {
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

function* __generateQ(to: [number, number], from?: [number, number]): IterableIterator<[number, number]> {
    if (from) {
        if (to[1] === 0 || from[1] === 0 || to[0] === 0 || from[0] === 0) {
            console.error('[ERROR] invalid Fractions detected ' + to + ', ' + from)
            yield undefined
        } else if (to[1] === from[1]) { // denominators match
            let n = _gen(from[0], to[0])
            let d = to[1]
            yield [n, d];
        } else { // denominators do not match
            const _d = from[1] * to[1]
            const _to = [to[0] * from[1], _d]
            const _from = [from[0] * to[1], _d]
            const n = _gen(_from[0], _to[0])
            yield rationalize([n, _d])
        }
    } else { // only upper bound
        let n1 = Math.ceil(Math.random() * to[0])
        let d1 = Math.ceil(Math.random() * to[1])
        if (n1 === 0) {
            n1 = 1
        }
        if (d1 === 0) {
            d1 = 1
        }
        yield [n1, d1];
    }
}

/**
 * 
 * Use ceil since we dont want n === 0
 * Add +1 to difference to include upper bound 
 * 
 * @param from 
 * @param to
 */
export function _gen(from: number, to: number): number {
    const n = Math.ceil(Math.random() * (to + 1 - from))
    // ensure bounds
    if (n < from) {
        return from
    } else if (n > to) {
        return to
    }
    return n
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
