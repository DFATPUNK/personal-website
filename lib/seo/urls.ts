import { siteConfig } from '@/lib/site-config'

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.url).toString()
}
