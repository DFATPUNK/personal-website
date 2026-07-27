import { siteConfig } from '@/lib/site-config'
import {
  PUBLICATION_ALERT_REQUEST_BODY_MAX_BYTES,
  PUBLICATION_ALERT_RESUBSCRIBE_MESSAGE,
  PUBLICATION_ALERT_SUCCESS_MESSAGE,
  PUBLICATION_ALERT_UNAVAILABLE_MESSAGE,
  PUBLICATION_ALERT_VALIDATION_MESSAGE,
  type PublicationAlertSubmission,
} from '@/lib/publication-alerts/config'
import {
  PublicationAlertDeliveryError,
  deliverPublicationAlertSubmission,
} from '@/lib/publication-alerts/delivery'
import {
  getPublicationAlertTags,
  isPublicationAlertHoneypotPopulated,
  validatePublicationAlertInput,
} from '@/lib/publication-alerts/schema'
import { readBoundedRequestBody } from '@/lib/server/http'

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
    rawBody = await readBoundedRequestBody(
      request,
      PUBLICATION_ALERT_REQUEST_BODY_MAX_BYTES,
    )
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: PUBLICATION_ALERT_VALIDATION_MESSAGE,
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
        message: PUBLICATION_ALERT_VALIDATION_MESSAGE,
      },
      400,
    )
  }

  if (isPublicationAlertHoneypotPopulated(payload)) {
    return jsonResponse(
      {
        ok: true,
        message: PUBLICATION_ALERT_SUCCESS_MESSAGE,
      },
      200,
    )
  }

  const validation = validatePublicationAlertInput(payload)

  if (!validation.ok) {
    return jsonResponse(
      {
        ok: false,
        message: PUBLICATION_ALERT_VALIDATION_MESSAGE,
        fieldErrors: validation.fieldErrors,
      },
      422,
    )
  }

  const submission: PublicationAlertSubmission = {
    email: validation.data.email,
    source: validation.data.source,
    tags: getPublicationAlertTags(validation.data.source),
    submittedAt: new Date().toISOString(),
    sourceUrl: getSubmissionSourceUrl(),
  }

  try {
    const result = await deliverPublicationAlertSubmission(submission)

    if (!result.ok && result.status === 'suppressed') {
      return jsonResponse(
        {
          ok: false,
          message: PUBLICATION_ALERT_RESUBSCRIBE_MESSAGE,
        },
        409,
      )
    }
  } catch (error) {
    if (error instanceof PublicationAlertDeliveryError) {
      console.warn('publication alert delivery failed', {
        category: error.category,
        source: submission.source,
      })
    }

    return jsonResponse(
      {
        ok: false,
        message: PUBLICATION_ALERT_UNAVAILABLE_MESSAGE,
      },
      503,
    )
  }

  return jsonResponse(
    {
      ok: true,
      message: PUBLICATION_ALERT_SUCCESS_MESSAGE,
    },
    200,
  )
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  })
}

function getSubmissionSourceUrl() {
  try {
    return new URL('/publication-alerts', siteConfig.url).toString()
  } catch {
    return 'https://jeremybrunet.com/publication-alerts'
  }
}
