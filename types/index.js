export {}

// START VENDOR
// (VSCode has a bug which does not allow to import through separate files)

/* typal node_modules/assert-throws/types/index.xml noSuppress */
/**
 * @typedef {_assertThrows.Assertion} Assertion An assertion to perform.
 */
/**
 * @typedef {!(string|RegExp|!Function)} _assertThrows.Assertion An assertion to perform.
 */
/**
 * @typedef {_assertThrows.Config} Config Parameters to the `assert-throws` method.
 */
/**
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

/* typal node_modules/@zoroaster/fork/types/index.xml noSuppress */
/**
 * @typedef {_contextTesting.ForkConfig} ForkConfig Parameters for forking.
 */
/**
 * @typedef {Object} _contextTesting.ForkConfig Parameters for forking.
 * @prop {string} module The path to the module to fork.
 * @prop {(function(this: *, !Array<string>, ..._contextTesting.Context): !Array<string>|!Promise<!Array<string>>)} [getArgs] The function to get arguments to pass the fork based on the parsed mask input and contexts. The `this` context is set to the passed properties.
 * @prop {(function(this: *, ..._contextTesting.Context): !child_process.ForkOptions)} [getOptions] The function to get options for the fork, such as `ENV` and `cwd`, based on contexts. The `this` context is set to the passed properties.
 * @prop {!child_process.ForkOptions} [options] Options for the forked processed, such as `ENV` and `cwd`.
 * @prop {!Array<!Array<(!RegExp|string)>>} [inputs] Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data, e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @prop {!Array<!Array<(!RegExp|string)>>} [stderrInputs] Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`), e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.
 * @prop {boolean|{stderr: !(stream.Writable|NodeJS.WriteStream), stdout: !(stream.Writable|NodeJS.WriteStream)}} [log=false] Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties. Default `false`.
 * @prop {boolean} [includeAnswers=true] Whether to add the answers to the `stderr` and `stdout` output. Default `true`.
 * @prop {boolean} [stripAnsi=true] Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result. Default `true`.
 * @prop {(_contextTesting.Preprocessor|_contextTesting.ForkPreprocessor)} [preprocess] The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.
 */
/**
 * @typedef {_contextTesting.Preprocessor} Preprocessor The function which processes fork's outputs before returning them for asserts.
 */
/**
 * @typedef {function(string): string} _contextTesting.Preprocessor The function which processes fork's outputs before returning them for asserts.
 */
/**
 * @typedef {_contextTesting.ForkPreprocessor} ForkPreprocessor An object with `stdout` and `stderr` preprocessors.
 */
/**
 * @typedef {Object} _contextTesting.ForkPreprocessor An object with `stdout` and `stderr` preprocessors.
 * @prop {_contextTesting.Preprocessor} [stdout] How to process `stdout` before asserts.
 * @prop {_contextTesting.Preprocessor} [stderr] How to process `stderr` before asserts.
 */
/**
 * @typedef {import('child_process').ForkOptions} child_process.ForkOptions
 */

/* typal node_modules/@zoroaster/fork/types/context.xml noSuppress */
/**
 * @typedef {_contextTesting.Context} Context A context made with a constructor.
 */
/**
 * @typedef {Object} _contextTesting.Context A context made with a constructor.
 * @prop {function(): !Promise|void} [_init] The function to initialise the context.
 * @prop {function(): !Promise|void} [_destroy] The function to destroy the context.
 */

/**
 * @typedef {import('stream').Writable} stream.Writable
 */



// END VENDOR



/* typal types/index.xml noSuppress ignore:_assertThrows.Config,_contextTesting.Context,_contextTesting.ForkConfig  */
/**
 * @typedef {_contextTesting.MaskContext} MaskContext The `this` context of mask methods which contains the mask's properties extracted from the result file.
 */
/**
 * @typedef {Object} _contextTesting.MaskContext The `this` context of mask methods which contains the mask's properties extracted from the result file.
 * @prop {*} input The input to the mask, normally as string, but parsed into an object if `jsonProps` contains the `'input'` value.
 * @prop {string} [preamble] The text at the top of the mask result file if present.
 * @prop {string} [inputs] The synchronous inputs for the fork, each on a new line in form of `question: answer`.
 */
/**
 * @typedef {_contextTesting.MaskConfig} MaskConfig Configuration for making test suites.
 */
/**
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
 * @prop {!RegExp} [splitRe] A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.
 * @prop {!RegExp} [propStartRe="\/\‎⁎"] The regex to detect the start of the property, e.g., in `/⁎ propName ⁎/` it is the default regex that detects `/⁎`. There's no option to define the end of the regex after the name. [If copying, replace `⁎` with `*`]. Default `\/\‎⁎`.
 * @prop {!RegExp} [propEndRe="/\/\⁎\⁎\//"] The regex which indicates the end of the property, e.g, in `/⁎ propName ⁎/ some prop value /⁎⁎/` it is the default that detects `/⁎⁎/`. [If copying, replace `⁎` with `*`]. Default `/\/\⁎\⁎\//`.
 */
/**
 * @typedef {import('stream').Transform} stream.Transform
 */
/**
 * @typedef {import('stream').Readable} stream.Readable
 */