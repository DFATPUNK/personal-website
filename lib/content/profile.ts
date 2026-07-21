import {
  academicEntries,
  type AcademicEntry,
} from '@/lib/content/academics'
import { careerEntries, type CareerEntry } from '@/lib/content/career'
import {
  testimonials,
  type Testimonial,
} from '@/lib/content/testimonials'

export type ProfileIntroduction = {
  eyebrow: string
  title: string
  summary: string
  body: readonly string[]
}

export type ProfileContent = {
  introduction: ProfileIntroduction
  career: readonly CareerEntry[]
  academics: readonly AcademicEntry[]
  testimonials: readonly Testimonial[]
}

export const profileIntroduction = {
  eyebrow: 'Who I am?',
  title: 'Who I am?',
  summary:
    'Temporary profile introduction. Final personal copy has not been supplied yet.',
  body: [
    'Placeholder introduction: this area is reserved for the final personal overview once approved copy is available.',
    'The page structure is ready for a concise profile, selected career entries, academic history, and verified testimonials without treating draft text as public fact.',
  ],
} as const satisfies ProfileIntroduction

export const profileContent = {
  introduction: profileIntroduction,
  career: careerEntries,
  academics: academicEntries,
  testimonials,
} as const satisfies ProfileContent
