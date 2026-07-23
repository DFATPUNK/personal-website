import type { TopicSlug } from '@/lib/topics/registry'

export type Testimonial = {
  id: string
  quote: readonly string[]
  author: string
  role?: string
  organization?: string
  tags?: TopicSlug[]
}

export const testimonials: readonly Testimonial[] = [
  {
    id: 'quentin-bastide',
    quote: [
      'I had the opportunity to work with Jérémy on the implementation of complex automations within my company. His contribution was instrumental in structuring our processes, optimizing our internal tools, and significantly improving our operational efficiency.',
      'Beyond his advanced technical expertise, Jérémy stood out for his ability to understand our business challenges and propose concrete, relevant, and sustainable solutions. He was always available, attentive, and clear in his explanations, while proactively suggesting improvements at every stage of the project.',
      'In addition to his undeniable technical abilities, he adopted a genuinely client-focused approach, providing rigorous follow-up, facilitating communication with the teams, and fully committing himself to solving our problems. Working with him was as effective as it was pleasant on a daily basis.',
      'I highly recommend Jérémy to any company looking for someone reliable, skilled, and able to bridge technical work and business needs with intelligence and commitment.',
    ],
    author: 'Quentin BASTIDE',
    role: 'Co-founder',
    organization: 'Plusse.co',
  },
  {
    id: 'christophe-bastard',
    quote: [
      'As Marketing Director, I worked with Jérémy for three years while he was CTO at Automate Me. His greatest strength is his ability to quickly understand our marketing needs and translate them into effective technical solutions. Always approachable and in good spirits, he showed great flexibility as our priorities changed.',
      'His expertise in APIs and automation transformed our marketing approach. Jérémy successfully connected our Pipedrive CRM with Airtable, Autopilot, Calendly, and Mailchimp to maximize lead generation, and developed custom API calls to manage trials. These CRM developments, combined with the marketing automation strategies he recommended, significantly improved the conversion rate of our newly acquired leads and reduced the workload of our marketing and sales teams.',
    ],
    author: 'Christophe Bastard',
    role: 'Pre-Sales Director, Mergers & Acquisitions (M&A)',
    organization: 'Efalia',
  },
]

export const testimonialsEmptyState = {
  title: 'No testimonials yet',
  description:
    'Verified testimonials and attribution have not been provided, so this section intentionally remains empty.',
} as const
