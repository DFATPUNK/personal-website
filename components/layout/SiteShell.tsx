import type { ReactNode } from 'react'

import { SiteNavigation } from '@/components/navigation/SiteNavigation'

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
      <SiteNavigation />
      <main className="min-w-0 px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:py-16">
        <div className="max-w-[var(--content-width)]">{children}</div>
      </main>
    </div>
  )
}
