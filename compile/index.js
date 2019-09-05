const mask = require('./depack')

/**
 * @param {string} path The path to the result file.
 * @param {_contextTesting.MaskConfig} config Configuration for making test suites.
 * @param {function(new: _contextTesting.Context)|!Array<function(new: _contextTesting.Context)>|*} [config.context] The single or multiple context constructors or objects to initialise for each test.
 * @param {function(new: _contextTesting.Context)|!Array<function(new: _contextTesting.Context)>|*} [config.persistentContext] The context constructor(s) that will be initialised and destroyed once per test suite, having a persistent state across tests.
 * @param {string|!_contextTesting.ForkConfig} [config.fork] The path to the module to fork with the mask's input split by whitespace as arguments, output of which will be compared against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started.
 * @param {!Array<string>} [config.jsonProps] The properties of the mask to parse as _JSON_ values.
 * @param {!Array<string>} [config.jsProps] The properties of the mask to parse into JavaScript objects. For example, a property can be written as `{ config: true }` and will be evaluated into an object.
 * @param {!RegExp} [config.splitRe] A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.
 * @param {!RegExp} [config.propStartRe="\/\‎⁎"] The regex to detect the start of the property, e.g., in `/⁎ propName ⁎/` it is the default regex that detects `/⁎`. There's no option to define the end of the regex after the name. [If copying, replace `⁎` with `*`]. Default `\/\‎⁎`.
 * @param {!RegExp} [config.propEndRe="/\/\⁎\⁎\//"] The regex which indicates the end of the property, e.g, in `/⁎ propName ⁎/ some prop value /⁎⁎/` it is the default that detects `/⁎⁎/`. [If copying, replace `⁎` with `*`]. Default `/\/\⁎\⁎\//`.
 * @param {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context) => (*|!Promise)} [config.getResults] A possibly async function which returns results of a test. If it outputs a string, it will be compared against the `expected` property of the mask using string comparison. If it outputs an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`. Otherwise, the result must be mapped for comparison with `expected` using the `mapActual` method.
 * @param {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context) => !(stream.Transform|Promise<!stream.Transform>)} [config.getTransform] A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask's result. Its output will be accumulated and compared against the expected output of the mask.
 * @param {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context) => !(stream.Readable|Promise<!stream.Readable>)} [config.getReadable] A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask.
 * @param {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context) => _assertThrows.Config} [config.getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @param {(result: *) => string} [config.mapActual] The function to get a value to test against `expected` mask property from results returned by `getResults`.
 * @param {(actual: *, expected: !Object<string, *>) => (!Promise|undefined)} [config.assertResults] A possibly async function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask's result (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 */
function makeTestSuite(path, config) {
  return mask(path, config)
}

module.exports = makeTestSuite

/**
 * @typedef {import('../types').MaskConfig} _contextTesting.MaskConfig
 */