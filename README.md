# @zoroaster/mask

[![npm version](https://badge.fury.io/js/%40zoroaster%2Fmask.svg)](https://npmjs.org/package/@zoroaster/mask)

`@zoroaster/mask` is The Code For _Zoroaster_ Mask Testing.

```sh
yarn add -D @zoroaster/mask
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`makeTestSuite(result: string, config: MakeTestSuiteConf): TestSuite`](#maketestsuiteresult-stringconfig-maketestsuiteconf-testsuite)
- [Types](#types)
  * [`MaskContext`](#type-maskcontext)
  * [`MaskConfig`](#type-maskconfig)
- [Testing Forks](#testing-forks)
  * [`ForkConfig`](#type-forkconfig)
  * [`Preprocessor`](#type-preprocessor)
  * [`ForkPreprocessor`](#type-forkpreprocessor)
- [Enabling JSDoc](#enabling-jsdoc)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import makeTestSuite from '@zoroaster/mask'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `makeTestSuite(`<br/>&nbsp;&nbsp;`result: string,`<br/>&nbsp;&nbsp;`config: MakeTestSuiteConf,`<br/>`): TestSuite`

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

_Zoroastser can test it using a mask:_

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

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Types

The following types are used to define the configuration of the mask.

[`import('stream').Transform`](https://nodejs.org/api/stream.html#stream_class_stream_transform) __<a name="type-streamtransform">`stream.Transform`</a>__

[`import('stream').Readable`](https://nodejs.org/api/stream.html#stream_class_stream_readable) __<a name="type-streamreadable">`stream.Readable`</a>__

[`import('assert-throws').Config`](https://github.com/artdecocode/assert-throws#type-_assertthrowsconfig) __<a name="type-_assertthrowsconfig">`_assertThrows.Config`</a>__

[`import('@zoroaster/fork/types').Context`](https://github.com/contexttesting/fork#type-forkconfig) __<a name="type-context">`Context`</a>__: A context instance to pass to the tests.

[`import('@zoroaster/fork/types').ForkConfig`](https://github.com/contexttesting/fork#type-forkconfig) __<a name="type-forkconfig">`ForkConfig`</a>__: The configuration of the fork.

__<a name="type-maskcontext">`MaskContext`</a>__: The `this` context of mask methods which contains the mask's properties extracted from the result file.

|    Name    |      Type       |                                                    Description                                                    |
| ---------- | --------------- | ----------------------------------------------------------------------------------------------------------------- |
| __input*__ | <em>*</em>      | The input to the mask, normally as string, but parsed into an object if `jsonProps` contains the `'input'` value. |
| preamble   | <em>string</em> | The text at the top of the mask result file if present.                                                           |
| inputs     | <em>string</em> | The synchronous inputs for the fork, each on a new line in form of `question: answer`.                            |

__<a name="type-maskconfig">`MaskConfig`</a>__: Configuration for making test suites.

|       Name        |                                                                                                                                                                                           Type                                                                                                                                                                                           |                                                                                                                                                                                                            Description                                                                                                                                                                                                             |   Default    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| context           | <em>(function(new: <a href="#type-context" title="A context instance to pass to the tests.">Context</a>) \| !Array&lt;function(new: <a href="#type-context" title="A context instance to pass to the tests.">Context</a>)&gt; \| *)</em>                                                                                                                                                 | The single or multiple context constructors or objects to initialise for each test.                                                                                                                                                                                                                                                                                                                                                | -            |
| persistentContext | <em>(function(new: <a href="#type-context" title="A context instance to pass to the tests.">Context</a>) \| !Array&lt;function(new: <a href="#type-context" title="A context instance to pass to the tests.">Context</a>)&gt; \| *)</em>                                                                                                                                                 | The context constructor(s) that will be initialised and destroyed once per test suite, having a persistent state across tests.                                                                                                                                                                                                                                                                                                     | -            |
| getResults        | <em>function(this: <a href="#type-maskcontext" title="The `this` context of mask methods which contains the mask's properties extracted from the result file.">MaskContext</a>, ...<a href="#type-context" title="A context instance to pass to the tests.">Context</a>): (* \| !Promise)</em>                                                                                           | A possibly async function which returns results of a test. If it outputs a string, it will be compared against the `expected` property of the mask using string comparison. If it outputs an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`. Otherwise, the result must be mapped for comparison with `expected` using the `mapActual` method.                                  | -            |
| getTransform      | <em>function(this: <a href="#type-maskcontext" title="The `this` context of mask methods which contains the mask's properties extracted from the result file.">MaskContext</a>, ...<a href="#type-context" title="A context instance to pass to the tests.">Context</a>): !([stream.Transform](#type-streamtransform) \| Promise&lt;[!stream.Transform](#type-streamtransform)&gt;)</em> | A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask's result. Its output will be accumulated and compared against the expected output of the mask.                                                                                                                                                                                                                       | -            |
| getReadable       | <em>function(this: <a href="#type-maskcontext" title="The `this` context of mask methods which contains the mask's properties extracted from the result file.">MaskContext</a>, ...<a href="#type-context" title="A context instance to pass to the tests.">Context</a>): !([stream.Readable](#type-streamreadable) \| Promise&lt;[!stream.Readable](#type-streamreadable)&gt;)</em>     | A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask.                                                                                                                                                                                                                                    | -            |
| fork              | <em>(string \| <a href="#type-forkconfig" title="The configuration of the fork.">!ForkConfig</a>)</em>                                                                                                                                                                                                                                                                                   | The path to the module to fork with the mask's input split by whitespace as arguments, output of which will be compared against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started. | -            |
| getThrowsConfig   | <em>function(this: <a href="#type-maskcontext" title="The `this` context of mask methods which contains the mask's properties extracted from the result file.">MaskContext</a>, ...<a href="#type-context" title="A context instance to pass to the tests.">Context</a>): [_assertThrows.Config](#type-_assertthrowsconfig)</em>                                                         | A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.                                                                                                                                                                                                                                                              | -            |
| mapActual         | <em>function(*): string</em>                                                                                                                                                                                                                                                                                                                                                             | The function to get a value to test against `expected` mask property from results returned by `getResults`.                                                                                                                                                                                                                                                                                                                        | -            |
| assertResults     | <em>function(*, !Object&lt;string, *&gt;): (!Promise \| undefined)</em>                                                                                                                                                                                                                                                                                                                  | A possibly async function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask's result (where `jsonProps` are parsed into JS objects) will be passed as arguments.                                                                                                                                                                               | -            |
| jsonProps         | <em>!Array&lt;string&gt;</em>                                                                                                                                                                                                                                                                                                                                                            | The properties of the mask to parse as _JSON_ values.                                                                                                                                                                                                                                                                                                                                                                              | -            |
| jsProps           | <em>!Array&lt;string&gt;</em>                                                                                                                                                                                                                                                                                                                                                            | The properties of the mask to parse into JavaScript objects. For example, a property can be written as `{ config: true }` and will be evaluated into an object.                                                                                                                                                                                                                                                                    | -            |
| splitRe           | <em>!RegExp</em>                                                                                                                                                                                                                                                                                                                                                                         | A regular expression used to detect the beginning of a new test in a mask result file. The default is `/^\/\/ /gm` for results from all files, and `/^## /gm` for results from `.md` files. Default `/^\/\/ /gm` or `/^## /gm`.                                                                                                                                                                                                    | -            |
| propStartRe       | <em>!RegExp</em>                                                                                                                                                                                                                                                                                                                                                                         | The regex to detect the start of the property, e.g., in `/⁎ propName ⁎/` it is the default regex that detects `/⁎`. There's no option to define the end of the regex after the name. [If copying, replace `⁎` with `*`].                                                                                                                                                                                                           | `\/\‎⁎`      |
| propEndRe         | <em>!RegExp</em>                                                                                                                                                                                                                                                                                                                                                                         | The regex which indicates the end of the property, e.g, in `/⁎ propName ⁎/ some prop value /⁎⁎/` it is the default that detects `/⁎⁎/`. [If copying, replace `⁎` with `*`].                                                                                                                                                                                                                                                        | `/\/\⁎\⁎\//` |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## Testing Forks

With masks, it is very easy to test fork processes.

[`import('child_process').ForkOptions`](https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options) __<a name="type-child_processforkoptions">`child_process.ForkOptions`</a>__: Options to fork a child process, allows to set cwd, environment variables, etc.

`import('stream').Writable` __<a name="type-streamwritable">`stream.Writable`</a>__: The writable stream to pipe the logs of the fork to, e.g., `process.stdout`.

__<a name="type-forkconfig">`ForkConfig`</a>__: Parameters for forking.

|      Name      |                                                                                                                                                                                     Type                                                                                                                                                                                     |                                                                                                   Description                                                                                                    | Default |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| __module*__    | <em>string</em>                                                                                                                                                                                                                                                                                                                                                              | The path to the module to fork.                                                                                                                                                                                  | -       |
| getArgs        | <em>function(this: *, !Array&lt;string&gt;, ...<a href="#type-context" title="A context instance to pass to the tests.">Context</a>): !(Array&lt;string&gt; \| Promise&lt;!Array&lt;string&gt;&gt;)</em>                                                                                                                                                                     | The function to get arguments to pass the fork based on the parsed mask input and contexts. The `this` context is set to the passed properties.                                                                  | -       |
| getOptions     | <em>function(this: *, ...<a href="#type-context" title="A context instance to pass to the tests.">Context</a>): <a href="#type-child_processforkoptions" title="Options to fork a child process, allows to set cwd, environment variables, etc.">!child_process.ForkOptions</a></em>                                                                                         | The function to get options for the fork, such as `ENV` and `cwd`, based on contexts. The `this` context is set to the passed properties.                                                                        | -       |
| options        | <em><a href="#type-child_processforkoptions" title="Options to fork a child process, allows to set cwd, environment variables, etc.">!child_process.ForkOptions</a></em>                                                                                                                                                                                                     | Options for the forked processed, such as `ENV` and `cwd`.                                                                                                                                                       | -       |
| inputs         | <em>Array&lt;[RegExp, string]&gt;</em>                                                                                                                                                                                                                                                                                                                                       | Inputs to push to `stdin` when `stdout` writes data. The inputs are kept on stack, and taken off the stack when the RegExp matches the written data, e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`. | -       |
| stderrInputs   | <em>Array&lt;[RegExp, string]&gt;</em>                                                                                                                                                                                                                                                                                                                                       | Inputs to push to `stdin` when `stderr` writes data (similar to `inputs`), e.g., `[[/question/, 'answer'], [/question2/, 'answer2']]`.                                                                           | -       |
| log            | <em>(boolean \| { stderr: !(<a href="#type-streamwritable" title="The writable stream to pipe the logs of the fork to, e.g., `process.stdout`.">stream.Writable</a> \| NodeJS.WriteStream), stdout: !(<a href="#type-streamwritable" title="The writable stream to pipe the logs of the fork to, e.g., `process.stdout`.">stream.Writable</a> \| NodeJS.WriteStream) })</em> | Whether to pipe data from `stdout`, `stderr` to the process's streams. If an object is passed, the output will be piped to streams specified as its `stdout` and `stderr` properties.                            | `false` |
| includeAnswers | <em>boolean</em>                                                                                                                                                                                                                                                                                                                                                             | Whether to add the answers to the `stderr` and `stdout` output.                                                                                                                                                  | `true`  |
| stripAnsi      | <em>boolean</em>                                                                                                                                                                                                                                                                                                                                                             | Remove ANSI escape sequences from the `stdout` and `stderr` prior to checking of the result.                                                                                                                     | `true`  |
| preprocess     | <em>(<a href="#type-preprocessor" title="The function which processes fork's outputs before returning them for asserts.">Preprocessor</a> \| <a href="#type-forkpreprocessor" title="An object with `stdout` and `stderr` preprocessors.">ForkPreprocessor</a>)</em>                                                                                                         | The function to run on `stdout` and `stderr` before comparing it to the output. Pass an object with `stdout` and `stderr` properties for individual pre-processors.                                              | -       |

`function(string): string` __<a name="type-preprocessor">`Preprocessor`</a>__: The function which processes fork's outputs before returning them for asserts.

__<a name="type-forkpreprocessor">`ForkPreprocessor`</a>__: An object with `stdout` and `stderr` preprocessors.

|  Name  |                                                                     Type                                                                      |               Description               |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| stdout | <em><a href="#type-preprocessor" title="The function which processes fork's outputs before returning them for asserts.">Preprocessor</a></em> | How to process `stdout` before asserts. |
| stderr | <em><a href="#type-preprocessor" title="The function which processes fork's outputs before returning them for asserts.">Preprocessor</a></em> | How to process `stderr` before asserts. |

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Enabling JSDoc

The JSDoc for contexts can be enabled by specifying types for the params to the functions.

![Zoroaster Mask JSDoc Contexts](doc/context.gif)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/5.svg?sanitize=true"></a></p>

## Copyright


  (c) [Context Testing](https://contexttesting.com) 2019


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>