import { deepEqual } from 'assert-diff'
import SnapshotContext from 'snapshot-context'
import { ok, equal } from 'assert'
import throws from 'assert-throws'
import Context from '../context'
import getTests from '../../src/mask'

/** @type {Object.<string, (c: Context, sc: SnapshotContext)>} */
const T = {
  context: [Context, SnapshotContext],
  async 'can make a mask'({ fixture }, { test }) {
    const res = getTests({ path: fixture`mask.js` })
    const fr = res.map(({ onError, ...rest }) => {
      ok(onError)
      return rest
    })
    await test('mask.json', fr)
  },
  async 'can make a mask with a separator'(
    { fixture }, { test },
  ) {
    const res = getTests({ path: fixture`get-tests/split.js`, splitRe: /^\/\/\/ /mg })
    const fr = res.map(({ onError, ...rest }) => {
      ok(onError)
      return rest
    })
    await test('mask-nl.json', fr)
  },
  async 'prints the error lines for custom separators'({ fixture }) {
    const path = fixture`get-tests/split.js`
    const [res] = getTests({ path, splitRe: /^\/\/\/ /mg })
    await throws({
      fn: res.onError,
      args: new Error('hola'),
      stack: `Error: hola
    at a mask with a new line (${path}:1:1)`,
    })
  },
  async 'correct error lines when tests begin with same symbols'({ fixture }) {
    const path = fixture`mask/same-name-start.js`
    const [,res] = getTests({ path })
    await throws({
      fn: res.onError,
      args: new Error('hola'),
      stack: `Error: hola
    at a test (${path}:8:1)`,
    })
  },
  async 'can make a mask with a new line'({ fixture }, { test }) {
    const res = getTests({ path: fixture`get-tests/new-line.js` })
    const fr = res.map(({ onError, ...rest }) => {
      ok(onError)
      return rest
    })
    await test('mask-nl.json', fr)
  },
  async 'can make a mask with empty expected'({ fixture }) {
    const res = getTests({ path: fixture`mask/empty.md` })
    equal(res.length, 1)
    const [test] = res
    ok(test.onError)
    delete test.onError
    deepEqual(test, {
      name: 'an empty expected',
      input: '',
      expected: '',
    })
  },
  async 'can make a mask with blank expected'({ fixture }) {
    const res = getTests({ path: fixture`mask/blank.md` })
    equal(res.length, 1)
    const [test] = res
    ok(test.onError)
    delete test.onError
    deepEqual(test, {
      name: 'a blank expected',
      input: '',
      expected: '\n',
    })
  },
}

export default T