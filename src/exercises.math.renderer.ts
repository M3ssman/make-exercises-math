import { Number, BinaryExpression } from './exercises.math';

/**
 * Renderer Declaration
 */
export interface Renderer {
    toString(expression: BinaryExpression): string;
    toMaskedString?(expression: BinaryExpression): string;
}

/**
 * Default Render Implementation
 */
export class BinaryExpressionRender implements Renderer {
    toString(expression: BinaryExpression) {
        return '' + (<Number>expression.term.x).n + '' + expression.term.operation + ''
            + (<Number>expression.term.y).n + '' + expression.eq + '' + expression.value.n;
    }
    toMaskedString(expression: BinaryExpression) {
        let mask = '';
        for (let i = 0; i < expression.value.toString().length; i++) {
            mask += '_';
        }
        let fillY = (<Number>expression.term.y).n < 10 ? ' ' : '';
        let fillR = (expression.value.n < 10) ? ' ' : '';
        return '' + (<Number>expression.term.x).n + ' ' + expression.term.operation +
            ' ' + fillY + (<Number>expression.term.y).n + ' ' + expression.eq + ' ' + fillR + mask;
    }
}

/**
 * Shortcut Renderer for testing Purposes
 */
export class BinOpTripleRenderer implements Renderer {
    toString(expression: BinaryExpression) {
        return '(' + expression.term.x + ' ' + expression.term.operation + ' ' + expression.term.y + ') => ' + expression.value;
    }
}
