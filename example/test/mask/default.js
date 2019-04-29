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
   * @param {Context} t
   */
  async getResults({ fixture }) {
    const res = await fn(fixture, this.input)
    return res
  },
})