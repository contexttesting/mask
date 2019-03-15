# @zoroaster/mask

[![npm version](https://badge.fury.io/js/%40zoroaster%2Fmask.svg)](https://npmjs.org/package/@zoroaster/mask)

`@zoroaster/mask` is The Code For Zoroaster Mask Testing.

```sh
yarn add -E @zoroaster/mask
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`makeTestSuite(result: string, config: MakeTestSuiteConf)`](#maketestsuiteresult-stringconfig-maketestsuiteconf-void)
  * [`MakeTestSuiteConf`](#type-maketestsuiteconf)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function:

```js
import makeTestSuite from '@zoroaster/mask'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

## `makeTestSuite(`<br/>&nbsp;&nbsp;`result: string,`<br/>&nbsp;&nbsp;`config: MakeTestSuiteConf,`<br/>`): void`

Creates a test suite that can be exported to run with _Zoroaster_ Context-Testing Framework.

`import('stream').Transform` __<a name="type-transform">`Transform`</a>__

`import('stream').Readable` __<a name="type-readable">`Readable`</a>__

__<a name="type-maketestsuiteconf">`MakeTestSuiteConf`</a>__: Configuration for making test suites.

|      Name       |                                                    Type                                                     |                                                                                                                                                                                       Description                                                                                                                                                                                       |   Default    |
| --------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| context         | _({new(): Context}\|{new(): Context}[]\|{})_                                                                | Single or multiple context constructors or objects to initialise for each test.                                                                                                                                                                                                                                                                                                         | -            |
| getResults      | _(input: string, ...contexts?: Context[]) =&gt; string_                                                     | A possibly async function which should return results of a test. If it returns a string, it will be compared against the `expected` property of the mask using string comparison. If it returns an object, its deep equality with `expected` can be tested by adding `'expected'` to the `jsonProps`.                                                                                   | -            |
| getTransform    | _(...contexts?: Context[]) =&gt; Transform\|Promise.&lt;[Transform](#type-transform)>_                      | A possibly async function which returns a _Transform_ stream to be ended with the input specified in the mask. Its output will be accumulated and compared against the expected output of the mask.                                                                                                                                                                                     | -            |
| getReadable     | _(input: string, ...contexts?: Context[]) =&gt; Readable\|Promise.&lt;[Readable](#type-readable)>_          | A possibly async function which returns a _Readable_ stream constructed with the input from the mask. Its output will be stored in memory and compared against the expected output of the mask. This could be used to test a forked child process, for example.                                                                                                                         | -            |
| fork            | _string\|ForkConfig_                                                                                        | A path to the module to fork with input as arguments, and compare its output against the `code`, `stdout` and `stderr` properties of the mask. Arguments with whitespace should be wrapped in speech marks, i.e. `'` or `"`. Additionally, `ForkConfig` with `module`, `getArgs`, `options` and `getOptions` properties can be passed for more control of how the fork will be started. | -            |
| getThrowsConfig | _(input: string, ...contexts?: Context[]) =&gt; { fn: function, args?: any[], message?: (string\|RegExp) }_ | A function which should return a configuration for [`assert-throws`](https://github.com/artdecocode/assert-throws), including `fn` and `args`, when testing an error.                                                                                                                                                                                                                   | -            |
| mapActual       | _(results: any) =&gt; string_                                                                               | An optional function to get a value to test against `expected` mask property from results. By default, the full result is used.                                                                                                                                                                                                                                                         | -            |
| assertResults   | _(results: any, props: Object.&lt;string, (string\|object)&gt;\|) => void_                                  | A function containing any addition assertions on the results. The results from `getResults` and a map of expected values extracted from the mask (where `jsonProps` are parsed into JS objects) will be passed as arguments.                                                                                                                                                            | -            |
| jsonProps       | _string[]_                                                                                                  | Any additional properties to extract from the mask, and parse as _JSON_ values.                                                                                                                                                                                                                                                                                                         | -            |
| splitRe         | _RegExp_                                                                                                    | A regular expression used to detect the beginning of a new test in a mask file.                                                                                                                                                                                                                                                                                                         | `/^\/\/ /gm` |

```js
/* yarn example/ */
import mask from '@zoroaster/mask'

(async () => {
  const res = await mask({
    text: 'example',
  })
  console.log(res)
})()
```
```

```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true"></a></p>

## Copyright


  (c) [Context Testing](https://contexttesting.com) 2019


<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>