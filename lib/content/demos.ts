import { z } from 'zod'

import { siteConfig } from '@/lib/site-config'
import { topicSlugSchema, type TopicSlug } from '@/lib/topics/registry'

export const demoStatuses = ['live', 'planned', 'archived'] as const

export type DemoStatus = (typeof demoStatuses)[number]

const httpUrlSchema = z.string().url().refine((value) => {
  const protocol = new URL(value).protocol

  return protocol === 'http:' || protocol === 'https:'
}, 'Use an HTTP or HTTPS URL.')

const externalPathSchema = z
  .string()
  .regex(/^\/(?!\/)/, 'External paths must begin with a single /.')

export const demoSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a URL-safe slug.'),
    title: z.string().min(1),
    shortDescription: z.string().min(1),
    description: z.array(z.string().min(1)).min(1),
    status: z.enum(demoStatuses),
    externalPath: externalPathSchema.optional(),
    externalUrl: httpUrlSchema.optional(),
    repositoryUrl: httpUrlSchema.optional(),
    documentationUrl: httpUrlSchema.optional(),
    tags: z.array(topicSlugSchema).min(1),
    featured: z.boolean().optional(),
    order: z.number().int().nonnegative(),
  })
  .superRefine((demo, context) => {
    const hasExternalPath = Boolean(demo.externalPath)
    const hasExternalUrl = Boolean(demo.externalUrl)

    if (hasExternalPath && hasExternalUrl) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['externalUrl'],
        message: 'Use either externalPath or externalUrl, not both.',
      })
    }

    if (demo.status === 'live' && !hasExternalPath && !hasExternalUrl) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['externalPath'],
        message: 'Live demos require exactly one external destination.',
      })
    }
  })

type DemoInput = z.input<typeof demoSchema>

export type Demo = Omit<z.infer<typeof demoSchema>, 'tags'> & {
  tags: TopicSlug[]
}

export const demosBaseUrl = siteConfig.demosBaseUrl

const demoEntries = [
  {
    slug: 'alan',
    title: 'Zero-Touch Onboarding / Alan',
    shortDescription:
      'An event-driven HR onboarding proof of concept with explicit status handling.',
    description: [
      'This proof of concept models employee onboarding as a deterministic process that begins from a hiring event.',
      'The source project describes standard, flagged, and partial onboarding scenarios, with audit-oriented run and step tracking.',
    ],
    status: 'live',
    externalPath: '/alan',
    repositoryUrl: 'https://github.com/DFATPUNK/hr-onboarding-engine',
    documentationUrl: 'https://writebook.jeremybrunet.com/3/alan.com',
    tags: ['automations', 'database', 'hr'],
    featured: true,
    order: 10,
  },
  {
    slug: 'balatro',
    title: 'Balatro Joker Generator',
    shortDescription:
      'A desktop-oriented generator for composing custom Joker card images.',
    description: [
      'This demo lets visitors assemble a custom Joker card image from selectable visual assets and export the result as a PNG.',
      'The source README credits a public Figma community asset source. This catalog entry does not imply affiliation with Balatro, its creators, or its publishers.',
    ],
    status: 'live',
    externalPath: '/balatro',
    repositoryUrl: 'https://github.com/DFATPUNK/balatro-card-generator',
    tags: ['figma'],
    order: 20,
  },
  {
    slug: 'pg-calculator',
    title: 'Parameter Golf Calculator',
    shortDescription: "A calculator for OpenAI's Parameter Golf challenge.",
    description: [
      "This demo provides a calculator for OpenAI's Parameter Golf challenge.",
      'The related demos hub links it as a live application and as a documented project with a public source repository.',
    ],
    status: 'live',
    externalPath: '/pg-calculator',
    repositoryUrl: 'https://github.com/DFATPUNK/pg-calculator',
    documentationUrl: 'https://writebook.jeremybrunet.com/5/pg-calculator',
    tags: ['ai', 'llm', 'python'],
    order: 30,
  },
  {
    slug: 'mlp',
    title: 'MLP — Machine Learning Pipeline Builder',
    shortDescription:
      'A no-code proof of concept for assembling small machine-learning pipelines from typed, reusable steps and artifacts.',
    description: [
      'MLP is a no-code proof of concept for assembling small machine-learning pipelines from typed, reusable steps and artifacts.',
      'This catalog entry links to the public application and source repository without embedding, proxying, or modifying the external project.',
    ],
    status: 'live',
    externalUrl: 'https://mlp.jeremybrunet.com/',
    repositoryUrl: 'https://github.com/DFATPUNK/mlp',
    tags: ['machine-learning', 'ai', 'data', 'react', 'apis'],
    order: 40,
  },
] satisfies readonly DemoInput[]

function formatZodIssues(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join('.') || 'demo'}: ${issue.message}`)
    .join('; ')
}

function compareDemos(first: Demo, second: Demo) {
  const order = first.order - second.order

  if (order !== 0) {
    return order
  }

  return first.title.localeCompare(second.title)
}

export function validateDemoCollection(entries: readonly DemoInput[]) {
  const seenSlugs = new Set<string>()

  return entries.map((entry) => {
    const result = demoSchema.safeParse(entry)

    if (!result.success) {
      throw new Error(`Invalid demo entry: ${formatZodIssues(result.error)}`)
    }

    const demo = result.data as Demo

    if (seenSlugs.has(demo.slug)) {
      throw new Error(`Duplicate demo slug: ${demo.slug}`)
    }

    seenSlugs.add(demo.slug)

    return demo
  })
}

export const demos = validateDemoCollection(demoEntries).sort(compareDemos)

export function isPublicDemo(demo: Demo) {
  return demo.status !== 'planned'
}

export function getAllDemos() {
  return demos
}

export function getPublicDemos() {
  return demos.filter(isPublicDemo)
}

export function getDemoBySlug(slug: string) {
  return getPublicDemos().find((demo) => demo.slug === slug)
}

export function getDemoInternalPath(demo: Pick<Demo, 'slug'>) {
  return `/demos/${demo.slug}` as const
}

export function getDemoExternalUrl(
  demo: Pick<Demo, 'externalPath' | 'externalUrl'>,
) {
  if (demo.externalUrl) {
    return demo.externalUrl
  }

  if (demo.externalPath) {
    return new URL(demo.externalPath, demosBaseUrl).toString()
  }

  return undefined
}

export function getDemoStaticParams() {
  return getPublicDemos().map((demo) => ({ slug: demo.slug }))
}
