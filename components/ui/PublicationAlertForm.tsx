'use client'

import Link from 'next/link'
import { FormEvent, useId, useState } from 'react'

import {
  PUBLICATION_ALERT_BUTTON_LABEL,
  PUBLICATION_ALERT_EMAIL_LABEL,
  PUBLICATION_ALERT_EMAIL_PLACEHOLDER,
  PUBLICATION_ALERT_HELPER,
  PUBLICATION_ALERT_INVITATION,
} from '@/lib/publication-alerts/config'

type PublicationAlertFormProps = {
  source: string
  compact?: boolean
}

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error'

export function PublicationAlertForm({
  source,
  compact = false,
}: PublicationAlertFormProps) {
  const emailId = useId()
  const messageId = useId()
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [state, setState] = useState<SubmissionState>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('submitting')
    setMessage('')

    const fixture = getLocalPublicationAlertFixture()

    if (fixture === 'success') {
      setState('success')
      setMessage("You're on the list.")
      setEmail('')
      return
    }

    if (fixture === 'error') {
      setState('error')
      setMessage('Publication alerts are temporarily unavailable.')
      return
    }

    try {
      const response = await fetch('/api/publication-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source,
          website,
        }),
      })
      const payload = (await response.json()) as {
        ok?: boolean
        message?: string
        fieldErrors?: {
          email?: string
        }
      }
      const responseMessage =
        payload.fieldErrors?.email ??
        payload.message ??
        'Publication alerts are temporarily unavailable.'

      if (!response.ok || payload.ok !== true) {
        setState('error')
        setMessage(responseMessage)
        return
      }

      setState('success')
      setMessage(responseMessage)
      setEmail('')
    } catch {
      setState('error')
      setMessage('Publication alerts are temporarily unavailable.')
    }
  }

  return (
    <form
      className={compact ? 'publication-alert publication-alert--compact' : 'publication-alert'}
      onSubmit={handleSubmit}
    >
      <div className="publication-alert__copy">
        <p className="text-sm leading-6 text-[var(--foreground)]">
          {PUBLICATION_ALERT_INVITATION}
        </p>
        <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
          {PUBLICATION_ALERT_HELPER}{' '}
          <Link className="border-b border-[var(--border)]" href="/privacy">
            Privacy
          </Link>
        </p>
      </div>
      <div className="publication-alert__fields">
        <label className="sr-only" htmlFor={emailId}>
          {PUBLICATION_ALERT_EMAIL_LABEL}
        </label>
        <input
          aria-describedby={message ? messageId : undefined}
          autoComplete="email"
          className="publication-alert__input"
          id={emailId}
          maxLength={254}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder={PUBLICATION_ALERT_EMAIL_PLACEHOLDER}
          required
          type="email"
          value={email}
        />
        <label className="sr-only" htmlFor={`${emailId}-website`}>
          Website
        </label>
        <input
          aria-hidden="true"
          autoComplete="off"
          className="publication-alert__honeypot"
          id={`${emailId}-website`}
          name="website"
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          type="text"
          value={website}
        />
        <button
          className="publication-alert__button"
          disabled={state === 'submitting'}
          type="submit"
        >
          {state === 'submitting' ? 'Sending...' : PUBLICATION_ALERT_BUTTON_LABEL}
        </button>
      </div>
      <p
        aria-live="polite"
        className="min-h-5 text-xs leading-5 text-[var(--muted-foreground)]"
        id={messageId}
      >
        {message}
      </p>
    </form>
  )
}

function getLocalPublicationAlertFixture() {
  if (
    typeof window === 'undefined' ||
    (process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PUBLIC_SCREENSHOT_FIXTURES !== '1')
  ) {
    return undefined
  }

  const fixture = new URLSearchParams(window.location.search).get(
    'publicationAlertFixture',
  )

  return fixture === 'success' || fixture === 'error' ? fixture : undefined
}
