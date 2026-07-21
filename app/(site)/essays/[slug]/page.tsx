import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { StandardEssay } from '@/components/mdx/StandardEssay'
import {
  getEssayBySlug,
  getEssaySlugs,
  type Essay,
} from '@/lib/content/essays'
import { getImmersiveEssayComponent } from '@/lib/mdx/essay-registry'
import { absoluteUrl } from '@/lib/seo/urls'

type EssayPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getEssaySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: EssayPageProps): Promise<Metadata> {
  const { slug } = await params
  const essay = getEssayBySlug(slug)

  if (!essay) {
    return {}
  }

  return {
    title: essay.metadata.title,
    description: essay.metadata.description,
    alternates: {
      canonical: absoluteUrl(`/essays/${essay.slug}`),
    },
  }
}

function renderEssay(essay: Essay) {
  if (essay.metadata.layout === 'immersive') {
    const ImmersiveEssay = getImmersiveEssayComponent(essay.slug)

    if (!ImmersiveEssay) {
      throw new Error(
        `Essay "${essay.slug}" uses immersive layout but no renderer is registered.`,
      )
    }

    return <ImmersiveEssay essay={essay} />
  }

  return <StandardEssay essay={essay} />
}

export default async function EssayPage({ params }: EssayPageProps) {
  const { slug } = await params
  const essay = getEssayBySlug(slug)

  if (!essay) {
    notFound()
  }

  return renderEssay(essay)
}
