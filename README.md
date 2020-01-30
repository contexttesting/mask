# @zoroaster/mask

[![npm version](https://badge.fury.io/js/%40zoroaster%2Fmask.svg)](https://www.npmjs.com/package/@zoroaster/mask)

`@zoroaster/mask` is The Code For _Zoroaster_ Mask Testing.

```sh
yarn add -D @zoroaster/mask
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`makeTestSuite(path: string, config: MaskConfig): TestSuite`](#maketestsuitepath-stringconfig-maskconfig-testsuite)
- [Types](#types)
  * [`MaskContext`](#type-maskcontext)
  * [`MaskConfig`](#type-maskconfig)
- [Testing Forks](#testing-forks)
  * [`ForkConfig`](#type-forkconfig)
  * [`Preprocessor`](#type-preprocessor)
  * [`ForkPreprocessor`](#type-forkpreprocessor)
- [Enabling JSDoc](#enabling-jsdoc)
- [Copyright & License](#copyright--license)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function:

```js
import makeTestSuite from '@zoroaster/mask'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>


## <code><ins>makeTestSuite</ins>(</code><sub><br/>&nbsp;&nbsp;`path: string,`<br/>&nbsp;&nbsp;`config: MaskConfig,`<br/></sub><code>): <i>TestSuite</i></code>
Creates a new test suite based on the config. The test suite should be exported from JS files, either as default, or named exports.

 - <kbd><strong>path*</strong></kbd> <em>`string`</em>: The path to the mask result file or directory.
 - <kbd><strong>config*</strong></kbd> <em><code><a href="#type-maskconfig" title="Configuration for making test suites.">MaskConfig</a></code></em>: Configuration for making test suites.

Creates a test suite that can be exported to run with _Zoroaster_ Context-Testing Framework. The simplest form of a mask is to use the `getResults` property, which acts as a template for test cases, which will receive the inputs (e.g., `input`) from the mask result as properties of the `this` context, and the contexts via the arguments. The output will be compared to the `expected` property of the mask.

_For example, given the following function:_

```js
import read from '@wrote/read'

/**
 * An example function that reads a file.
 * @param {string} path The path to the file to read.
 * @param {string} input The string to prepend.
 */
const fn = async (path, input) => {
  const res = await read(path)
  return `${input}: ${res}`
}

export default fn
```

_Zoroaster can test it using a mask:_

<table>
<tr><th>Mask</th><th>Mask Result</th></tr>
<tr><td>

```js
/* yarn example/ */
import makeTestSuite from '@zoroaster/mask'
import fn from '../../src'

class Context {
  /**
   * Returns the path to the fixture.
   */
  get fixture() { return 'example/test/fixture/test.txt' }
}

export default makeTestSuite('example/test/result', {
  context: Context,
  /**
   * @param {Context} t
   */
  async getResults({ fixture }) {
    const res = await fn(fixture, this.input)
    return res
  },
})
```
</td><td>

```markdown
## runs the test
hello world

/* expected */
hello world: this is a test
/**/

## fails the test
hello world

/* expected */
not hello world: this is a test
/**/
```
</td></tr>
</table>

```
example/test/mask/default.js
  ✓  runs the test
not hello world: this is a test
  ✗  fails the test
  | Error: 'hello world: this is a test' == 'not hello world: this is a test'
  |     at fails the test (example/test/result/default.md:8:1)

example/test/mask/default.js > fails the test
  Error: 'hello world: this is a test' == 'not hello world: this is a test'
      at fails the test (example/test/result/default.md:8:1)

🦅  Executed 2 tests: 1 error.
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## Types

The following types are used to define the configuration of the mask.

__<a name="type-maskcontext">`MaskContext`</a>__: The `this` context of mask methods which contains the mask's properties extracted from the result file.


|    Name    |      Type       |                                                                                 Description                                                                                 |
| ---------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| __input*__ | <em>*</em>      | The input to the mask, normally as string, but parsed into an object if `jsonProps` contains the `'input'` value.                                                           |
| preamble   | <em>string</em> | The text at the top of the mask result file if present.                                                                                                                     |
| inputs     | <em>string</em> | The synchronous inputs for the fork, each on a new line in form of `question: answer`. This is not hard-coded, it's just a convention for naming the inputs to forks field. |


__<a name="type-maskconfig">`MaskConfig`</a>__: Configuration for making test suites.


|       Name        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |                                                                                                                                                                                                            Description                                                                                                                                                                                                             |   Default    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| context           | <em>(function(new: <a href="https://github.com/contexttesting/fork#type-context" title="A context made with a constructor.">Context</a>) \| !Array&lt;function(new: <a href="https://github.com/contexttesting/fork#type-context" title="A context made with a constructor.">Context</a>)&gt; \| *)</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | The single or multiple context constructors or objects to initialise for each test.                                                                                                                                                                                                                                                                                                                                                | -            |
| persistentContext | <em>(function(new: <a href="https://github.com/contexttesting/fork#type-context" title="A context made with a constructor.">Context</a>) \| !Array&lt;function(new: <a href="https://github.com/contexttesting/fork#type-context" title="A context made with a constructor.">Context</a>)&gt; \| *)</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | The context constructor(s) that will be initialised and destroyed once per test suite, having a persistent state across tests.                                                                                                                                                                                                                                                                                                     | -            |
| fork              | <em>(string \| <a href="#type-forkconfig" title="Parameters for forking.">!ForkConfig</a>)</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | The path to the module to fork with the mask's input split by whitespace as arguments, output of which will be compared against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started. | -            |
| jsonProps         | <em>!Array&lt;string&gt;</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | The properties of the mask to parse as _JSON_ values.                                                                                                                                                                                                                                                                                                                                                                              | -            |
| jsProps           | <em>!Array&lt;string&gt;</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | The properties of the mask to parse into JavaScript objects. For example, a property can be written as `{ config: true }` and will be evaluated into an object.                                                                                                                                                                                                                                                                    | -            |
| splitRe           | <em>!RegExp</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.                                                                                                                                                                                                    | -            |
| propStartRe       | <em>!RegExp</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | The regex to detect the start of the property, e.g., in `/⁎ propName ⁎/` it is the default regex that detects `/⁎`. There's no option to define the end of the regex after the name. [If copying, replace `⁎` with `*`].                                                                                                                                                                                                           | `\/\‎⁎`      |
| propEndRe         | <em>!RegExp</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | The regex which indicates the end of the property, e.g, in `/⁎ propName ⁎/ some prop value /⁎⁎/` it is the default that detects `/⁎⁎/`. [If copying, replace `⁎` with `*`].                                                                                                                                                                                                                                                        | `/\/\⁎\⁎\//` |
| getResults        | <em>(this: <a href="#type-maskcontext" title="The `this` context of mask methods which contains the mask's properties extracted from the result file.">MaskContext</a>, ...args: <a href="https://github.com/contexttesting/fork#type-context" title="A context made with a constructor.">Context</a>[]) => (* \| !Promise)</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | A possibly async function which returns results of a test. If it outputs a string, it will be compared against the `expected` property of the mask using string comparison. If it outputs an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`. Otherwise, the result must be mapped for comparison with `expected` using the `mapActual` method.                                  | -            |
| getTransform      | <em>(this: <a href="#type-maskcontext" title="The `this` context of mask methods which contains the mask's properties extracted from the result file.">MaskContext</a>, ...args: <a href="https://github.com/contexttesting/fork#type-context" title="A context made with a constructor.">Context</a>[]) => !(<a href="https://nodejs.org/api/stream.html#stream_class_stream_transform" title="A duplex stream that receives data as Writable, transforms this data, and pushes it as Readable via the `transform` method implementation."><img src=".documentary/type-icons/node-even.png" alt="Node.JS Docs">stream.Transform</a> \| Promise&lt;<a href="https://nodejs.org/api/stream.html#stream_class_stream_transform" title="A duplex stream that receives data as Writable, transforms this data, and pushes it as Readable via the `transform` method implementation."><img src=".documentary/type-icons/node-even.png" alt="Node.JS Docs">!stream.Transform</a>&gt;)</em> | A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask's result. Its output will be accumulated and compared against the expected output of the mask.                                                                                                                                                                                                                       | -            |
| getReadable       | <em>(this: <a href="#type-maskcontext" title="The `this` context of mask methods which contains the mask's properties extracted from the result file.">MaskContext</a>, ...args: <a href="https://github.com/contexttesting/fork#type-context" title="A context made with a constructor.">Context</a>[]) => !(<a href="https://nodejs.org/api/stream.html#stream_class_stream_readable" title="A stream that emits data (an external source of data that pushes new chunks as they are ready)."><img src=".documentary/type-icons/node-odd.png" alt="Node.JS Docs">stream.Readable</a> \| Promise&lt;<a href="https://nodejs.org/api/stream.html#stream_class_stream_readable" title="A stream that emits data (an external source of data that pushes new chunks as they are ready)."><img src=".documentary/type-icons/node-odd.png" alt="Node.JS Docs">!stream.Readable</a>&gt;)</em>                                                                                             | A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask.                                                                                                                                                                                                                                    | -            |
| getThrowsConfig   | <em>(this: <a href="#type-maskcontext" title="The `this` context of mask methods which contains the mask's properties extracted from the result file.">MaskContext</a>, ...args: <a href="https://github.com/contexttesting/fork#type-context" title="A context made with a constructor.">Context</a>[]) => _assertThrows.Config</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.                                                                                                                                                                                                                                                              | -            |
| mapActual         | <em>(result: *) => string</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | The function to get a value to test against `expected` mask property from results returned by `getResults`.                                                                                                                                                                                                                                                                                                                        | -            |
| assertResults     | <em>(actual: *, expected: !Object&lt;string, *&gt;) => (!Promise \| undefined)</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | A possibly async function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask's result (where `jsonProps` are parsed into JS objects) will be passed as arguments.                                                                                                                                                                               | -            |

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## Testing Forks

With masks, it is very easy to test fork processes.

__<a name="type-forkconfig">`ForkConfig`</a>__: Parameters for forking.


|      Name      |                                                                                                                                                                                                                                                            Type                                                                                                                                                                                                                                                            |                                                                                                   Description                                                                                                    | Default |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| __module*__    | <em>string</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | The path to the module to fork.                                                                                                                                                                                  | -       |
| options        | <em><a href="https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options" title="Options to fork a child process with. Allows to set cwd, environment variables, etc."><img src=".documentary/type-icons/node-even.png" alt="Node.JS Docs">!child_process.ForkOptions</a></em>                                                                                                                                                                                                      | Options for the forked processed, such as `ENV` and `cwd`.                                                                                                                                                       | -       |
| inputs         | <em>!Array&lt;!Array&lt;(!RegExp \| string)&gt;&gt;</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data, e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`. | -       |
| stderrInputs   | <em>!Array&lt;!Array&lt;(!RegExp \| string)&gt;&gt;</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`), e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.                                                                           | -       |
| log            | <em>(boolean \| { stderr: !(<a href="https://nodejs.org/api/stream.html#stream_class_stream_writable" title="A stream that can be written data to."><img src=".documentary/type-icons/node-odd.png" alt="Node.JS Docs">stream.Writable</a> \| NodeJS.WriteStream), stdout: !(<a href="https://nodejs.org/api/stream.html#stream_class_stream_writable" title="A stream that can be written data to."><img src=".documentary/type-icons/node-odd.png" alt="Node.JS Docs">stream.Writable</a> \| NodeJS.WriteStream) })</em> | Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties.                            | `false` |
| includeAnswers | <em>boolean</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Whether to add the answers to the `stderr` and `stdout` output.                                                                                                                                                  | `true`  |
| stripAnsi      | <em>boolean</em>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result.                                                                                                                     | `true`  |
| preprocess     | <em>(<a href="#type-preprocessor" title="The function which processes fork's outputs before returning them for asserts.">Preprocessor</a> \| <a href="#type-forkpreprocessor" title="An object with `stdout` and `stderr` preprocessors.">ForkPreprocessor</a>)</em>                                                                                                                                                                                                                                                       | The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.                                              | -       |
| getArgs        | <em>(this: Object, forkArgs: !Array&lt;string&gt;, ...contexts: <a href="https://github.com/contexttesting/fork#type-context" title="A context made with a constructor.">Context</a>[]) => !(Array&lt;string&gt; \| Promise&lt;!Array&lt;string&gt;&gt;)</em>                                                                                                                                                                                                                                                              | The function to extend arguments to pass the fork based on the parsed mask input and contexts. The `this` context is set to the passed properties.                                                               | -       |
| getOptions     | <em>(this: Object, ...contexts: <a href="https://github.com/contexttesting/fork#type-context" title="A context made with a constructor.">Context</a>[]) => <a href="https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options" title="Options to fork a child process with. Allows to set cwd, environment variables, etc."><img src=".documentary/type-icons/node-even.png" alt="Node.JS Docs">!child_process.ForkOptions</a></em>                                               | The function to get options for the fork, such as `ENV` and `cwd`, based on contexts. The `this` context is set to the passed properties.                                                                        | -       |


`function(string): string` __<a name="type-preprocessor">`Preprocessor`</a>__: The function which processes fork's outputs before returning them for asserts.


__<a name="type-forkpreprocessor">`ForkPreprocessor`</a>__: An object with `stdout` and `stderr` preprocessors.


|  Name  |                Type                 |                                              Description                                               |
| ------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| stdout | <em>(stdout: string) => string</em> | How to process `stdout` before asserts.                                                                |
| stderr | <em>(stdout: string) => string</em> | How to process `stderr` before asserts, for example, you can strip `\r` symbols with `clearr` package. |

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true">
</a></p>

## Enabling JSDoc

The JSDoc for contexts can be enabled by specifying types for the params to the functions.

![Zoroaster Mask JSDoc Contexts](doc/context.gif)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true">
</a></p>

## Copyright & License

GNU Affero General Public License v3.0

<table>
  <tr>
    <th>
      <a href="https://www.artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://www.artd.eco">Art Deco™</a> for <a href="https://www.contexttesting.com">ContextTesting</a> 2020</th>
    <th>
      <a href="https://www.contexttesting.com">
        <img src="https://avatars1.githubusercontent.com/u/44418436?s=100&amp;v=4" width="100"
          alt="ContextTesting">
      </a>
    </th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>