import { describe, expect, it } from 'vitest'

import {
  isTopicSlug,
  normalizeTopicSlug,
  topicSlugs,
} from '../lib/topics/registry'

describe('topic registry', () => {
  it('normalizes labels into stable slugs', () => {
    expect(normalizeTopicSlug(' Event driven architecture ')).toBe(
      'event-driven-architecture',
    )
    expect(normalizeTopicSlug('AI & APIs')).toBe('ai-and-apis')
  })

  it('recognizes registered topic slugs', () => {
    expect(isTopicSlug('ai')).toBe(true)
    expect(isTopicSlug('unknown-topic')).toBe(false)
  })

  it('keeps the foundation topic registry unique', () => {
    expect(new Set(topicSlugs).size).toBe(topicSlugs.length)
  })
})
