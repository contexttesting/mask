import read from '@wrote/read'

/**
 * An example function that reads a file.
 * @param {string} path The path to the file to read.
 * @param {string} input The string to prepend.
 */
const fn = async (path, input) => {
  const res = await read(path)
  return `${input}: ${res}`
}

export default fn