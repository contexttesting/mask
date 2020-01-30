import { throws, ok, deepEqual } from '@zoroaster/assert'
import { inspect } from 'util'
import Context from '../../context'
import makeTestSuite from '../../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'can create a test suite from a directory'({ f }) {
    const ts = makeTestSuite(f`test-suite`, {
      getResults(input) {
        return input + ' - ok'
      },
    })
    const s = inspect(ts)
      .split('\n').map(a => a.trimRight()).join('\n')
    return s
  },
  async 'can create a test suite from multiple files'({ f }) {
    const ts = makeTestSuite([f`test-suite/custom.js`, f`test-suite/default.js`], {
      getResults(input) {
        return input + ' - ok'
      },
    })
    const s = inspect(ts)
      .split('\n').map(a => a.trimRight()).join('\n')
    return s
  },
  async 'creates a test suite from nested directories'({ f }) {
    const ts = makeTestSuite(f`recursive`, {
      getResults() {},
    })
    const s = inspect(ts)
      .split('\n').map(a => a.trimRight()).join('\n')
    return s
  },
  async 'resolves result file extension'({ f }) {
    const ts = makeTestSuite(f`result/index`, {
      getResults() {},
    })
    ok(Object.keys(ts).length)
  },
  async 'throws on multiple possible result file extensions'({ f }) {
    const path = f`result/multiple`
    await throws({
      fn: makeTestSuite,
      args: [path, {
        getResults() {},
      }],
      message: `Could not resolve the result path ${path}, possible files: multiple.js, multiple.md.`,
    })
  },
}

/** @type {Object.<string, (c: Context)>} */
export const focus = {
  context: Context,
  async 'generates a focused test suite from dir'({ f }) {
    const ts = makeTestSuite('!' + f`test-suite`, {
      getResults() {},
    })
    deepEqual(Object.keys(ts), ['!test/fixture/test-suite'])
  },
  async 'generates a focused test suite from file'({ f }) {
    const ts = makeTestSuite('!' + f`result/index`, {
      getResults() {},
    })
    deepEqual(Object.keys(ts), ['!test/fixture/result/index'])
  },
}

export default T