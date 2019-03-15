/* yarn example/ */
import mask from '../src'

(async () => {
  const res = await mask({
    text: 'example',
  })
  console.log(res)
})()