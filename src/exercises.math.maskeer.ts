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
    if (exercise.rendered) {
        const _type: ExtensionType = exercise.extension.type
        if (_type) {
            const _r: Rendered[] = exercise.rendered
            const rs: Rendered[] = _r.map((r: Rendered, i) => {
                const _t: RenderedType = r.type
                if (_t === 'INTERMEDIATE') {
                    if( _type === 'DIV_EVEN' ) {
                        if (replacer && replacer === 'ALL') {
                            return { type: _t, rendered: maskAllWithDefaultMark(r.rendered) }
                        } else {
                            return { type: _t, rendered: maskNonNullWithDefaultMark(r.rendered) }
                        }
                    } else {
                        return { type: _t, rendered: maskNonNullWithDefaultMark(r.rendered)}
                    }
                } else if (_t === 'VALUE') {
                    if (exercise.extension.type !== 'DIV_EVEN') {
                        return { type: _t, rendered: maskAllWithDefaultMark(r.rendered) }
                    } else {
                        return { type: _t, rendered: r.rendered }
                    }
                } else if (_t === 'CARRY') {
                    const _r = maskNonNullWithDefaultMark(_whitespaceZero(r.rendered))
                    return { type: _t, rendered: _r}
                } else {
                    // dont mask row
                    return { type: _t, rendered: r.rendered }
                }
            })

            exercise.rendered = rs
        }
    }
    return exercise;
}

const maskNonNullWithDefaultMark: (string) => string = _maskWith.bind(null, /[1-9]/g, DEFAULT_MASK)
const maskAllWithDefaultMark: (string) => string = _maskWith.bind(null, /[0-9]/g, DEFAULT_MASK)
const _whitespaceZero: (string) => string = _maskWith.bind(null, /0/g, ' ')

function _maskWith(regex: RegExp, mask: string, ren: string): string {
    return ren.replace(regex, mask)
}
