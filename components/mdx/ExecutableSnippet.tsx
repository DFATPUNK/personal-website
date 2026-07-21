/**
 * Reserved MDX boundary for a future browser-only notebook or executable
 * snippet. This component intentionally does not execute code.
 */
export type ExecutableSnippetProps = {
  description?: string
  language?: string
  sourceUrl?: string
  title: string
}

export function ExecutableSnippet({
  description,
  language,
  sourceUrl,
  title,
}: ExecutableSnippetProps) {
  return (
    <aside className="my-8 border border-[var(--border)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--secondary-accent)]">
        Executable snippet
      </p>
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          {description}
        </p>
      ) : null}
      {language ? (
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          Language: {language}
        </p>
      ) : null}
      {sourceUrl ? (
        <a
          className="mt-3 inline-block border-b border-[var(--border)] text-sm text-[var(--accent)]"
          href={sourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          Source
        </a>
      ) : null}
    </aside>
  )
}
