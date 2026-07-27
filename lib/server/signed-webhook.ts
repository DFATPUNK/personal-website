import crypto from 'node:crypto'

export const SIGNED_WEBHOOK_TIMESTAMP_HEADER = 'x-jeremy-timestamp'
export const SIGNED_WEBHOOK_SIGNATURE_HEADER = 'x-jeremy-signature'

export type SignedWebhookHeaders = Record<string, string>

export function createSignedWebhookSignature({
  body,
  secret,
  timestamp,
}: {
  body: string
  secret: string
  timestamp: string
}) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('hex')
}

export function createSignedWebhookHeaders({
  body,
  secret,
  timestamp = new Date().toISOString(),
}: {
  body: string
  secret: string
  timestamp?: string
}): SignedWebhookHeaders {
  return {
    'Content-Type': 'application/json',
    [SIGNED_WEBHOOK_TIMESTAMP_HEADER]: timestamp,
    [SIGNED_WEBHOOK_SIGNATURE_HEADER]: createSignedWebhookSignature({
      body,
      secret,
      timestamp,
    }),
  }
}

export function timingSafeEqualHex(first: string, second: string) {
  if (!/^[a-f0-9]+$/i.test(first) || !/^[a-f0-9]+$/i.test(second)) {
    return false
  }

  const firstBuffer = Buffer.from(first, 'hex')
  const secondBuffer = Buffer.from(second, 'hex')

  if (firstBuffer.byteLength !== secondBuffer.byteLength) {
    return false
  }

  return crypto.timingSafeEqual(firstBuffer, secondBuffer)
}
