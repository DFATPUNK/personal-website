import type { ReactNode } from 'react'

type SectionRowProps = {
  title: string
  children: ReactNode
}

export function SectionRow({ title, children }: SectionRowProps) {
  return (
    <section className="border-b border-[var(--border)] py-8">
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
        {title}
      </h2>
      <div className="mt-4 text-base leading-7 text-[var(--foreground)]">
        {children}
      </div>
    </section>
  )
}
