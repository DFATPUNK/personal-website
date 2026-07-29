import {
  PUBLICATION_ALERT_WEBHOOK_RESPONSE_MAX_BYTES,
  PUBLICATION_ALERT_WEBHOOK_TIMEOUT_MS,
  type PublicationAlertSubmission,
} from '@/lib/publication-alerts/config'
import { readBoundedText } from '@/lib/server/http'
import { createSignedWebhookHeaders } from '@/lib/server/signed-webhook'

type FetchLike = typeof fetch

export type PublicationAlertDeliveryResult =
  | {
      ok: true
      status: 'subscribed'
    }
  | {
      ok: false
      status: 'suppressed'
    }

type DeliverPublicationAlertOptions = {
  fetcher?: FetchLike
  timeoutMs?: number
  webhookUrl?: string
  signingSecret?: string
}

export class PublicationAlertDeliveryError extends Error {
  constructor(
    message: string,
    readonly category:
      | 'missing-config'
      | 'http-error'
      | 'network-error'
      | 'malformed-response',
  ) {
    super(message)
    this.name = 'PublicationAlertDeliveryError'
  }
}

function normalizeN8nResponse(input: unknown): PublicationAlertDeliveryResult {
  if (!input || typeof input !== 'object') {
    throw new PublicationAlertDeliveryError(
      'Publication alert webhook returned a malformed response.',
      'malformed-response',
    )
  }

  const response = input as { ok?: unknown; status?: unknown }

  if (response.ok === true && response.status === 'subscribed') {
    return {
      ok: true,
      status: 'subscribed',
    }
  }

  if (response.ok === false && response.status === 'suppressed') {
    return {
      ok: false,
      status: 'suppressed',
    }
  }

  throw new PublicationAlertDeliveryError(
    'Publication alert webhook returned a malformed response.',
    'malformed-response',
  )
}

export async function deliverPublicationAlertSubmission(
  submission: PublicationAlertSubmission,
  options: DeliverPublicationAlertOptions = {},
) {
  const webhookUrl =
    options.webhookUrl ?? process.env.PUBLICATION_ALERTS_WEBHOOK_URL
  const signingSecret =
    options.signingSecret ??
    process.env.PUBLICATION_ALERTS_WEBHOOK_SIGNING_SECRET

  if (!webhookUrl || !signingSecret) {
    throw new PublicationAlertDeliveryError(
      'Publication alerts webhook is not configured.',
      'missing-config',
    )
  }

  const body = JSON.stringify(submission)
  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? PUBLICATION_ALERT_WEBHOOK_TIMEOUT_MS,
  )

  try {
    const response = await (options.fetcher ?? fetch)(webhookUrl, {
      method: 'POST',
      headers: createSignedWebhookHeaders({
        body,
        secret: signingSecret,
      }),
      body,
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new PublicationAlertDeliveryError(
        'Publication alerts webhook returned an unsuccessful status.',
        'http-error',
      )
    }

    const rawResponse = await readBoundedText(
      response,
      PUBLICATION_ALERT_WEBHOOK_RESPONSE_MAX_BYTES,
    )

    return normalizeN8nResponse(JSON.parse(rawResponse))
  } catch (error) {
    if (error instanceof PublicationAlertDeliveryError) {
      throw error
    }

    throw new PublicationAlertDeliveryError(
      'Publication alerts webhook request failed.',
      'network-error',
    )
  } finally {
    clearTimeout(timeout)
  }
}
