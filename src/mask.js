import erte, { c } from 'erte'
import { equal } from 'assert'
import mismatch from 'mismatch'
import { readFileSync, writeFileSync } from 'fs'
import { askSingle, confirm } from 'reloquent'
import { splitWithPositions } from './lib'

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
  let resultFile = `${readFileSync(path)}`
  const mi = splitRe.exec(resultFile)
  if (!mi) throw new Error(`${path} does not contain tests.`)
  const preamble = resultFile.slice(0, mi.index).replace(/\n\n$/, '')
  const mm = resultFile.slice(mi.index)
  splitRe.lastIndex = 0
  const t = splitWithPositions(mm, splitRe).filter(({ match }) => {
    return match
  })
  const tests = t.map(({ match: test, position, separator }) => {
    const [name, total] = split(test, '\n')
    const [i, body] = splitWithRe(total, new RegExp(`\n${propStartRe.source}`))
    const bodyStartsAt = test.indexOf(body)
    const input = i.replace(/\n$/, '')

    const foundProps = mismatch(
      new RegExp(`(${propStartRe.source} +(.+) +\\*\\/(\n?))([\\s\\S]*?)\n${propEndRe.source}`, 'g'),
      body,
      ['preValue', 'key', 'newLine', 'value'], true,
    )
    /** @type {Object<string,{ start: number, length: number }>} */
    const positions = {}
    const expected = foundProps.reduce((acc, { preValue, key, newLine, value, position: p }) => {
      const fullPosition = position + bodyStartsAt + p + preValue.length + separator.length
      positions[key] = { start: fullPosition, length: value.length }
      const val = (!value && newLine) ? newLine : value
      return {
        ...acc,
        [key]: val,
      }
    }, {})
    return {
      name,
      input,
      positions,
      ...(preamble ? { preamble } : {}),
      ...expected,
    }
  })

  const lines = resultFile.split('\n')
  let lengthDifference = 0

  /**
   * A function to be called on error in a test.
   * @param {string} name
   * @param {!Object<string, { start: number, length: number }>} positions
   * @param {!Error} error
   * @throws {!Error} An error with a stack trace pointing at the line in the mask file.
   */
  const onError = async (name, positions, error) => {
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
    if (error.property && error.actual) {
      const handleUpdate = async () => {
        // update in interactive mode
        const position = positions[error.property]
        if (!position) return false
        const start = position.start + lengthDifference
        const b = resultFile.slice(0, start)
        const a = resultFile.slice(start + position.length)
        const newFile = `${b}${error.actual}${a}`
        console.error('Result does not match property "%s"\n  at %s (%s:%s:1)', error.property, c(name, 'blue'), path, lineNumber)
        let shouldUpdate = false
        const answer = await askSingle('Show more (d), skip (s), or update (u): [u]')
        if (answer == 'd') {
          console.log(c('Actual: ', 'blue'))
          console.log(error.actual)
          console.log(c('Expected: ', 'blue'))
          console.log(error.expected)
          shouldUpdate = await confirm('Update the result')
        } else if (!answer || answer == 'u') {
          shouldUpdate = true
        }
        if (!shouldUpdate) return false
        lengthDifference += error.actual.length - position.length
        await writeFileSync(path, newFile)
        resultFile = `${readFileSync(path)}`

        return true
      }
      err.handleUpdate = handleUpdate
    }
    throw err
  }
  const testsWithOnError = tests.map(({ name, positions, ...rest }) => {
    /**
     * @type {function}
     * @param {!Error} error An error with a stack trace pointing at the line in the mask file.
     */
    const boundOnError = onError.bind(null, name, positions)
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
export const assertExpected = (result, expected) => {
  try {
    equal(result, expected)
  } catch (err) {
    const e = erte(expected, result)
    console.log(e) // eslint-disable-line no-console
    err.property = 'expected'
    throw err
  }
}

export default getTests