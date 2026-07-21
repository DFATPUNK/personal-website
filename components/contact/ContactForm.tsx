'use client'

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'

import {
  CONTACT_SUCCESS_MESSAGE,
  CONTACT_TOPICS,
  EMAIL_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  type ContactFormInput,
  type ContactTopic,
} from '@/lib/contact/config'
import {
  getTodayDateInputValue,
  validateContactFormInput,
  type ContactFieldErrors,
} from '@/lib/contact/schema'

type FormState = {
  email: string
  topic: '' | ContactTopic
  message: string
  preferredInterviewDate: string
  honeypot: string
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

type ContactResponse = {
  ok: boolean
  message: string
  fieldErrors?: ContactFieldErrors
}

const initialFormState: FormState = {
  email: '',
  topic: '',
  message: '',
  preferredInterviewDate: '',
  honeypot: '',
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const emailRef = useRef<HTMLInputElement>(null)
  const topicRef = useRef<HTMLSelectElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)

  const selectedTopic = CONTACT_TOPICS.find(
    (topic) => topic.value === form.topic,
  )
  const today = useMemo(() => getTodayDateInputValue(), [])

  useEffect(() => {
    if (form.topic !== 'job-offer' && form.preferredInterviewDate) {
      setForm((currentForm) => ({
        ...currentForm,
        preferredInterviewDate: '',
      }))
    }
  }, [form.topic, form.preferredInterviewDate])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload = toContactPayload(form)
    const clientValidation = validateContactFormInput(payload)

    if (!clientValidation.ok) {
      setStatus('error')
      setStatusMessage('Please review the highlighted fields.')
      setFieldErrors(clientValidation.fieldErrors)
      focusFirstInvalidField(clientValidation.fieldErrors)
      return
    }

    setStatus('submitting')
    setStatusMessage('Sending message.')
    setFieldErrors({})

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientValidation.data),
      })
      const result = (await response.json()) as ContactResponse

      if (!response.ok || !result.ok) {
        setStatus('error')
        setStatusMessage(result.message)
        setFieldErrors(result.fieldErrors ?? {})

        if (result.fieldErrors) {
          focusFirstInvalidField(result.fieldErrors)
        }

        return
      }

      setStatus('success')
      setStatusMessage(result.message || CONTACT_SUCCESS_MESSAGE)
      setForm(initialFormState)
    } catch {
      setStatus('error')
      setStatusMessage(
        'Your message could not be sent right now. Please try again later.',
      )
    }
  }

  function focusFirstInvalidField(errors: ContactFieldErrors) {
    window.requestAnimationFrame(() => {
      if (errors.email) {
        emailRef.current?.focus()
        return
      }

      if (errors.topic) {
        topicRef.current?.focus()
        return
      }

      if (errors.message) {
        messageRef.current?.focus()
        return
      }

      if (errors.preferredInterviewDate) {
        dateRef.current?.focus()
      }
    })
  }

  const isSubmitting = status === 'submitting'

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-semibold" htmlFor="contact-email">
          Email <span aria-hidden="true">*</span>
        </label>
        <p
          className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]"
          id="contact-email-help"
        >
          I use this only to respond to your message.
        </p>
        <input
          ref={emailRef}
          aria-describedby={describeBy(
            'contact-email-help',
            fieldErrors.email ? 'contact-email-error' : undefined,
          )}
          aria-invalid={Boolean(fieldErrors.email)}
          autoComplete="email"
          className={fieldClassName(fieldErrors.email)}
          id="contact-email"
          maxLength={EMAIL_MAX_LENGTH}
          name="email"
          onChange={(event) =>
            setForm((currentForm) => ({
              ...currentForm,
              email: event.target.value,
            }))
          }
          required
          type="email"
          value={form.email}
        />
        <FieldError id="contact-email-error" message={fieldErrors.email} />
      </div>

      <div>
        <label className="block text-sm font-semibold" htmlFor="contact-topic">
          Reason for contact <span aria-hidden="true">*</span>
        </label>
        <select
          ref={topicRef}
          aria-describedby={fieldErrors.topic ? 'contact-topic-error' : undefined}
          aria-invalid={Boolean(fieldErrors.topic)}
          className={fieldClassName(fieldErrors.topic)}
          id="contact-topic"
          name="topic"
          onChange={(event) =>
            setForm((currentForm) => ({
              ...currentForm,
              topic: event.target.value as FormState['topic'],
            }))
          }
          required
          value={form.topic}
        >
          <option value="">Select a reason</option>
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
        <FieldError id="contact-topic-error" message={fieldErrors.topic} />
      </div>

      {selectedTopic ? (
        <div>
          <label
            className="block text-sm font-semibold"
            htmlFor="contact-message"
          >
            {selectedTopic.messageLabel} <span aria-hidden="true">*</span>
          </label>
          <p
            className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]"
            id="contact-message-help"
          >
            {selectedTopic.helperText}
          </p>
          <textarea
            ref={messageRef}
            aria-describedby={describeBy(
              'contact-message-help',
              fieldErrors.message ? 'contact-message-error' : undefined,
            )}
            aria-invalid={Boolean(fieldErrors.message)}
            className={fieldClassName(fieldErrors.message)}
            id="contact-message"
            maxLength={MESSAGE_MAX_LENGTH}
            name="message"
            onChange={(event) =>
              setForm((currentForm) => ({
                ...currentForm,
                message: event.target.value,
              }))
            }
            placeholder={selectedTopic.placeholder}
            required
            rows={selectedTopic.rows}
            value={form.message}
          />
          <FieldError id="contact-message-error" message={fieldErrors.message} />
        </div>
      ) : null}

      {form.topic === 'job-offer' ? (
        <div>
          <label
            className="block text-sm font-semibold"
            htmlFor="contact-preferred-date"
          >
            When would you like to book a first interview?
          </label>
          <p
            className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]"
            id="contact-preferred-date-help"
          >
            This is only a preferred date. It does not create a calendar booking.
          </p>
          <input
            ref={dateRef}
            aria-describedby={describeBy(
              'contact-preferred-date-help',
              fieldErrors.preferredInterviewDate
                ? 'contact-preferred-date-error'
                : undefined,
            )}
            aria-invalid={Boolean(fieldErrors.preferredInterviewDate)}
            className={fieldClassName(fieldErrors.preferredInterviewDate)}
            id="contact-preferred-date"
            min={today}
            name="preferredInterviewDate"
            onChange={(event) =>
              setForm((currentForm) => ({
                ...currentForm,
                preferredInterviewDate: event.target.value,
              }))
            }
            type="date"
            value={form.preferredInterviewDate}
          />
          <FieldError
            id="contact-preferred-date-error"
            message={fieldErrors.preferredInterviewDate}
          />
        </div>
      ) : null}

      <div
        aria-hidden="true"
        className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-company">Company</label>
        <input
          autoComplete="off"
          id="contact-company"
          name="company"
          onChange={(event) =>
            setForm((currentForm) => ({
              ...currentForm,
              honeypot: event.target.value,
            }))
          }
          tabIndex={-1}
          type="text"
          value={form.honeypot}
        />
      </div>

      <div aria-atomic="true" aria-live="polite" className="min-h-6 text-sm">
        {statusMessage ? (
          <p
            className={
              status === 'success'
                ? 'text-[var(--accent)]'
                : 'text-[var(--secondary-accent)]'
            }
          >
            {statusMessage}
          </p>
        ) : null}
      </div>

      <button
        className="inline-flex min-h-11 items-center border border-[var(--foreground)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-wait disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Sending...' : 'Send message'}
      </button>
    </form>
  )
}

function toContactPayload(form: FormState): ContactFormInput {
  const payload: ContactFormInput = {
    email: form.email,
    topic: form.topic as ContactTopic,
    message: form.message,
    honeypot: form.honeypot,
  }

  if (form.preferredInterviewDate) {
    payload.preferredInterviewDate = form.preferredInterviewDate
  }

  return payload
}

function fieldClassName(error?: string) {
  return [
    'mt-3 w-full border bg-transparent px-3 py-2 text-base leading-6 text-[var(--foreground)]',
    'placeholder:text-[var(--muted-foreground)] focus-visible:outline-offset-2',
    error ? 'border-[var(--secondary-accent)]' : 'border-[var(--border)]',
  ].join(' ')
}

function describeBy(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(' ') || undefined
}

function FieldError({
  id,
  message,
}: {
  id: string
  message: string | undefined
}) {
  if (!message) {
    return null
  }

  return (
    <p className="mt-2 text-sm text-[var(--secondary-accent)]" id={id}>
      {message}
    </p>
  )
}
