export const checkStatus = response => {
  // console.log('checking status...', response)
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export const parseJSON = response => {
  let decoded = response.json()
  // console.log('decoded: ', decoded)
  return decoded
}
