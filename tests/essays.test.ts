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

  it('loads the sample essay from frontmatter', () => {
    const essay = getEssayBySlug('foundation-sample')

    expect(essay?.metadata.title).toBe('Foundation sample essay')
    expect(essay?.metadata.layout).toBe('standard')
  })

  it('exposes only published essays publicly', () => {
    expect(getAllEssays()).toHaveLength(1)
    expect(getPublishedEssays()).toHaveLength(1)
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
    expect(getEssayStaticParams()).toEqual([{ slug: 'foundation-sample' }])
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
