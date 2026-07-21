type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-12 border-b border-[var(--border)] pb-8">
      {eyebrow ? (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--secondary-accent)] sm:tracking-[0.16em]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="max-w-md text-2xl font-semibold leading-tight">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-md text-sm leading-6 text-[var(--muted-foreground)] sm:text-base sm:leading-7">
          {description}
        </p>
      ) : null}
    </header>
  )
}
