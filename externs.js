/* typal types/index.xml */
/** @const */
var _contextTesting = {}
/**
 * The `this` context of mask methods which contains the mask's properties extracted from the result file.
 * @typedef {{ input: *, preamble: (string|undefined) }}
 */
_contextTesting.MaskContext
/**
 * Configuration for making test suites.
 * @record
 */
_contextTesting.MaskConfig
/**
 * The single or multiple context constructors or objects to initialise for each test.
 * @type {(function(new: _contextTesting.Context)|Array<function(new: _contextTesting.Context)>|*|undefined)}
 */
_contextTesting.MaskConfig.prototype.context
/**
 * The context constructor(s) that will be initialised and destroyed once per test suite, having a persistent state across tests.
 * @type {(function(new: _contextTesting.Context)|Array<function(new: _contextTesting.Context)>|*|undefined)}
 */
_contextTesting.MaskConfig.prototype.persistentContext
/**
 * A possibly async function which returns results of a test. If it outputs a string, it will be compared against the `expected` property of the mask using string comparison. If it outputs an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`. Otherwise, the result must be mapped for comparison with `expected` using the `mapActual` method.
 * @type {(function(this:_contextTesting.MaskContext, ..._contextTesting.Context): *|!Promise|undefined)}
 */
_contextTesting.MaskConfig.prototype.getResults
/**
 * A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask's result. Its output will be accumulated and compared against the expected output of the mask.
 * @type {(function(this:_contextTesting.MaskContext, ..._contextTesting.Context): stream.Transform|!Promise<!stream.Transform>|undefined)}
 */
_contextTesting.MaskConfig.prototype.getTransform
/**
 * A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask.
 * @type {(function(this:_contextTesting.MaskContext, ..._contextTesting.Context): stream.Readable|Promise<stream.Readable>|undefined)}
 */
_contextTesting.MaskConfig.prototype.getReadable
/**
 * The path to the module to fork with the mask's input split by whitespace as arguments, output of which will be compared against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started.
 * @type {(string|_contextTesting.ForkConfig|undefined)}
 */
_contextTesting.MaskConfig.prototype.fork
/**
 * A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.
 * @type {(function (this:_contextTesting.MaskContext, ..._contextTesting.Context): _assertThrows.Config|undefined)}
 */
_contextTesting.MaskConfig.prototype.getThrowsConfig
/**
 * The function to get a value to test against `expected` mask property from results returned by `getResults`.
 * @type {(function(*): string|undefined)}
 */
_contextTesting.MaskConfig.prototype.mapActual
/**
 * A possibly async function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask's result (where `jsonProps` are parsed into JS objects) will be passed as arguments.
 * @type {(function(*, Object<string, *>): !Promise|undefined|undefined)}
 */
_contextTesting.MaskConfig.prototype.assertResults
/**
 * The properties of the mask to parse as _JSON_ values.
 * @type {(!Array<string>|undefined)}
 */
_contextTesting.MaskConfig.prototype.jsonProps
/**
 * A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.
 * @type {(!RegExp|undefined)}
 */
_contextTesting.MaskConfig.prototype.splitRe
/**
 * The regex to detect the start of the property, e.g., in `/⁎ propName ⁎/` it is the default regex that detects `/⁎`. There's no option to define the end of the regex after the name. [If copying, replace `⁎` with `*`]. Default `\/\‎⁎`.
 * @type {(!RegExp|undefined)}
 */
_contextTesting.MaskConfig.prototype.propStartRe
/**
 * The regex which indicates the end of the property, e.g, in `/⁎ propName ⁎/ some prop value /⁎⁎/` it is the default that detects `/⁎⁎/`. [If copying, replace `⁎` with `*`]. Default `/\/\⁎\⁎\//`.
 * @type {(!RegExp|undefined)}
 */
_contextTesting.MaskConfig.prototype.propEndRe
