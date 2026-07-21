import { siteConfig } from '@/lib/site-config'
import {
  CONTACT_DELIVERY_FAILURE_MESSAGE,
  CONTACT_REQUEST_BODY_MAX_BYTES,
  CONTACT_SUCCESS_MESSAGE,
  CONTACT_VALIDATION_MESSAGE,
  type ContactSubmission,
} from '@/lib/contact/config'
import {
  isHoneypotPopulated,
  validateContactFormInput,
} from '@/lib/contact/schema'
import {
  ContactDeliveryError,
  deliverContactSubmission,
} from '@/lib/contact/delivery'

const jsonHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json',
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? ''

  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonResponse(
      {
        ok: false,
        message: 'Unsupported request format.',
      },
      415,
    )
  }

  let rawBody: string

  try {
    rawBody = await readBoundedBody(request, CONTACT_REQUEST_BODY_MAX_BYTES)
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: CONTACT_VALIDATION_MESSAGE,
      },
      413,
    )
  }

  let payload: unknown

  try {
    payload = JSON.parse(rawBody)
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: CONTACT_VALIDATION_MESSAGE,
      },
      400,
    )
  }

  if (isHoneypotPopulated(payload)) {
    return jsonResponse(
      {
        ok: true,
        message: CONTACT_SUCCESS_MESSAGE,
      },
      200,
    )
  }

  const validation = validateContactFormInput(payload)

  if (!validation.ok) {
    return jsonResponse(
      {
        ok: false,
        message: CONTACT_VALIDATION_MESSAGE,
        fieldErrors: validation.fieldErrors,
      },
      422,
    )
  }

  const submission: ContactSubmission = {
    email: validation.data.email,
    topic: validation.data.topic,
    message: validation.data.message,
    submittedAt: new Date().toISOString(),
    source: getSubmissionSource(),
  }

  if (validation.data.preferredInterviewDate) {
    submission.preferredInterviewDate = validation.data.preferredInterviewDate
  }

  try {
    await deliverContactSubmission(submission)
  } catch (error) {
    if (error instanceof ContactDeliveryError) {
      console.warn('contact delivery failed', {
        category: error.category,
        topic: submission.topic,
        submittedAt: submission.submittedAt,
      })
    }

    return jsonResponse(
      {
        ok: false,
        message: CONTACT_DELIVERY_FAILURE_MESSAGE,
      },
      503,
    )
  }

  return jsonResponse(
    {
      ok: true,
      message: CONTACT_SUCCESS_MESSAGE,
    },
    200,
  )
}

async function readBoundedBody(request: Request, maxBytes: number) {
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

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  })
}

function getSubmissionSource() {
  try {
    return new URL(siteConfig.url).hostname.replace(/^www\./, '')
  } catch {
    return 'jeremybrunet.com'
  }
}
