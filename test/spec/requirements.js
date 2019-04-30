import { ok } from 'zoroaster/assert'
import spawn from 'spawncommand'

export default {
  async 'notifies of errors in fork'() {
    const p = spawn('node_modules/.bin/zoroaster', [
      'test/requirements/fork/default.js', '-a'], {
      env: process.env,
    })
    const res = await p.promise
    ok(res.code)
    return res.stdout
  },
  async '!notifies of errors in get-results'() {
    const p = spawn('node_modules/.bin/zoroaster', [
      'test/requirements/get-results/default.js', '-a'], {
      env: process.env,
    })
    const res = await p.promise
    ok(res.code)
    return res.stdout
  },
}