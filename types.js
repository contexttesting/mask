export {}

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
 * @prop {function(new: _contextTesting.Context)|Array<function(new: _contextTesting.Context)>|*} [context] The single or multiple context constructors or objects to initialise for each test.
 * @prop {function(new: _contextTesting.Context)|Array<function(new: _contextTesting.Context)>|*} [persistentContext] The context constructor(s) that will be initialised and destroyed once per test suite, having a persistent state across tests.
 * @prop {function(this:_contextTesting.MaskContext, ..._contextTesting.Context): *|!Promise} [getResults] A possibly async function which returns results of a test. If it outputs a string, it will be compared against the `expected` property of the mask using string comparison. If it outputs an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`. Otherwise, the result must be mapped for comparison with `expected` using the `mapActual` method.
 * @prop {function(this:_contextTesting.MaskContext, ..._contextTesting.Context): stream.Transform|!Promise<!stream.Transform>} [getTransform] A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask's result. Its output will be accumulated and compared against the expected output of the mask.
 * @prop {function(this:_contextTesting.MaskContext, ..._contextTesting.Context): stream.Readable|Promise<stream.Readable>} [getReadable] A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask.
 * @prop {string|_contextTesting.ForkConfig} [fork] The path to the module to fork with the mask's input split by whitespace as arguments, output of which will be compared against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started.
 * @prop {function (this:_contextTesting.MaskContext, ..._contextTesting.Context): _assertThrows.Config} [getThrowsConfig] A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @prop {function(*): string} [mapActual] The function to get a value to test against `expected` mask property from results returned by `getResults`.
 * @prop {function(*, Object<string, *>): !Promise|undefined} [assertResults] A possibly async function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask's result (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 * @prop {!Array<string>} [jsonProps] The properties of the mask to parse as _JSON_ values.
 * @prop {!RegExp} [splitRe="/^\/\/ /gm` or `/^## /gm"] A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.
 * @prop {!RegExp} [propStartRe="\/\‎⁎"] The regex to detect the start of the property, e.g., in `/⁎ propName ⁎/` it is the default regex that detects `/⁎`. There's no option to define the end of the regex after the name. [If copying, replace `⁎` with `*`]. Default `\/\‎⁎`.
 * @prop {!RegExp} [propEndRe="/\/\⁎\⁎\//"] The regex which indicates the end of the property, e.g, in `/⁎ propName ⁎/ some prop value /⁎⁎/` it is the default that detects `/⁎⁎/`. [If copying, replace `⁎` with `*`]. Default `/\/\⁎\⁎\//`.
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
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@zoroaster/fork').Context} _contextTesting.Context
 */
