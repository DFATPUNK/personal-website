import { describe, expect, it } from 'vitest'

import { POST as POST_WAKE } from '../app/api/demos/availability/[key]/wake/route'
import { GET as GET_STATUS } from '../app/api/demos/availability/route'
import {
  createDemoWebhookBody,
  createUnavailableStatuses,
  fetchDemoAvailabilityStatuses,
  normalizeDemoHealthResponse,
  normalizeDemoProjectStateResponse,
  normalizeDemoWakeResponse,
  resetDemoAvailabilityCacheForTests,
  resolveDemoProjectRef,
  wakeDemo,
} from '../lib/demos/availability'
import {
  SIGNED_WEBHOOK_SIGNATURE_HEADER,
  SIGNED_WEBHOOK_TIMESTAMP_HEADER,
  createSignedWebhookHeaders,
  createSignedWebhookSignature,
  timingSafeEqualHex,
} from '../lib/server/signed-webhook'

const checkedAt = '2026-07-27T12:00:00.000Z'
const alanRef = 'abcdefghijklmnopqrst'
const mlpRef = 'qrstuvwxyzabcdefghij'
const testEnv = {
  ALAN_SUPABASE_PROJECT_REF: alanRef,
  DEMO_HEALTH_WEBHOOK_URL: 'https://n8n.example/health',
  DEMO_STATUS_WEBHOOK_URL: 'https://n8n.example/status',
  DEMO_WAKE_WEBHOOK_URL: 'https://n8n.example/wake',
  DEMO_WEBHOOK_SIGNING_SECRET: 'secret',
  MLP_SUPABASE_PROJECT_REF: mlpRef,
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status })
}

function readRequestBody(init?: RequestInit) {
  return typeof init?.body === 'string' ? init.body : ''
}

function hasSignedHeaders(init?: RequestInit) {
  const headers = init?.headers

  if (!headers) {
    return false
  }

  if (headers instanceof Headers) {
    return (
      headers.has(SIGNED_WEBHOOK_TIMESTAMP_HEADER) &&
      headers.has(SIGNED_WEBHOOK_SIGNATURE_HEADER)
    )
  }

  if (Array.isArray(headers)) {
    const headerNames = headers.map(([name]) => name.toLowerCase())

    return (
      headerNames.includes(SIGNED_WEBHOOK_TIMESTAMP_HEADER) &&
      headerNames.includes(SIGNED_WEBHOOK_SIGNATURE_HEADER)
    )
  }

  return (
    Boolean(headers[SIGNED_WEBHOOK_TIMESTAMP_HEADER]) &&
    Boolean(headers[SIGNED_WEBHOOK_SIGNATURE_HEADER])
  )
}

describe('demo availability API contracts', () => {
  it('creates unavailable statuses without provider payloads', () => {
    expect(createUnavailableStatuses(checkedAt)).toEqual({
      alan: { key: 'alan', state: 'unavailable', checkedAt },
      mlp: { key: 'mlp', state: 'unavailable', checkedAt },
    })
  })

  it('resolves only exact logical keys to server-only project refs', () => {
    expect(resolveDemoProjectRef('alan', testEnv)).toBe(alanRef)
    expect(resolveDemoProjectRef('mlp', testEnv)).toBe(mlpRef)
    expect(createDemoWebhookBody(alanRef)).toBe(
      '{"ref":"abcdefghijklmnopqrst"}',
    )

    expect(() =>
      resolveDemoProjectRef('alan', {
        ...testEnv,
        ALAN_SUPABASE_PROJECT_REF: undefined,
      }),
    ).toThrow(/missing or malformed/)
    expect(() =>
      resolveDemoProjectRef('mlp', {
        ...testEnv,
        MLP_SUPABASE_PROJECT_REF: 'bad-ref',
      }),
    ).toThrow(/missing or malformed/)
    expect(() => createDemoWebhookBody('bad-ref')).toThrow(
      /missing or malformed/,
    )
  })

  it('does not expose refs in the public demo registry', async () => {
    const { getPublicDemos } = await import('../lib/content/demos')

    expect(JSON.stringify(getPublicDemos())).not.toContain(alanRef)
    expect(JSON.stringify(getPublicDemos())).not.toContain(mlpRef)
  })

  it('normalizes project state and rejects returned-ref mismatch', () => {
    expect(
      normalizeDemoProjectStateResponse(
        {
          ref: alanRef,
          status: 'INACTIVE',
          rawProviderPayload: { token: 'secret' },
        },
        alanRef,
      ),
    ).toEqual({
      ref: alanRef,
      status: 'INACTIVE',
    })

    expect(() =>
      normalizeDemoProjectStateResponse(
        { ref: mlpRef, status: 'ACTIVE_HEALTHY' },
        alanRef,
      ),
    ).toThrow(/malformed/)
  })

  it('normalizes service health responses without exposing raw provider data', () => {
    expect(
      normalizeDemoHealthResponse([
        { name: 'rest', healthy: true, status: 'OK' },
        { name: 'db', healthy: true },
      ]),
    ).toBe('active')
    expect(
      normalizeDemoHealthResponse([
        { name: 'rest', healthy: true },
        { name: 'db', healthy: false, status: 'COMING_UP' },
      ]),
    ).toBe('waking')
    expect(() => normalizeDemoHealthResponse([])).toThrow(/malformed/)
    expect(() =>
      normalizeDemoHealthResponse([{ name: '', healthy: true }]),
    ).toThrow(/malformed/)
  })

  it('returns unavailable statuses when all external variables are unset', async () => {
    const response = await GET_STATUS(
      new Request('http://localhost:3000/api/demos/availability'),
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.statuses.alan.state).toBe('unavailable')
    expect(body.statuses.mlp.state).toBe('unavailable')
    expect(JSON.stringify(body)).not.toMatch(
      /abcdefghijklmnopqrst|qrstuvwxyzabcdefghij|token|project|webhook|secret/i,
    )
  })

  it('rejects status orchestration when any required availability variable is missing', async () => {
    resetDemoAvailabilityCacheForTests()

    await expect(
      fetchDemoAvailabilityStatuses({
        env: {
          ...testEnv,
          DEMO_WAKE_WEBHOOK_URL: undefined,
        },
        fetcher: (async () =>
          jsonResponse({ ref: alanRef, status: 'INACTIVE' })) as typeof fetch,
        force: true,
      }),
    ).rejects.toThrow(/not configured/)
  })

  it('signs webhook requests with HMAC SHA-256 headers', () => {
    const body = '{"ref":"abcdefghijklmnopqrst"}'
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
    expect(headers[SIGNED_WEBHOOK_TIMESTAMP_HEADER]).toBe(timestamp)
    expect(headers[SIGNED_WEBHOOK_SIGNATURE_HEADER]).toBe(signature)
    expect(timingSafeEqualHex(signature, signature)).toBe(true)
    expect(timingSafeEqualHex(signature, '00')).toBe(false)
  })

  it('orchestrates status and health webhooks and caches results', async () => {
    resetDemoAvailabilityCacheForTests()
    const calls: Array<{ body: string; signed: boolean; url: string }> = []
    const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString()
      const body = readRequestBody(init)
      calls.push({
        body,
        signed: hasSignedHeaders(init),
        url,
      })
      const ref = JSON.parse(body).ref as string

      if (url.endsWith('/status')) {
        return jsonResponse({
          ref,
          status: ref === alanRef ? 'INACTIVE' : 'ACTIVE_HEALTHY',
          rawProviderPayload: { secret: 'not-public' },
        })
      }

      return jsonResponse([{ name: 'rest', healthy: true, status: 'OK' }])
    }

    const first = await fetchDemoAvailabilityStatuses({
      env: testEnv,
      fetcher: fetcher as typeof fetch,
      now: 1000,
    })
    const second = await fetchDemoAvailabilityStatuses({
      env: testEnv,
      fetcher: fetcher as typeof fetch,
      now: 2000,
    })

    expect(first.alan.state).toBe('inactive')
    expect(first.mlp.state).toBe('active')
    expect(second).toEqual(first)
    expect(calls).toHaveLength(3)
    expect(calls.map((call) => call.body)).toEqual([
      '{"ref":"abcdefghijklmnopqrst"}',
      '{"ref":"qrstuvwxyzabcdefghij"}',
      '{"ref":"qrstuvwxyzabcdefghij"}',
    ])
    expect(calls.every((call) => call.signed)).toBe(true)
    expect(JSON.stringify(first)).not.toMatch(/ref|ACTIVE_HEALTHY|secret/)
  })

  it('maps unhealthy service health to waking', async () => {
    resetDemoAvailabilityCacheForTests()
    const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
      const ref = JSON.parse(readRequestBody(init)).ref as string

      if (input.toString().endsWith('/status')) {
        return jsonResponse({ ref, status: 'ACTIVE_HEALTHY' })
      }

      return jsonResponse([{ name: 'rest', healthy: ref !== alanRef }])
    }

    const statuses = await fetchDemoAvailabilityStatuses({
      env: testEnv,
      fetcher: fetcher as typeof fetch,
      force: true,
    })

    expect(statuses.alan.state).toBe('waking')
    expect(statuses.mlp.state).toBe('active')
  })

  it('keeps one project failure from forcing the other unavailable', async () => {
    resetDemoAvailabilityCacheForTests()
    const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
      const ref = JSON.parse(readRequestBody(init)).ref as string

      if (ref === alanRef) {
        return jsonResponse({ ref: mlpRef, status: 'ACTIVE_HEALTHY' })
      }

      if (input.toString().endsWith('/status')) {
        return jsonResponse({ ref, status: 'ACTIVE_HEALTHY' })
      }

      return jsonResponse([{ name: 'rest', healthy: true }])
    }

    const statuses = await fetchDemoAvailabilityStatuses({
      env: testEnv,
      fetcher: fetcher as typeof fetch,
      force: true,
    })

    expect(statuses.alan.state).toBe('unavailable')
    expect(statuses.mlp.state).toBe('active')
  })

  it('surfaces empty or malformed health responses as unavailable', async () => {
    resetDemoAvailabilityCacheForTests()
    const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
      const ref = JSON.parse(readRequestBody(init)).ref as string

      if (input.toString().endsWith('/status')) {
        return jsonResponse({ ref, status: 'ACTIVE_HEALTHY' })
      }

      return jsonResponse(ref === alanRef ? [] : { provider: 'raw' })
    }

    const statuses = await fetchDemoAvailabilityStatuses({
      env: testEnv,
      fetcher: fetcher as typeof fetch,
      force: true,
    })

    expect(statuses.alan.state).toBe('unavailable')
    expect(statuses.mlp.state).toBe('unavailable')
  })

  it('validates wake keys, ignores browser refs, and keeps missing env safe', async () => {
    const invalid = await POST_WAKE(
      new Request('http://localhost:3000/api/demos/availability/balatro/wake', {
        method: 'POST',
        body: '{}',
      }),
      { params: Promise.resolve({ key: 'balatro' }) },
    )
    const browserRef = await POST_WAKE(
      new Request('http://localhost:3000/api/demos/availability/alan/wake', {
        method: 'POST',
        body: JSON.stringify({ ref: alanRef }),
      }),
      { params: Promise.resolve({ key: 'alan' }) },
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
    expect(browserRef.status).toBe(400)
    expect(await browserRef.text()).not.toMatch(alanRef)
    expect(missingEnv.status).toBe(503)
    expect(await missingEnv.text()).not.toMatch(/supabase|n8n|secret|token/i)
  })

  it('normalizes valid empty-object restore responses to public waking', async () => {
    const calls: Array<{ body: string; signed: boolean; url: string }> = []

    await expect(
      wakeDemo('alan', {
        env: testEnv,
        fetcher: (async (input, init) => {
          calls.push({
            body: readRequestBody(init),
            signed: hasSignedHeaders(init),
            url: input.toString(),
          })

          return jsonResponse({})
        }) as typeof fetch,
      }),
    ).resolves.toEqual({ ok: true, key: 'alan', state: 'waking' })

    expect(calls).toEqual([
      {
        body: '{"ref":"abcdefghijklmnopqrst"}',
        signed: true,
        url: 'https://n8n.example/wake',
      },
    ])
    expect(normalizeDemoWakeResponse({}, 'alan')).toEqual({
      ok: true,
      key: 'alan',
      state: 'waking',
    })
    expect(() =>
      normalizeDemoWakeResponse({ ref: alanRef }, 'alan'),
    ).toThrow(/malformed/)
  })
})
