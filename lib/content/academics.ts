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

export const academicEntries: readonly AcademicEntry[] = [
  {
    id: 'codecademy-machine-learning-engineer',
    institution: 'Codecademy',
    title: 'Machine Learning Engineer',
    date: '2026',
    links: [
      {
        label: 'See certificate',
        href: '/certificates/codecademy-machine-learning-engineer.pdf',
      },
    ],
    tags: ['machine-learning', 'ai', 'python'],
  },
  {
    id: 'zapier-expert-certification',
    institution: 'Zapier',
    title: 'Expert Certification',
    date: '2022',
    links: [
      {
        label: 'See certificate',
        href: '/certificates/zapier_certificate.pdf',
      },
    ],
    tags: ['zapier', 'automations', 'apis'],
  },
  {
    id: 'harvardx-cs50',
    institution: 'HarvardX',
    title: 'CS50: Introduction to Computer Science',
    date: '2016',
    links: [
      {
        label: 'See certificate',
        href: '/certificates/cs50.pdf',
      },
      {
        label: 'Watch final project demo',
        href: 'https://youtu.be/ceseVLbMreg',
      },
    ],
    tags: ['python', 'data'],
  },
  {
    id: 'universite-montpellier-3-master-2-npi',
    institution: 'Université Montpellier 3',
    title: 'Master 2 NPI English/German',
    date: '2012',
  },
]

export const academicsEmptyState = {
  title: 'Academic entries pending',
  description:
    'No verified academic entries, certifications, or structured learning paths have been supplied yet.',
} as const
