import { describe, expect, it } from 'vitest'

import { academicEntries } from '../lib/content/academics'
import { careerEntries, previousRoles } from '../lib/content/career'
import { profileIntroduction } from '../lib/content/profile'
import { testimonials } from '../lib/content/testimonials'

describe('profile content', () => {
  it('uses the final profile introduction without placeholder copy', () => {
    const renderedIntroduction = [
      profileIntroduction.eyebrow,
      profileIntroduction.title,
      profileIntroduction.summary,
      ...profileIntroduction.body,
    ].join(' ')

    expect(profileIntroduction.eyebrow).toBe('About')
    expect(profileIntroduction.title).toBe('AI Systems & Automation Specialist')
    expect(profileIntroduction.summary).toBe(
      'My goal is to build the best systems possible for complex, high-value work.',
    )
    expect(renderedIntroduction).not.toMatch(/placeholder|temporary/i)
  })

  it('keeps detailed career entries in reverse chronological order with supplied metrics', () => {
    expect(careerEntries.map((entry) => entry.organization)).toEqual([
      'Automate Me',
      'Peter',
    ])
    expect(careerEntries[0]?.summary).toContain('more than 1,000 automations')
    expect(careerEntries[0]?.summary).toContain('over 100 databases')
    expect(careerEntries[0]?.summary).toContain('more than 50 companies')
    expect(careerEntries[0]?.summary).toContain(
      'more than 20,000 hours of manual work',
    )
  })

  it('stores previous roles as typed subordinate content', () => {
    expect(previousRoles).toEqual([
      {
        id: 'yooz-marketing-project-manager',
        role: 'Marketing Project Manager',
        organization: 'Yooz',
      },
      {
        id: 'piscine-privee-international-sales-manager',
        role: 'International Sales Manager',
        organization: 'Piscine Privée',
      },
    ])
  })

  it('keeps academic entries reverse chronological with approved labels', () => {
    expect(academicEntries.map((entry) => entry.date)).toEqual([
      '2026',
      '2022',
      '2016',
      '2012',
    ])

    const labels = academicEntries.flatMap((entry) =>
      (entry.links ?? []).map((link) => link.label),
    )

    expect(labels).toContain('See certificate')
    expect(labels).toContain('Watch final project demo')
    expect(labels).not.toContain('See certification')
  })

  it('preserves testimonial attribution and paragraph structure without source links', () => {
    expect(testimonials).toHaveLength(2)
    expect(testimonials.map((testimonial) => testimonial.author)).toEqual([
      'Quentin BASTIDE',
      'Christophe Bastard',
    ])
    expect(testimonials[0]?.quote).toHaveLength(4)
    expect(testimonials[1]?.quote).toHaveLength(2)
    expect(testimonials.every((testimonial) => testimonial.quote.length > 1)).toBe(
      true,
    )
    expect(
      testimonials.every(
        (testimonial) => !('sourceUrl' in testimonial) && !('linkedin' in testimonial),
      ),
    ).toBe(true)
  })
})
