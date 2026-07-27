import type { Metadata } from 'next'
import Link from 'next/link'

import { DemoLaunchAction } from '@/components/ui/DemoLaunchAction'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  getDemoExternalUrl,
  getDemoInternalPath,
  getPublicDemos,
} from '@/lib/content/demos'
import { absoluteUrl } from '@/lib/seo/urls'
import { getTopicLabel } from '@/lib/topics/registry'

export const metadata: Metadata = {
  title: 'Demos',
  description:
    'Live demos and technical context by Jérémy Brunet, including applications that may need a short warm-up.',
  alternates: {
    canonical: absoluteUrl('/demos'),
  },
}

export default function DemosPage() {
  const demos = getPublicDemos()

  return (
    <>
      <PageHeader
        eyebrow="Demos"
        title="Demos and contexts."
        description="Please note that some demos rely on on-demand databases and may need a short warm-up."
      />

      {demos.length > 0 ? (
        <ul className="space-y-8">
          {demos.map((demo) => {
            const externalUrl = getDemoExternalUrl(demo)

            return (
              <li className="list-none" key={demo.slug}>
                <article className="border-b border-[var(--border)] pb-8">
                  <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted-foreground)]">
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

                  <h2 className="text-xl font-semibold leading-tight sm:text-2xl">
                    <Link href={getDemoInternalPath(demo)}>{demo.title}</Link>
                  </h2>

                  <p className="mt-3 leading-7 text-[var(--muted-foreground)]">
                    {demo.shortDescription}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <Link
                      className="font-medium text-[var(--accent)]"
                      href={getDemoInternalPath(demo)}
                    >
                      Read context
                    </Link>
                    {externalUrl ? (
                      <DemoLaunchAction
                        demoTitle={demo.title}
                        externalUrl={externalUrl}
                        linkClassName="border-b border-[var(--border)] text-[var(--accent)]"
                      />
                    ) : null}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="border-t border-[var(--border)] pt-8 leading-7 text-[var(--muted-foreground)]">
          No public demos are available yet.
        </p>
      )}
    </>
  )
}
