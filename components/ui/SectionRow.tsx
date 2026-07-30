import type { ReactNode } from 'react'

type SectionRowProps = {
  title: string
  children: ReactNode
}

export function SectionRow({ title, children }: SectionRowProps) {
  return (
    <section className="border-t border-[#dddddd] py-5 sm:grid sm:grid-cols-[140px_1fr] sm:items-start sm:gap-5">
      <h2 className="self-start pt-1 text-xs font-normal uppercase tracking-[0.06em] text-[var(--muted-foreground)]">
        {title}
      </h2>
      <div className="mt-3 text-[15px] leading-[1.6] text-[var(--muted-foreground)] sm:mt-0">
        {children}
      </div>
    </section>
  )
}
