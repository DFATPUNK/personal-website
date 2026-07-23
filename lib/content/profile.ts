import {
  academicEntries,
  type AcademicEntry,
} from '@/lib/content/academics'
import {
  careerEntries,
  previousRoles,
  type CareerEntry,
  type PreviousRole,
} from '@/lib/content/career'
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
  previousRoles: readonly PreviousRole[]
  academics: readonly AcademicEntry[]
  testimonials: readonly Testimonial[]
}

export const profileIntroduction = {
  eyebrow: 'About',
  title: 'AI Systems & Automation Specialist',
  summary: 'My goal is to build the best systems possible for complex, high-value work.',
  body: [
    'I combine APIs, automation, and data architecture with applied AI across marketing, sales, and human resources. For execution and knowledge flow, I build integrations, workflows, and automated documentation; for data processing and decision-making, I design databases, algorithms, and machine-learning pipelines.',
  ],
} as const satisfies ProfileIntroduction

export const profileContent = {
  introduction: profileIntroduction,
  career: careerEntries,
  previousRoles,
  academics: academicEntries,
  testimonials,
} as const satisfies ProfileContent
