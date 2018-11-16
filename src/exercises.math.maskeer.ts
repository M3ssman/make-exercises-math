import {
    Exercise,
    ExtensionType,
    MaskType
} from './exercises.math';

import {
    Rendered,
    RenderedType
} from './exercises.math.renderer'

/**
 * 
 * Mask rendered Exercises API
 * 
 */
export interface Maskeer {
    (exercise: Exercise, replacer: MaskType): Exercise;
}

export const DEFAULT_MASK = '?'

export function mask(exercise: Exercise, replacer: MaskType): Exercise {
    if (exercise.rendered && exercise.extension) {
        const _type: ExtensionType = exercise.extension.type
        if (_type) {
            const _r: Rendered[] = exercise.rendered
            let rs: Rendered[] = _r.map((r: Rendered, i) => {
                const _t: RenderedType = r.type
                if (_t === 'INTERMEDIATE') {
                    if (_type === 'DIV_EVEN') {
                        if (replacer && replacer === 'ALL') {
                            return { type: _t, rendered: maskAllWithDefaultMark(r.rendered) }
                        } else {
                            return { type: _t, rendered: maskNonNullWithDefaultMark(r.rendered) }
                        }
                    } else {
                        return { type: _t, rendered: maskNonNullWithDefaultMark(r.rendered) }
                    }
                } else if (_t === 'VALUE') {
                    if (exercise.extension.type !== 'DIV_EVEN') {
                        return { type: _t, rendered: maskAllWithDefaultMark(r.rendered) }
                    } else {
                        return { type: _t, rendered: r.rendered }
                    }
                } else if (_t === 'CARRY') {
                    const _r = maskNonNullWithDefaultMark(_whitespaceZero(r.rendered))
                    return { type: _t, rendered: _r }
                } else {
                    // dont mask row
                    return { type: _t, rendered: r.rendered }
                }
            })

            // case fraction
            if (_r[0].type === 'FRACTION_NOMINATOR') {
                // remove potentially existing unmasked entries from "dont mask row" (see above)
                rs = []
                const offsettEq = _r[1].rendered.indexOf('=')
                if (offsettEq > 0) {
                    const _rn0 = _r[0].rendered.substring(0,offsettEq)
                    const _rn = _rn0 + maskNonOneWithDefaultMark(_r[0].rendered.substring(offsettEq))
                    const _rd0 = _r[2].rendered.substring(0,offsettEq)
                    const _rd = _rd0 + maskNonOneWithDefaultMark(_r[2].rendered.substring(offsettEq))
                    rs.push({ type: 'FRACTION_NOMINATOR', rendered: _rn })
                    rs.push({ type: 'FRACTION_STRIKE', rendered: _r[1].rendered })
                    rs.push({ type: 'FRACTION_DENOMINATOR', rendered: _rd })
                }
            }

            exercise.rendered = rs
        }
    }
    return exercise;
}

/**
 * 
 * regular replacement funcion using standard JavaScript Regex
 * 
 * @param regex 
 * @param mask 
 * @param ren 
 */
function _maskWith(regex: RegExp, mask: string, ren: string): string {
    return ren.replace(regex, mask)
}

/**
 * partially applied functions
 */
const maskNonOneWithDefaultMark: (String) => string = _maskWith.bind(null, /[2-9]/g, DEFAULT_MASK)
const maskNonNullWithDefaultMark: (string) => string = _maskWith.bind(null, /[1-9]/g, DEFAULT_MASK)
const maskAllWithDefaultMark: (string) => string = _maskWith.bind(null, /[0-9]/g, DEFAULT_MASK)
const _whitespaceZero: (string) => string = _maskWith.bind(null, /0/g, ' ')

