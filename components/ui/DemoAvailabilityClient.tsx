'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { DemoAvailabilityIndicator } from '@/components/ui/DemoAvailabilityIndicator'
import { type DemoAvailabilityKey } from '@/lib/content/demos'
import {
  demoAvailabilityStates,
  type DemoAvailabilityState,
  type DemoAvailabilityStatus,
} from '@/lib/demos/availability-contract'

type DemoAvailabilityClientProps = {
  availabilityKey: DemoAvailabilityKey
  mode: 'index' | 'context'
}

const pollMs = 9000
const maxWaitMs = 5 * 60 * 1000
const retryDelayMs = 30_000

export function DemoAvailabilityClient({
  availabilityKey,
  mode,
}: DemoAvailabilityClientProps) {
  const [state, setState] = useState<DemoAvailabilityState>('unavailable')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [retryReady, setRetryReady] = useState(false)
  const [wakeInFlight, setWakeInFlight] = useState(false)
  const wakeAttemptedRef = useRef(false)
  const wakeFailedRef = useRef(false)
  const wakeInFlightRef = useRef(false)
  const startedAtRef = useRef(Date.now())
  const statusRequestCountRef = useRef(0)
  const retryWakeRef = useRef<(() => void) | null>(null)

  const sessionStorageKey = useMemo(
    () => `demo-wake-attempted:${availabilityKey}`,
    [availabilityKey],
  )

  useEffect(() => {
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    let stopped = false

    function clearTimer() {
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }
    }

    function schedule(callback: () => void, delay: number) {
      clearTimer()
      timer = setTimeout(callback, delay)
    }

    function canKeepWaiting() {
      return Date.now() - startedAtRef.current < maxWaitMs
    }

    async function fetchStatus() {
      try {
        const statusRequestCount = statusRequestCountRef.current
        statusRequestCountRef.current += 1

        const response = await fetch(getStatusUrl(statusRequestCount), {
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Status request failed.')
        }

        const payload = (await response.json()) as {
          statuses?: Partial<Record<DemoAvailabilityKey, DemoAvailabilityStatus>>
        }
        const nextState = payload.statuses?.[availabilityKey]?.state

        if (!nextState || !demoAvailabilityStates.includes(nextState)) {
          throw new Error('Status response was malformed.')
        }

        if (stopped) {
          return
        }

        setState(nextState)
        setLoading(false)
        setMessage('')
        setRetryReady(false)

        if (mode === 'context') {
          await handleContextState(nextState)
          return
        }

        handleIndexState(nextState)
      } catch {
        if (controller.signal.aborted || stopped) {
          return
        }

        setState('unavailable')
        setLoading(false)
        setMessage('Status is temporarily unavailable.')
        setRetryReady(false)
      }
    }

    function handleIndexState(nextState: DemoAvailabilityState) {
      if (nextState === 'waking' && canKeepWaiting()) {
        schedule(fetchStatus, pollMs)
      }
    }

    async function handleContextState(nextState: DemoAvailabilityState) {
      if (nextState === 'active' || nextState === 'unavailable') {
        return
      }

      if (nextState === 'inactive' && !wakeFailedRef.current) {
        const canAttemptWake =
          !isLocalWakeGuardEnabled() &&
          !wakeAttemptedRef.current &&
          window.sessionStorage.getItem(sessionStorageKey) !== 'true'

        if (canAttemptWake) {
          wakeAttemptedRef.current = true
          await requestWake()
          return
        }
      }

      if (nextState === 'waking' && canKeepWaiting()) {
        schedule(fetchStatus, pollMs)
      }
    }

    async function requestWake() {
      if (wakeInFlightRef.current) {
        return
      }

      wakeInFlightRef.current = true
      window.sessionStorage.setItem(sessionStorageKey, 'true')
      setWakeInFlight(true)
      setRetryReady(false)
      clearTimer()

      try {
        const response = await fetch(getWakeUrl(availabilityKey), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: '{}',
          cache: 'no-store',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Wake request failed.')
        }

        const payload = (await response.json()) as {
          ok?: boolean
          state?: DemoAvailabilityState
        }

        if (payload.ok !== true || payload.state !== 'waking') {
          throw new Error('Wake response was malformed.')
        }

        if (stopped) {
          return
        }

        wakeFailedRef.current = false
        setState('waking')
        setLoading(false)
        setRetryReady(false)
        setMessage('Starting the database. This can take a few minutes.')
        schedule(fetchStatus, pollMs)
      } catch {
        if (controller.signal.aborted || stopped) {
          return
        }

        wakeFailedRef.current = true
        window.sessionStorage.removeItem(sessionStorageKey)
        setState('inactive')
        setLoading(false)
        setRetryReady(false)
        setMessage(
          'Wake-up could not start. You can retry after a short pause.',
        )
        schedule(() => {
          if (!stopped) {
            setRetryReady(true)
          }
        }, getRetryDelayMs())
      } finally {
        wakeInFlightRef.current = false

        if (!stopped) {
          setWakeInFlight(false)
        }
      }
    }

    retryWakeRef.current = () => {
      wakeFailedRef.current = false
      wakeAttemptedRef.current = true
      void requestWake()
    }

    fetchStatus()

    return () => {
      stopped = true
      controller.abort()
      retryWakeRef.current = null
      clearTimer()
    }
  }, [availabilityKey, mode, sessionStorageKey])

  return (
    <span className="inline-flex flex-col gap-1">
      <DemoAvailabilityIndicator loading={loading} state={state} />
      {message ? (
        <span className="max-w-[26rem] text-xs leading-5 text-[var(--muted-foreground)]">
          {message}
        </span>
      ) : null}
      {mode === 'context' && retryReady ? (
        <button
          className="demo-availability__retry"
          disabled={wakeInFlight}
          onClick={() => retryWakeRef.current?.()}
          type="button"
        >
          Retry wake-up
        </button>
      ) : null}
    </span>
  )
}

function getStatusUrl(statusRequestCount: number) {
  if (typeof window === 'undefined') {
    return '/api/demos/availability'
  }

  const search = new URLSearchParams(window.location.search)
  const fixture = search.get('availabilityFixture')

  return fixture
    ? `/api/demos/availability?fixture=${encodeURIComponent(fixture)}&step=${statusRequestCount}`
    : '/api/demos/availability'
}

function getWakeUrl(key: DemoAvailabilityKey) {
  if (typeof window === 'undefined') {
    return `/api/demos/availability/${key}/wake`
  }

  const search = new URLSearchParams(window.location.search)
  const fixture = search.get('wakeFixture')
  const path = `/api/demos/availability/${key}/wake`

  return fixture ? `${path}?fixture=${encodeURIComponent(fixture)}` : path
}

function isLocalWakeGuardEnabled() {
  if (!isLocalFixtureRuntime()) {
    return false
  }

  return new URLSearchParams(window.location.search).get('wakeGuard') === '1'
}

function getRetryDelayMs() {
  if (
    typeof window !== 'undefined' &&
    isLocalFixtureRuntime() &&
    new URLSearchParams(window.location.search).get('wakeRetryReady') === '1'
  ) {
    return 0
  }

  return retryDelayMs
}

function isLocalFixtureRuntime() {
  return !(
    typeof window === 'undefined' ||
    (process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PUBLIC_SCREENSHOT_FIXTURES !== '1')
  )
}
