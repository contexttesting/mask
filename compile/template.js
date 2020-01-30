const mask = require('./depack')

/**
 * @methodType {_contextTesting.makeTestSuite}
 */
function makeTestSuite(path, config) {
  return mask(path, config)
}

module.exports = makeTestSuite

/* typal types/index.xml namespace */
