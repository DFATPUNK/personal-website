import type { ReactNode } from 'react'

type SectionRowProps = {
  title: string
  children: ReactNode
}

export function SectionRow({ title, children }: SectionRowProps) {
  return (
    <section className="grid gap-5 border-b border-[var(--border)] py-8 sm:grid-cols-[160px_minmax(0,1fr)]">
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
        {title}
      </h2>
      <div className="text-base leading-7 text-[var(--foreground)]">{children}</div>
    </section>
  )
}
