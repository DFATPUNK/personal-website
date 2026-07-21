import { getStandardEssayComponent } from '@/lib/mdx/essay-registry'
import { absoluteUrl } from '@/lib/seo/urls'
import { getTopicLabel } from '@/lib/topics/registry'
import { formatEssayDate, type Essay } from '@/lib/content/essays'

import { ShareControls } from './ShareControls'

export function StandardEssay({ essay }: { essay: Essay }) {
  const Content = getStandardEssayComponent(essay.slug)
  const canonicalUrl = absoluteUrl(`/essays/${essay.slug}`)

  if (!Content) {
    throw new Error(`No standard MDX component registered for ${essay.slug}.`)
  }

  return (
    <article>
      <header className="mb-10 border-b border-[var(--border)] pb-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--secondary-accent)] sm:tracking-[0.16em]">
          Essay
        </p>
        <h1 className="max-w-md text-2xl font-semibold leading-tight">
          {essay.metadata.title}
        </h1>
        <p className="mt-5 max-w-md text-sm leading-6 text-[var(--muted-foreground)] sm:text-base sm:leading-7">
          {essay.metadata.description}
        </p>
        <div className="mt-5 space-y-3 text-sm text-[var(--muted-foreground)]">
          {essay.metadata.publishedAt ? (
            <p>
              Published{' '}
              <time dateTime={essay.metadata.publishedAt}>
                {formatEssayDate(essay.metadata.publishedAt)}
              </time>
            </p>
          ) : null}
          {essay.metadata.updatedAt ? (
            <p>
              Updated{' '}
              <time dateTime={essay.metadata.updatedAt}>
                {formatEssayDate(essay.metadata.updatedAt)}
              </time>
            </p>
          ) : null}
          {essay.metadata.tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {essay.metadata.tags.map((tag) => (
                <li key={tag}>{getTopicLabel(tag)}</li>
              ))}
            </ul>
          ) : null}
          {essay.metadata.repositoryUrl ? (
            <p>
              <a
                className="border-b border-[var(--border)] text-[var(--accent)]"
                href={essay.metadata.repositoryUrl}
                rel="noreferrer"
                target="_blank"
              >
                Repository
              </a>
            </p>
          ) : null}
        </div>
      </header>
      <div className="site-prose mb-12">
        <Content />
      </div>
      <ShareControls title={essay.metadata.title} url={canonicalUrl} />
    </article>
  )
}
