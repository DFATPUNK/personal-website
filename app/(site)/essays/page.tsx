import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/ui/PageHeader'
import {
  formatEssayDate,
  getPublicEssayEntries,
} from '@/lib/content/essays'
import { getRegisteredImmersiveEssaySlugs } from '@/lib/mdx/essay-registry'
import { absoluteUrl } from '@/lib/seo/urls'
import { getTopicLabel } from '@/lib/topics/registry'

export const metadata: Metadata = {
  title: 'Essays',
  description:
    'Essays, notebooks, tutorials, and external publications by Jérémy Brunet.',
  alternates: {
    canonical: absoluteUrl('/essays'),
  },
}

export default function EssaysPage() {
  const essays = getPublicEssayEntries({
    registeredImmersiveSlugs: getRegisteredImmersiveEssaySlugs(),
  })

  return (
    <>
      <PageHeader
        eyebrow="Essays"
        title="Essays, notebooks, and tutorials."
        description="My writing, from newest to oldest, including past external publications."
      />
      {essays.length > 0 ? (
        <div className="space-y-8">
          {essays.map((essay) => {
            const isExternal = essay.metadata.status === 'external'
            const essayHref = `/essays/${essay.slug}`
            const externalHref = essay.metadata.externalUrl ?? essayHref

            return (
              <article
                className="border-b border-[var(--border)] pb-8"
                key={essay.slug}
              >
                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted-foreground)]">
                  {essay.metadata.publishedAt ? (
                    <time dateTime={essay.metadata.publishedAt}>
                      {formatEssayDate(essay.metadata.publishedAt)}
                    </time>
                  ) : null}
                  {isExternal ? (
                    <span className="text-xs font-normal uppercase tracking-[0.06em] text-[var(--secondary-accent)]">
                      External
                    </span>
                  ) : null}
                </div>
                <h2 className="text-lg font-normal leading-snug sm:text-xl">
                  {isExternal ? (
                    <a
                      href={externalHref}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {essay.metadata.title}
                    </a>
                  ) : (
                    <Link href={essayHref}>{essay.metadata.title}</Link>
                  )}
                </h2>
                <p className="mt-3 leading-[1.6] text-[var(--muted-foreground)]">
                  {essay.metadata.description}
                </p>
                {essay.metadata.tags.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
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
              </article>
            )
          })}
        </div>
      ) : (
        <p className="border-t border-[var(--border)] pt-8 leading-7 text-[var(--muted-foreground)]">
          No published essays are available yet.
        </p>
      )}
    </>
  )
}
