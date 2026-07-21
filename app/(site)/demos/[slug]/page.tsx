import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/ui/PageHeader'
import {
  getDemoBySlug,
  getDemoExternalUrl,
  getDemoInternalPath,
  getDemoStaticParams,
} from '@/lib/content/demos'
import { absoluteUrl } from '@/lib/seo/urls'
import { getTopicLabel } from '@/lib/topics/registry'

type DemoPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getDemoStaticParams()
}

export async function generateMetadata({
  params,
}: DemoPageProps): Promise<Metadata> {
  const { slug } = await params
  const demo = getDemoBySlug(slug)

  if (!demo) {
    return {}
  }

  return {
    title: demo.title,
    description: demo.shortDescription,
    alternates: {
      canonical: absoluteUrl(getDemoInternalPath(demo)),
    },
  }
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params
  const demo = getDemoBySlug(slug)

  if (!demo) {
    notFound()
  }

  const externalUrl = getDemoExternalUrl(demo)

  return (
    <article>
      <PageHeader
        eyebrow="Demo"
        title={demo.title}
        description={demo.shortDescription}
      />

      <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--muted-foreground)]">
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--secondary-accent)]">
          {demo.status}
        </span>
        <ul className="flex flex-wrap gap-2">
          {demo.tags.map((tag) => (
            <li className="text-xs" key={tag}>
              {getTopicLabel(tag)}
            </li>
          ))}
        </ul>
      </div>

      <div className="site-prose">
        {demo.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 border-t border-[var(--border)] pt-6">
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
          {externalUrl ? (
            <a
              aria-label={`Open live demo for ${demo.title}`}
              className="font-medium text-[var(--accent)]"
              href={externalUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Open live demo
            </a>
          ) : null}
          {demo.repositoryUrl ? (
            <a
              className="border-b border-[var(--border)] text-[var(--accent)]"
              href={demo.repositoryUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Source repository
            </a>
          ) : null}
          {demo.documentationUrl ? (
            <a
              className="border-b border-[var(--border)] text-[var(--accent)]"
              href={demo.documentationUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              User manual
            </a>
          ) : null}
        </div>
        <Link
          className="mt-8 inline-block text-sm text-[var(--muted-foreground)] hover:text-[var(--accent)]"
          href="/demos"
        >
          Back to demos
        </Link>
      </div>
    </article>
  )
}
