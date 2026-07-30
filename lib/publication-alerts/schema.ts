import { z } from 'zod'

import {
  PUBLICATION_ALERT_GENERAL_TAG,
  PUBLICATION_ALERT_VALIDATION_MESSAGE,
} from '@/lib/publication-alerts/config'

const disallowedControlCharacters = /[\u0000-\u001F\u007F]/
const emailMaxLength = 254
const sourceMaxLength = 80
const honeypotMaxLength = 200

export const publicationAlertSourceSchema = z
  .string()
  .trim()
  .min(1)
  .max(sourceMaxLength)
  .regex(/^[a-z0-9]+(?::[a-z0-9]+(?:-[a-z0-9]+)*)+$/)
  .superRefine((source, context) => {
    if (disallowedControlCharacters.test(source)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid source.',
      })
    }
  })

const publicationAlertRequestSchema = z
  .object({
    email: z.preprocess(
      (value) => (typeof value === 'string' ? value.trim().toLowerCase() : value),
      z
        .string()
        .min(1, PUBLICATION_ALERT_VALIDATION_MESSAGE)
        .max(emailMaxLength, PUBLICATION_ALERT_VALIDATION_MESSAGE)
        .email(PUBLICATION_ALERT_VALIDATION_MESSAGE)
        .superRefine((email, context) => {
          if (disallowedControlCharacters.test(email)) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              message: PUBLICATION_ALERT_VALIDATION_MESSAGE,
            })
          }
        }),
    ),
    source: z.preprocess(
      (value) => (typeof value === 'string' ? value.trim() : value),
      publicationAlertSourceSchema,
    ),
    website: z.preprocess(
      (value) => (typeof value === 'string' ? value.trim() : value),
      z.string().max(honeypotMaxLength).optional(),
    ),
  })
  .strict()

export type PublicationAlertFormInput = z.infer<
  typeof publicationAlertRequestSchema
>

export type PublicationAlertValidationResult =
  | {
      ok: true
      data: PublicationAlertFormInput
    }
  | {
      ok: false
      fieldErrors: {
        email?: string
        source?: string
      }
    }

export function isPublicationAlertHoneypotPopulated(input: unknown) {
  if (!input || typeof input !== 'object') {
    return false
  }

  const value = (input as { website?: unknown }).website

  return typeof value === 'string' && value.trim().length > 0
}

export function validatePublicationAlertInput(
  input: unknown,
): PublicationAlertValidationResult {
  const result = publicationAlertRequestSchema.safeParse(input)

  if (result.success) {
    return {
      ok: true,
      data: result.data,
    }
  }

  const fieldErrors: {
    email?: string
    source?: string
  } = {}

  for (const issue of result.error.issues) {
    const field = issue.path[0]

    if (field === 'email') {
      fieldErrors.email ??= issue.message
    }

    if (field === 'source') {
      fieldErrors.source ??= 'Signup source is not available.'
    }
  }

  return {
    ok: false,
    fieldErrors,
  }
}

export function getPublicationAlertSourceTag(source: string) {
  return `source:${source.replace(/:/g, '-')}`
}

export function getPublicationAlertTags(source: string) {
  return [
    PUBLICATION_ALERT_GENERAL_TAG,
    getPublicationAlertSourceTag(source),
  ] as const
}
