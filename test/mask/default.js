import makeTestSuite from '../../src'
import Context from '../context'

const ts = makeTestSuite('test/result', {
  async getResults(input) {
    return input + ' ok'
  },
  context: Context,
})

export default ts
