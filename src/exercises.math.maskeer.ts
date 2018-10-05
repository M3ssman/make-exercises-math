import {
    Exercise,
    MaskType
} from './exercises.math';

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
        exercise.rendered = exercise.rendered.map( (r, i) => {
            if( i > 0) {
                if(replacer && replacer === 'ALL') {
                    return maskAllWithDefaultMark(r)
                } else {
                    return maskNonNullWithDefaultMark(r)
                }
            } else {
                // dont mask first row with exercise
                return r
            }
        })
    }
    return exercise;
}

const maskNonNullWithDefaultMark: (string) => string = _maskWith.bind(null, /[1-9]/g, DEFAULT_MASK)
const maskAllWithDefaultMark: (string) => string = _maskWith.bind(null, /[0-9]/g, DEFAULT_MASK)

function _maskWith(regex: RegExp, mask: string, row: string, ): string {
    return row.replace(regex, mask);
}
