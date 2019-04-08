import { equal } from 'zoroaster/assert'
import makeTestSuite from '../../src'

export default makeTestSuite('test/result/default', {
  async getResults(input) {
    return input + ' ok'
  },
})

export const regex = makeTestSuite('test/result/regex', {
  async getResults(input) {
    const res = input + `\nfunction ${this.functionName}() {}`
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