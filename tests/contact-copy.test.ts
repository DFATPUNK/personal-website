import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { CONTACT_TOPICS } from '../lib/contact/config'

describe('contact public copy', () => {
  it('keeps the internal payload field named topic while exposing subject copy', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'components/contact/ContactForm.tsx'),
      'utf8',
    )

    expect(source).toContain('Subject <span aria-hidden="true">*</span>')
    expect(source).toContain('Select a subject')
    expect(source).toContain('name="topic"')
    expect(source).not.toContain('Reason for contact')
    expect(source).not.toContain('Select a reason')
  })

  it('uses approved need-help and job-offer guidance', () => {
    const needHelp = CONTACT_TOPICS.find((topic) => topic.value === 'need-help')
    const jobOffer = CONTACT_TOPICS.find((topic) => topic.value === 'job-offer')
    const source = fs.readFileSync(
      path.join(process.cwd(), 'components/contact/ContactForm.tsx'),
      'utf8',
    )

    expect(needHelp?.messageLabel).toBe('Where are you stuck?')
    expect(needHelp?.helperText).toBe(
      'Describe what you do, the current process, where you are blocked, and which tools and services you use.',
    )
    expect(needHelp?.placeholder).toBe(
      "I'm an HR manager at Acme Inc. My day starts with...",
    )
    expect(source).toContain('See a realistic example')
    expect(source).toContain('I&apos;m an HR manager at Acme Inc.')

    expect(jobOffer?.helperText).toBe(
      'Describe the role, the team context, and what you expect from the person in this position.',
    )
    expect(source).toContain('When would you like to meet?')
  })
})
