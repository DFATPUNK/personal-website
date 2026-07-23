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

export type PreviousRole = {
  id: string
  role: string
  organization: string
}

export const careerEntries: readonly CareerEntry[] = [
  {
    id: 'automate-me',
    organization: 'Automate Me',
    role: 'Co-founder and CTO',
    startDate: '2018',
    endDate: '2025',
    summary:
      'I spent seven years building data architectures, API integrations, and automated workflows. As Data & Automation Lead at the no-code and low-code agency Automate Me, I designed and delivered more than 1,000 automations across Zapier, n8n, Make, and Parabola, as well as over 100 databases using Airtable, Supabase, and Firebase. I helped more than 50 companies complete tasks representing a total of more than 20,000 hours of manual work.',
    tags: [
      'automations',
      'apis',
      'airtable',
      'n8n',
      'data',
      'event-driven-architecture',
    ],
  },
  {
    id: 'peter',
    organization: 'Peter',
    role: 'Co-founder',
    startDate: '2016',
    endDate: '2018',
    summary:
      'I spent more than two years building a peer-to-peer educational chatbot that helped K–12 students work on their homework together after school. It was my first entrepreneurial venture and a practical introduction to APIs, algorithms, data analysis, and workflow automation. I worked across product, data, community, and technical support.',
    tags: ['apis', 'data', 'automations'],
  },
]

export const previousRoles: readonly PreviousRole[] = [
  {
    id: 'yooz-marketing-project-manager',
    role: 'Marketing Project Manager',
    organization: 'Yooz',
  },
  {
    id: 'piscine-privee-international-sales-manager',
    role: 'International Sales Manager',
    organization: 'Piscine Privée',
  },
]

export const careerEmptyState = {
  title: 'Career entries pending',
  description:
    'No verified career entries have been supplied yet. This section is reserved for selected professional experience once final copy is provided.',
} as const
