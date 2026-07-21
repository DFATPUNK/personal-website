import { describe, expect, it } from 'vitest'

import {
  essayLayoutSchema,
  getAllEssays,
  getEssayBySlug,
  getPublishedEssays,
} from '../lib/content/essays'

describe('essay content foundation', () => {
  it('validates both declared layout values', () => {
    expect(essayLayoutSchema.parse('standard')).toBe('standard')
    expect(essayLayoutSchema.parse('immersive')).toBe('immersive')
  })

  it('loads the sample essay from frontmatter', () => {
    const essay = getEssayBySlug('foundation-sample')

    expect(essay?.metadata.title).toBe('Foundation sample essay')
    expect(essay?.metadata.layout).toBe('standard')
  })

  it('exposes only published essays publicly', () => {
    expect(getAllEssays()).toHaveLength(1)
    expect(getPublishedEssays()).toHaveLength(1)
  })
})
