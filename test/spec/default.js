import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import mask from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof mask, 'function')
  },
  async 'calls package without error'() {
    await mask()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await mask({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T