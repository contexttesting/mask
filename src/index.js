import { c as color } from 'erte'
import { readdirSync, lstatSync } from 'fs'
import { join, dirname, basename } from 'path'
import getTests from './mask'
import makeTest from './lib/make-test'

/**
 * Make a test suite to test against a mask.
 * @param {string} path Path to the mask file or directory of files.
 * @param {_contextTesting.MaskConfig} [conf] Configuration for making test suites.
 * @param {function(new: Context)|Array<function(new: Context)>|*} [conf.context] The single or multiple context constructors or objects to initialise for each test.
 * @param {function(new: Context)|Array<function(new: Context)>|*} [conf.persistentContext] The context constructor(s) that will be initialised and destroyed once per test suite, having a persistent state across tests.
 * @param {function(this:_contextTesting.MaskContext, ...Context): *|!Promise} [conf.getResults] A possibly async function which returns results of a test. If it outputs a string, it will be compared against the `expected` property of the mask using string comparison. If it outputs an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`. Otherwise, the result must be mapped for comparison with `expected` using the `mapActual` method.
 * @param {function(this:_contextTesting.MaskContext, ...Context): stream.Transform|!Promise<!stream.Transform>} [conf.getTransform] A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask's result. Its output will be accumulated and compared against the expected output of the mask.
 * @param {function(this:_contextTesting.MaskContext, ...Context): stream.Readable|Promise<stream.Readable>} [conf.getReadable] A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask.
 * @param {string|_contextTesting.ForkConfig} [conf.fork] The path to the module to fork with the mask's input split by whitespace as arguments, output of which will be compared against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started.
 * @param {function (this:_contextTesting.MaskContext, ...Context): _assertThrows.Config} [conf.getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @param {function(*): string} [conf.mapActual] The function to get a value to test against `expected` mask property from results returned by `getResults`.
 * @param {function(*, Object<string, *>): !Promise|undefined} [conf.assertResults] A possibly async function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask's result (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 * @param {!Array<string>} [conf.jsonProps] The properties of the mask to parse as _JSON_ values.
 * @param {!RegExp} [conf.splitRe="/^\/\/ /gm` or `/^## /gm"] A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.
 * @param {!RegExp} [conf.propStartRe="\/\‎⁎"] The regex to detect the start of the property, e.g., in `/⁎ propName ⁎/` it is the default regex that detects `/⁎`. There's no option to define the end of the regex after the name. [If copying, replace `⁎` with `*`]. Default `\/\‎⁎`.
 * @param {!RegExp} [conf.propEndRe="/\/\⁎\⁎\//"] The regex which idicates the end of the property, e.g, in `/⁎ propName ⁎/ some prop value /⁎⁎/` it is the default that detects `/⁎⁎/`. [If copying, replace `⁎` with `*`]. Default `/\/\⁎\⁎\//`.
 */
export default function makeTestSuite(path, conf, _content) {
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
  /** @type {MakeTestSuiteConf} */
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
    name, input, error, onError, ...rest
  }) => {
    let setupError
    let props
    let expected
    if (name in acc)
      setupError = `Repeated use of the test name "${name}".`
    try {
      ({ expected, ...props } = parseProps(rest, jsonProps))
    } catch ({ message }) {
      setupError = message
    }

    let test
    if (setupError) {
      test = () => { throw new Error(setupError) }
    } else {
      test = makeTest({
        input, error, getThrowsConfig, getTransform, getReadable, getResults, expected,
        assertResults, props, mapActual, forkConfig,
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
    ...(context ? { context }: {}),
    ...(persistentContext ? { persistentContext }: {}),
  })
  return t
}

/* documentary types/context.xml */
/**
 * @typedef {Object} Context A context made with a constructor.
 * @prop {() => void} [_init] A function to initialise the context.
 * @prop {() => void} [_destroy] A function to destroy the context.
 */

/* documentary types/index.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_contextTesting.MaskContext} MaskContext The `this` context of mask methods which contains the mask's properties extracted from the result file.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _contextTesting.MaskContext The `this` context of mask methods which contains the mask's properties extracted from the result file.
 * @prop {*} input The input to the mask, normally as string, but parsed into an object if `jsonProps` contains the `'input'` value.
 * @prop {string} [preamble] The text at the top of the mask result file if present.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_contextTesting.MaskConfig} MaskConfig Configuration for making test suites.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _contextTesting.MaskConfig Configuration for making test suites.
 * @prop {function(new: Context)|Array<function(new: Context)>|*} [context] The single or multiple context constructors or objects to initialise for each test.
 * @prop {function(new: Context)|Array<function(new: Context)>|*} [persistentContext] The context constructor(s) that will be initialised and destroyed once per test suite, having a persistent state across tests.
 * @prop {function(this:_contextTesting.MaskContext, ...Context): *|!Promise} [getResults] A possibly async function which returns results of a test. If it outputs a string, it will be compared against the `expected` property of the mask using string comparison. If it outputs an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`. Otherwise, the result must be mapped for comparison with `expected` using the `mapActual` method.
 * @prop {function(this:_contextTesting.MaskContext, ...Context): stream.Transform|!Promise<!stream.Transform>} [getTransform] A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask's result. Its output will be accumulated and compared against the expected output of the mask.
 * @prop {function(this:_contextTesting.MaskContext, ...Context): stream.Readable|Promise<stream.Readable>} [getReadable] A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask.
 * @prop {string|_contextTesting.ForkConfig} [fork] The path to the module to fork with the mask's input split by whitespace as arguments, output of which will be compared against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started.
 * @prop {function (this:_contextTesting.MaskContext, ...Context): _assertThrows.Config} [getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @prop {function(*): string} [mapActual] The function to get a value to test against `expected` mask property from results returned by `getResults`.
 * @prop {function(*, Object<string, *>): !Promise|undefined} [assertResults] A possibly async function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask's result (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 * @prop {!Array<string>} [jsonProps] The properties of the mask to parse as _JSON_ values.
 * @prop {!RegExp} [splitRe="/^\/\/ /gm` or `/^## /gm"] A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.
 * @prop {!RegExp} [propStartRe="\/\‎⁎"] The regex to detect the start of the property, e.g., in `/⁎ propName ⁎/` it is the default regex that detects `/⁎`. There's no option to define the end of the regex after the name. [If copying, replace `⁎` with `*`]. Default `\/\‎⁎`.
 * @prop {!RegExp} [propEndRe="/\/\⁎\⁎\//"] The regex which idicates the end of the property, e.g, in `/⁎ propName ⁎/ some prop value /⁎⁎/` it is the default that detects `/⁎⁎/`. [If copying, replace `⁎` with `*`]. Default `/\/\⁎\⁎\//`.
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
 * @typedef {import('@zoroaster/fork').ForkConfig} _contextTesting.ForkConfig
 */
