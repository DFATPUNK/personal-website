import { describe, expect, it } from 'vitest'

import {
  demosBaseUrl,
  getAllDemos,
  getDemoBySlug,
  getDemoExternalUrl,
  getDemoInternalPath,
  getDemoStaticParams,
  getPublicDemos,
  validateDemoCollection,
} from '../lib/content/demos'
import { isTopicSlug } from '../lib/topics/registry'

describe('demo registry', () => {
  it('publishes the expected canonical demo slugs', () => {
    expect(getPublicDemos().map((demo) => demo.slug)).toEqual([
      'alan',
      'balatro',
      'pg-calculator',
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
    expect(getAllDemos().map((demo) => demo.order)).toEqual([10, 20, 30])
    expect(getAllDemos().map((demo) => demo.slug)).toEqual([
      'alan',
      'balatro',
      'pg-calculator',
    ])
  })

  it('requires live demos to expose slash-prefixed external paths', () => {
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
    ).toThrow(/Live demos require an external path/)

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
  })

  it('derives external URLs from the approved demos host', () => {
    const alan = getDemoBySlug('alan')

    expect(demosBaseUrl).toBe('https://demos.jeremybrunet.com')
    expect(alan ? getDemoExternalUrl(alan) : undefined).toBe(
      'https://demos.jeremybrunet.com/alan',
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

  it('looks up public demos by canonical slug', () => {
    expect(getDemoBySlug('balatro')?.title).toBe('Balatro Joker Generator')
    expect(getDemoBySlug('zero-touch-onboarding')).toBeUndefined()
  })

  it('derives internal paths and static params from public slugs', () => {
    const demos = getPublicDemos()

    expect(demos.map(getDemoInternalPath)).toEqual([
      '/demos/alan',
      '/demos/balatro',
      '/demos/pg-calculator',
    ])
    expect(getDemoStaticParams()).toEqual([
      { slug: 'alan' },
      { slug: 'balatro' },
      { slug: 'pg-calculator' },
    ])
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
