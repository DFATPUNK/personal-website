import { describe, expect, it, vi } from 'vitest'

import {
  ContactDeliveryError,
  deliverContactSubmission,
} from '../lib/contact/delivery'
import type { ContactSubmission } from '../lib/contact/config'

const submission: ContactSubmission = {
  email: 'person@company.com',
  topic: 'job-offer',
  message: 'Description of the opportunity',
  preferredInterviewDate: '2026-08-01',
  submittedAt: '2026-07-20T18:00:00.000Z',
  source: 'jeremybrunet.com',
}

describe('contact delivery', () => {
  it('sends the expected JSON payload', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))

    await deliverContactSubmission(submission, {
      fetcher: fetcher as unknown as typeof fetch,
      webhookUrl: 'https://n8n.example/webhook/contact',
    })

    expect(fetcher).toHaveBeenCalledOnce()
    const request = fetcher.mock.calls[0]?.[1] as RequestInit

    expect(fetcher).toHaveBeenCalledWith(
      'https://n8n.example/webhook/contact',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }),
    )
    expect(JSON.parse(String(request.body))).toEqual(submission)
  })

  it('excludes honeypot and internal anti-spam fields', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))

    await deliverContactSubmission(
      {
        ...submission,
        honeypot: 'filled',
        startedAt: '2026-07-20T17:59:55.000Z',
      } as ContactSubmission & { honeypot: string; startedAt: string },
      {
        fetcher: fetcher as unknown as typeof fetch,
        webhookUrl: 'https://n8n.example/webhook/contact',
      },
    )

    const request = fetcher.mock.calls[0]?.[1] as RequestInit
    const body = JSON.parse(String(request.body)) as Record<string, unknown>

    expect(body.honeypot).toBeUndefined()
    expect(body.startedAt).toBeUndefined()
  })

  it('omits an absent preferred date', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))

    await deliverContactSubmission(
      {
        email: 'person@company.com',
        topic: 'other',
        message: 'A general message for the contact form.',
        submittedAt: '2026-07-20T18:00:00.000Z',
        source: 'jeremybrunet.com',
      },
      {
        fetcher: fetcher as unknown as typeof fetch,
        webhookUrl: 'https://n8n.example/webhook/contact',
      },
    )

    const request = fetcher.mock.calls[0]?.[1] as RequestInit
    const body = JSON.parse(String(request.body)) as Record<string, unknown>

    expect(body.preferredInterviewDate).toBeUndefined()
  })

  it('treats a non-2xx webhook response as failure', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { status: 500 }))

    await expect(
      deliverContactSubmission(submission, {
        fetcher: fetcher as unknown as typeof fetch,
        webhookUrl: 'https://n8n.example/webhook/contact',
      }),
    ).rejects.toMatchObject({
      category: 'http-error',
    } satisfies Partial<ContactDeliveryError>)
  })

  it('handles network failure', async () => {
    const fetcher = vi.fn().mockRejectedValue(new TypeError('network failed'))

    await expect(
      deliverContactSubmission(submission, {
        fetcher: fetcher as unknown as typeof fetch,
        webhookUrl: 'https://n8n.example/webhook/contact',
      }),
    ).rejects.toMatchObject({
      category: 'network-error',
    } satisfies Partial<ContactDeliveryError>)
  })

  it('fails safely when the environment variable is missing', async () => {
    const fetcher = vi.fn()
    const previousWebhookUrl = process.env.CONTACT_WEBHOOK_URL

    delete process.env.CONTACT_WEBHOOK_URL

    await expect(
      deliverContactSubmission(submission, {
        fetcher: fetcher as unknown as typeof fetch,
        webhookUrl: '',
      }),
    ).rejects.toMatchObject({
      category: 'missing-config',
    } satisfies Partial<ContactDeliveryError>)

    if (previousWebhookUrl) {
      process.env.CONTACT_WEBHOOK_URL = previousWebhookUrl
    } else {
      delete process.env.CONTACT_WEBHOOK_URL
    }
    expect(fetcher).not.toHaveBeenCalled()
  })
})
