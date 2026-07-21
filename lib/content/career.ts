import type { TopicSlug } from '@/lib/topics/registry'

export type ContentLink = {
  label: string
  href: string
}

export type CareerEntry = {
  id: string
  organization: string
  role: string
  startDate: string
  endDate?: string
  summary: string
  tags: TopicSlug[]
  links?: ContentLink[]
}

export const careerEntries: readonly CareerEntry[] = []

export const careerEmptyState = {
  title: 'Career entries pending',
  description:
    'No verified career entries have been supplied yet. This section is reserved for selected professional experience once final copy is provided.',
} as const
