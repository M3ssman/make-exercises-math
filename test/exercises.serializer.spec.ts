import * as fs from 'fs'
import {
    asPDF,
    preparePageOptions,
    PageOptions,
} from '../src/exercises.serializer'
import {
    makeSet
} from '../src/exercises.math'

/**
 * Serializer API
 */
describe('Serializer API', () => {
    const timestamp = Date.now()
    const fileName = 'test_make_exercises_serializer_' + timestamp + '.pdf'

    it('should serialize Exercises NodeJS Stream to "'+fileName+'"', async () => {
        const fsStream: NodeJS.WritableStream = fs.createWriteStream(fileName)
        const metaData: PageOptions = preparePageOptions({pageLabel:'Test default Exercise'})
        const sets = await makeSet()
        asPDF(sets, metaData, fsStream)
    })
})