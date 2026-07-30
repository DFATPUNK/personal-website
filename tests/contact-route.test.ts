import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  CONTACT_DELIVERY_FAILURE_MESSAGE,
  CONTACT_SUCCESS_MESSAGE,
  CONTACT_VALIDATION_MESSAGE,
} from '../lib/contact/config'

vi.mock('@/lib/contact/delivery', async () => {
  const actual =
    await vi.importActual<typeof import('../lib/contact/delivery')>(
      '@/lib/contact/delivery',
    )

  return {
    ...actual,
    deliverContactSubmission: vi.fn(),
  }
})

const { ContactDeliveryError, deliverContactSubmission } = await import(
  '@/lib/contact/delivery'
)
const { POST } = await import('../app/api/contact/route')

const mockedDeliverContactSubmission = vi.mocked(deliverContactSubmission)

function contactRequest(body: unknown, contentType = 'application/json') {
  return new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

function validBody() {
  return {
    email: 'reviewer@acme.co',
    topic: 'need-help',
    message: 'I need help improving a technical workflow.',
  }
}

async function readJson(response: Response) {
  return (await response.json()) as {
    ok: boolean
    message: string
    fieldErrors?: Record<string, string>
  }
}

describe('contact route', () => {
  beforeEach(() => {
    mockedDeliverContactSubmission.mockReset()
  })

  it('handles a valid request', async () => {
    mockedDeliverContactSubmission.mockResolvedValue(undefined)

    const response = await POST(contactRequest(validBody()))
    const body = await readJson(response)

    expect(response.status).toBe(200)
    expect(body).toEqual({
      ok: true,
      message: CONTACT_SUCCESS_MESSAGE,
    })
    expect(mockedDeliverContactSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'reviewer@acme.co',
        topic: 'need-help',
        message: 'I need help improving a technical workflow.',
        source: 'jeremybrunet.com',
        submittedAt: expect.any(String),
      }),
    )
  })

  it('returns field validation errors', async () => {
    const response = await POST(
      contactRequest({
        ...validBody(),
        email: 'not-an-email',
      }),
    )
    const body = await readJson(response)

    expect(response.status).toBe(422)
    expect(body.ok).toBe(false)
    expect(body.message).toBe(CONTACT_VALIDATION_MESSAGE)
    expect(body.fieldErrors?.email).toBe('Enter a valid email address.')
    expect(mockedDeliverContactSubmission).not.toHaveBeenCalled()
  })

  it('returns public copy for an empty topic validation error', async () => {
    const response = await POST(
      contactRequest({
        ...validBody(),
        topic: '',
      }),
    )
    const body = await readJson(response)
    const topicError = body.fieldErrors?.topic

    expect(response.status).toBe(422)
    expect(body.ok).toBe(false)
    expect(topicError).toBe('Please select a subject.')
    expect(JSON.stringify(body)).not.toContain('Invalid enum')
    expect(JSON.stringify(body)).not.toContain('need-help')
    expect(mockedDeliverContactSubmission).not.toHaveBeenCalled()
  })

  it('handles malformed requests', async () => {
    const response = await POST(contactRequest('{'))
    const body = await readJson(response)

    expect(response.status).toBe(400)
    expect(body).toEqual({
      ok: false,
      message: CONTACT_VALIDATION_MESSAGE,
    })
    expect(mockedDeliverContactSubmission).not.toHaveBeenCalled()
  })

  it('rejects unsupported content types', async () => {
    const response = await POST(contactRequest('email=test', 'text/plain'))
    const body = await readJson(response)

    expect(response.status).toBe(415)
    expect(body.ok).toBe(false)
    expect(mockedDeliverContactSubmission).not.toHaveBeenCalled()
  })

  it('returns generic success for honeypot submissions without delivery', async () => {
    const response = await POST(
      contactRequest({
        ...validBody(),
        honeypot: 'filled',
      }),
    )
    const body = await readJson(response)

    expect(response.status).toBe(200)
    expect(body).toEqual({
      ok: true,
      message: CONTACT_SUCCESS_MESSAGE,
    })
    expect(mockedDeliverContactSubmission).not.toHaveBeenCalled()
  })

  it('returns a generic delivery-unavailable response', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    mockedDeliverContactSubmission.mockRejectedValue(
      new ContactDeliveryError('missing config', 'missing-config'),
    )

    const response = await POST(contactRequest(validBody()))
    const body = await readJson(response)

    expect(response.status).toBe(503)
    expect(body).toEqual({
      ok: false,
      message: CONTACT_DELIVERY_FAILURE_MESSAGE,
    })

    warn.mockRestore()
  })

  it('returns delivery success when the webhook succeeds', async () => {
    mockedDeliverContactSubmission.mockResolvedValue(undefined)

    const response = await POST(
      contactRequest({
        email: 'recruiter@acme.co',
        topic: 'job-offer',
        message: 'This open role could fit your automation background.',
        preferredInterviewDate: '2026-08-01',
      }),
    )
    const body = await readJson(response)

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(mockedDeliverContactSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        preferredInterviewDate: '2026-08-01',
      }),
    )
  })
})
