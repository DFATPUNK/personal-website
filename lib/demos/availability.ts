import { z } from 'zod'

import {
  demoAvailabilityKeys,
  type DemoAvailabilityKey,
} from '@/lib/content/demos'
import {
  type DemoAvailabilityState,
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

const demoProjectRefSchema = z.string().regex(/^[a-z0-9]{20}$/)

const projectStateResponseSchema = z
  .object({
    ref: demoProjectRefSchema,
    status: z.string().trim().min(1),
  })
  .passthrough()

const restoreResponseSchema = z.object({}).strict()

type AvailabilityEnvironment = Record<string, string | undefined>

type DemoAvailabilityConfig = {
  projectRefs: Record<DemoAvailabilityKey, string>
  signingSecret: string
  statusWebhookUrl: string
  wakeWebhookUrl: string
}

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

export function resolveDemoProjectRef(
  key: DemoAvailabilityKey,
  env: AvailabilityEnvironment = process.env,
) {
  const envName =
    key === 'alan' ? 'ALAN_SUPABASE_PROJECT_REF' : 'MLP_SUPABASE_PROJECT_REF'
  const result = demoProjectRefSchema.safeParse(env[envName])

  if (!result.success) {
    throw new DemoAvailabilityError(
      'Demo project ref is missing or malformed.',
      'missing-config',
    )
  }

  return result.data
}

export function createDemoWebhookBody(ref: string) {
  const result = demoProjectRefSchema.safeParse(ref)

  if (!result.success) {
    throw new DemoAvailabilityError(
      'Demo project ref is missing or malformed.',
      'missing-config',
    )
  }

  return JSON.stringify({ ref: result.data })
}

export function normalizeDemoProjectStateResponse(
  input: unknown,
  requestedRef: string,
) {
  const result = projectStateResponseSchema.safeParse(input)

  if (!result.success || result.data.ref !== requestedRef) {
    throw new DemoAvailabilityError(
      'Demo status webhook returned a malformed response.',
      'malformed-response',
    )
  }

  return {
    ref: result.data.ref,
    status: result.data.status.trim().toUpperCase(),
  }
}

export function normalizeDemoProjectStatus(
  status: string,
): DemoAvailabilityState {
  const normalizedStatus = status.trim().toUpperCase()

  if (!normalizedStatus) {
    throw new DemoAvailabilityError(
      'Demo status webhook returned a malformed response.',
      'malformed-response',
    )
  }

  if (normalizedStatus === 'INACTIVE') {
    return 'inactive'
  }

  if (normalizedStatus === 'ACTIVE_HEALTHY') {
    return 'active'
  }

  return 'waking'
}

export function normalizeDemoWakeResponse(
  input: unknown,
  key: DemoAvailabilityKey,
) {
  const result = restoreResponseSchema.safeParse(input)

  if (!result.success) {
    throw new DemoAvailabilityError(
      'Demo wake webhook returned a malformed response.',
      'malformed-response',
    )
  }

  return {
    ok: true as const,
    key,
    state: 'waking' as const,
  }
}

export async function fetchDemoAvailabilityStatuses(
  options: {
    env?: AvailabilityEnvironment
    fetcher?: typeof fetch
    force?: boolean
    now?: number
    signingSecret?: string
    statusWebhookUrl?: string
    timeoutMs?: number
  } = {},
) {
  const now = options.now ?? Date.now()

  if (!options.force && statusCache && statusCache.expiresAt > now) {
    return statusCache.statuses
  }

  const config = getDemoAvailabilityConfig(options)
  const checkedAt = new Date().toISOString()
  const fetcher = options.fetcher ?? fetch
  const statuses = Object.fromEntries(
    await Promise.all(
      demoAvailabilityKeys.map(async (key) => {
        try {
          const state = await fetchDemoAvailabilityState(key, {
            config,
            fetcher,
            timeoutMs: options.timeoutMs,
          })

          return [
            key,
            {
              key,
              state,
              checkedAt,
            },
          ]
        } catch {
          return [
            key,
            {
              key,
              state: 'unavailable' as const,
              checkedAt,
            },
          ]
        }
      }),
    ),
  ) as DemoAvailabilityStatuses

  statusCache = {
    expiresAt: now + DEMO_AVAILABILITY_CACHE_SECONDS * 1000,
    statuses,
  }

  return statuses
}

async function fetchDemoAvailabilityState(
  key: DemoAvailabilityKey,
  {
    config,
    fetcher,
    timeoutMs,
  }: {
    config: DemoAvailabilityConfig
    fetcher: typeof fetch
    timeoutMs: number | undefined
  },
): Promise<DemoAvailabilityState> {
  const ref = config.projectRefs[key]
  const projectState = await postSignedWebhookJson({
    body: createDemoWebhookBody(ref),
    fetcher,
    responseMaxBytes: DEMO_AVAILABILITY_RESPONSE_MAX_BYTES,
    signingSecret: config.signingSecret,
    timeoutMs,
    webhookUrl: config.statusWebhookUrl,
  })
  const normalizedProject = normalizeDemoProjectStateResponse(projectState, ref)

  return normalizeDemoProjectStatus(normalizedProject.status)
}

export async function wakeDemo(
  key: DemoAvailabilityKey,
  options: {
    env?: AvailabilityEnvironment
    fetcher?: typeof fetch
    signingSecret?: string
    timeoutMs?: number
    wakeWebhookUrl?: string
  } = {},
) {
  const config = getDemoWakeConfig(key, options)
  const response = await postSignedWebhookJson({
    body: createDemoWebhookBody(config.ref),
    fetcher: options.fetcher ?? fetch,
    responseMaxBytes: DEMO_WAKE_RESPONSE_MAX_BYTES,
    signingSecret: config.signingSecret,
    timeoutMs: options.timeoutMs,
    webhookUrl: config.wakeWebhookUrl,
  })

  statusCache = undefined

  return normalizeDemoWakeResponse(response, key)
}

function getDemoAvailabilityConfig({
  env = process.env,
  signingSecret,
  statusWebhookUrl,
}: {
  env?: AvailabilityEnvironment
  signingSecret?: string
  statusWebhookUrl?: string
}): DemoAvailabilityConfig {
  const config = {
    projectRefs: {
      alan: resolveDemoProjectRef('alan', env),
      mlp: resolveDemoProjectRef('mlp', env),
    },
    signingSecret: signingSecret ?? env.DEMO_WEBHOOK_SIGNING_SECRET,
    statusWebhookUrl: statusWebhookUrl ?? env.DEMO_STATUS_WEBHOOK_URL,
    wakeWebhookUrl: env.DEMO_WAKE_WEBHOOK_URL,
  }

  if (
    !config.statusWebhookUrl ||
    !config.wakeWebhookUrl ||
    !config.signingSecret
  ) {
    throw new DemoAvailabilityError(
      'Demo availability webhooks are not configured.',
      'missing-config',
    )
  }

  return config as DemoAvailabilityConfig
}

function getDemoWakeConfig(
  key: DemoAvailabilityKey,
  {
    env = process.env,
    signingSecret,
    wakeWebhookUrl,
  }: {
    env?: AvailabilityEnvironment
    signingSecret?: string
    wakeWebhookUrl?: string
  },
) {
  const config = {
    ref: resolveDemoProjectRef(key, env),
    signingSecret: signingSecret ?? env.DEMO_WEBHOOK_SIGNING_SECRET,
    wakeWebhookUrl: wakeWebhookUrl ?? env.DEMO_WAKE_WEBHOOK_URL,
  }

  if (!config.signingSecret || !config.wakeWebhookUrl) {
    throw new DemoAvailabilityError(
      'Demo wake webhook is not configured.',
      'missing-config',
    )
  }

  return config as {
    ref: string
    signingSecret: string
    wakeWebhookUrl: string
  }
}

async function postSignedWebhookJson({
  body,
  fetcher,
  responseMaxBytes,
  signingSecret,
  timeoutMs = DEMO_AVAILABILITY_TIMEOUT_MS,
  webhookUrl,
}: {
  body: string
  fetcher: typeof fetch
  responseMaxBytes: number
  signingSecret: string
  timeoutMs: number | undefined
  webhookUrl: string
}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetcher(webhookUrl, {
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

    const rawResponse = await readBoundedText(response, responseMaxBytes)

    try {
      return JSON.parse(rawResponse) as unknown
    } catch {
      throw new DemoAvailabilityError(
        'Demo availability webhook returned malformed JSON.',
        'malformed-response',
      )
    }
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

export function resetDemoAvailabilityCacheForTests() {
  statusCache = undefined
}
