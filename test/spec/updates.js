import { throws } from '@zoroaster/assert'
import Context from '../context'
import TempContext from 'temp-context'
import S from 'zoroaster'
import makeTestSuite from '../../src'

/** @type {Object.<string, (c: Context, t: TempContext, z: S)>} */
const T = {
  context: [Context, TempContext, S],
  async'can update text'({ fixture, runTest }, { add, snapshot }, { snapshotExtension }) {
    snapshotExtension('md')
    const p = await add(fixture`updates/text.md`)
    const ts = makeTestSuite(p, {
      getResults() {
        return this.input + ': updated'
      },
    })
    const e = await throws({
      fn: runTest,
      args: [ts, 'fail'],
    })
    const u = e.handleUpdate()
    setTimeout(() => {
      process.stdin.push('\n')
    }, 10)
    await u
    return snapshot()
  },
  async'can update empty text'({ fixture, runTest }, { add, snapshot }, { snapshotExtension }) {
    snapshotExtension('md')
    const p = await add(fixture`updates/empty.md`)
    const ts = makeTestSuite(p, {
      getResults() {
        return this.input + ': updated'
      },
    })
    const e = await throws({
      fn: runTest,
      args: [ts, 'fail empty'],
    })
    const u = e.handleUpdate()
    setTimeout(() => {
      process.stdin.push('\n')
    }, 10)
    await u
    return snapshot()
  },
  async'can update json'({ fixture, runTest }, { add, snapshot }, { snapshotExtension }) {
    snapshotExtension('md')
    const p = await add(fixture`updates/json.md`)
    const ts = makeTestSuite(p, {
      getResults() {
        return { updated: true }
      },
      jsonProps: ['expected'],
    })
    const e = await throws({
      fn: runTest,
      args: [ts, 'fail json'],
    })
    const u = e.handleUpdate()
    setTimeout(() => {
      process.stdin.push('\n')
    }, 10)
    await u

    const e2 = await throws({
      fn: runTest,
      args: [ts, 'fail json2'],
    })
    const u2 = e2.handleUpdate()
    setTimeout(() => {
      process.stdin.push('\n')
    }, 10)
    await u2
    return snapshot()
  },
}

export default T