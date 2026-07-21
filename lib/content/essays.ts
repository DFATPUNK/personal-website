import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'
import { z } from 'zod'

import { topicSlugSchema, type TopicSlug } from '@/lib/topics/registry'

const essaysDirectory = path.join(process.cwd(), 'content/essays')

export const essayStatusSchema = z.enum(['draft', 'published', 'external'])
export const essayLayoutSchema = z.enum(['standard', 'immersive'])

export const essayDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD date format.')
  .refine((value) => {
    const parsedDate = new Date(`${value}T00:00:00.000Z`)

    return (
      !Number.isNaN(parsedDate.getTime()) &&
      parsedDate.toISOString().slice(0, 10) === value
    )
  }, 'Use a valid calendar date.')

const urlSchema = z.string().url().refine((value) => {
  const protocol = new URL(value).protocol

  return protocol === 'http:' || protocol === 'https:'
}, 'Use an HTTP or HTTPS URL.')

export const essayMetadataSchema = z
  .object({
    title: z.string().min(1),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a URL-safe slug.'),
    description: z.string().min(1),
    publishedAt: essayDateSchema.optional(),
    updatedAt: essayDateSchema.optional(),
    status: essayStatusSchema,
    layout: essayLayoutSchema,
    tags: z.array(topicSlugSchema).min(1),
    featured: z.boolean().optional(),
    externalUrl: urlSchema.optional(),
    repositoryUrl: urlSchema.optional(),
  })
  .strict()
  .superRefine((metadata, context) => {
    if (metadata.status === 'published' && !metadata.publishedAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['publishedAt'],
        message: 'Published essays require publishedAt.',
      })
    }

    if (metadata.status === 'external' && !metadata.externalUrl) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['externalUrl'],
        message: 'External essay entries require externalUrl.',
      })
    }

    if (
      metadata.publishedAt &&
      metadata.updatedAt &&
      metadata.updatedAt < metadata.publishedAt
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['updatedAt'],
        message: 'updatedAt cannot be earlier than publishedAt.',
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

type EssayValidationOptions = {
  registeredImmersiveSlugs?: Iterable<string>
}

function getRegisteredImmersiveSlugSet(options?: EssayValidationOptions) {
  return new Set(options?.registeredImmersiveSlugs ?? [])
}

function getEssayFiles(directory: string) {
  if (!fs.existsSync(directory)) {
    return []
  }

  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith('.mdx'))
    .sort()
}

function formatZodIssues(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join('.') || 'frontmatter'}: ${issue.message}`)
    .join('; ')
}

function readEssay(directory: string, fileName: string): Essay {
  const sourcePath = path.join(directory, fileName)
  const source = fs.readFileSync(sourcePath, 'utf8')
  const parsed = matter(source)
  const result = essayMetadataSchema.safeParse(parsed.data)

  if (!result.success) {
    throw new Error(
      `Invalid essay frontmatter in "${fileName}": ${formatZodIssues(result.error)}`,
    )
  }

  const metadata = result.data as EssayMetadata
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

function compareEssaysByDate(first: Essay, second: Essay) {
  const firstDate = first.metadata.publishedAt ?? ''
  const secondDate = second.metadata.publishedAt ?? ''
  const dateOrder = secondDate.localeCompare(firstDate)

  if (dateOrder !== 0) {
    return dateOrder
  }

  return first.metadata.title.localeCompare(second.metadata.title)
}

export function validateEssayCollection(
  essays: Essay[],
  options?: EssayValidationOptions,
) {
  const seenSlugs = new Set<string>()
  const registeredImmersiveSlugs = getRegisteredImmersiveSlugSet(options)

  for (const essay of essays) {
    if (seenSlugs.has(essay.slug)) {
      throw new Error(`Duplicate essay slug: ${essay.slug}`)
    }
    seenSlugs.add(essay.slug)

    if (
      essay.metadata.status === 'published' &&
      essay.metadata.layout === 'immersive' &&
      !registeredImmersiveSlugs.has(essay.slug)
    ) {
      throw new Error(
        `Published immersive essay "${essay.slug}" requires an explicitly registered renderer.`,
      )
    }
  }

  return essays
}

export function getAllEssaysFromDirectory(
  directory: string,
  options?: EssayValidationOptions,
) {
  const essays = getEssayFiles(directory).map((fileName) =>
    readEssay(directory, fileName),
  )

  return validateEssayCollection(essays, options).sort(compareEssaysByDate)
}

export function getAllEssays(options?: EssayValidationOptions) {
  return getAllEssaysFromDirectory(essaysDirectory, options)
}

export function getPublicEssayEntries(options?: EssayValidationOptions) {
  return getAllEssays(options).filter((essay) =>
    ['published', 'external'].includes(essay.metadata.status),
  )
}

export function getPublishedEssays(options?: EssayValidationOptions) {
  return getAllEssays(options).filter(
    (essay) => essay.metadata.status === 'published',
  )
}

export function getEssaySlugs(options?: EssayValidationOptions) {
  return getPublishedEssays(options).map((essay) => essay.slug)
}

export function getEssayStaticParams(options?: EssayValidationOptions) {
  return getEssaySlugs(options).map((slug) => ({ slug }))
}

export function getEssayBySlug(slug: string, options?: EssayValidationOptions) {
  return getPublishedEssays(options).find((essay) => essay.slug === slug)
}

export function formatEssayDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00.000Z`))
}
