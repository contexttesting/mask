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
 * @typedef {{ context: (function(new: _contextTesting.Context)|Array<function(new: _contextTesting.Context)>|*|undefined), persistentContext: (function(new: _contextTesting.Context)|Array<function(new: _contextTesting.Context)>|*|undefined), getResults: (function(this:_contextTesting.MaskContext, ..._contextTesting.Context): *|!Promise|undefined), getTransform: (function(this:_contextTesting.MaskContext, ..._contextTesting.Context): stream.Transform|!Promise<!stream.Transform>|undefined), getReadable: (function(this:_contextTesting.MaskContext, ..._contextTesting.Context): stream.Readable|Promise<stream.Readable>|undefined), fork: (string|_contextTesting.ForkConfig|undefined), getThrowsConfig: (function (this:_contextTesting.MaskContext, ..._contextTesting.Context): _assertThrows.Config|undefined), mapActual: (function(*): string|undefined), assertResults: (function(*, Object<string, *>): !Promise|undefined|undefined), jsonProps: (!Array<string>|undefined), splitRe: (!RegExp|undefined), propStartRe: (!RegExp|undefined), propEndRe: (!RegExp|undefined) }}
 */
_contextTesting.MaskConfig
