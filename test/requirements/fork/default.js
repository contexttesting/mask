import makeTestSuite from '../../../src'

export const fork = makeTestSuite('test/requirements/fork/expected', {
  fork: {
    module: 'test/requirements/fork/fork',
    getOptions() {
      return {
        env: this.env,
      }
    },
  },
  jsonProps: ['stdout', 'expected', 'env'],
  mapActual({ stdout }) { return JSON.parse(stdout) },
})

export const inputs = makeTestSuite('test/requirements/fork/inputs.md', {
  fork: {
    module: 'test/requirements/fork/inputs',
  },
})