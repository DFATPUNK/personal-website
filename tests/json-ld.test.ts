import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { serializeJsonLd } from '../lib/seo/json-ld'

describe('json-ld serialization', () => {
  it('keeps ordinary JSON-LD valid JSON', () => {
    const value = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Jérémy Brunet',
    }
    const serialized = serializeJsonLd(value)

    expect(JSON.parse(serialized)).toEqual(value)
  })

  it('escapes literal less-than characters and preserves parsed values', () => {
    const payload = {
      '@type': 'Article',
      headline: '</script><script>alert(1)</script>',
    }
    const serialized = serializeJsonLd(payload)

    expect(serialized).not.toContain('<')
    expect(JSON.parse(serialized)).toEqual(payload)
  })

  it('uses the shared helper for WebSite and Article JSON-LD scripts', () => {
    const rootLayout = fs.readFileSync(
      path.join(process.cwd(), 'app/layout.tsx'),
      'utf8',
    )
    const standardEssay = fs.readFileSync(
      path.join(process.cwd(), 'components/mdx/StandardEssay.tsx'),
      'utf8',
    )

    expect(rootLayout).toContain("import { serializeJsonLd }")
    expect(standardEssay).toContain("import { serializeJsonLd }")
    expect(rootLayout).toContain('serializeJsonLd(websiteStructuredData)')
    expect(standardEssay).toContain('serializeJsonLd(articleStructuredData)')
    expect(rootLayout).not.toContain('JSON.stringify(websiteStructuredData)')
    expect(standardEssay).not.toContain('JSON.stringify(articleStructuredData)')
  })
})
