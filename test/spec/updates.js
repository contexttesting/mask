import { throws } from '@zoroaster/assert'
import Context from '../context'
import TempContext from 'temp-context'
import Zoroaster from 'zoroaster'
import makeTestSuite from '../../src'

/** @type {Object.<string, (c: Context, t: TempContext, z: Zoroaster)>} */
const T = {
  context: [Context, TempContext, class extends Zoroaster {
    static get snapshotExtension() {
      return 'md'
    }
  }],
  async'can update text'({ fixture, runTest, preprocess, makeStdin }, 
    { add, snapshot }) {
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
    await e.handleUpdate({
      stdin: makeStdin(),
    })
    const s = await snapshot()
    return preprocess(s)
  },
  async'can update empty text'({ fixture, runTest, preprocess, makeStdin }, 
    { add, snapshot }) {
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
    const u = await e.handleUpdate({
      stdin: makeStdin(),
    })
    const s = await snapshot()
    return preprocess(s)
  },
  async'can update json'({ fixture, runTest, preprocess, makeStdin }, 
    { add, snapshot }) {
    const p = await add(fixture`updates/json.md`)
    const ts = makeTestSuite(p, {
      getResults() {
        return { updated: true }
      },
      jsonProps: ['expected'],
    })
    // I
    const e = await throws({
      fn: runTest,
      args: [ts, 'fail json'],
    })
    await e.handleUpdate({
      stdin: makeStdin(),
    })
    // II
    const e2 = await throws({
      fn: runTest,
      args: [ts, 'fail json2'],
    })
    
    await e2.handleUpdate({
      stdin: makeStdin(),
    })

    const s = await snapshot()
    return preprocess(s)
  },
}

export default T