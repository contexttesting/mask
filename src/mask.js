import erte, { c } from 'erte'
import { equal } from 'assert'
import mismatch from 'mismatch'
import { readFileSync, writeFileSync } from 'fs'
import { askSingle, confirm } from 'reloquent'
import { splitWithPositions } from './lib'
import { EOL } from 'os'

/**
 * A function to construct tests from a mask file.
 * @param {Object} conf
 * @param {string} conf.path Path to the mask file.
 * @param {!RegExp} [conf.splitRe] The regular expression to split the file by.
 * @param {!RegExp} [conf.propStartRe] The regular expression indicating the start of the property of the mask.
 * @param {!RegExp} [conf.propEndRe] The regular expression indicating the end of the property of the mask.
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
  const preamble = resultFile.slice(0, mi.index).replace(/\r?\n\r?\n$/, '')
  const mm = resultFile.slice(mi.index)
  splitRe.lastIndex = 0
  const t = splitWithPositions(mm, splitRe).filter(({ match }) => {
    return match
  })

  const tests = t.map(({ match: test, position, separator }) => {
    const [name, total] = split(test, EOL)
    const [i, body] = splitWithRe(total, new RegExp(`\\r?\\n${propStartRe.source}`))
    const bodyStartsAt = test.indexOf(body)
    const input = i.replace(/\r?\n$/, '')

    const offset = mi.index + bodyStartsAt + position + separator.length

    const foundProps = mismatch(
      new RegExp(`(${propStartRe.source} +(.+) +\\*\\/(\\r?\\n?))([\\s\\S]*?)\\r?\\n${propEndRe.source}`, 'g'),
      body,
      ['preValue', 'key', 'newLine', 'value'], true,
    )
    /** @type {!Object<string, { start: number, length: number }>} */
    const positions = {}

    const expected = foundProps.reduce((acc, { 'preValue': preValue, 'key': key, 'newLine': newLine, 'value': value, 'position': p }) => {
      const fullPosition = offset + p + preValue.length
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
      ...(preamble ? { 'preamble': preamble } : {}),
      ...expected,
    }
  })

  const lines = resultFile.split(EOL)
  let lengthDifference = 0

  /**
   * A function to be called on error in a test.
   * @param {string} name The name of the test.
   * @param {!Object<string, { start: number, length: number }>} positions Positions of the properties.
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
    if (error['property'] && error['actual']) {
      const { 'property': property, 'actual': actual, 'expected': expected } = error
      const handleUpdate = async () => {
        // update in interactive mode
        const position = positions[property]
        if (!position) return false
        const start = position.start + lengthDifference
        const b = resultFile.slice(0, start)
        const a = resultFile.slice(start + position.length)
        const newFile = `${b}${actual}${a}`
        console.error('Result does not match property "%s"', property)
        console.error('  at %s (%s:%s:1)', c(name, 'blue'), path, lineNumber)
        let shouldUpdate = false
        const answer = await askSingle('Show more (d), skip (s), or update (u): [u]')
        if (answer == 'd') {
          console.log(c('Actual: ', 'blue'))
          console.log(actual)
          console.log(c('Expected: ', 'blue'))
          console.log(expected)
          shouldUpdate = await confirm('Update the result')
        } else if (!answer || answer == 'u') {
          shouldUpdate = true
        }
        if (!shouldUpdate) return false
        lengthDifference += actual.length - position.length
        await writeFileSync(path, newFile)
        resultFile = `${readFileSync(path)}`

        return true
      }
      err['handleUpdate'] = handleUpdate
    }
    throw err
  }
  const testsWithOnError = tests.map(({ name, positions, ...rest }) => {
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
  return `Error: ${message}${EOL}    at ${name} (${path}:${lineNumber}:1)`
}

/**
 * @returns {!Array<string>}
 */
const splitWithRe = (s, re) => {
  const nl = s.search(re)
  if (nl < 0) throw new Error(
    `Could not process "${s}": propStart re ${re} returned -1`)
  const first = s.substr(0, nl)
  const second = s.substr(nl + 1)
  return [first, second]
}

/**
 * @param {string} s The string to split.
 * @param {string} del The delimiter to split by
 * @returns {!Array<string>}
 */
const split = (s, del) => {
  const nl = s.indexOf(del)
  const first = s.substr(0, nl)
  const second = s.substr(nl + del.length)
  return [first, second]
}

/**
 * Asserts that the strings are equal, and prints a color message if they're not.
 */
// eslint-disable-next-line no-console
export const assertExpected = (result, expected, log = console.log) => {
  try {
    equal(result, expected)
  } catch (err) {
    const e = erte(expected, result)
    log(e)
    err['property'] = 'expected'
    throw err
  }
}

export default getTests