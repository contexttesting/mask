let erte = require('erte'); if (erte && erte.__esModule) erte = erte.default;
const { equal } = require('assert');
let mismatch = require('mismatch'); if (mismatch && mismatch.__esModule) mismatch = mismatch.default;
const { readFileSync } = require('fs');

/**
 * @typedef {Object} Conf
 * @prop {string} path Path to the mask file.
 * @prop {RegExp} splitRe The regular expression to split the file by.
 * @prop {RegExp} propStartRe The regular expression indicating the start of the property of the mask.
 * @prop {RegExp} propEndRe The regular expression indicating the end of the property of the mask.
 */

/**
 * A function to construct tests from a mask file.
 * @param {Conf} conf
 */
const getTests = (conf) => {
  const { path, propStartRe = /\/\*/, propEndRe = /\/\*\*\// } = conf
  let { splitRe } = conf
  if (!splitRe) {
    splitRe = path.endsWith('.md') ?  /^## /gm : /^\/\/ /gm
  }
  const m = `${readFileSync(path)}`
  const mi = splitRe.exec(m)
  if (!mi) throw new Error(`${path} does not contain tests.`)
  const mm = m.slice(mi.index)
  splitRe.lastIndex = 0
  const t = mm.split(splitRe).filter(a => a)
  const tests = t.map((test) => {
    const [name, total] = split(test, '\n')
    const [i, body] = splitWithRe(total, new RegExp(`\n${propStartRe.source}`))
    const input = i.replace(/\n$/, '')

    const expected = mismatch(
      new RegExp(`${propStartRe.source} +(.+) +\\*\\/(\n?)([\\s\\S]*?)\n${propEndRe.source}`, 'g'),
      body,
      ['key', 'newLine', 'value'],
    ).reduce((acc, { key, newLine, value }) => {
      const val = (!value && newLine) ? newLine : value
      return {
        ...acc,
        [key]: val,
      }
    }, {})
    return {
      name,
      input,
      ...expected,
    }
  })

  const lines = m.split('\n')
  /**
   * A function to be called on error in a test.
   * @param {string} name
   * @param {Error} error
   * @throws {Error} An error with a stack trace pointing at the line in the mask file.
   */
  const onError = (name, error) => {
    const lineRe = new RegExp(`${splitRe.source}${name}\r?$`)
    const lineNumber = lines.reduce((acc, current, index) => {
      if (acc) return acc // found
      if (lineRe.test(current)) return index + 1
      return acc
    }, null)
    const err = new Error(error.message)
    // possibly also remember custom test stack later
    const stack = makeStack(error.message, name, path, lineNumber)
    err.stack = stack
    throw err
  }
  const testsWithOnError = tests.map(({ name, ...rest }) => {
    /**
     * @type {function}
     * @param {Error} error An error with a stack trace pointing at the line in the mask file.
     */
    const boundOnError = onError.bind(null, name)
    return {
      ...rest,
      name,
      onError: boundOnError,
    }
  })
  return testsWithOnError
}

const makeStack = (message, name, path, lineNumber) => {
  return `Error: ${message}\n    at ${name} (${path}:${lineNumber}:1)`
}

const splitWithRe = (s, re) => {
  const nl = s.search(re)
  if (nl < 0) throw new Error(
    `Could not process "${s}": propStart re ${re} returned -1`)
  const first = s.substr(0, nl)
  const second = s.substr(nl + 1)
  return [first, second]
}

const split = (s, del) => {
  const nl = s.indexOf(del)
  const first = s.substr(0, nl)
  const second = s.substr(nl + 1)
  return [first, second]
}

/**
 * Asserts that the strings are equal, and prints a color message if they're not.
 */
       const assertExpected = (result, expected) => {
  try {
    equal(result, expected)
  } catch (err) {
    const e = erte(expected, result)
    console.log(e) // eslint-disable-line no-console
    throw err
  }
}

module.exports=getTests

module.exports.assertExpected = assertExpected