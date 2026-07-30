import { describe, expect, it } from 'vitest'

import {
  CONTACT_TOPICS,
  MESSAGE_MAX_LENGTH,
  type ContactFormInput,
  type ContactTopic,
} from '../lib/contact/config'
import { isObviouslyFakeEmail } from '../lib/contact/email-validation'
import {
  isHoneypotPopulated,
  validateContactFormInput,
} from '../lib/contact/schema'

const today = '2026-07-21'

function validInput(topic: ContactTopic): ContactFormInput {
  return {
    email: 'reviewer@acme.co',
    topic,
    message: 'This is a useful review message.',
    ...(topic === 'job-offer'
      ? { preferredInterviewDate: '2026-07-22' }
      : {}),
  }
}

describe('contact form schema', () => {
  it('accepts one valid submission for each topic', () => {
    for (const topic of CONTACT_TOPICS) {
      const result = validateContactFormInput(validInput(topic.value), {
        today,
      })

      expect(result.ok).toBe(true)
    }
  })

  it('rejects an empty topic with public subject copy', () => {
    const result = validateContactFormInput(
      {
        ...validInput('other'),
        topic: '',
      },
      { today },
    )

    expect(result.ok).toBe(false)
    expect(result.ok ? undefined : result.fieldErrors.topic).toBe(
      'Please select a subject.',
    )
  })

  it('rejects a missing topic with public subject copy', () => {
    const result = validateContactFormInput(
      {
        email: 'reviewer@acme.co',
        message: 'This is a useful review message.',
      },
      { today },
    )

    expect(result.ok).toBe(false)
    expect(result.ok ? undefined : result.fieldErrors.topic).toBe(
      'Please select a subject.',
    )
  })

  it('rejects a non-string topic with public subject copy', () => {
    const result = validateContactFormInput(
      {
        ...validInput('other'),
        topic: 123,
      },
      { today },
    )

    expect(result.ok).toBe(false)
    expect(result.ok ? undefined : result.fieldErrors.topic).toBe(
      'Please select a valid subject.',
    )
  })

  it('rejects an unsupported topic without enum internals', () => {
    const result = validateContactFormInput(
      {
        ...validInput('other'),
        topic: 'unsupported-topic',
      },
      { today },
    )

    expect(result.ok).toBe(false)
    const error = result.ok ? undefined : result.fieldErrors.topic

    expect(error).toBe('Please select a valid subject.')
    expect(error).not.toContain('Invalid enum')
    expect(error).not.toContain('need-help')
  })

  it('requires a message', () => {
    const result = validateContactFormInput(
      {
        email: 'reviewer@acme.co',
        topic: 'other',
      },
      { today },
    )

    expect(result.ok).toBe(false)
    expect(result.ok ? undefined : result.fieldErrors.message).toBeDefined()
  })

  it('rejects a message below the minimum', () => {
    const result = validateContactFormInput(
      {
        ...validInput('other'),
        message: 'short',
      },
      { today },
    )

    expect(result.ok).toBe(false)
    expect(result.ok ? undefined : result.fieldErrors.message).toMatch(
      /at least 10/,
    )
  })

  it('rejects a message above the maximum', () => {
    const result = validateContactFormInput(
      {
        ...validInput('other'),
        message: 'a'.repeat(MESSAGE_MAX_LENGTH + 1),
      },
      { today },
    )

    expect(result.ok).toBe(false)
    expect(result.ok ? undefined : result.fieldErrors.message).toMatch(
      /5000/,
    )
  })

  it('trims and normalizes valid input', () => {
    const result = validateContactFormInput(
      {
        email: '  REVIEWER@ACME.CO  ',
        topic: ' other ',
        message: '\r\n  First line\r\n\r\n\r\n\r\nSecond line  \r\n',
        preferredInterviewDate: '',
      },
      { today },
    )

    expect(result.ok).toBe(true)

    if (!result.ok) {
      return
    }

    expect(result.data).toEqual({
      email: 'reviewer@acme.co',
      topic: 'other',
      message: 'First line\n\n\nSecond line',
    })
  })

  it('accepts an omitted job-offer date', () => {
    const result = validateContactFormInput(
      {
        email: 'recruiter@acme.co',
        topic: 'job-offer',
        message: 'This role could match your automation background.',
      },
      { today },
    )

    expect(result.ok).toBe(true)
  })

  it('accepts today or a future date', () => {
    expect(
      validateContactFormInput(
        {
          ...validInput('job-offer'),
          preferredInterviewDate: today,
        },
        { today },
      ).ok,
    ).toBe(true)

    expect(
      validateContactFormInput(
        {
          ...validInput('job-offer'),
          preferredInterviewDate: '2026-07-22',
        },
        { today },
      ).ok,
    ).toBe(true)
  })

  it('rejects a past date', () => {
    const result = validateContactFormInput(
      {
        ...validInput('job-offer'),
        preferredInterviewDate: '2026-07-20',
      },
      { today },
    )

    expect(result.ok).toBe(false)
    expect(
      result.ok ? undefined : result.fieldErrors.preferredInterviewDate,
    ).toMatch(/future/)
  })

  it('rejects invalid date formats', () => {
    const badFormat = validateContactFormInput(
      {
        ...validInput('job-offer'),
        preferredInterviewDate: '2026-7-22',
      },
      { today },
    )
    const impossibleDate = validateContactFormInput(
      {
        ...validInput('job-offer'),
        preferredInterviewDate: '2026-02-31',
      },
      { today },
    )

    expect(badFormat.ok).toBe(false)
    expect(impossibleDate.ok).toBe(false)
  })

  it('rejects the exact fake local parts', () => {
    for (const localPart of [
      'test',
      'testing',
      'dummy',
      'fake',
      'azerty',
      'qwerty',
      'aaaa',
      'example',
    ]) {
      expect(isObviouslyFakeEmail(`${localPart}@company.com`)).toBe(true)
    }
  })

  it('rejects plus-addressed fake local parts', () => {
    expect(isObviouslyFakeEmail('test+contact@company.com')).toBe(true)
  })

  it('does not reject legitimate local parts that merely contain a blocked substring', () => {
    expect(isObviouslyFakeEmail('testing.engineer@company.com')).toBe(false)
    expect(isObviouslyFakeEmail('latest@company.com')).toBe(false)
  })

  it('rejects reserved domains', () => {
    expect(isObviouslyFakeEmail('person@example.com')).toBe(true)
    expect(isObviouslyFakeEmail('person@company.test')).toBe(true)
    expect(isObviouslyFakeEmail('person@LOCALHOST')).toBe(true)
  })

  it('accepts a normal company email', () => {
    const result = validateContactFormInput(validInput('other'), { today })

    expect(result.ok).toBe(true)
  })

  it('rejects disallowed control characters', () => {
    const result = validateContactFormInput(
      {
        ...validInput('other'),
        message: 'Valid text\u0000with a null byte.',
      },
      { today },
    )

    expect(result.ok).toBe(false)
    expect(result.ok ? undefined : result.fieldErrors.message).toMatch(
      /control characters/,
    )
  })

  it('detects a populated honeypot', () => {
    expect(isHoneypotPopulated({ honeypot: 'company value' })).toBe(true)
    expect(isHoneypotPopulated({ honeypot: '   ' })).toBe(false)
  })
})
