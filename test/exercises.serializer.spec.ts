import * as fs from 'fs'
import * as PDFDocument from 'pdfkit';

import {
    asPDF,
    preparePageOptions,
    PageOptions,
    Instruction,
    makeInstruction,
    applyInstructions,
    default_pageDim,
    default_pdfkit_fontsrc,
    default_fontfamily,
    default_fontsize
} from '../src/exercises.serializer'
import {
    makeSet
} from '../src/exercises.math'

/**
 * Serializer API
 */
describe('Serializer API', () => {
    const timestamp = Date.now()
    const fileName1 = 'test_make_exercises_serializer_' + timestamp + '.pdf'
    const fileName2 = 'test_make_exercises_serializer_' + timestamp + '_instructions.pdf'

    it('should serialize Exercises NodeJS Stream to "' + fileName1 + '"', async () => {
        const fsStream: NodeJS.WritableStream = fs.createWriteStream(fileName1)
        const metaData: PageOptions = preparePageOptions({ pageLabel: 'Test default Exercise' })
        const sets = await makeSet()
        asPDF(sets, metaData, fsStream)
    })

    it('should respect defaults for colors and lines', () => {
        const doc: PDFKit.PDFDocument = new PDFDocument({ 'size': default_pageDim });
        doc.font(default_pdfkit_fontsrc, default_fontfamily, default_fontsize)
        const i0: Instruction = makeInstruction('textAt', 'TEST DEFAULT TEXT FLOW')
        const i1: Instruction = makeInstruction('rectangleAtTo', 100, 100, 200, 50, 4, 'red')
        const i2: Instruction = makeInstruction('lineAtTo', 100, 200, 300, 200, 8, 'green')
        const i3: Instruction = makeInstruction('textAt', 'TEST RED TEXT', 100, 250, 'red')
        const i4: Instruction = makeInstruction('textAt', 'TEST DEFAULT BLACK TEXT', 100, 300)
        const i5: Instruction = makeInstruction('rectangleAtTo', 100, 350, 200, 50)
        const i6: Instruction = makeInstruction('lineAtTo', 100, 450, 300, 450)

        applyInstructions(doc, [i0, i1, i2, i3, i4, i5, i6])
        const fsStream: NodeJS.WritableStream = fs.createWriteStream(fileName2)
        doc.pipe(fsStream);
        doc.end();
    })
})