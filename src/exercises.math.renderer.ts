import { BinaryExpression } from './exercises.math';

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
    toMaskedString?(expression: BinaryExpression): string;
}
/**
 * Default Render Implementation
 */
export class BinaryExpressionRender implements Renderer {
    toMaskedString(expression: BinaryExpression) {
        let mask = '';
        for (let i = 0; i < expression.value.toString().length; i++) {
            mask += '_';
        }
        // let fillY = (<Number>expression.term.y).n < 10 ? ' ' : '';
        // let fillR = (expression.value.n < 10) ? ' ' : '';
        let x = expression.x;
        let y = expression.y;
        let ops = funcMap[expression.operation].label;
        return '' + x + ' ' + ops + ' ' + y + ' ' + expression.eq + ' ' + mask;
    }
}