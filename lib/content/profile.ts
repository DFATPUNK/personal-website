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
  title: 'AI & Automation Specialist',
  summary:
    'Building intelligent automations to complete complex, high-value tasks.',
  body: [
    'I design end-to-end workflows across marketing, sales, and HR, combining SaaS, event-driven data architecture, and applied AI. I automate key workflows, use MCP to connect AI agents to external tools, and deliver shared databases, documentation, and machine-learning pipelines.',
  ],
} as const satisfies ProfileIntroduction

export const profileContent = {
  introduction: profileIntroduction,
  career: careerEntries,
  previousRoles,
  academics: academicEntries,
  testimonials,
} as const satisfies ProfileContent
