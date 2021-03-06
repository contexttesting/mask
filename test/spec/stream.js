import { Transform, Readable } from 'stream'
import throws from 'assert-throws'
import { fork } from 'child_process'
import Context from '../context'
import makeTestSuite from '../../src'

// /**
//  * Generate a test suite.
//  * @param {Object<string, (...t: T)>} tests
//  * @param {...T} contexts
//  * @template T
//  */
// const generate = (tests, ...contexts) => {
//   return {}
// }

// generate({
//   'hello'(t) {
//     t
//   },
// }, Context)

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'can stream the result'({ f, runTest }) {
    const ts = makeTestSuite(f`result/index.md`, {
      getTransform({ test }) {
        const t = new Transform({
          transform(chunk, encoding, next) {
            const r = `${chunk}`.replace(/input/, 'output')
            const rr = `${r}: ${test}`
            this.push(rr)
            next()
          },
        })
        return t
      },
      context: { test: 'pass' },
    })
    await runTest(ts, 'can stream result of a masked test suite')
    await throws({
      fn: runTest,
      args: [ts, 'can stream result of a masked test suite with an error'],
      message: /this is a test output: pass' == 'this is a test output: fail/,
    })
  },
  async 'displays the error from the stream'({ f, runTest }) {
    const ts = makeTestSuite(f`result/index.md`, {
      getTransform({ test }) {
        const t = new Transform({
          transform(chunk, encoding, next) {
            next(new Error(`test-error: ${test}`))
          },
        })
        return t
      },
      context: { test: 'pass' },
    })
    await throws({
      fn: runTest,
      args: [ts, 'displays correct error'],
      message: /test-error: pass/,
    })
  },
  async 'uses async getTransform'({ f, runTest }) {
    const ts = makeTestSuite(f`result/index.md`, {
      async getTransform({ test }) {
        await new Promise(r => setTimeout(r, 100))
        const t = new Transform({
          transform(chunk, encoding, next) {
            const r = `${chunk}`.replace(/input/, 'output')
            const rr = `${r}: ${test}`
            this.push(rr)
            next()
          },
        })
        return t
      },
      context: { test: 'pass' },
    })
    await runTest(ts, 'can stream result of a masked test suite')
    await throws({
      fn: runTest,
      args: [ts, 'can stream result of a masked test suite with an error'],
      message: /this is a test output: pass' == 'this is a test output: fail/,
    })
  },
  async 'gets a readable stream'({ f, runTest }) {
    const ts = makeTestSuite(f`result/stream-arg`, {
      getReadable({ test }) {
        const input = this.input
        const r = new Readable({
          read() {
            this.push(`${input}: ${test}`)
            this.push(null)
          },
        })
        return r
      },
      context: { test: 'pass' },
    })
    await runTest(ts, 'streams result with argument')
  },
  async'gets an async readable stream'({ f, runTest }) {
    const ts = makeTestSuite(f`result/stream-arg`, {
      async getReadable({ test }) {
        const input = this.input
        await new Promise(r => setTimeout(r, 100))
        const r = new Readable({
          read() {
            this.push(`${input}: ${test}`)
            this.push(null)
          },
        })
        return r
      },
      context: { test: 'pass' },
    })
    await runTest(ts, 'streams result with argument')
  },
  async'tests a readable fork'({ f, runTest }) {
    const ts = makeTestSuite(f`result/stream-arg`, {
      getReadable() {
        const proc = fork(f`echo`, [this.input], {
          stdio: 'pipe',
        })
        return proc.stdout
      },
    })
    await runTest(ts, 'streams to a fork')
  },
}

export default T