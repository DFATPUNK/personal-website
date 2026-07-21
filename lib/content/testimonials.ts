import type { TopicSlug } from '@/lib/topics/registry'

export type Testimonial = {
  id: string
  quote: string
  author: string
  role?: string
  organization?: string
  sourceUrl?: string
  tags?: TopicSlug[]
}

export const testimonials: readonly Testimonial[] = []

export const testimonialsEmptyState = {
  title: 'No testimonials yet',
  description:
    'Verified testimonials and attribution have not been provided, so this section intentionally remains empty.',
} as const
