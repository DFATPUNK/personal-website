import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { StandardEssay } from '@/components/mdx/StandardEssay'
import {
  getEssayBySlug,
  getEssayStaticParams,
  type Essay,
} from '@/lib/content/essays'
import {
  getImmersiveEssayComponent,
  getRegisteredImmersiveEssaySlugs,
} from '@/lib/mdx/essay-registry'
import { absoluteUrl } from '@/lib/seo/urls'

type EssayPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getEssayStaticParams({
    registeredImmersiveSlugs: getRegisteredImmersiveEssaySlugs(),
  })
}

export async function generateMetadata({
  params,
}: EssayPageProps): Promise<Metadata> {
  const { slug } = await params
  const essay = getEssayBySlug(slug, {
    registeredImmersiveSlugs: getRegisteredImmersiveEssaySlugs(),
  })

  if (!essay) {
    return {}
  }

  return {
    title: essay.metadata.title,
    description: essay.metadata.description,
    alternates: {
      canonical: absoluteUrl(`/essays/${essay.slug}`),
    },
    keywords: essay.metadata.tags,
    openGraph: {
      title: essay.metadata.title,
      description: essay.metadata.description,
      type: 'article',
      url: absoluteUrl(`/essays/${essay.slug}`),
      publishedTime: essay.metadata.publishedAt,
      modifiedTime: essay.metadata.updatedAt,
      tags: essay.metadata.tags,
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
  const essay = getEssayBySlug(slug, {
    registeredImmersiveSlugs: getRegisteredImmersiveEssaySlugs(),
  })

  if (!essay) {
    notFound()
  }

  return renderEssay(essay)
}
