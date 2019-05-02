const get = async () => {
  const { hash, port  } = window.location
  return { hash, port }
}

(async () => {
  const res = await get()
  console.log(res)
})()