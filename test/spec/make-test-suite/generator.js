import { throws, ok, deepEqual } from '@zoroaster/assert'
import Zoroaster from 'zoroaster'
import { join } from 'path'
import { inspect } from 'util'
import Context from '../../context'
import makeTestSuite from '../../../src'

class Service extends Zoroaster {
  static serialise(ts) {
    const d = Object.entries(ts).reduce((acc, [key, value]) => {
      const v = typeof value == 'function' ? inspect(value) : Service.serialise(value)
      acc[key] = v
      return acc
    }, {})
    return d
  }
}

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: [Context, Service],
  async 'can create a test suite from a directory'({ f }) {
    const ts = makeTestSuite(f`test-suite`, {
      getResults(input) {
        return input + ' - ok'
      },
    })
    return ts
  },
  async 'can create a test suite from multiple files'({ f }) {
    const ts = makeTestSuite([f`test-suite/custom.js`, f`test-suite/default.js`], {
      getResults(input) {
        return input + ' - ok'
      },
    })
    return ts
  },
  async 'creates a test suite from nested directories'({ f }) {
    const ts = makeTestSuite(f`recursive`, {
      getResults() {},
    })
    return ts
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
  async'generates a focused test suite from dir'({ f }) {
    const ts = makeTestSuite('!' + f`test-suite`, {
      getResults() {},
    })
    deepEqual(Object.keys(ts), [join('!test', 'fixture', 'test-suite')])
  },
  async'generates a focused test suite from file'({ f }) {
    const ts = makeTestSuite('!' + f`result/index`, {
      getResults() {},
    })
    deepEqual(Object.keys(ts), [join('!test', 'fixture', 'result', 'index')])
  },
}

export default T