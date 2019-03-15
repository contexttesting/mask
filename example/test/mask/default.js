/* yarn example/ */
import makeTestSuite from '../../../src'
import fn from '../../src'

class Context {
  /**
   * Returns the path to the fixture.
   */
  get fixture() { return 'example/test/fixture/test.txt' }
}

export default makeTestSuite('example/test/result', {
  context: Context,
  /**
   * @param {string} input
   * @param {Context} t
   */
  async getResults(input, { fixture }) {
    const res = await fn(fixture, input)
    return res
  },
})