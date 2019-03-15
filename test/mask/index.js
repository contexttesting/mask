import { makeTestSuite } from 'zoroaster'
import Context from '../context'
import mask from '../../src'

const ts = makeTestSuite('test/result', {
  async getResults(input) {
    const res = await mask({
      text: input,
    })
    return res
  },
  context: Context,
})

// export default ts
