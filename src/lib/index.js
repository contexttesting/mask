/**
 * Splits the string by regular expression and remembers positions.
 * @param {string} string
 * @param {!RegExp} re
 * @returns {!Array<{ position: number, separator: string, match: string }>}
 */
export const splitWithPositions = (string, re) => {
  let tt = []
  string.replace(re, (match, position) => {
    tt.push({ position, separator: match })
  })
  tt = [{ position: 0, separator: '' }, ...tt]
  const t = tt.reduce((acc, { position, separator }, i, arr) => {
    const { length } = separator
    const next = arr[i + 1]
    if (!next) {
      const r = string.slice(position + length)
      acc.push({ position, separator, match: r })
      return acc
    }
    const { position: nextPosition } = next
    const r = string.slice(position + length, nextPosition)
    acc.push({ position, separator, match: r })
    return acc
  }, [])
  return t
}

/**
 * @param {!Object} props
 * @param {!Array<string>} jsonProps
 * @param {!Array<string>} jsProps
 */
export const parseProps = (props, jsonProps, jsProps) => {
  const parsedRest = Object.keys(props).reduce((ac, k) => {
    let val
    const value = props[k]
    if (jsonProps.includes(k)) {
      try {
        val = JSON.parse(value)
      } catch (err) {
        throw new Error(`Could not parse JSON property "${k}": ${err.message}.`)
      }
    } else if (jsProps.includes(k)) {
      try {
        eval(`val = ${value}`)
      } catch(err) {
        throw new Error(`Could not evaluate JS property "${k}": ${err.message}.`)
      }
    } else val = value
    ac[k] = val
    return ac
  }, {})
  return parsedRest
}