import { Expression } from './exercises.math';

/**
 * Basic Binary Functions
 */
export function add(a: number, b: number): number { return a + b }
export function sub(a: number, b: number): number { return a - b }
export function mult(a: number, b: number): number { return a * b }

export interface OpEntry {
    label: string;
    func: (a: number, b: number) => number;
}
export const funcMap: { [key: string]: OpEntry } = {
    'add': { label: '+', func: add },
    'sub': { label: '-', func: sub },
    'mult': { label: '*', func: mult },
    'div': { label: ':', func: mult }
};

/**
 * Renderer Declaration
 */
export interface Renderer {
    toMaskedString?(expression: Expression): string;
}

/**
 * Default Render Implementation
 */
export class ExpressionRender implements Renderer {
    toMaskedString(expression: Expression) {
        let mask = '';
        if (typeof expression.value === 'number') {
            for (let i = 0; i < expression.value.toString().length; i++) {
                mask += '_';
            }

        // handle rendering of division with optional Rest part
        } else if(typeof expression.value === 'object' && expression.operations[0] === 'div') {
            if(expression.value.length !== undefined) {
                const q = expression.value[0];
                for (let i = 0; i < q.toString().length; i++) {
                    mask += '_';
                }
                if(expression.value.length == 2) {
                    const r = expression.value[1];
                    mask +=' R ';
                    for (let i = 0; i < r.toString().length; i++) {
                        mask += '_';
                    }
                }
            }
        }

        let ops = expression.operations.map(op => funcMap[op].label);
        let xpr = '';
        xpr += expression.operands[0];
        for (let o = 0, r = 1; o < ops.length; o++ , r++) {
            if (ops[o]) {
                xpr += ops[o];
            }
            if (expression.operands[r]) {
                xpr += expression.operands[r];
            }
        }
        return '' + xpr + ' ' + expression.eq + ' ' + mask;
    }
}
