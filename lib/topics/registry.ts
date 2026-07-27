import { z } from 'zod'

export const topicSlugs = [
  'ai',
  'automations',
  'zapier',
  'airtable',
  'python',
  'machine-learning',
  'llm',
  'n8n',
  'apis',
  'data',
  'database',
  'event-driven-architecture',
  'react',
  'figma',
  'hr',
  'user-experience',
  'web-scraping',
  'education',
  'cs50',
] as const

export type TopicSlug = (typeof topicSlugs)[number]

const topicLabels = {
  ai: 'AI',
  automations: 'Automations',
  zapier: 'Zapier',
  airtable: 'Airtable',
  python: 'Python',
  'machine-learning': 'Machine Learning',
  llm: 'LLM',
  n8n: 'n8n',
  apis: 'APIs',
  data: 'Data',
  database: 'Database',
  'event-driven-architecture': 'Event-driven Architecture',
  react: 'React',
  figma: 'Figma',
  hr: 'HR',
  'user-experience': 'User Experience',
  'web-scraping': 'Web Scraping',
  education: 'Education',
  cs50: 'CS50',
} satisfies Record<TopicSlug, string>

export const topics = topicSlugs.map((slug) => ({
  slug,
  label: topicLabels[slug],
}))

export const topicSlugSchema = z.enum(topicSlugs)

export function getTopicLabel(slug: TopicSlug) {
  return topicLabels[slug]
}

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
