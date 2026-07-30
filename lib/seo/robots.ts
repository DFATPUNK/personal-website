import type { MetadataRoute } from 'next'

import { absoluteUrl, getCanonicalOrigin } from '@/lib/seo/urls'

export function getRobotsRules(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: getCanonicalOrigin(),
  }
}
