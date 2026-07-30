import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-10">
      {eyebrow ? (
        <p className="mb-4 text-xs font-normal uppercase tracking-[0.06em] text-[var(--muted-foreground)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="max-w-[var(--content-width)] break-words text-[1.625rem] font-normal leading-[1.2] tracking-normal sm:text-4xl sm:leading-[1.1]">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-[var(--content-width)] text-[15px] leading-[1.6] text-[var(--muted-foreground)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  )
}
