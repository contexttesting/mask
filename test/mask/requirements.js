import makeTestSuite from '@zoroaster/mask'
import Context from '../context'
import TempContext from 'temp-context'

export default makeTestSuite(`test/result/requirements/default-${Context.version}`, {
  fork: 'node_modules/zoroaster/depack/bin/zoroaster.js',
})

export const getResults = makeTestSuite('test/result/requirements/get-results', {
  fork: 'node_modules/zoroaster/depack/bin/zoroaster.js',
})

// export const updates = makeTestSuite('!test/result/requirements/updates', {
//   context: [Context, TempContext],
//   fork: {
//     module: 'node_modules/zoroaster/depack/bin/zoroaster.js',
//     async getArgs(_, { fixture }, { add }) {
//       const p = await add(fixture`updates/json.md`)
//       return ['test/fixture/updates/fork', '-a']
//     },
//     options: {
//       env: {
//         PATH: 
//       },
//     },
//     inputs: [
//       ['update', 'u'],
//       ['update', 'u'],
//     ],
//   },
//   /**
//    * @param {Context} _ 
//    * @param {TempContext} param1 
//    */
//   async getResults(_, { snapshot }) {
//     return await snapshot()
//   }
// })