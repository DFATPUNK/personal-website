import { z } from 'zod'

export const topicSlugs = [
  'ai',
  'automations',
  'zapier',
  'airtable',
  'python',
  'machine-learning',
  'n8n',
  'apis',
  'data',
  'event-driven-architecture',
] as const

export type TopicSlug = (typeof topicSlugs)[number]

const topicLabels = {
  ai: 'AI',
  automations: 'Automations',
  zapier: 'Zapier',
  airtable: 'Airtable',
  python: 'Python',
  'machine-learning': 'Machine Learning',
  n8n: 'n8n',
  apis: 'APIs',
  data: 'Data',
  'event-driven-architecture': 'Event-driven Architecture',
} satisfies Record<TopicSlug, string>

export const topics = topicSlugs.map((slug) => ({
  slug,
  label: topicLabels[slug],
}))

export const topicSlugSchema = z.enum(topicSlugs)

export function normalizeTopicSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}

export function isTopicSlug(value: string): value is TopicSlug {
  return topicSlugs.includes(value as TopicSlug)
}
