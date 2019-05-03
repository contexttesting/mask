import { c as color } from 'erte'
import { readdirSync, lstatSync } from 'fs'
import { join, dirname, basename } from 'path'
import getTests from './mask'
import makeTest from './lib/make-test'

/**
 * Make a test suite to test against a mask.
 * @param {string} path Path to the mask file or directory of files.
 * @param {!_contextTesting.MaskConfig} conf Configuration for making test suites.
 */
export default function makeTestSuite(path, conf, _content = null) {
  let pathStat
  const isFocused = path.startsWith('!')
  let realPath = isFocused ? path.replace(/^!/, '') : path
  try {
    pathStat = lstatSync(realPath)
  } catch (err) {
    if (err.code != 'ENOENT') {
      throw err
    }
    realPath = resolve(realPath, _content)
    pathStat = lstatSync(realPath)
  }
  let ts
  if (pathStat.isFile()) {
    ts = makeATestSuite(realPath, conf)
  } else if (pathStat.isDirectory()) {
    const content = readdirSync(realPath)
    ts = content.reduce((acc, node) => {
      const newPath = join(realPath, node)
      const nn = replaceFilename(node)
      return {
        ...acc,
        [nn]: makeTestSuite(newPath, conf, content),
      }
    }, {})
  }
  if (isFocused) return { [path]: ts }
  return ts
}
const replaceFilename = (filename) => {
  return filename.replace(/\.\w+?$/, '')
}

const resolve = (path, content) => {
  const dir = dirname(path)
  const files = content || readdirSync(dir)
  const matchingFiles = files.filter((f) => {
    return f.startsWith(`${basename(path)}.`)
  })
  if (matchingFiles.length > 1) {
    throw new Error(`Could not resolve the result path ${path}, possible files: ${matchingFiles.join(', ')}.`)
  } else if (matchingFiles.length) {
    path = join(dir, matchingFiles[0])
  } else {
    throw new Error(`Could not resolve the result path ${path}.`)
  }
  return path
}

// The `expected` property of the mask will be compared against the actual value returned by the `getActual` function. To test for the correct error message, the `error` property will be tested using `assert-throws` configuration returned by `getThrowsConfig` function. Any additional tests can be performed with `customTest` function, which will receive any additional properties extracted from the mask using `customProps` and `jsonProps`. The JSON properties will be parsed into an object.

const parseProps = (props, jsonProps) => {
  const parsedRest = Object.keys(props).reduce((ac, k) => {
    try {
      const val = jsonProps.includes(k) ? JSON.parse(props[k]) : props[k]
      ac[k] = val
      return ac
    } catch (err) {
      throw new Error(`Could not parse JSON property "${k}": ${err.message}.`)
    }
  }, {})
  return parsedRest
}

/**
 * @param {string} maskPath Path to the mask.
 */
const makeATestSuite = (maskPath, conf) => {
  /** @type {!_contextTesting.MaskConfig} */
  const c = conf
  if (!c) throw new Error('No configuration is given. A config should at least contain either a "getThrowsConfig", "getResults", "getTransform" or "getReadable" functions.')
  const {
    context,
    persistentContext,
    getResults,
    getTransform,
    getReadable,
    getThrowsConfig,
    mapActual = a => a,
    assertResults,
    jsonProps = [],
    splitRe,
    fork: forkConfig,
    propEndRe,
    propStartRe,
  } = c
  const tests = getTests({
    path: maskPath, splitRe, propEndRe, propStartRe })

  const t = tests.reduce((acc, {
    name, input, 'error': error, onError, ...rest
  }) => {
    let setupError
    let props
    let expected
    if (name in acc)
      setupError = `Repeated use of the test name "${name}".`
    try {
      ({ 'expected': expected, ...props } = parseProps(rest, jsonProps))
    } catch ({ message }) {
      setupError = message
    }

    let test
    if (setupError) {
      test = () => { throw new Error(setupError) }
    } else {
      test = makeTest({
        input, error, getThrowsConfig, getTransform, getReadable, getResults, expected,
        assertResults, props, mapActual, fork: forkConfig,
      })
    }

    acc[name] = async (...args) => {
      try {
        await test(...args)
      } catch (err) {
        if (process.env['DEBUG']) console.log(color(err.stack, 'red'))
        await onError(err) // show location in the error stack. TODO: keep mask line
      }
    }
    return acc
  }, {
    ...(context ? { 'context': context }: {}),
    ...(persistentContext ? { 'persistentContext': persistentContext }: {}),
  })
  return t
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').MaskConfig} _contextTesting.MaskConfig
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../types').MaskContext} _contextTesting.MaskContext
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('stream').Transform} stream.Transform
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('stream').Readable} stream.Readable
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('assert-throws').Config} _assertThrows.Config
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@zoroaster/fork/types').ForkConfig} _contextTesting.ForkConfig
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@zoroaster/fork/types').Context} _contextTesting.Context
 */