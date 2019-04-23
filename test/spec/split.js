import { deepEqual } from 'assert-diff'
import Context from '../context'
import { splitWithPositions } from '../../src/lib'

export default {
  context: Context,
  'splits the string'() {
    const s = 'hello world 123'
    const expected = s.split(/ /g)
    const res = splitWithPositions(s, / /g).map(({ match }) => {
      return match
    })
    deepEqual(expected, res)
  },
  'splits the string without separator'() {
    const s = 'helloworld123'
    const res = splitWithPositions(s, / /g).map(({ match }) => {
      return match
    })
    deepEqual(['helloworld123'], res)
  },
}