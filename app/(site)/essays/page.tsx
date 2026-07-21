import Link from 'next/link'

import { PageHeader } from '@/components/ui/PageHeader'
import { getPublishedEssays } from '@/lib/content/essays'

export const metadata = {
  title: 'Essays',
  description: 'Technical essays by Jérémy Brunet.',
}

export default function EssaysPage() {
  const essays = getPublishedEssays()

  return (
    <>
      <PageHeader
        eyebrow="Essays"
        title="A small publishing surface for technical explanations."
        description="The foundation includes one standard MDX essay to prove routing, metadata validation, code blocks, and mathematical notation."
      />
      <div className="space-y-8">
        {essays.map((essay) => (
          <article
            className="border-b border-[var(--border)] pb-8"
            key={essay.slug}
          >
            <p className="mb-2 text-sm text-[var(--muted-foreground)]">
              {essay.metadata.publishedAt}
            </p>
            <h2 className="text-2xl font-semibold">
              <Link href={`/essays/${essay.slug}`}>{essay.metadata.title}</Link>
            </h2>
            <p className="mt-3 leading-7 text-[var(--muted-foreground)]">
              {essay.metadata.description}
            </p>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              Layout: {essay.metadata.layout}
            </p>
          </article>
        ))}
      </div>
    </>
  )
}
