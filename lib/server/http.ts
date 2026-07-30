export async function readBoundedText(response: Response, maxBytes: number) {
  if (!response.body) {
    return ''
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let receivedBytes = 0
  let body = ''

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    receivedBytes += value.byteLength

    if (receivedBytes > maxBytes) {
      throw new Error('Response body is too large.')
    }

    body += decoder.decode(value, { stream: true })
  }

  body += decoder.decode()

  return body
}

export async function readBoundedRequestBody(request: Request, maxBytes: number) {
  if (!request.body) {
    return ''
  }

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let receivedBytes = 0
  let body = ''

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    receivedBytes += value.byteLength

    if (receivedBytes > maxBytes) {
      throw new Error('Request body is too large.')
    }

    body += decoder.decode(value, { stream: true })
  }

  body += decoder.decode()

  return body
}
