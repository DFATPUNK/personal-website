import fs from 'node:fs'
import path from 'node:path'

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
    expect(profileIntroduction.title).toBe('AI & Automation Specialist')
    expect(profileIntroduction.summary).toBe(
      'Building intelligent automations to complete complex, high-value tasks.',
    )
    expect(profileIntroduction.body).toEqual([
      'I design end-to-end workflows across marketing, sales, and HR, combining SaaS, event-driven data architecture, and applied AI. I automate key workflows, use MCP to connect AI agents to external tools, and deliver shared databases, documentation, and machine-learning pipelines.',
    ])
    expect(profileIntroduction.body).toHaveLength(1)
    expect(renderedIntroduction).not.toMatch(/glossary|tooltip/i)
    expect(renderedIntroduction).not.toMatch(
      /visionary|world-class|cutting-edge/i,
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
      'automate over 20,000 hours of operational work',
    )
    expect(careerEntries[0]?.summary).toBe(
      '7+ years building data architectures, API integrations, and automated workflows. As Data & Automation Lead at the no-code and low-code agency Automate Me, I designed and delivered more than 1,000 automations across Zapier, n8n, Make, and Parabola, to name a few, as well as over 100 databases, mostly using Airtable, Supabase, and Firebase. I helped more than 50 companies automate over 20,000 hours of operational work.',
    )
    expect(careerEntries[1]?.summary).toBe(
      '2+ years building a peer-to-peer educational Messenger chatbot that helped K–12 students work on their homework together after school. My first entrepreneurial venture and a practical introduction to APIs, algorithms, data architecture, and KPIs tracking. Worked across product, data, community, and technical support.',
    )
  })

  it('keeps the approved career rendering hierarchy role first', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'app/(site)/page.tsx'),
      'utf8',
    )
    const roleIndex = source.indexOf('{entry.role}')
    const organizationIndex = source.indexOf('{entry.organization} ·')
    const summaryIndex = source.indexOf('{entry.summary}')
    const topicsIndex = source.indexOf('<TopicList tags={entry.tags} />')

    expect(roleIndex).toBeGreaterThan(-1)
    expect(organizationIndex).toBeGreaterThan(roleIndex)
    expect(summaryIndex).toBeGreaterThan(organizationIndex)
    expect(topicsIndex).toBeGreaterThan(summaryIndex)
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
