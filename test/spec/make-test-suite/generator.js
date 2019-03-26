import { throws, ok } from 'zoroaster/assert'
import { inspect } from 'util'
import Context from '../../context'
import makeTestSuite from '../../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'can create a test suite from a directory'({ fixture }) {
    const ts = makeTestSuite(fixture`test-suite`, {
      getResults(input) {
        return input + ' - ok'
      },
    })
    const s = inspect(ts)
      .split('\n').map(a => a.trimRight()).join('\n')
    return s
  },
  async 'creates a test suite from nested directories'({ fixture }) {
    const ts = makeTestSuite(fixture`recursive`, {
      getResults() {},
    })
    const s = inspect(ts)
      .split('\n').map(a => a.trimRight()).join('\n')
    return s
  },
  async 'resolves result file extension'({ fixture }) {
    const ts = makeTestSuite(fixture`result/index`, {
      getResults() {},
    })
    ok(Object.keys(ts).length)
  },
  async 'throws on multiple possible result file extensions'({ fixture }) {
    const path = fixture`result/multiple`
    await throws({
      fn: makeTestSuite,
      args: [path, {
        getResults() {},
      }],
      message: `Could not resolve the result path ${path}, possible files: multiple.js, multiple.md.`,
    })
  },
}

export default T