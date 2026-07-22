import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

import { siteConfig } from '@/lib/site-config'
import { serializeJsonLd } from '@/lib/seo/json-ld'
import { absoluteUrl, getCanonicalOrigin } from '@/lib/seo/urls'

const canonicalOrigin = getCanonicalOrigin()

export const metadata: Metadata = {
  metadataBase: new URL(canonicalOrigin),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl('/'),
    siteName: siteConfig.name,
    type: 'website',
  },
  robots: {
    follow: true,
    index: true,
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.description,
  },
}

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: absoluteUrl('/'),
    description: siteConfig.description,
  }

  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(websiteStructuredData),
          }}
          type="application/ld+json"
        />
        {children}
      </body>
    </html>
  )
}
