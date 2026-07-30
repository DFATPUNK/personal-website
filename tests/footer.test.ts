import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { siteConfig } from '../lib/site-config'
import { testimonials } from '../lib/content/testimonials'

describe('site footer', () => {
  it('exposes a restrained Contact, GitHub, and LinkedIn footer', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'components/layout/SiteFooter.tsx'),
      'utf8',
    )

    expect(siteConfig.links.github).toBe('https://github.com/DFATPUNK')
    expect(siteConfig.links.linkedin).toBe(
      'https://www.linkedin.com/in/j%C3%A9r%C3%A9my-brunet-446007b4/',
    )
    expect(source).toContain("import { Github, Linkedin, Mail }")
    expect(source).toContain('© Jérémy Brunet')
    expect(source).toContain('href="/contact"')
    expect(source).toContain('<Mail aria-hidden size={16}')
    expect(source).toContain('aria-label="GitHub profile"')
    expect(source).toContain('href={siteConfig.links.github}')
    expect(source).toContain('<Github aria-hidden size={16}')
    expect(source).toContain('aria-label="LinkedIn profile"')
    expect(source).toContain('href={siteConfig.links.linkedin}')
    expect(source).toContain('<Linkedin aria-hidden size={16}')
    expect(source).toContain('target="_blank"')
    expect(source).toContain('rel="noopener noreferrer"')
    expect(source).not.toContain('>LinkedIn<')
  })

  it('does not add LinkedIn links to testimonials', () => {
    expect(JSON.stringify(testimonials)).not.toContain('linkedin.com')
  })
})
