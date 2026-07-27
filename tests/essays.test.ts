import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  essayLayoutSchema,
  getAllEssays,
  getAllEssaysFromDirectory,
  getEssayBySlug,
  getEssayStaticParams,
  getPublishedEssays,
  getPublicEssayEntries,
  validateEssayCollection,
  type Essay,
} from '../lib/content/essays'

function createEssayDirectory() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'essay-content-'))
}

function writeEssay(directory: string, fileName: string, frontmatter: string) {
  fs.writeFileSync(
    path.join(directory, fileName),
    `---\n${frontmatter.trim()}\n---\n\nSample body.\n`,
  )
}

describe('essay content foundation', () => {
  it('validates both declared layout values', () => {
    expect(essayLayoutSchema.parse('standard')).toBe('standard')
    expect(essayLayoutSchema.parse('immersive')).toBe('immersive')
  })

  it('loads the draft sample essay from frontmatter', () => {
    const essay = getAllEssays().find(
      (entry) => entry.slug === 'foundation-sample',
    )

    expect(essay?.metadata.title).toBe('Foundation sample essay')
    expect(essay?.metadata.layout).toBe('standard')
    expect(essay?.metadata.status).toBe('draft')
  })

  it('keeps the temporary sample essay out of public local surfaces', () => {
    expect(getAllEssays()).toHaveLength(4)
    expect(getPublishedEssays()).toHaveLength(0)
    expect(getPublicEssayEntries()).toHaveLength(3)
    expect(getEssayBySlug('foundation-sample')).toBeUndefined()
    expect(getEssayStaticParams()).toEqual([])
  })

  it('publishes the expected external Medium references', () => {
    const externalEntries = getPublicEssayEntries().filter(
      (essay) => essay.metadata.status === 'external',
    )

    expect(externalEntries.map((essay) => essay.slug)).toEqual([
      'and-the-award-for-the-best-mooc-goes-to',
      'how-to-scrap-didier-deschamps-email',
      'how-to-hack-people-loyalty-with-care',
    ])
    expect(externalEntries.map((essay) => essay.metadata.title)).toEqual([
      'And the award for the best MOOC goes to…🥁',
      'How to scrap Didier Deschamps email',
      'How to hack people loyalty with care?',
    ])
    expect(externalEntries.map((essay) => essay.metadata.publishedAt)).toEqual([
      '2018-08-30',
      '2018-07-13',
      '2018-07-11',
    ])
    expect(externalEntries.map((essay) => essay.metadata.externalUrl)).toEqual([
      'https://medium.com/free-code-camp/and-the-award-for-the-best-mooc-goes-to-308604e5bf2a',
      'https://medium.com/hackernoon/how-to-scrap-didier-deschamps-email-651891ebe1e4',
      'https://medium.com/user-experience-design-1/how-to-hack-people-loyalty-with-care-f2ce9346c47c',
    ])
  })

  it('validates external Medium topic slugs', () => {
    const externalTags = getPublicEssayEntries()
      .filter((essay) => essay.metadata.status === 'external')
      .flatMap((essay) => essay.metadata.tags)

    expect(externalTags).toEqual([
      'education',
      'cs50',
      'user-experience',
      'web-scraping',
      'data',
      'user-experience',
    ])
  })

  it('leaves unknown essay slugs private', () => {
    expect(getEssayBySlug('unknown-essay')).toBeUndefined()
  })

  it('sorts published local essays in reverse chronological order', () => {
    const directory = createEssayDirectory()

    writeEssay(
      directory,
      'older.mdx',
      `
title: "Older"
slug: "older"
description: "Older essay."
publishedAt: "2026-01-01"
status: "published"
layout: "standard"
tags:
  - ai
`,
    )
    writeEssay(
      directory,
      'newer.mdx',
      `
title: "Newer"
slug: "newer"
description: "Newer essay."
publishedAt: "2026-03-01"
status: "published"
layout: "standard"
tags:
  - data
`,
    )

    expect(getAllEssaysFromDirectory(directory).map((essay) => essay.slug)).toEqual([
      'newer',
      'older',
    ])
  })

  it('excludes drafts and external entries from static params', () => {
    const directory = createEssayDirectory()

    writeEssay(
      directory,
      'published-local.mdx',
      `
title: "Published local"
slug: "published-local"
description: "Public local essay."
publishedAt: "2026-03-01"
status: "published"
layout: "standard"
tags:
  - ai
`,
    )
    writeEssay(
      directory,
      'draft-local.mdx',
      `
title: "Draft local"
slug: "draft-local"
description: "Draft essay."
status: "draft"
layout: "standard"
tags:
  - data
`,
    )
    writeEssay(
      directory,
      'external-entry.mdx',
      `
title: "External entry"
slug: "external-entry"
description: "External reference."
status: "external"
layout: "standard"
tags:
  - apis
externalUrl: "https://example.com/essay"
`,
    )

    const essays = getAllEssaysFromDirectory(directory)
    const staticParams = essays
      .filter((essay) => essay.metadata.status === 'published')
      .map((essay) => ({ slug: essay.slug }))

    expect(staticParams).toEqual([{ slug: 'published-local' }])
    expect(getEssayStaticParams()).toEqual([])
  })

  it('rejects frontmatter slug and filename mismatches', () => {
    const directory = createEssayDirectory()

    writeEssay(
      directory,
      'file-name.mdx',
      `
title: "Mismatch"
slug: "frontmatter-slug"
description: "Invalid essay."
publishedAt: "2026-01-01"
status: "published"
layout: "standard"
tags:
  - ai
`,
    )

    expect(() => getAllEssaysFromDirectory(directory)).toThrow(
      /must match its frontmatter slug/,
    )
  })

  it('rejects invalid slug formats and invalid dates', () => {
    const directory = createEssayDirectory()

    writeEssay(
      directory,
      'invalid-slug.mdx',
      `
title: "Invalid"
slug: "Invalid Slug"
description: "Invalid essay."
publishedAt: "2026-99-99"
status: "published"
layout: "standard"
tags:
  - ai
`,
    )

    expect(() => getAllEssaysFromDirectory(directory)).toThrow(
      /Use a URL-safe slug/,
    )
    expect(() => getAllEssaysFromDirectory(directory)).toThrow(
      /Use a valid calendar date/,
    )
  })

  it('rejects invalid topic slugs', () => {
    const directory = createEssayDirectory()

    writeEssay(
      directory,
      'invalid-topic.mdx',
      `
title: "Invalid topic"
slug: "invalid-topic"
description: "Invalid essay."
publishedAt: "2026-01-01"
status: "published"
layout: "standard"
tags:
  - unknown-topic
`,
    )

    expect(() => getAllEssaysFromDirectory(directory)).toThrow(/Invalid enum/)
  })

  it('requires publication dates for published essays', () => {
    const directory = createEssayDirectory()

    writeEssay(
      directory,
      'missing-date.mdx',
      `
title: "Missing date"
slug: "missing-date"
description: "Invalid essay."
status: "published"
layout: "standard"
tags:
  - ai
`,
    )

    expect(() => getAllEssaysFromDirectory(directory)).toThrow(
      /Published essays require publishedAt/,
    )
  })

  it('requires external URLs for external entries', () => {
    const directory = createEssayDirectory()

    writeEssay(
      directory,
      'external-entry.mdx',
      `
title: "External"
slug: "external-entry"
description: "Invalid external entry."
status: "external"
layout: "standard"
tags:
  - ai
`,
    )

    expect(() => getAllEssaysFromDirectory(directory)).toThrow(
      /External essay entries require externalUrl/,
    )
  })

  it('rejects unknown frontmatter fields', () => {
    const directory = createEssayDirectory()

    writeEssay(
      directory,
      'unknown-field.mdx',
      `
title: "Unknown field"
slug: "unknown-field"
description: "Invalid essay."
publishedAt: "2026-01-01"
status: "published"
layout: "standard"
tags:
  - ai
repositoryURL: "https://example.com/repo"
`,
    )

    expect(() => getAllEssaysFromDirectory(directory)).toThrow(
      /Unrecognized key\(s\) in object: 'repositoryURL'/,
    )
  })

  it('requires registered renderers before publishing immersive essays', () => {
    const directory = createEssayDirectory()

    writeEssay(
      directory,
      'immersive-demo.mdx',
      `
title: "Immersive demo"
slug: "immersive-demo"
description: "Invalid immersive essay."
publishedAt: "2026-01-01"
status: "published"
layout: "immersive"
tags:
  - ai
`,
    )

    expect(() => getAllEssaysFromDirectory(directory)).toThrow(
      /requires an explicitly registered renderer/,
    )
    expect(
      getAllEssaysFromDirectory(directory, {
        registeredImmersiveSlugs: ['immersive-demo'],
      }),
    ).toHaveLength(1)
  })

  it('rejects duplicate essay slugs', () => {
    const duplicateEssay = {
      metadata: {
        description: 'Duplicate.',
        layout: 'standard',
        publishedAt: '2026-01-01',
        slug: 'duplicate',
        status: 'published',
        tags: ['ai'],
        title: 'Duplicate',
      },
      slug: 'duplicate',
      sourcePath: 'duplicate.mdx',
    } satisfies Essay

    expect(() =>
      validateEssayCollection([duplicateEssay, duplicateEssay]),
    ).toThrow(/Duplicate essay slug/)
  })
})
