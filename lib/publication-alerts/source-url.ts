import { siteConfig } from '@/lib/site-config'

export function getPublicationAlertSourceUrl(request: Request) {
  try {
    const siteUrl = new URL(siteConfig.url)
    const referer = request.headers.get('referer')

    if (!referer) {
      return siteUrl.toString()
    }

    const refererUrl = new URL(referer)

    if (refererUrl.origin !== siteUrl.origin) {
      return siteUrl.toString()
    }

    return refererUrl.toString()
  } catch {
    return 'https://jeremybrunet.com'
  }
}
