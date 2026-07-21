import type { MetadataRoute } from 'next'

import {
  getDemoInternalPath,
  getPublicDemos,
} from '@/lib/content/demos'
import {
  getPublishedEssays,
  type Essay,
} from '@/lib/content/essays'
import { absoluteUrl } from '@/lib/seo/urls'

function essayLastModified(essay: Essay) {
  return essay.metadata.updatedAt ?? essay.metadata.publishedAt
}

export function getSitemapEntries(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/essays', '/demos', '/contact'].map((route) => ({
    url: absoluteUrl(route),
  }))

  const essayRoutes = getPublishedEssays().map((essay) => ({
    url: absoluteUrl(`/essays/${essay.slug}`),
    lastModified: essayLastModified(essay),
  }))

  const demoRoutes = getPublicDemos().map((demo) => ({
    url: absoluteUrl(getDemoInternalPath(demo)),
  }))

  return [...staticRoutes, ...essayRoutes, ...demoRoutes]
}
