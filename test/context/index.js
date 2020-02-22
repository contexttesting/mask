import { join } from 'path'
import { EOL } from 'os'

/**
 * A testing context for the package.
 */
export default class Context {
  get version() {
    return Context.version()
  }
  static get version() {
    const v = process.version.split('.')[0].replace('v', '')
    return v
  }
  preprocess(s) {
    if (process.platform != 'win32') return s
    return s.replace(/([^\r])\n/g, `$1${EOL}`)
  }
  /**
   * Initialise contexts for a test and run it.
   * @param {TestSuite} ts A test suite to run.
   * @param {string} name Name of the test in the test suite.
   */
  async runTest(ts, name) {
    if (!(name in ts)) throw new Error('No such test found')

    const contexts = Array.isArray(ts.context) ?
      ts.context : [ts.context].filter(c => c)

    const ic = await contexts.reduce(async (acc, Con) => {
      await acc
      const c = typeof Con == 'object' ? Con : new Con()
      if ('_init' in c) await c._init()
      return [...acc, c]
    }, [])
    const test = ts[name]
    await test(...ic)
  }
  /**
   * A tagged template that returns the relative path to the fixture.
   * @param {string} file
   * @example
   * fixture`result/mask`
   */
  get fixture() {
    return fixture
  }
  /**
   * A tagged template that returns the relative path to the fixture.
   * @param {string} file
   * @example
   * fixture`result/mask`
   */
  get f() {
    return fixture
  }
  /**
   * A tagged template that returns the relative path to the fixture.
   * @param {string} file
   * @example
   * fixture`result/mask`
   */
  static get fixture() {
    return fixture
  }
}

/**
 * A tagged template that returns the relative path to the fixture.
 * @param {string} file
 * @example
 * fixture`result/mask`
 */
const fixture = (file) => {
  const f = file.raw[0]
  return join('test/fixture', f)
}