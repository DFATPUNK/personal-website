import { z } from 'zod'

import {
  CONTACT_TOPIC_VALUES,
  EMAIL_MAX_LENGTH,
  HONEYPOT_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  type ContactFormInput,
  type ContactTopic,
} from '@/lib/contact/config'
import { isObviouslyFakeEmail } from '@/lib/contact/email-validation'

const disallowedControlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/
const missingTopicMessage = 'Please select a subject.'
const invalidTopicMessage = 'Please select a valid subject.'

export type ContactField = keyof ContactFormInput
export type ContactFieldErrors = Partial<Record<ContactField, string>>

export type ContactValidationResult =
  | {
      ok: true
      data: ContactFormInput
    }
  | {
      ok: false
      fieldErrors: ContactFieldErrors
    }

type ContactSchemaOptions = {
  today?: Date | string
}

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : value
}

function normalizeTopic(value: unknown) {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : undefined
}

function isContactTopic(value: string): value is ContactTopic {
  return CONTACT_TOPIC_VALUES.includes(value as ContactTopic)
}

function normalizeEmail(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : value
}

export function normalizeMessage(value: string) {
  return value
    .replace(/\r\n?/g, '\n')
    .trim()
    .replace(/\n{4,}/g, '\n\n\n')
}

function normalizeOptionalDate(value: unknown) {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : undefined
}

function getDateOnly(value: Date | string) {
  if (typeof value === 'string') {
    return value.slice(0, 10)
  }

  return value.toISOString().slice(0, 10)
}

function isRealDateOnly(value: string) {
  if (!dateOnlyPattern.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return false
  }

  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

export function getTodayDateInputValue(today: Date | string = new Date()) {
  return getDateOnly(today)
}

export function isHoneypotPopulated(input: unknown) {
  if (!input || typeof input !== 'object') {
    return false
  }

  const value = (input as { honeypot?: unknown }).honeypot

  return typeof value === 'string' && value.trim().length > 0
}

export function createContactFormSchema(options: ContactSchemaOptions = {}) {
  const today = getTodayDateInputValue(options.today)

  return z
    .object({
      email: z.preprocess(
        normalizeEmail,
        z
          .string({ required_error: 'Enter your email address.' })
          .min(1, 'Enter your email address.')
          .max(EMAIL_MAX_LENGTH, 'Email must be 254 characters or fewer.')
          .email('Enter a valid email address.')
          .superRefine((email, context) => {
            if (isObviouslyFakeEmail(email)) {
              context.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Enter a real contact email address.',
              })
            }
          }),
      ),
      topic: z.preprocess(
        normalizeTopic,
        z
          .string({
            required_error: missingTopicMessage,
            invalid_type_error: invalidTopicMessage,
          })
          .refine(isContactTopic, invalidTopicMessage),
      ),
      message: z.preprocess(
        (value) => (typeof value === 'string' ? normalizeMessage(value) : value),
        z
          .string({ required_error: 'Write a message.' })
          .min(1, 'Write a message.')
          .min(
            MESSAGE_MIN_LENGTH,
            `Message must be at least ${MESSAGE_MIN_LENGTH} characters.`,
          )
          .max(
            MESSAGE_MAX_LENGTH,
            `Message must be ${MESSAGE_MAX_LENGTH} characters or fewer.`,
          )
          .superRefine((message, context) => {
            if (disallowedControlCharacters.test(message)) {
              context.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Message contains unsupported control characters.',
              })
            }
          }),
      ),
      preferredInterviewDate: z.preprocess(
        normalizeOptionalDate,
        z
          .string()
          .optional()
          .superRefine((date, context) => {
            if (!date) {
              return
            }

            if (!isRealDateOnly(date)) {
              context.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Use a date in YYYY-MM-DD format.',
              })
              return
            }

            if (date < today) {
              context.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Choose today or a future date.',
              })
            }
          }),
      ),
      honeypot: z.preprocess(
        normalizeString,
        z
          .string()
          .max(
            HONEYPOT_MAX_LENGTH,
            `This field must be ${HONEYPOT_MAX_LENGTH} characters or fewer.`,
          )
          .optional(),
      ),
    })
    .strict()
}

export function validateContactFormInput(
  input: unknown,
  options: ContactSchemaOptions = {},
): ContactValidationResult {
  const result = createContactFormSchema(options).safeParse(input)

  if (result.success) {
    const data: ContactFormInput = {
      email: result.data.email,
      topic: result.data.topic,
      message: result.data.message,
    }

    if (result.data.preferredInterviewDate) {
      data.preferredInterviewDate = result.data.preferredInterviewDate
    }

    if (result.data.honeypot) {
      data.honeypot = result.data.honeypot
    }

    return {
      ok: true,
      data,
    }
  }

  return {
    ok: false,
    fieldErrors: getContactFieldErrors(result.error),
  }
}

function getContactFieldErrors(error: z.ZodError<ContactFormInput>) {
  const fieldErrors: ContactFieldErrors = {}

  for (const issue of error.issues) {
    const field = issue.path[0]

    if (
      field === 'email' ||
      field === 'topic' ||
      field === 'message' ||
      field === 'preferredInterviewDate' ||
      field === 'honeypot'
    ) {
      fieldErrors[field] ??= issue.message
    }
  }

  return fieldErrors
}
