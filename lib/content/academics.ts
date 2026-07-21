import type { TopicSlug } from '@/lib/topics/registry'

import type { ContentLink } from '@/lib/content/career'

export type AcademicEntry = {
  id: string
  institution: string
  title: string
  date?: string
  description?: string
  url?: string
  tags?: TopicSlug[]
  links?: ContentLink[]
}

export const academicEntries: readonly AcademicEntry[] = []

export const academicsEmptyState = {
  title: 'Academic entries pending',
  description:
    'No verified academic entries, certifications, or structured learning paths have been supplied yet.',
} as const
