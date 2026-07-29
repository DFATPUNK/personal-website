import fs from 'node:fs'
import path from 'node:path'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  PUBLICATION_ALERT_BUTTON_LABEL,
  PUBLICATION_ALERT_COMPACT_BUTTON_LABEL,
  PUBLICATION_ALERT_COMPACT_EMAIL_PLACEHOLDER,
  PUBLICATION_ALERT_EMAIL_LABEL,
  PUBLICATION_ALERT_EMAIL_PLACEHOLDER,
  PUBLICATION_ALERT_HELPER,
  PUBLICATION_ALERT_INVITATION,
  PUBLICATION_ALERT_RESUBSCRIBE_MESSAGE,
  PUBLICATION_ALERT_SUCCESS_MESSAGE,
  PUBLICATION_ALERT_UNAVAILABLE_MESSAGE,
  PUBLICATION_ALERT_VALIDATION_MESSAGE,
} from '../lib/publication-alerts/config'
import {
  getPublicationAlertSourceTag,
  getPublicationAlertTags,
  validatePublicationAlertInput,
} from '../lib/publication-alerts/schema'

vi.mock('@/lib/publication-alerts/delivery', async () => {
  const actual =
    await vi.importActual<typeof import('../lib/publication-alerts/delivery')>(
      '@/lib/publication-alerts/delivery',
    )

  return {
    ...actual,
    deliverPublicationAlertSubmission: vi.fn(),
  }
})

const {
  PublicationAlertDeliveryError,
  deliverPublicationAlertSubmission,
} = await import('@/lib/publication-alerts/delivery')
const { POST } = await import('../app/api/publication-alerts/route')
const { getPublicationAlertSourceUrl } = await import(
  '../lib/publication-alerts/source-url'
)

const mockedDeliver = vi.mocked(deliverPublicationAlertSubmission)

function alertRequest(
  body: unknown,
  contentType = 'application/json',
  headers?: Record<string, string>,
) {
  return new Request('http://localhost:3000/api/publication-alerts', {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

function validBody() {
  return {
    email: ' PERSON@Example.COM ',
    source: 'essay:event-driven-database',
    website: '',
  }
}

async function readJson(response: Response) {
  return (await response.json()) as {
    ok: boolean
    message: string
    fieldErrors?: Record<string, string>
  }
}

describe('publication alerts', () => {
  beforeEach(() => {
    mockedDeliver.mockReset()
  })

  it('validates and normalizes email and source input', () => {
    const result = validatePublicationAlertInput(validBody())

    expect(result).toEqual({
      ok: true,
      data: {
        email: 'person@example.com',
        source: 'essay:event-driven-database',
        website: '',
      },
    })
    expect(getPublicationAlertSourceTag('essay:event-driven-database')).toBe(
      'source:essay-event-driven-database',
    )
    expect(getPublicationAlertTags('essay:event-driven-database')).toEqual([
      'publication-alerts',
      'source:essay-event-driven-database',
    ])
  })

  it('rejects invalid emails, source keys, and control characters', () => {
    expect(
      validatePublicationAlertInput({
        email: 'not-an-email',
        source: 'essay:event-driven-database',
        website: '',
      }),
    ).toMatchObject({
      ok: false,
      fieldErrors: {
        email: PUBLICATION_ALERT_VALIDATION_MESSAGE,
      },
    })

    expect(
      validatePublicationAlertInput({
        email: 'person@example.com',
        source: 'bad source',
        website: '',
      }),
    ).toMatchObject({
      ok: false,
      fieldErrors: {
        source: 'Signup source is not available.',
      },
    })
  })

  it('delivers a valid signup as an idempotent success', async () => {
    mockedDeliver.mockResolvedValue({ ok: true, status: 'subscribed' })

    const response = await POST(
      alertRequest(validBody(), 'application/json', {
        Referer:
          'https://jeremybrunet.com/essays/how-to-manage-automations-event-driven-database',
      }),
    )
    const body = await readJson(response)

    expect(response.status).toBe(200)
    expect(body).toEqual({
      ok: true,
      message: PUBLICATION_ALERT_SUCCESS_MESSAGE,
    })
    expect(mockedDeliver).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'person@example.com',
        source: 'essay:event-driven-database',
        sourceUrl:
          'https://jeremybrunet.com/essays/how-to-manage-automations-event-driven-database',
        tags: ['publication-alerts', 'source:essay-event-driven-database'],
      }),
    )
  })

  it('returns generic success for honeypot submissions without delivery', async () => {
    const response = await POST(
      alertRequest({
        ...validBody(),
        website: 'filled',
      }),
    )
    const body = await readJson(response)

    expect(response.status).toBe(200)
    expect(body.message).toBe(PUBLICATION_ALERT_SUCCESS_MESSAGE)
    expect(mockedDeliver).not.toHaveBeenCalled()
  })

  it('returns safe validation and malformed request errors', async () => {
    const invalid = await POST(
      alertRequest({
        ...validBody(),
        email: 'bad',
      }),
    )
    const malformed = await POST(alertRequest('{'))

    expect(invalid.status).toBe(422)
    expect((await readJson(invalid)).message).toBe(
      PUBLICATION_ALERT_VALIDATION_MESSAGE,
    )
    expect(malformed.status).toBe(400)
    expect((await readJson(malformed)).message).toBe(
      PUBLICATION_ALERT_VALIDATION_MESSAGE,
    )
  })

  it('maps missing env, timeout, and malformed n8n responses to safe copy', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    mockedDeliver.mockRejectedValue(
      new PublicationAlertDeliveryError('missing config', 'missing-config'),
    )

    const response = await POST(alertRequest(validBody()))
    const body = await readJson(response)

    expect(response.status).toBe(503)
    expect(body.message).toBe(PUBLICATION_ALERT_UNAVAILABLE_MESSAGE)
    expect(JSON.stringify(body)).not.toMatch(/mailchimp|n8n|zod|secret|token/i)

    warn.mockRestore()
  })

  it('preserves suppressed Mailchimp states', async () => {
    mockedDeliver.mockResolvedValue({ ok: false, status: 'suppressed' })

    const response = await POST(alertRequest(validBody()))
    const body = await readJson(response)

    expect(response.status).toBe(409)
    expect(body.message).toBe(PUBLICATION_ALERT_RESUBSCRIBE_MESSAGE)
  })

  it('uses exact public form copy and explicit compact/full variants', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'components/ui/PublicationAlertForm.tsx'),
      'utf8',
    )
    const essaysPage = fs.readFileSync(
      path.join(process.cwd(), 'app/(site)/essays/page.tsx'),
      'utf8',
    )

    expect(PUBLICATION_ALERT_INVITATION).toBe(
      'Get notified when this essay is published and when I release another major essay or demo.',
    )
    expect(PUBLICATION_ALERT_HELPER).toBe(
      'No newsletter. Only occasional publication alerts. Unsubscribe anytime.',
    )
    expect(PUBLICATION_ALERT_EMAIL_LABEL).toBe('Email address')
    expect(PUBLICATION_ALERT_EMAIL_PLACEHOLDER).toBe('you@example.com')
    expect(PUBLICATION_ALERT_COMPACT_EMAIL_PLACEHOLDER).toBe(
      'email@example.com',
    )
    expect(PUBLICATION_ALERT_BUTTON_LABEL).toBe('Notify me')
    expect(PUBLICATION_ALERT_COMPACT_BUTTON_LABEL).toBe(
      'Get publication alerts',
    )
    expect(PUBLICATION_ALERT_SUCCESS_MESSAGE).toBe("You're on the list.")
    expect(source).toContain("variant?: 'compact' | 'full'")
    expect(source).toContain("const isCompact = variant === 'compact'")
    expect(source).toContain('isCompact ? null :')
    expect(source).toContain('href="/privacy"')
    expect(source).toContain('PUBLICATION_ALERT_COMPACT_EMAIL_PLACEHOLDER')
    expect(source).toContain('PUBLICATION_ALERT_COMPACT_BUTTON_LABEL')
    expect(source).not.toContain('checkbox')
    expect(essaysPage).toContain('PublicationAlertForm')
    expect(essaysPage).toContain('variant="compact"')
  })

  it('keeps source URLs same-origin and ignores untrusted client URLs', () => {
    expect(
      getPublicationAlertSourceUrl(
        alertRequest(validBody(), 'application/json', {
          Referer:
            'https://jeremybrunet.com/essays/how-to-manage-automations-event-driven-database',
        }),
      ),
    ).toBe(
      'https://jeremybrunet.com/essays/how-to-manage-automations-event-driven-database',
    )

    expect(
      getPublicationAlertSourceUrl(
        alertRequest(validBody(), 'application/json', {
          Referer: 'https://attacker.example/phish',
        }),
      ),
    ).toBe('https://jeremybrunet.com/')

    const result = validatePublicationAlertInput({
      ...validBody(),
      sourceUrl: 'https://attacker.example/phish',
    })

    expect(result.ok).toBe(false)
  })
})
