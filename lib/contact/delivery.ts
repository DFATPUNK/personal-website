import {
  CONTACT_WEBHOOK_TIMEOUT_MS,
  type ContactSubmission,
} from '@/lib/contact/config'

type FetchLike = typeof fetch

type DeliverContactSubmissionOptions = {
  fetcher?: FetchLike
  timeoutMs?: number
  webhookUrl?: string
}

export class ContactDeliveryError extends Error {
  constructor(
    message: string,
    readonly category: 'missing-config' | 'http-error' | 'network-error',
  ) {
    super(message)
    this.name = 'ContactDeliveryError'
  }
}

export async function deliverContactSubmission(
  submission: ContactSubmission,
  options: DeliverContactSubmissionOptions = {},
) {
  const webhookUrl = options.webhookUrl ?? process.env.CONTACT_WEBHOOK_URL

  if (!webhookUrl) {
    throw new ContactDeliveryError(
      'Contact webhook URL is not configured.',
      'missing-config',
    )
  }

  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? CONTACT_WEBHOOK_TIMEOUT_MS,
  )
  const fetcher = options.fetcher ?? fetch
  const payload: ContactSubmission = {
    email: submission.email,
    topic: submission.topic,
    message: submission.message,
    submittedAt: submission.submittedAt,
    source: submission.source,
  }

  if (submission.preferredInterviewDate) {
    payload.preferredInterviewDate = submission.preferredInterviewDate
  }

  try {
    const response = await fetcher(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new ContactDeliveryError(
        'Contact webhook returned an unsuccessful status.',
        'http-error',
      )
    }
  } catch (error) {
    if (error instanceof ContactDeliveryError) {
      throw error
    }

    throw new ContactDeliveryError(
      'Contact webhook request failed.',
      'network-error',
    )
  } finally {
    clearTimeout(timeout)
  }
}
