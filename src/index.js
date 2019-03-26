import { c as color } from 'erte'
import { readdirSync, lstatSync } from 'fs'
import { join, dirname, basename } from 'path'
import { collect } from 'catchment'
import { deepEqual } from 'assert-diff'
import fork from '@zoroaster/fork'
import throws from 'assert-throws'
import getTests, { assertExpected } from './mask'

/**
 * Make a test suite to test against a mask.
 * @param {string} path Path to the mask file or directory of files.
 * @param {MakeTestSuiteConf} [conf] Configuration for making test suites.
 * @param {({new(): Context}|{new(): Context}[]|{})} [conf.context] Single or multiple context constructors or objects to initialise for each test.
 * @param {({new(): Context}|{new(): Context}[]|{})} [conf.persistentContext] The context constructor(s) that will be initialised and destroyed once per test suite, having a persistent state across tests.
 * @param {(input: string, ...contexts?: Context[]) => string} [conf.getResults] A possibly async function which should return results of a test. If it returns a string, it will be compared against the `expected` property of the mask using string comparison. If it returns an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`.
 * @param {(...contexts?: Context[]) => Transform|Promise.<Transform>} [conf.getTransform] A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask. Its output will be accumulated and compared against the expected output of the mask.
 * @param {(input: string, ...contexts?: Context[]) => Readable|Promise.<Readable>} [conf.getReadable] A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask. This could be used to test a forked child process, for example.
 * @param {string|ForkConfig} [conf.fork] A path to the module to fork with input as arguments, and compare its output against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started.
 * @param {(input: string, ...contexts?: Context[]) => { fn: function, args?: any[], message?: (string|RegExp) }} [conf.getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @param {(results: any) => string} [conf.mapActual] An optional function to get a value to test against `expected` mask property from results. By default, the full result is used.
 * @param {(results: any, props: Object.<string, (string|object)>) => (void|Promise)} [conf.assertResults] A possibly async function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 * @param {string[]} [conf.jsonProps] Any additional properties to extract from the mask, and parse as _JSON_ values.
 * @param {RegExp} [conf.splitRe="/^\/\/ /gm` or `/^## /gm"] A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.
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

const assertHasExpected = (expected) => {
  if (expected === undefined) throw new Error('No expected output was given.')
}

/**
 * Create a new test.
 * @param {{ getTransform: () => Transform, getReadable: (input: string) => Readable, getThrowsConfig: Function }} param
 */
const makeTest = ({
  input, error, getThrowsConfig, getTransform, getResults, expected,
  assertResults, props, mapActual, getReadable, forkConfig,
}) => {
  const test = async (...contexts) => {
    const cntx = { input, ...props }
    let results
    if (error) {
      if (!getThrowsConfig)
        throw new Error('No "getThrowsConfig" function is given.')
      const throwsConfig = getThrowsConfig.call(cntx, input, ...contexts)
      await assertError(throwsConfig, error)
      return
    } else if (getTransform) {
      assertHasExpected(expected)
      const rs = await getTransform.call(cntx, ...contexts)
      rs.end(input)
      results = await collect(rs)
    } else if (getReadable) {
      assertHasExpected(expected)
      const rs = await getReadable.call(cntx, input, ...contexts)
      results = await collect(rs)
    } else if (forkConfig) {
      if (props.inputs) {
        forkConfig.inputs = getInputsFromProps(props.inputs)
      }
      const r = await fork({
        forkConfig,
        input,
        props,
        contexts,
      })
      results = getResults ? await getResults.call(cntx, input, ...contexts) : r
    } else if (!getResults) {
      throw new Error('Nothing was tested.')
    } else {
      results = await getResults.call(cntx, input, ...contexts)
    }

    if (expected !== undefined) {
      const actual = mapActual(results)
      if (typeof expected != 'string') { // already parsed
        deepEqual(actual, expected)
      } else if ((typeof actual).toLowerCase() != 'string') {
        throw new Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".')
      } else {
        assertExpected(actual, expected)
      }
    }
    if (assertResults) {
      await assertResults.call(cntx, results, props)
    }
  }
  return test
}

const getInputsFromProps = (s) => {
  const res = s.split('\n').map(i => {
    const [q, a] = i.split(/: +/)
    const re = new RegExp(q)
    return [re, a]
  })
  return res
}

const makeATestSuite = (maskPath, conf) => {
  if (!conf) throw new Error('No configuration is given. A config should at least contain either a "getThrowsConfig", "getResults", "getTransform" or "getReadable" functions.')
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
  } = conf
  const tests = getTests({ path: maskPath, splitRe })

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
        if (process.env.DEBUG) console.log(color(err.stack, 'red'))
        onError(err) // show location in the error stack. TODO: keep mask line
      }
    }
    return acc
  }, {
    ...(context ? { context }: {}),
    ...(persistentContext ? { persistentContext }: {}),
  })
  return t
}

const assertError = async (throwsConfig, error) => {
  await throws({
    ...throwsConfig,
    message: error,
  })
}

/* documentary types/context.xml */
/**
 * @typedef {Object} Context A context made with a constructor.
 * @prop {() => void} [_init] A function to initialise the context.
 * @prop {() => void} [_destroy] A function to destroy the context.
 */

/* documentary node_modules/@zoroaster/fork/types/index.xml */
/**
 * @typedef {import('child_process').ForkOptions} ForkOptions
 *
 * @typedef {Object} ForkConfig Parameters for forking.
 * @prop {string} module The path to the module to fork.
 * @prop {(args: string[], ...contexts?: Context[]) => string[]|Promise.<string[]>} [getArgs] The function to get arguments to pass the fork based on the parsed mask input and contexts.
 * @prop {(...contexts?: Context[]) => ForkOptions} [getOptions] The function to get options for the fork, such as `ENV` and `cwd`, based on contexts.
 * @prop {ForkOptions} [options] Options for the forked processed, such as `ENV` and `cwd`.
 * @prop {[RegExp, string][]} [inputs] Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data.
 * @prop {[RegExp, string][]} [stderrInputs] Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`).
 * @prop {boolean|{stderr: Writable, stdout: Writable}} [log=false] Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties. Default `false`.
 * @prop {boolean} [includeAnswers=true] Whether to add the answers to the `stderr` and `stdout` output. Default `true`.
 * @prop {boolean} [stripAnsi=true] Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result. Default `true`.
 * @prop {(function|{stdout?:function, stderr?:function})} [preprocess] The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.
 */

/* documentary types/index.xml */
/**
 * @typedef {import('stream').Transform} Transform
 * @typedef {import('stream').Readable} Readable
 *
 * @typedef {Object} MakeTestSuiteConf Configuration for making test suites.
 * @prop {({new(): Context}|{new(): Context}[]|{})} [context] Single or multiple context constructors or objects to initialise for each test.
 * @prop {({new(): Context}|{new(): Context}[]|{})} [persistentContext] The context constructor(s) that will be initialised and destroyed once per test suite, having a persistent state across tests.
 * @prop {(input: string, ...contexts?: Context[]) => string} [getResults] A possibly async function which should return results of a test. If it returns a string, it will be compared against the `expected` property of the mask using string comparison. If it returns an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`.
 * @prop {(...contexts?: Context[]) => Transform|Promise.<Transform>} [getTransform] A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask. Its output will be accumulated and compared against the expected output of the mask.
 * @prop {(input: string, ...contexts?: Context[]) => Readable|Promise.<Readable>} [getReadable] A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask. This could be used to test a forked child process, for example.
 * @prop {string|ForkConfig} [fork] A path to the module to fork with input as arguments, and compare its output against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started.
 * @prop {(input: string, ...contexts?: Context[]) => { fn: function, args?: any[], message?: (string|RegExp) }} [getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @prop {(results: any) => string} [mapActual] An optional function to get a value to test against `expected` mask property from results. By default, the full result is used.
 * @prop {(results: any, props: Object.<string, (string|object)>) => (void|Promise)} [assertResults] A possibly async function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 * @prop {string[]} [jsonProps] Any additional properties to extract from the mask, and parse as _JSON_ values.
 * @prop {RegExp} [splitRe="/^\/\/ /gm` or `/^## /gm"] A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.
 */
