import * as moment from 'moment';
import * as PDFDocument from 'pdfkit';
import {
    ExerciseSet,
    Exercise,
    Options,
    SINGLE_LINEAdd
} from './exercises.math'
import * as extype from './exercises.math.options'
import {
    Rendered,
    RenderedType
} from './exercises.math.renderer'
import { type } from 'os';
import { create } from 'domain';
import { appendFileSync } from 'fs';

/**
 * 
 * Serializer API
 * 
 */
export interface SerializerOptions {
}
export interface PageOptions extends SerializerOptions {
    pageLabel?: string
    pageLocale?: string
    pageDatum?: string
    pageDimension?: number[]
    pageFont?: FontOptions
}
export interface FontOptions {
    src: string
    family: string
    size: number
}

/*
* PDF Defaults
*/
export const default_pdfkit_fontsrc = 'Courier-Bold'
export const default_fontfamily = 'Courier'
export const default_fontsize = 16
export const default_pageDim = [600, 840]

export function preparePageOptions(pageOptions?: PageOptions): PageOptions {
    let theSienna = 'Mathematik :: Sienna Metzner, 4c'
    let fontSrc = default_pdfkit_fontsrc
    let fontFam = default_fontfamily
    let fontSize = default_fontsize
    let pageDim = default_pageDim
    if (pageOptions) {
        if (pageOptions.pageLabel) {
            theSienna = pageOptions.pageLabel
        }
    }
    const fontOpts: FontOptions = { src: fontSrc, family: fontFam, size: fontSize }
    moment.locale('de');
    const datum = moment(new Date()).format('LL');
    return { pageDatum: datum, pageLabel: theSienna, pageDimension: pageDim, pageFont: fontOpts }
}

export function extractExerciseTypes(types: string): Options[] {
    if (types) {
        const typesArray = types.split(',')
        return typesArray
            .filter(type => extype[type] !== undefined)
            .map(t => extype[t]);
    } else {
        console.warn('[WARN] no Exercises identified for "' + types + '" => return [defaultAdd]')
        return [SINGLE_LINEAdd];
    }
}

const CHAR_WIDTH = 10
const ADDITIONAL_WHITESPACES_BETWEEN = 4
export function asPDF<T extends NodeJS.WritableStream>(sets: ExerciseSet[], pageOptions: PageOptions, targetStream: T) {
    // prepare pageOptions
    const pos = preparePageOptions(pageOptions)

    // prepare pdf doc
    let doc = new PDFDocument({ 'size': pos.pageDimension });
    doc.font(pos.pageFont.src, pos.pageFont.family, pos.pageFont.size);
    doc.text(pos.pageLabel)
    doc.text('(1) ' + pos.pageDatum);

    // prepare width, indents, nr of exercises
    let y = 150
    let x = 40
    let CURRENT_MAX_CHARS = 120
    let a = 1

    // collect instructions: what and where to process
    const instrs: Instruction[] = []
    sets.forEach((set: ExerciseSet) => {
        // exercise set header
        instrs.push(makeInstruction('textAt', a + ' ) ', x, y))
        x += 40;

        // now process exercises ... 
        set.exercises.forEach((exc: Exercise) => {
            const rendered: Rendered[] = exc.rendered
            CURRENT_MAX_CHARS = rendered.map(r => r.rendered.length).reduce((p, c) => c > p ? c : p, 0)
            console.log('### FOUND max width "' + CURRENT_MAX_CHARS + '" for ' + set.properties.label)
            if (typeof rendered === 'object') {
                if (rendered.length === 1) {
                    instrs.push(makeInstruction('textAt', rendered[0].rendered, x, y))
                    y += 40;
                    // having at least an additional carry row ...
                } else if (rendered.length > 1) {
                    y = handleRendered(rendered, instrs, x, y)
                    // guess some vertical space between each exercise
                    y += 15;
                }
            }
        });
        a++;
        // some horizontal space two preceeding exercise sets
        x += (CURRENT_MAX_CHARS + ADDITIONAL_WHITESPACES_BETWEEN) * CHAR_WIDTH
        y = 150;
    });
    // now apply all collected instructions
    applyInstructions(doc, instrs)

    doc.pipe(targetStream);
    doc.end();
}

function handleRendered(rendered: Rendered[], instr: Instruction[], x: number, y: number): number {
    for (let k = 0; k < rendered.length; k++) {
        let row: Rendered = rendered[k];
        let _type: RenderedType = row.type
        if (!row) {
            console.log('[ERROR] entry ' + k + ': encountered row of type "undefined" from rendered ' + JSON.stringify(rendered) + '!')
            continue;
        }
        // check row for masked marks of former digits
        if (row.rendered.indexOf('?') > -1) {
            let _x = x;
            for (let l = 0; l < row.rendered.length; l++) {
                // replace underscore mark by rectangle
                if (row.rendered[l] === '?') {
                    instr.push(makeInstruction('rectangleAtTo', _x, y, 8, 12, 1))
                }
                else {
                    instr.push(makeInstruction('textAt', row.rendered[l], _x, y))
                }
                _x += 10;
            }
            _x = 0;
        } else if (_type !== 'FRACTION_STRIKE') {
            // no marks, just render line as it is
            instr.push(makeInstruction('textAt', row.rendered, x, y))
        }
        // strike line before result entry
        if (_type.startsWith('FRACTION')) {
            if (_type === 'FRACTION_STRIKE') {
                const verticalSpace = 5
                let _x = x
                let x1 = x
                let x2 = x
                let metSign = false
                for (let l = 0; l < row.rendered.length; l++) {
                    const _char = row.rendered[l]
                    x2 += 10
                    if (_isSign(_char)) {
                        instr.push(makeInstruction('textAt', _char, _x, y))
                        metSign = true
                    } else {
                        // lately came accross sign?
                        if (metSign) {
                            x2 = _x - 10
                            instr.push(makeInstruction('lineAtTo', x1 + 1, y + verticalSpace, x2 - 1, y + verticalSpace, 2, 'red'))
                            x1 = _x
                            metSign = false
                        }
                    }
                    _x += 10
                }
                // final stroke
                instr.push(makeInstruction('lineAtTo', x1, y + verticalSpace, _x, y + verticalSpace, 2))
            }
        } else { // no Fractions, but add_carry, sub, mult or div_even
            if (k === rendered.length - 2) {
                const w = rendered[k].rendered.length * 10;
                instr.push(makeInstruction('lineAtTo', x, y + 14, x + w, y + 14, 2))
                y += 5;
            }
            // srike twice below every result row
            if (k === rendered.length - 1) {
                const w = rendered[k].rendered.length * 10;
                instr.push(makeInstruction('lineAtTo', x, y + 14, x + w, y + 14, 1))
                instr.push(makeInstruction('lineAtTo', x, y + 16, x + w, y + 16, 1))
                y += 5;
            }
        }
        // next row
        y += 15;
    }
    return y
}

function _isSign(s: string): boolean {
    return s === '+' || s === '-' || s === '=' || s === '*' || s === ':'
}

/**
 * 
 * Instruction API
 * 
 */
export type InstructionType = 'textAt' | 'lineAtTo' | 'rectangleAtTo' | 'unknown'

export interface Instruction {
    type: InstructionType
    text?: string
    x_1?: number
    y_1?: number
    x_2?: number
    y_2?: number
    w?: number
    h?: number
    lineWidth?: number
    color?: string
    args?: string
}

export const makeInstruction: (t: InstructionType, ...args: any[]) => Instruction =
    function (t: InstructionType, ...args: any[]): Instruction {
        if (t && args && args.length >= 1) {
            const _line0 = args[4] || 2
            const _color0 = args[5] || 'black'
            switch (t) {
                case 'textAt':
                    const _color = args[3] || 'black'
                    if (args[1] && args[2]) {
                        return { type: 'textAt', text: args[0], x_1: args[1], y_1: args[2], color: _color }
                    } else if (args.length === 1) {
                        return { type: 'textAt', text: args[0] }
                    }
                case 'lineAtTo':
                    return { type: 'lineAtTo', x_1: args[0], y_1: args[1], x_2: args[2], y_2: args[3], lineWidth: _line0, color: _color0 }
                case 'rectangleAtTo':
                    return { type: 'rectangleAtTo', x_1: args[0], y_1: args[1], x_2: args[2], y_2: args[3], lineWidth: _line0, color: _color0 }
            }
        }
        return { type: 'unknown', args: JSON.stringify(args) }
    }

export const applyInstructions: (doc: PDFKit.PDFDocument, instructions: Instruction[]) => void =
    function (doc: PDFKit.PDFDocument, instructions: Instruction[]): void {
        instructions.forEach(instruction => applyInstruction(doc, instruction))
    }
/**
 * 
 * Translate Instructions into PDFKit Rendering Commands
 * 
 * @param doc 
 * @param instr 
 */
function applyInstruction(doc: PDFKit.PDFDocument, instr: Instruction): void {
    switch (instr.type) {
        case 'textAt':
            if (instr.color) {
                doc.fillColor(instr.color)
            }
            if (instr.x_1 && instr.y_1) {
                doc.text(instr.text, instr.x_1, instr.y_1)
            } else {
                doc.text(instr.text)
            }
            // reset to black font if set previously
            if (instr.color) {
                doc.fillColor('black')
            }
            break
        case 'lineAtTo': {
            const _lineWidth = instr.lineWidth || 1
            const _color = instr.color || 'black'
            doc.lineWidth(_lineWidth)
            doc.strokeColor(_color)
            doc.moveTo(instr.x_1, instr.y_1).lineTo(instr.x_2, instr.y_2).stroke();
            break
        }
        case 'rectangleAtTo': {
            const _lineWidth = instr.lineWidth || 1
            const _color = instr.color || 'green'
            doc.lineWidth(_lineWidth)
            doc.strokeColor(_color)
            doc.rect(instr.x_1, instr.y_1, instr.x_2, instr.y_2).stroke()
            break
        }
    }
}
