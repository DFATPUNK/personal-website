import Link from 'next/link'

import { SiteShell } from '@/components/layout/SiteShell'

export const metadata = {
  title: 'Page not found',
  description: 'The requested page could not be found.',
}

export default function NotFound() {
  return (
    <SiteShell>
      <p className="mb-4 text-xs font-normal uppercase tracking-[0.06em] text-[var(--muted-foreground)]">
        Not found
      </p>
      <h1 className="text-[1.625rem] font-normal leading-[1.2] sm:text-4xl sm:leading-[1.1]">
        This page could not be found.
      </h1>
      <p className="mt-5 leading-[1.6] text-[var(--muted-foreground)]">
        The address may be incorrect, or the page may not be public.
      </p>
      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm">
        <Link className="font-medium text-[var(--accent)]" href="/">
          Return home
        </Link>
        <Link className="border-b border-[var(--border)]" href="/essays">
          Essays
        </Link>
        <Link className="border-b border-[var(--border)]" href="/demos">
          Demos
        </Link>
      </div>
    </SiteShell>
  )
}
