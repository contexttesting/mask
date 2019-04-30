import makeTestSuite from '../../../src'

export const expected = makeTestSuite('test/requirements/get-results/expected', {
  getResults() {
    return this.input
  },
})

export const regex = makeTestSuite('test/requirements/get-results/regex', {
  getResults() {
    return `input: ${this.input}!
prop: ${this.prop}!
number: ${this.number}!`
  },
  splitRe: /^\[TEST\] /gm,
  propStartRe: /-- \[PROP\]/,
  propEndRe: /-- \/\[PROP\] --/,
})