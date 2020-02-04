import { c as color } from 'erte'
import { readdirSync, lstatSync } from 'fs'
import { join, dirname, basename } from 'path'
import getTests from './mask'
import makeTest from './lib/make-test'
import { parseProps } from './lib'

/**
 * @type {_contextTesting.makeTestSuite}
 */
function makeTestSuite(path, conf, _content = null) {
  if (Array.isArray(path)) {
    const ts = path.reduce((acc, p) => {
      const nn = basename(replaceFilename(p))
      const its = makeTestSuite(p, conf, _content)
      Object.assign(acc, { [nn]: its })
      return acc
    }, {})
    return ts
  }
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

export default makeTestSuite

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
    jsProps = [],
    splitRe,
    fork: forkConfig,
    propEndRe,
    propStartRe,
    debugLog,
  } = c
  const tests = getTests({
    path: maskPath, splitRe, propEndRe, propStartRe, jsonProps })

  const t = tests.reduce((acc, {
    name, input, 'error': error, onError, ...rest
  }) => {
    let setupError
    let props
    let expected
    if (name in acc)
      setupError = `Repeated use of the test name "${name}".`
    try {
      ({ 'expected': expected, ...props }
        = parseProps(rest, jsonProps, jsProps))
    } catch ({ message }) {
      setupError = message
    }

    let test
    if (setupError) {
      test = () => { throw new Error(setupError) }
    } else {
      test = makeTest({
        input, error, getThrowsConfig, getTransform, getReadable, getResults, expected,
        assertResults, props, mapActual, fork: forkConfig, debugLog,
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
 * @typedef {import('..').MaskConfig} _contextTesting.MaskConfig
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..')} _contextTesting.makeTestSuite
 */