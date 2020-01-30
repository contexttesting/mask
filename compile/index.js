const mask = require('./depack')

/**
 * Creates a new test suite based on the config. The test suite should be exported from JS files, either as a default, or named export.
 * @param {(string|!Array<string>)} path The path to the mask result file or directory. Can also pass an array of paths.
 * @param {_contextTesting.MaskConfig} config Configuration for making test suites.
 * @param {function(new: _contextTesting.Context)|!Array<function(new: _contextTesting.Context)>|*} [config.context] The single or multiple context constructors or objects to initialise for each test.
 * @param {function(new: _contextTesting.Context)|!Array<function(new: _contextTesting.Context)>|*} [config.persistentContext] The context constructor(s) that will be initialised and destroyed once per test suite, having a persistent state across tests.
 * @param {string|!_contextTesting.ForkConfig} [config.fork] The path to the module to fork with the mask's input split by whitespace as arguments, output of which will be compared against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started.
 * @param {!Array<string>} [config.jsonProps] The properties of the mask to parse as _JSON_ values.
 * @param {!Array<string>} [config.jsProps] The properties of the mask to parse into JavaScript objects. For example, a property can be written as `{ config: true }` and will be evaluated into an object.
 * @param {!RegExp} [config.splitRe] A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.
 * @param {!RegExp} [config.propStartRe="\/\‎⁎"] The regex to detect the start of the property, e.g., in `/⁎ propName ⁎/` it is the default regex that detects `/⁎`. There's no option to define the end of the regex after the name. [If copying, replace `⁎` with `*`]. Default `\/\‎⁎`.
 * @param {!RegExp} [config.propEndRe="/\/\⁎\⁎\//"] The regex which indicates the end of the property, e.g, in `/⁎ propName ⁎/ some prop value /⁎⁎/` it is the default that detects `/⁎⁎/`. [If copying, replace `⁎` with `*`]. Default `/\/\⁎\⁎\//`.
 * @param {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context[]) => (*|!Promise)} [config.getResults] A possibly async function which returns results of a test. If it outputs a string, it will be compared against the `expected` property of the mask using string comparison. If it outputs an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`. Otherwise, the result must be mapped for comparison with `expected` using the `mapActual` method.
 * @param {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context[]) => !(stream.Transform|Promise<!stream.Transform>)} [config.getTransform] A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask's result. Its output will be accumulated and compared against the expected output of the mask.
 * @param {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context[]) => !(stream.Readable|Promise<!stream.Readable>)} [config.getReadable] A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask.
 * @param {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context[]) => _assertThrows.Config} [config.getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @param {(result: *) => string} [config.mapActual] The function to get a value to test against `expected` mask property from results returned by `getResults`.
 * @param {(actual: *, expected: !Object<string, *>) => (!Promise|undefined)} [config.assertResults] A possibly async function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask's result (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 * @return {_contextTesting.TestSuite}
 */
function makeTestSuite(path, config) {
  return mask(path, config)
}

module.exports = makeTestSuite

/* typal types/index.xml namespace */
/**
 * @typedef {import('stream').Transform} stream.Transform
 * @typedef {import('stream').Readable} stream.Readable
 * @typedef {_contextTesting.MaskContext} MaskContext The `this` context of mask methods which contains the mask's properties extracted from the result file.
 * @typedef {Object} _contextTesting.MaskContext The `this` context of mask methods which contains the mask's properties extracted from the result file.
 * @prop {*} input The input to the mask, normally as string, but parsed into an object if `jsonProps` contains the `'input'` value.
 * @prop {string} [preamble] The text at the top of the mask result file if present.
 * @prop {string} [inputs] The synchronous inputs for the fork, each on a new line in form of `question: answer`. This is not hard-coded, it's just a convention for naming the inputs to forks field.
 * @typedef {_contextTesting.MaskConfig} MaskConfig `＠record` Configuration for making test suites.
 * @typedef {Object} _contextTesting.MaskConfig `＠record` Configuration for making test suites.
 * @prop {function(new: _contextTesting.Context)|!Array<function(new: _contextTesting.Context)>|*} [context] The single or multiple context constructors or objects to initialise for each test.
 * @prop {function(new: _contextTesting.Context)|!Array<function(new: _contextTesting.Context)>|*} [persistentContext] The context constructor(s) that will be initialised and destroyed once per test suite, having a persistent state across tests.
 * @prop {string|!_contextTesting.ForkConfig} [fork] The path to the module to fork with the mask's input split by whitespace as arguments, output of which will be compared against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started.
 * @prop {!Array<string>} [jsonProps] The properties of the mask to parse as _JSON_ values.
 * @prop {!Array<string>} [jsProps] The properties of the mask to parse into JavaScript objects. For example, a property can be written as `{ config: true }` and will be evaluated into an object.
 * @prop {!RegExp} [splitRe] A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.
 * @prop {!RegExp} [propStartRe="\/\‎⁎"] The regex to detect the start of the property, e.g., in `/⁎ propName ⁎/` it is the default regex that detects `/⁎`. There's no option to define the end of the regex after the name. [If copying, replace `⁎` with `*`]. Default `\/\‎⁎`.
 * @prop {!RegExp} [propEndRe="/\/\⁎\⁎\//"] The regex which indicates the end of the property, e.g, in `/⁎ propName ⁎/ some prop value /⁎⁎/` it is the default that detects `/⁎⁎/`. [If copying, replace `⁎` with `*`]. Default `/\/\⁎\⁎\//`.
 * @prop {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context[]) => (*|!Promise)} [getResults] A possibly async function which returns results of a test. If it outputs a string, it will be compared against the `expected` property of the mask using string comparison. If it outputs an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`. Otherwise, the result must be mapped for comparison with `expected` using the `mapActual` method.
 * @prop {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context[]) => !(stream.Transform|Promise<!stream.Transform>)} [getTransform] A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask's result. Its output will be accumulated and compared against the expected output of the mask.
 * @prop {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context[]) => !(stream.Readable|Promise<!stream.Readable>)} [getReadable] A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask.
 * @prop {(this: _contextTesting.MaskContext, ...args: _contextTesting.Context[]) => _assertThrows.Config} [getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @prop {(result: *) => string} [mapActual] The function to get a value to test against `expected` mask property from results returned by `getResults`.
 * @prop {(actual: *, expected: !Object<string, *>) => (!Promise|undefined)} [assertResults] A possibly async function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask's result (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 */
/* typal-embed node_modules/assert-throws/types/index.xml namespace */
/**
 * @typedef {_assertThrows.Assertion} Assertion An assertion to perform.
 * @typedef {!(string|RegExp|!Function)} _assertThrows.Assertion An assertion to perform.
 * @typedef {_assertThrows.Config} Config Parameters to the `assert-throws` method.
 * @typedef {Object} _assertThrows.Config Parameters to the `assert-throws` method.
 * @prop {!Function} fn The function to test, either sync or async.
 * @prop {*|!Array<*>} [args] The arguments or single argument to pass to the function.
 * @prop {*} [context] The context in which to execute the function. Global context will be set by default.
 * @prop {_assertThrows.Assertion} [message] A string, regex, or function to test the message.
 * @prop {_assertThrows.Assertion} [code] A string, regex, or function to test the code.
 * @prop {_assertThrows.Assertion} [stack] A string, regex, or function to test the stack.
 * @prop {_assertThrows.Assertion} [prop] A string, regex, or function to test any other property of the error.
 * @prop {Error} [error] An error to perform strict comparison against.
 */
/* typal-embed node_modules/@zoroaster/fork/types/index.xml namespace */
/**
 * @typedef {import('child_process').ForkOptions} child_process.ForkOptions
 * @typedef {import('stream').Writable} stream.Writable
 * @typedef {_contextTesting.ForkConfig} ForkConfig `＠record` Parameters for forking.
 * @typedef {Object} _contextTesting.ForkConfig `＠record` Parameters for forking.
 * @prop {string} module The path to the module to fork.
 * @prop {!child_process.ForkOptions} [options] Options for the forked processed, such as `ENV` and `cwd`.
 * @prop {Array<[RegExp, string]>} [inputs] Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data, e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @prop {Array<[RegExp, string]>} [stderrInputs] Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`), e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @prop {boolean|{stderr: !(stream.Writable|NodeJS.WriteStream), stdout: !(stream.Writable|NodeJS.WriteStream)}} [log=false] Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties. Default `false`.
 * @prop {boolean} [includeAnswers=true] Whether to add the answers to the `stderr` and `stdout` output. Default `true`.
 * @prop {boolean} [stripAnsi=true] Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result. Default `true`.
 * @prop {(_contextTesting.Preprocessor|_contextTesting.ForkPreprocessor)} [preprocess] The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.
 * @prop {(this: Object, forkArgs: !Array<string>, ...contexts: _contextTesting.Context[]) => !(Array<string>|Promise<!Array<string>>)} [getArgs] The function to extend arguments to pass the fork based on the parsed mask input and contexts. The `this` context is set to the passed properties.
 * @prop {(this: Object, ...contexts: _contextTesting.Context[]) => !child_process.ForkOptions} [getOptions] The function to get options for the fork, such as `ENV` and `cwd`, based on contexts. The `this` context is set to the passed properties.
 * @typedef {_contextTesting.Preprocessor} Preprocessor The function which processes fork's outputs before returning them for asserts.
 * @typedef {function(string): string} _contextTesting.Preprocessor The function which processes fork's outputs before returning them for asserts.
 * @typedef {_contextTesting.ForkPreprocessor} ForkPreprocessor `＠record` An object with `stdout` and `stderr` preprocessors.
 * @typedef {Object} _contextTesting.ForkPreprocessor `＠record` An object with `stdout` and `stderr` preprocessors.
 * @prop {(stdout: string) => string} [stdout] How to process `stdout` before asserts.
 * @prop {(stdout: string) => string} [stderr] How to process `stderr` before asserts, for example, you can strip `\r` symbols with `clearr` package.
 */
/* typal-embed node_modules/@zoroaster/fork/types/context.xml namespace */
/**
 * @typedef {_contextTesting.Context} Context A context made with a constructor.
 * @typedef {Object} _contextTesting.Context A context made with a constructor.
 * @prop {() => (!Promise|void)} [_init] The function to initialise the context.
 * @prop {() => (!Promise|void)} [_destroy] The function to destroy the context.
 */
