import {
  DEMO_AVAILABILITY_CACHE_SECONDS,
  createUnavailableStatuses,
  fetchDemoAvailabilityStatuses,
} from '@/lib/demos/availability'

export async function GET(request: Request) {
  const fixture = getLocalFixture(request)

  if (fixture) {
    return jsonResponse(
      {
        ok: true,
        statuses: fixture,
      },
      200,
    )
  }

  try {
    const statuses = await fetchDemoAvailabilityStatuses()

    return jsonResponse(
      {
        ok: true,
        statuses,
      },
      200,
    )
  } catch {
    return jsonResponse(
      {
        ok: true,
        statuses: createUnavailableStatuses(),
      },
      200,
    )
  }
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Cache-Control': `public, max-age=0, s-maxage=${DEMO_AVAILABILITY_CACHE_SECONDS}, stale-while-revalidate=30`,
      'Content-Type': 'application/json',
    },
  })
}

function getLocalFixture(request: Request) {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.SCREENSHOT_FIXTURES !== '1'
  ) {
    return undefined
  }

  const url = new URL(request.url)
  const fixture = url.searchParams.get('fixture')

  if (!fixture) {
    return undefined
  }

  const checkedAt = new Date('2026-07-27T12:00:00.000Z').toISOString()

  if (fixture === 'active') {
    return {
      alan: { key: 'alan', state: 'active', checkedAt },
      mlp: { key: 'mlp', state: 'active', checkedAt },
    }
  }

  if (fixture === 'mixed') {
    return {
      alan: { key: 'alan', state: 'waking', checkedAt },
      mlp: { key: 'mlp', state: 'inactive', checkedAt },
    }
  }

  if (fixture === 'unavailable') {
    return {
      alan: { key: 'alan', state: 'unavailable', checkedAt },
      mlp: { key: 'mlp', state: 'unavailable', checkedAt },
    }
  }

  return undefined
}
