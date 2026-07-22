import { siteConfig } from '@/lib/site-config'

const canonicalFallbackOrigin = 'https://jeremybrunet.com'

export function getCanonicalOrigin(value = siteConfig.url) {
  try {
    const url = new URL(value)

    if (url.hostname === 'www.jeremybrunet.com') {
      url.hostname = 'jeremybrunet.com'
    }

    url.pathname = ''
    url.search = ''
    url.hash = ''

    return url.toString().replace(/\/$/, '')
  } catch {
    return canonicalFallbackOrigin
  }
}

export function absoluteUrl(pathname: string) {
  return new URL(pathname, `${getCanonicalOrigin()}/`).toString()
}
