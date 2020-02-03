import { ok } from '@zoroaster/assert'
import spawn from 'spawncommand'
import Zoroaster from 'zoroaster'
import Context from '../context'

export default {
  context: [Context, Zoroaster],
  /**
   * @param {Context} c
   * @param {Zoroaster} z
   */
  async 'notifies of errors in fork'(c, z) {
    z.snapshotExtension(`${c.version}.txt`)
    const p = spawn('node_modules/.bin/zoroaster', [
      'test/requirements/fork/default.js', '-a'], {
      env: process.env,
    })
    const res = await p.promise
    ok(res.code)
    return res.stdout.replace(/\033\[.*?m/g, '')
  },
  async 'notifies of errors in get-results'() {
    const p = spawn('node_modules/.bin/zoroaster', [
      'test/requirements/get-results/default.js', '-a'], {
      env: process.env,
    })
    const res = await p.promise
    ok(res.code)
    return res.stdout
  },
}