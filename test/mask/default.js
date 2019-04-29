import { equal } from 'zoroaster/assert'
import makeTestSuite from '../../depack/mask'
// import makeTestSuite from '../../src'

export default makeTestSuite('test/result/default', {
  async getResults() {
    return this.input + ' ok'
  },
})

export const regex = makeTestSuite('test/result/regex', {
  async getResults() {
    const res = this.input + `\nfunction ${this.functionName}() {}`
    equal(res, `/**
 * JsDoc in mask testing.
 * @param {string} param The param.
 */
function helloWorld() {}`)
    return res
  },
  propStartRe: /\/\*@/,
  propEndRe: /\/\*@\*\//,
})

export const preamble = makeTestSuite('test/result/preamble', {
  getResults() {
    return this.preamble
  },
})