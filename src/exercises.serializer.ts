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

export function asPDF<T extends NodeJS.WritableStream>(sets: ExerciseSet[], pageOptions: PageOptions, targetStream: T) {
    // prepare pageOptions
    const pos = preparePageOptions(pageOptions)

    // prepare pdf doc
    let doc = new PDFDocument({ 'size': pos.pageDimension });
    doc.font(pos.pageFont.src, pos.pageFont.family, pos.pageFont.size);
    doc.text(pos.pageLabel)
    doc.text('(1) ' + pos.pageDatum);
    // prepare width, indents, nr of exercises
    let y = 150;
    let x = 40;
    let a = 1;

    sets.forEach((set: ExerciseSet) => {
        let row = a + ' ) ';
        doc.text(row, x, y);
        x += 40;
        set.exercises.forEach((exc: Exercise) => {
            const rendered: Rendered[] = exc.rendered;
            if (typeof rendered === 'object') {
                if (rendered.length === 1) {
                    doc.text(rendered[0].rendered, x, y);
                    y += 40;
                    // having at least an additional carry row ...
                } else if (rendered.length > 1) {
                    y = handleRendered(rendered, x, doc, y);
                    // guess some space between each exercise
                    y += 15;
                }
            }
        });
        a++;
        // if the last entry from last row was division ...
        if (set.properties.extension === 'DIV_EVEN') {
            x += 200;
        } else {
            x += 120;
        }
        y = 150;
    });
    doc.pipe(targetStream);
    doc.end();
}

function handleRendered(rendered: Rendered[], x: number, doc: PDFKit.PDFDocument, y: number) {
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
                    doc.lineWidth(1)
                    doc.strokeColor('black')
                    doc.rect(_x, y, 8, 12).stroke()
                }
                else {
                    doc.text(row.rendered[l], _x, y);
                }
                _x += 10;
            }
            _x = 0;
        } else if (_type !== 'FRACTION_STRIKE') {
            // no marks, just render line as it is
            doc.text(row.rendered, x, y);
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
                        doc.text(_char, _x, y);
                        metSign = true
                    } else {
                        // lately came accross sign?
                        if (metSign) {
                            x2 = _x - 10
                            doc.lineWidth(2)
                            doc.strokeColor('green')
                            doc.moveTo(x1 + 1, y + verticalSpace).lineTo(x2 - 1, y + verticalSpace).stroke()
                            x1 = _x
                            metSign = false
                        }
                    }
                    _x += 10
                }
                // final stroke
                doc.moveTo(x1, y + verticalSpace).lineTo(_x, y + verticalSpace).stroke()
            }
        } else {
            // no Fractions, but add_carry, sub, mult or div_even
            if (k === rendered.length - 2) {
                const w = rendered[k].rendered.length * 10;
                doc.lineWidth(2);
                doc.moveTo(x, y + 14).lineTo(x + w, y + 14).stroke();
                y += 5;
            }
            // srike twice below every result row
            if (k === rendered.length - 1) {
                const w = rendered[k].rendered.length * 10;
                doc.lineWidth(1);
                doc.moveTo(x, y + 14).lineTo(x + w, y + 14).stroke();
                doc.moveTo(x, y + 16).lineTo(x + w, y + 16).stroke();
                y += 5;
            }
        }
        // next row
        y += 15;
    }
    return y;
}

function _isSign(s: string): boolean {
    return s === '+' || s === '-' || s === '=' || s === '*' || s === ':'
}
