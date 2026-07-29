import { describe, expect, it } from 'vitest'

import {
  demosBaseUrl,
  getAllDemos,
  getDemoBySlug,
  getDemoExternalUrl,
  getDemoInternalPath,
  getDemoStaticParams,
  getPublicDemos,
  isDemoAvailabilityKey,
  validateDemoCollection,
} from '../lib/content/demos'
import { isTopicSlug } from '../lib/topics/registry'

describe('demo registry', () => {
  it('publishes the expected canonical demo slugs', () => {
    expect(getPublicDemos().map((demo) => demo.slug)).toEqual([
      'mlp',
      'pg-calculator',
      'alan',
      'balatro',
    ])
  })

  it('does not use legacy demos hub paths as canonical slugs', () => {
    const slugs = getAllDemos().map((demo) => demo.slug)

    expect(slugs).not.toContain('zero-touch-onboarding')
    expect(slugs).not.toContain('balatro-joker-generator')
  })

  it('keeps demo slugs unique and URL-safe', () => {
    const slugs = getAllDemos().map((demo) => demo.slug)

    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs).toEqual(
      slugs.filter((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)),
    )
  })

  it('keeps ordering deterministic', () => {
    expect(getAllDemos().map((demo) => demo.order)).toEqual([10, 20, 30, 40])
    expect(getAllDemos().map((demo) => demo.slug)).toEqual([
      'mlp',
      'pg-calculator',
      'alan',
      'balatro',
    ])
  })

  it('requires live demos to expose exactly one external destination', () => {
    expect(() =>
      validateDemoCollection([
        {
          slug: 'missing-live-path',
          title: 'Missing live path',
          shortDescription: 'Invalid live demo.',
          description: ['Invalid live demo.'],
          status: 'live',
          tags: ['ai'],
          order: 1,
        },
      ]),
    ).toThrow(/exactly one external destination/)

    expect(() =>
      validateDemoCollection([
        {
          slug: 'bad-path',
          title: 'Bad path',
          shortDescription: 'Invalid path.',
          description: ['Invalid path.'],
          status: 'live',
          externalPath: 'bad-path',
          tags: ['ai'],
          order: 1,
        },
      ]),
    ).toThrow(/External paths must begin/)

    expect(() =>
      validateDemoCollection([
        {
          slug: 'both-destinations',
          title: 'Both destinations',
          shortDescription: 'Invalid destination.',
          description: ['Invalid destination.'],
          status: 'live',
          externalPath: '/both-destinations',
          externalUrl: 'https://example.com/both-destinations',
          tags: ['ai'],
          order: 1,
        },
      ]),
    ).toThrow(/either externalPath or externalUrl/)

    expect(() =>
      validateDemoCollection([
        {
          slug: 'relative-url',
          title: 'Relative URL',
          shortDescription: 'Invalid destination.',
          description: ['Invalid destination.'],
          status: 'live',
          externalUrl: '/relative-url',
          tags: ['ai'],
          order: 1,
        },
      ]),
    ).toThrow(/Invalid URL/)
  })

  it('derives external URLs from the approved demos host', () => {
    const alan = getDemoBySlug('alan')

    expect(demosBaseUrl).toBe('https://demos.jeremybrunet.com')
    expect(alan ? getDemoExternalUrl(alan) : undefined).toBe(
      'https://demos.jeremybrunet.com/alan',
    )
    expect(getDemoExternalUrl(getDemoBySlug('balatro')!)).toBe(
      'https://demos.jeremybrunet.com/balatro',
    )
    expect(getDemoExternalUrl(getDemoBySlug('pg-calculator')!)).toBe(
      'https://demos.jeremybrunet.com/pg-calculator',
    )
  })

  it('uses the MLP standalone host when a demo supplies externalUrl', () => {
    const mlp = getDemoBySlug('mlp')

    expect(mlp?.repositoryUrl).toBe('https://github.com/DFATPUNK/mlp')
    expect(mlp ? getDemoExternalUrl(mlp) : undefined).toBe(
      'https://mlp.jeremybrunet.com/',
    )
  })

  it('validates repository and documentation URLs as HTTP or HTTPS', () => {
    expect(() =>
      validateDemoCollection([
        {
          slug: 'bad-url',
          title: 'Bad URL',
          shortDescription: 'Invalid URL.',
          description: ['Invalid URL.'],
          status: 'live',
          externalPath: '/bad-url',
          repositoryUrl: 'ftp://example.com/repo',
          documentationUrl: 'notaurl',
          tags: ['ai'],
          order: 1,
        },
      ]),
    ).toThrow(/HTTP or HTTPS|Invalid URL/)
  })

  it('validates all topic tags against the topic registry', () => {
    for (const demo of getAllDemos()) {
      expect(demo.tags.every(isTopicSlug)).toBe(true)
    }

    expect(() =>
      validateDemoCollection([
        {
          slug: 'unknown-topic-demo',
          title: 'Unknown topic demo',
          shortDescription: 'Invalid topic.',
          description: ['Invalid topic.'],
          status: 'live',
          externalPath: '/unknown-topic-demo',
          tags: ['not-a-topic' as never],
          order: 1,
        },
      ]),
    ).toThrow(/Invalid enum/)
  })

  it('keeps approved demo topic ordering', () => {
    expect(getDemoBySlug('pg-calculator')?.tags).toEqual([
      'ai',
      'llm',
      'python',
    ])
    expect(getDemoBySlug('balatro')?.tags).toEqual(['figma'])
    expect(getDemoBySlug('alan')?.tags).toEqual([
      'automations',
      'database',
      'hr',
    ])
    expect(getDemoBySlug('mlp')?.tags).toEqual([
      'machine-learning',
      'ai',
      'data',
      'react',
      'apis',
    ])
  })

  it('looks up public demos by canonical slug', () => {
    expect(getDemoBySlug('balatro')?.title).toBe('Balatro Joker Generator')
    expect(getDemoBySlug('zero-touch-onboarding')).toBeUndefined()
    expect(getDemoBySlug('unknown-demo')).toBeUndefined()
  })

  it('derives internal paths and static params from public slugs', () => {
    const demos = getPublicDemos()

    expect(demos.map(getDemoInternalPath)).toEqual([
      '/demos/mlp',
      '/demos/pg-calculator',
      '/demos/alan',
      '/demos/balatro',
    ])
    expect(getDemoStaticParams()).toEqual([
      { slug: 'mlp' },
      { slug: 'pg-calculator' },
      { slug: 'alan' },
      { slug: 'balatro' },
    ])
  })

  it('limits Supabase availability metadata to Alan and MLP safe keys', () => {
    const availability = getPublicDemos()
      .filter((demo) => demo.availability)
      .map((demo) => ({
        slug: demo.slug,
        availability: demo.availability,
      }))

    expect(availability).toEqual([
      {
        slug: 'mlp',
        availability: {
          provider: 'supabase',
          key: 'mlp',
        },
      },
      {
        slug: 'alan',
        availability: {
          provider: 'supabase',
          key: 'alan',
        },
      },
    ])
    expect(isDemoAvailabilityKey('alan')).toBe(true)
    expect(isDemoAvailabilityKey('mlp')).toBe(true)
    expect(isDemoAvailabilityKey('pg-calculator')).toBe(false)
    expect(JSON.stringify(availability)).not.toMatch(
      /project|token|anon|webhook|secret|supabase\.co/i,
    )
  })

  it('rejects duplicate demo slugs', () => {
    const duplicateDemo = {
      slug: 'duplicate',
      title: 'Duplicate',
      shortDescription: 'Duplicate demo.',
      description: ['Duplicate demo.'],
      status: 'live' as const,
      externalPath: '/duplicate',
      tags: ['ai' as const],
      order: 1,
    }

    expect(() =>
      validateDemoCollection([duplicateDemo, duplicateDemo]),
    ).toThrow(/Duplicate demo slug/)
  })
})
