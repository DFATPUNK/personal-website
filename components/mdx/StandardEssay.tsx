import { getStandardEssayComponent } from '@/lib/mdx/essay-registry'
import { serializeJsonLd } from '@/lib/seo/json-ld'
import { absoluteUrl } from '@/lib/seo/urls'
import { getTopicLabel } from '@/lib/topics/registry'
import { formatEssayDate, type Essay } from '@/lib/content/essays'

import { ShareControls } from './ShareControls'

export function StandardEssay({ essay }: { essay: Essay }) {
  const Content = getStandardEssayComponent(essay.slug)
  const canonicalUrl = absoluteUrl(`/essays/${essay.slug}`)
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: essay.metadata.title,
    description: essay.metadata.description,
    datePublished: essay.metadata.publishedAt,
    dateModified: essay.metadata.updatedAt ?? essay.metadata.publishedAt,
    keywords: essay.metadata.tags,
    mainEntityOfPage: canonicalUrl,
    isAccessibleForFree: true,
  }

  if (!Content) {
    throw new Error(`No standard MDX component registered for ${essay.slug}.`)
  }

  return (
    <article>
      <header className="mb-10 border-b border-[var(--border)] pb-8">
        <p className="mb-4 text-xs font-normal uppercase tracking-[0.06em] text-[var(--muted-foreground)]">
          Essay
        </p>
        <h1 className="max-w-[var(--content-width)] text-[1.625rem] font-normal leading-[1.2] sm:text-4xl sm:leading-[1.1]">
          {essay.metadata.title}
        </h1>
        <p className="mt-5 max-w-[var(--content-width)] text-[15px] leading-[1.6] text-[var(--muted-foreground)] sm:text-lg">
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
                <li
                  className="border border-[var(--border)] px-2 py-1 text-xs text-[#666666]"
                  key={tag}
                >
                  {getTopicLabel(tag)}
                </li>
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
      <script
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(articleStructuredData),
        }}
        type="application/ld+json"
      />
      <ShareControls title={essay.metadata.title} url={canonicalUrl} />
    </article>
  )
}
