import { describe, expect, it } from 'vitest'

import { POST as POST_WAKE } from '../app/api/demos/availability/[key]/wake/route'
import { GET as GET_STATUS } from '../app/api/demos/availability/route'
import {
  createUnavailableStatuses,
  fetchDemoAvailabilityStatuses,
  normalizeDemoAvailabilityStatuses,
  normalizeDemoWakeResponse,
  resetDemoAvailabilityCacheForTests,
  wakeDemo,
} from '../lib/demos/availability'
import {
  createSignedWebhookHeaders,
  createSignedWebhookSignature,
  timingSafeEqualHex,
} from '../lib/server/signed-webhook'

const checkedAt = '2026-07-27T12:00:00.000Z'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status })
}

describe('demo availability API contracts', () => {
  it('creates unavailable statuses without provider payloads', () => {
    expect(createUnavailableStatuses(checkedAt)).toEqual({
      alan: { key: 'alan', state: 'unavailable', checkedAt },
      mlp: { key: 'mlp', state: 'unavailable', checkedAt },
    })
  })

  it('normalizes valid status responses', () => {
    expect(
      normalizeDemoAvailabilityStatuses({
        ok: true,
        statuses: {
          alan: { key: 'alan', state: 'active', checkedAt },
          mlp: { key: 'mlp', state: 'inactive', checkedAt },
        },
      }),
    ).toEqual({
      alan: { key: 'alan', state: 'active', checkedAt },
      mlp: { key: 'mlp', state: 'inactive', checkedAt },
    })
  })

  it('rejects malformed n8n status and wake responses', () => {
    expect(() =>
      normalizeDemoAvailabilityStatuses({
        ok: true,
        statuses: {
          alan: {
            key: 'alan',
            state: 'active',
            checkedAt,
            rawProviderPayload: { token: 'secret' },
          },
        },
      }),
    ).toThrow(/malformed/)

    expect(() =>
      normalizeDemoWakeResponse({ ok: true, key: 'mlp', state: 'waking' }, 'alan'),
    ).toThrow(/malformed/)
  })

  it('returns unavailable statuses when environment is missing', async () => {
    const response = await GET_STATUS(
      new Request('http://localhost:3000/api/demos/availability'),
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.statuses.alan.state).toBe('unavailable')
    expect(body.statuses.mlp.state).toBe('unavailable')
    expect(JSON.stringify(body)).not.toMatch(/token|project|webhook|secret/i)
  })

  it('signs webhook requests with HMAC SHA-256 headers', () => {
    const body = '{"key":"alan"}'
    const timestamp = '2026-07-27T12:00:00.000Z'
    const signature = createSignedWebhookSignature({
      body,
      secret: 'shared-secret',
      timestamp,
    })
    const headers = createSignedWebhookHeaders({
      body,
      secret: 'shared-secret',
      timestamp,
    })

    expect(signature).toMatch(/^[a-f0-9]{64}$/)
    expect(headers['x-jeremy-timestamp']).toBe(timestamp)
    expect(headers['x-jeremy-signature']).toBe(signature)
    expect(timingSafeEqualHex(signature, signature)).toBe(true)
    expect(timingSafeEqualHex(signature, '00')).toBe(false)
  })

  it('fetches and caches valid n8n status responses', async () => {
    resetDemoAvailabilityCacheForTests()
    let calls = 0
    const fetcher = async () => {
      calls += 1
      return jsonResponse({
        ok: true,
        statuses: {
          alan: { key: 'alan', state: 'active', checkedAt },
          mlp: { key: 'mlp', state: 'waking', checkedAt },
        },
      })
    }

    const first = await fetchDemoAvailabilityStatuses({
      fetcher: fetcher as typeof fetch,
      now: 1000,
      webhookUrl: 'https://n8n.example/status',
      signingSecret: 'secret',
    })
    const second = await fetchDemoAvailabilityStatuses({
      fetcher: fetcher as typeof fetch,
      now: 2000,
      webhookUrl: 'https://n8n.example/status',
      signingSecret: 'secret',
    })

    expect(calls).toBe(1)
    expect(first).toEqual(second)
  })

  it('surfaces timeout and malformed responses as safe errors', async () => {
    resetDemoAvailabilityCacheForTests()

    await expect(
      fetchDemoAvailabilityStatuses({
        fetcher: (async () => jsonResponse({ ok: true, provider: 'raw' })) as typeof fetch,
        force: true,
        webhookUrl: 'https://n8n.example/status',
        signingSecret: 'secret',
      }),
    ).rejects.toThrow(/malformed|failed/)

    await expect(
      fetchDemoAvailabilityStatuses({
        fetcher: (async (_input, init) => {
          init?.signal?.dispatchEvent(new Event('abort'))
          throw new DOMException('aborted', 'AbortError')
        }) as typeof fetch,
        force: true,
        timeoutMs: 1,
        webhookUrl: 'https://n8n.example/status',
        signingSecret: 'secret',
      }),
    ).rejects.toThrow(/failed/)
  })

  it('validates wake keys and safe missing-env behavior', async () => {
    const invalid = await POST_WAKE(
      new Request('http://localhost:3000/api/demos/availability/balatro/wake', {
        method: 'POST',
        body: '{}',
      }),
      { params: Promise.resolve({ key: 'balatro' }) },
    )
    const missingEnv = await POST_WAKE(
      new Request('http://localhost:3000/api/demos/availability/alan/wake', {
        method: 'POST',
        body: '{}',
      }),
      { params: Promise.resolve({ key: 'alan' }) },
    )

    expect(invalid.status).toBe(404)
    expect(await invalid.text()).not.toMatch(/supabase|n8n|secret|token/i)
    expect(missingEnv.status).toBe(503)
    expect(await missingEnv.text()).not.toMatch(/supabase|n8n|secret|token/i)
  })

  it('normalizes successful wake requests', async () => {
    await expect(
      wakeDemo('alan', {
        fetcher: (async () =>
          jsonResponse({ ok: true, key: 'alan', state: 'waking' })) as typeof fetch,
        webhookUrl: 'https://n8n.example/wake',
        signingSecret: 'secret',
      }),
    ).resolves.toEqual({ ok: true, key: 'alan', state: 'waking' })
  })
})
