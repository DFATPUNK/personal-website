import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { siteConfig } from '../lib/site-config'
import { testimonials } from '../lib/content/testimonials'

describe('site footer', () => {
  it('exposes a restrained Contact and LinkedIn footer', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'components/layout/SiteFooter.tsx'),
      'utf8',
    )

    expect(siteConfig.links.linkedin).toBe(
      'https://www.linkedin.com/in/j%C3%A9r%C3%A9my-brunet-446007b4/',
    )
    expect(source).toContain('© Jérémy Brunet')
    expect(source).toContain('href="/contact"')
    expect(source).toContain('target="_blank"')
    expect(source).toContain('rel="noopener noreferrer"')
  })

  it('does not add LinkedIn links to testimonials', () => {
    expect(JSON.stringify(testimonials)).not.toContain('linkedin.com')
  })
})
