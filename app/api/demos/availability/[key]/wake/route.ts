import { isDemoAvailabilityKey } from '@/lib/content/demos'
import {
  DemoAvailabilityError,
  wakeDemo,
} from '@/lib/demos/availability'
import { readBoundedRequestBody } from '@/lib/server/http'

type WakeRouteProps = {
  params: Promise<{
    key: string
  }>
}

export async function POST(request: Request, { params }: WakeRouteProps) {
  const { key } = await params

  if (!isDemoAvailabilityKey(key)) {
    return jsonResponse(
      {
        ok: false,
        message: 'Demo availability is not available for this key.',
      },
      404,
    )
  }

  let rawBody = ''

  try {
    rawBody = await readBoundedRequestBody(request, 2000)
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: 'Wake request could not be accepted.',
      },
      413,
    )
  }

  if (!isValidWakeBody(rawBody)) {
    return jsonResponse(
      {
        ok: false,
        message: 'Wake request could not be accepted.',
      },
      400,
    )
  }

  const fixture = getLocalFixture(request, key)

  if (fixture) {
    return jsonResponse(fixture, 200)
  }

  try {
    return jsonResponse(await wakeDemo(key), 200)
  } catch (error) {
    const status =
      error instanceof DemoAvailabilityError &&
      error.category === 'missing-config'
        ? 503
        : 502

    return jsonResponse(
      {
        ok: false,
        key,
        message:
          'This demo could not be woken right now. Please try again in a moment.',
      },
      status,
    )
  }
}

function isValidWakeBody(rawBody: string) {
  if (!rawBody.trim()) {
    return true
  }

  try {
    const parsed = JSON.parse(rawBody)

    return (
      parsed !== null &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed) &&
      Object.keys(parsed).length === 0
    )
  } catch {
    return false
  }
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
    },
  })
}

function getLocalFixture(request: Request, key: string) {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.SCREENSHOT_FIXTURES !== '1'
  ) {
    return undefined
  }

  const fixture = new URL(request.url).searchParams.get('fixture')

  if (fixture !== 'waking') {
    return undefined
  }

  return {
    ok: true,
    key,
    state: 'waking',
  }
}
