import { EOL } from 'os'
import { collect } from 'catchment'
import throws from 'assert-throws'
import deepEqual from '@zoroaster/deep-equal'
import fork from '@zoroaster/fork'
import { assertExpected } from '../mask'

/**
 * Create a new test.
 * @param {!_contextTesting.MaskConfig} params
 * @param {string} params.input
 * @param {string} params.error
 * @param {string} params.expected
 * @param {*} params.props
 */
const makeTest = (params) => {
  const {
    input, error, expected, props,
    getThrowsConfig, getTransform, getResults,
    assertResults, mapActual, getReadable, fork: forkConfig,
    debugLog,
  } = params
  const test = async (...contexts) => {
    const cntx = /** @type {_contextTesting.MaskContext} */ ({ input, ...props })
    let results
    if (error) {
      if (!getThrowsConfig)
        throw new Error('No "getThrowsConfig" function is given.')
      const throwsConfig = getThrowsConfig.call(cntx, ...contexts)
      await assertError(throwsConfig, error)
      return
    } else if (getTransform) {
      assertHasExpected(expected)
      const rs = await getTransform.call(cntx, ...contexts)
      rs.end(input)
      results = await collect(rs)
    } else if (getReadable) {
      assertHasExpected(expected)
      const rs = await getReadable.call(cntx, ...contexts)
      results = await collect(rs)
    } else if (forkConfig) {
      if (cntx.inputs)
        forkConfig.inputs = getInputsFromProps(cntx.inputs)

      const r = await fork({
        forkConfig,
        input,
        props,
        contexts,
      })

      results = getResults ? await getResults.call(cntx, ...contexts) : r
    } else if (!getResults) {
      throw new Error('Nothing was tested.')
    } else {
      results = await getResults.call(cntx, ...contexts)
    }

    if (expected !== undefined) {
      const actual = mapActual(results)
      if (typeof expected != 'string') { // already parsed
        try {
          deepEqual(actual, expected)
        } catch (err) {
          err['property'] = 'expected'
          throw err
        }
      } else if ((typeof actual).toLowerCase() != 'string') {
        throw new Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".')
      } else {
        assertExpected(actual, expected, debugLog)
      }
    }
    if (assertResults) {
      await assertResults.call(cntx, results, props)
    }
  }
  return test
}

const assertHasExpected = (expected) => {
  if (expected === undefined) throw new Error('No expected output was given.')
}

const getInputsFromProps = (s) => {
  const res = s.split(EOL).map(i => {
    const [q, a] = i.split(/: +/)
    const re = new RegExp(q)
    return [re, a]
  })
  return res
}

const assertError = async (throwsConfig, error) => {
  await throws(/** @type {_assertThrows.Config} */ ({
    ...throwsConfig,
    message: error,
  }))
}

export default makeTest

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').MaskConfig} _contextTesting.MaskConfig
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').MaskContext} _contextTesting.MaskContext
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../types').MaskForkConfig} _contextTesting.MaskForkConfig
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('assert-throws').Config} _assertThrows.Config
 */
