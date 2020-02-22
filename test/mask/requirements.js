import makeTestSuite from '@zoroaster/mask'
import Context from '../context'

export default makeTestSuite(`test/result/requirements/default-${Context.version}`, {
  fork: {
    module: 'node_modules/zoroaster/depack/bin/zoroaster.js',
  },
})

export const getResults = makeTestSuite('test/result/requirements/get-results', {
  fork: {
    module: 'node_modules/zoroaster/depack/bin/zoroaster.js',
  },
})