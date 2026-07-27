import { z } from 'zod'

import {
  demoAvailabilityKeySchema,
  demoAvailabilityKeys,
  type DemoAvailabilityKey,
} from '@/lib/content/demos'
import {
  demoAvailabilityStates,
  type DemoAvailabilityStatuses,
} from '@/lib/demos/availability-contract'
import { readBoundedText } from '@/lib/server/http'
import { createSignedWebhookHeaders } from '@/lib/server/signed-webhook'

export { demoAvailabilityLabels } from '@/lib/demos/availability-contract'
export type {
  DemoAvailabilityState,
  DemoAvailabilityStatus,
  DemoAvailabilityStatuses,
} from '@/lib/demos/availability-contract'

export const DEMO_AVAILABILITY_CACHE_SECONDS = 15
export const DEMO_AVAILABILITY_TIMEOUT_MS = 6000
export const DEMO_AVAILABILITY_RESPONSE_MAX_BYTES = 20_000
export const DEMO_WAKE_RESPONSE_MAX_BYTES = 6000

const n8nStatusSchema = z
  .object({
    ok: z.literal(true),
    statuses: z.record(
      demoAvailabilityKeySchema,
      z
        .object({
          key: demoAvailabilityKeySchema,
          state: z.enum(demoAvailabilityStates),
          checkedAt: z.string().datetime(),
        })
        .strict(),
    ),
  })
  .strict()

const n8nWakeSchema = z
  .object({
    ok: z.literal(true),
    key: demoAvailabilityKeySchema,
    state: z.literal('waking'),
  })
  .strict()

let statusCache:
  | {
      expiresAt: number
      statuses: DemoAvailabilityStatuses
    }
  | undefined

export class DemoAvailabilityError extends Error {
  constructor(
    message: string,
    readonly category:
      | 'missing-config'
      | 'http-error'
      | 'network-error'
      | 'malformed-response',
  ) {
    super(message)
    this.name = 'DemoAvailabilityError'
  }
}

export function createUnavailableStatuses(checkedAt = new Date().toISOString()) {
  return Object.fromEntries(
    demoAvailabilityKeys.map((key) => [
      key,
      {
        key,
        state: 'unavailable' as const,
        checkedAt,
      },
    ]),
  ) as DemoAvailabilityStatuses
}

export function normalizeDemoAvailabilityStatuses(input: unknown) {
  const result = n8nStatusSchema.safeParse(input)

  if (!result.success) {
    throw new DemoAvailabilityError(
      'Demo status webhook returned a malformed response.',
      'malformed-response',
    )
  }

  const checkedAt = new Date().toISOString()
  const fallback = createUnavailableStatuses(checkedAt)

  return Object.fromEntries(
    demoAvailabilityKeys.map((key) => {
      const status = result.data.statuses[key]

      return [
        key,
        status?.key === key
          ? {
              key,
              state: status.state,
              checkedAt: status.checkedAt,
            }
          : fallback[key],
      ]
    }),
  ) as DemoAvailabilityStatuses
}

export function normalizeDemoWakeResponse(input: unknown, key: DemoAvailabilityKey) {
  const result = n8nWakeSchema.safeParse(input)

  if (!result.success || result.data.key !== key) {
    throw new DemoAvailabilityError(
      'Demo wake webhook returned a malformed response.',
      'malformed-response',
    )
  }

  return {
    ok: true as const,
    key,
    state: result.data.state,
  }
}

export async function fetchDemoAvailabilityStatuses(
  options: {
    fetcher?: typeof fetch
    force?: boolean
    now?: number
    timeoutMs?: number
    webhookUrl?: string
    signingSecret?: string
  } = {},
) {
  const now = options.now ?? Date.now()

  if (!options.force && statusCache && statusCache.expiresAt > now) {
    return statusCache.statuses
  }

  const webhookUrl = options.webhookUrl ?? process.env.DEMO_STATUS_WEBHOOK_URL
  const signingSecret =
    options.signingSecret ?? process.env.DEMO_WEBHOOK_SIGNING_SECRET

  if (!webhookUrl || !signingSecret) {
    throw new DemoAvailabilityError(
      'Demo availability webhook is not configured.',
      'missing-config',
    )
  }

  const body = JSON.stringify({
    keys: demoAvailabilityKeys,
  })
  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEMO_AVAILABILITY_TIMEOUT_MS,
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
      throw new DemoAvailabilityError(
        'Demo availability webhook returned an unsuccessful status.',
        'http-error',
      )
    }

    const rawResponse = await readBoundedText(
      response,
      DEMO_AVAILABILITY_RESPONSE_MAX_BYTES,
    )
    const statuses = normalizeDemoAvailabilityStatuses(JSON.parse(rawResponse))

    statusCache = {
      expiresAt: now + DEMO_AVAILABILITY_CACHE_SECONDS * 1000,
      statuses,
    }

    return statuses
  } catch (error) {
    if (error instanceof DemoAvailabilityError) {
      throw error
    }

    throw new DemoAvailabilityError(
      'Demo availability webhook request failed.',
      'network-error',
    )
  } finally {
    clearTimeout(timeout)
  }
}

export async function wakeDemo(
  key: DemoAvailabilityKey,
  options: {
    fetcher?: typeof fetch
    timeoutMs?: number
    webhookUrl?: string
    signingSecret?: string
  } = {},
) {
  const webhookUrl = options.webhookUrl ?? process.env.DEMO_WAKE_WEBHOOK_URL
  const signingSecret =
    options.signingSecret ?? process.env.DEMO_WEBHOOK_SIGNING_SECRET

  if (!webhookUrl || !signingSecret) {
    throw new DemoAvailabilityError(
      'Demo wake webhook is not configured.',
      'missing-config',
    )
  }

  const body = JSON.stringify({ key })
  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEMO_AVAILABILITY_TIMEOUT_MS,
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
      throw new DemoAvailabilityError(
        'Demo wake webhook returned an unsuccessful status.',
        'http-error',
      )
    }

    const rawResponse = await readBoundedText(
      response,
      DEMO_WAKE_RESPONSE_MAX_BYTES,
    )

    statusCache = undefined

    return normalizeDemoWakeResponse(JSON.parse(rawResponse), key)
  } catch (error) {
    if (error instanceof DemoAvailabilityError) {
      throw error
    }

    throw new DemoAvailabilityError(
      'Demo wake webhook request failed.',
      'network-error',
    )
  } finally {
    clearTimeout(timeout)
  }
}

export function resetDemoAvailabilityCacheForTests() {
  statusCache = undefined
}
