import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'
import { z } from 'zod'

import { topicSlugSchema, type TopicSlug } from '@/lib/topics/registry'

const essaysDirectory = path.join(process.cwd(), 'content/essays')

export const essayStatusSchema = z.enum(['draft', 'published', 'external'])
export const essayLayoutSchema = z.enum(['standard', 'immersive'])

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD date format.')

const essayMetadataSchema = z
  .object({
    title: z.string().min(1),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a URL-safe slug.'),
    description: z.string().min(1),
    publishedAt: dateSchema.optional(),
    updatedAt: dateSchema.optional(),
    status: essayStatusSchema,
    layout: essayLayoutSchema,
    tags: z.array(topicSlugSchema).min(1),
    featured: z.boolean().optional(),
    externalUrl: z.string().url().optional(),
    repositoryUrl: z.string().url().optional(),
  })
  .superRefine((metadata, context) => {
    if (metadata.status === 'published' && !metadata.publishedAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['publishedAt'],
        message: 'Published essays require publishedAt.',
      })
    }
  })

export type EssayStatus = z.infer<typeof essayStatusSchema>
export type EssayLayout = z.infer<typeof essayLayoutSchema>

export type EssayMetadata = Omit<
  z.infer<typeof essayMetadataSchema>,
  'tags'
> & {
  tags: TopicSlug[]
}

export type Essay = {
  metadata: EssayMetadata
  slug: string
  sourcePath: string
}

function getEssayFiles() {
  if (!fs.existsSync(essaysDirectory)) {
    return []
  }

  return fs
    .readdirSync(essaysDirectory)
    .filter((fileName) => fileName.endsWith('.mdx'))
    .sort()
}

function readEssay(fileName: string): Essay {
  const sourcePath = path.join(essaysDirectory, fileName)
  const source = fs.readFileSync(sourcePath, 'utf8')
  const parsed = matter(source)
  const metadata = essayMetadataSchema.parse(parsed.data) as EssayMetadata
  const expectedFileName = `${metadata.slug}.mdx`

  if (fileName !== expectedFileName) {
    throw new Error(
      `Essay "${fileName}" must match its frontmatter slug "${expectedFileName}".`,
    )
  }

  return {
    metadata,
    slug: metadata.slug,
    sourcePath,
  }
}

export function getAllEssays() {
  const essays = getEssayFiles().map(readEssay)
  const seenSlugs = new Set<string>()

  for (const essay of essays) {
    if (seenSlugs.has(essay.slug)) {
      throw new Error(`Duplicate essay slug: ${essay.slug}`)
    }
    seenSlugs.add(essay.slug)
  }

  return essays.sort((first, second) => {
    const firstDate = first.metadata.publishedAt ?? ''
    const secondDate = second.metadata.publishedAt ?? ''
    return secondDate.localeCompare(firstDate)
  })
}

export function getPublishedEssays() {
  return getAllEssays().filter((essay) => essay.metadata.status === 'published')
}

export function getEssaySlugs() {
  return getPublishedEssays().map((essay) => essay.slug)
}

export function getEssayBySlug(slug: string) {
  return getPublishedEssays().find((essay) => essay.slug === slug)
}
