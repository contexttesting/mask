import { collect } from 'catchment'
import throws from 'assert-throws'
import deepEqual from '@zoroaster/deep-equal'
import fork from '@zoroaster/fork'
import { assertExpected } from '../mask'

/**
 * Create a new test.
 * @param {{ input:string, error: string, getTransform: () => Transform, getReadable: (input: string) => Readable, getThrowsConfig: Function }} param
 */
const makeTest = ({
  input, error, getThrowsConfig, getTransform, getResults, expected,
  assertResults, props, mapActual, getReadable, forkConfig,
}) => {
  const test = async (...contexts) => {
    const cntx = { input, ...props }
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
      if (props.inputs) {
        forkConfig.inputs = getInputsFromProps(props.inputs)
      }
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
        deepEqual(actual, expected)
      } else if ((typeof actual).toLowerCase() != 'string') {
        throw new Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".')
      } else {
        assertExpected(actual, expected)
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
  const res = s.split('\n').map(i => {
    const [q, a] = i.split(/: +/)
    const re = new RegExp(q)
    return [re, a]
  })
  return res
}

/**
 * @param {{ fn: !Function }} throwsConfig
 */
const assertError = async (throwsConfig, error) => {
  await throws({
    ...throwsConfig,
    message: error,
  })
}

export default makeTest