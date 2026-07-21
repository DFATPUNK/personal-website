import { getStandardEssayComponent } from '@/lib/mdx/essay-registry'
import type { Essay } from '@/lib/content/essays'

export function StandardEssay({ essay }: { essay: Essay }) {
  const Content = getStandardEssayComponent(essay.slug)

  if (!Content) {
    throw new Error(`No standard MDX component registered for ${essay.slug}.`)
  }

  return (
    <article>
      <header className="mb-10 border-b border-[var(--border)] pb-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--secondary-accent)] sm:tracking-[0.16em]">
          Standard essay
        </p>
        <h1 className="max-w-3xl text-2xl font-semibold leading-tight sm:text-4xl">
          {essay.metadata.title}
        </h1>
        <p className="mt-5 text-sm leading-6 text-[var(--muted-foreground)] sm:text-base sm:leading-7">
          {essay.metadata.description}
        </p>
        {essay.metadata.publishedAt ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            Published {essay.metadata.publishedAt}
          </p>
        ) : null}
      </header>
      <div className="site-prose">
        <Content />
      </div>
    </article>
  )
}
