/**
 * Splits the string by regular expression and remembers positions.
 * @param {string} string
 * @param {!RegExp} re
 * @returns {!Array<{ position: number, separator: string, match: string }>}
 */
       const splitWithPositions = (string, re) => {
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

module.exports.splitWithPositions = splitWithPositions