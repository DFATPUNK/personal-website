import { describe, expect, it } from 'vitest'

import { getDemoInternalPath, getPublicDemos } from '../lib/content/demos'
import { getRobotsRules } from '../lib/seo/robots'
import { getSitemapEntries } from '../lib/seo/sitemap'
import { absoluteUrl, getCanonicalOrigin } from '../lib/seo/urls'

describe('seo foundation', () => {
  it('derives canonical URLs from the configured origin', () => {
    expect(getCanonicalOrigin('https://preview.example.com/base/path')).toBe(
      'https://preview.example.com',
    )
    expect(getCanonicalOrigin('https://www.jeremybrunet.com')).toBe(
      'https://jeremybrunet.com',
    )
    expect(absoluteUrl('/essays')).toBe('https://jeremybrunet.com/essays')
  })

  it('includes only public static routes in the sitemap', () => {
    const urls = getSitemapEntries().map((entry) => entry.url)

    expect(urls).toContain('https://jeremybrunet.com/')
    expect(urls).toContain('https://jeremybrunet.com/essays')
    expect(urls).toContain('https://jeremybrunet.com/demos')
    expect(urls).toContain('https://jeremybrunet.com/contact')

    for (const demo of getPublicDemos()) {
      expect(urls).toContain(
        `https://jeremybrunet.com${getDemoInternalPath(demo)}`,
      )
    }
  })

  it('excludes drafts, external-only essay entries, and API routes from sitemap', () => {
    const urls = getSitemapEntries().map((entry) => entry.url)

    expect(urls).not.toContain(
      'https://jeremybrunet.com/essays/foundation-sample',
    )
    expect(urls).toContain('https://jeremybrunet.com/demos/mlp')
    expect(urls).not.toContain(
      'https://jeremybrunet.com/essays/how-to-hack-people-loyalty-with-care',
    )
    expect(urls).not.toContain(
      'https://jeremybrunet.com/essays/how-to-scrap-didier-deschamps-email',
    )
    expect(urls).not.toContain(
      'https://jeremybrunet.com/essays/and-the-award-for-the-best-mooc-goes-to',
    )
    expect(urls.some((url) => url.includes('/api/'))).toBe(false)
    expect(urls.some((url) => url.includes('example.com'))).toBe(false)
  })

  it('references the canonical sitemap and disallows API routes in robots', () => {
    const robots = getRobotsRules()

    expect(robots.sitemap).toBe('https://jeremybrunet.com/sitemap.xml')
    expect(robots.host).toBe('https://jeremybrunet.com')
    expect(robots.rules).toMatchObject({
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    })
  })
})
