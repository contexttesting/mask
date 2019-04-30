import { askSingle } from 'reloquent'

(async () => {
  const answer = await askSingle('Hello')
  console.log('Answer is: %s', answer)
})()