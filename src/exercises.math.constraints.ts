/**
 * 
 * Basic Constraints
 * 
 * @author m3ssman
 */

/**
 * Numeric Bounds
 */
export class NumBounds {
    constructor(public max: number, public min?: number) { }
}

/**
 * 
 * Unary and binary Constraints
 * 
 */
export class NumConstraint {
    appliesToIndex?: number;
    greaterThanIndex?: number;
    exactMatchOf?: number;
    range?: NumBounds;
    multipleOf?: number;
}
