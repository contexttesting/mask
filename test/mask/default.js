import { equal } from '@zoroaster/assert'
import makeTestSuite from '../../src'

export default makeTestSuite('test/result/default', {
  async getResults() {
    const { input, ...props } = this
    const allProps = Object.keys(props).reduce((acc, k) => {
      return { ...acc, ...props[k] }
    }, {})
    let s = Object.keys(allProps).map((k) => {
      return `${k}:${allProps[k]}`
    }, '').join(' ')
    if (s) s = ' ' + s
    return input + ' ok' + `${s}`
  },
  jsProps: ['js'],
  jsonProps: ['json'],
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