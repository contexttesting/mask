import { throws } from '@zoroaster/assert'
import TempContext from 'temp-context'
import Context from '../context'
import makeTestSuite from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async'tests a fork (pass)'({ runTest, fixture, preprocess }) {
    const ts = makeTestSuite(fixture`result/fork`, {
      fork: {
        module: fixture`fork`,
        preprocess,
      },
    })
    await runTest(ts, 'forks a module')
    await runTest(ts, 'forks a module with string arguments')
  },
  async 'tests a fork (fail)'({ runTest, fixture }) {
    const ts = makeTestSuite(fixture`result/fork`, {
      fork: fixture`fork`,
    })
    await throws({
      fn: runTest,
      args: [ts, 'fails on stdout'],
      message: /fail/,
    })
    await throws({
      fn: runTest,
      args: [ts, 'fails on stderr'],
      message: /fail/,
    })
    await throws({
      fn: runTest,
      args: [ts, 'fails on code'],
      message: /Fork exited with code 127 != 1/,
    })
  },
  async 'tests a fork with properties'({ runTest, fixture, preprocess }) {
    const t = '--test'
    const e = 'TEST'
    const ts = makeTestSuite(fixture`result/fork-options.md`, {
      fork: {
        module: fixture`fork/options`,
        getArgs(args, { arg }) {
          return [...args, arg]
        },
        getOptions({ FORK_ENV }) {
          return {
            env: {
              FORK_ENV,
            },
          }
        },
        preprocess,
      },
      jsonProps: ['stdout'],
      context: { arg: t, FORK_ENV: e },
    })
    await runTest(ts, 'forks a module')
  },
  async 'fails a fork with options'({ runTest, fixture, version: v }) {
    const t = '--test'
    const ts = makeTestSuite(fixture`result/fork-options.md`, {
      fork: {
        module: fixture`fork/options`,
        getArgs(args, { arg }) {
          return [...args, arg]
        },
        options: {
          env: {
            FORK_ENV: 'FAIL',
          },
        },
      },
      jsonProps: ['stdout'],
      context: { arg: t },
    })
    let message
    if (v < 10) {
      message = /'FAIL' === 'TEST'/
    } else if (v < 12) {
      message = /-.+?'FAIL'\r?\n.+?\+.+?'TEST'/
    } else {
      message = /'FAIL' !== 'TEST'/
    }
    await throws({
      fn: runTest,
      args: [ts, 'forks a module'],
      message,
    })
  },
}

/** @type {Object.<string, (c: Context, t: TempContext )>} */
export const ThisContext = {
  context: [Context, TempContext],
  async 'assigns context on getArgs and getOptions'({ runTest, fixture }, { write }) {
    const p = await write('test.js', 'console.log(`stdout: ${process.argv[2]}`); console.error(`stderr: ${process.env.TEST}`)')
    const ts = makeTestSuite(fixture`result/this-context.md`, {
      fork: {
        module: p,
        getArgs() {
          return [this.input]
        },
        getOptions() {
          return {
            env: {
              TEST: this.config.proc,
            },
          }
        },
      },
      jsonProps: ['config'],
    })
    await runTest(ts, '!assigns the input to this.input')
  },
}

const FORK_INPUT = Context.fixture`result/fork-input`

/** @type {Object.<string, (c: Context, r: string )>} */
export const $inputs = {
  context: [Context, FORK_INPUT],
  async'!passes inputs to stdin'({ runTest, fixture, preprocess }, result) {
    const ts = makeTestSuite(result, {
      fork: {
        module: fixture`fork/inputs`,
        inputs: [
          [/Answer 1/, 'input1'],
          [/Answer 2/, 'input2'],
        ],
        preprocess,
      },
      mapActual({ stdout }) {
        return stdout.trim()
      },
    })
    await runTest(ts, 'writes inputs')
  },
  async 'passes inputs to stdin without logging answers'({ runTest, fixture, preprocess }, result) {
    const ts = makeTestSuite(result, {
      fork: {
        module: fixture`fork/inputs`,
        inputs: [
          [/Answer 1/, 'input1'],
          [/Answer 2/, 'input2'],
        ],
        includeAnswers: false,
        preprocess,
      },
      mapActual({ stdout }) {
        return stdout.trim()
      },
    })
    await runTest(ts, 'writes inputs without answers')
  },
  async 'passes inputs to stdin on stderr'({ runTest, fixture, preprocess }, result) {
    const ts = makeTestSuite(result, {
      fork: {
        module: fixture`fork/inputs-stderr`,
        stderrInputs: [
          [/Answer 1/, 'input1'],
        ],
        preprocess,
      },
      mapActual({ stderr }) {
        return stderr.trim()
      },
    })
    await runTest(ts, 'writes inputs on stderr')
  },
  async 'passes inputs from the mask property'({ runTest, fixture, preprocess }, result) {
    const ts = makeTestSuite(result, {
      fork: {
        module: fixture`fork/inputs`,
        preprocess,
      },
      mapActual({ stdout }) {
        return stdout.trim()
      },
    })
    await runTest(ts, '!writes inputs from props')
  },
}

export default T