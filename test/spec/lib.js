import { parseProps } from '../../src/lib'

export default {
  'parses js and json properties'() {
    const json = JSON.stringify({ test: 123 })
    const js = '{ conf: true }'
    const props = { json, js }
    const res = parseProps(props, ['json'], ['js'])
    return res
  },
}