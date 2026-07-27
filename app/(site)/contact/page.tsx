import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact/ContactForm'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionRow } from '@/components/ui/SectionRow'
import { absoluteUrl } from '@/lib/seo/urls'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Email Jérémy Brunet or use the contact form for work, roles, essays, or code.',
  alternates: {
    canonical: absoluteUrl('/contact'),
  },
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <a
            className="border-b border-[var(--border)] text-[var(--accent)]"
            href="mailto:jeremy@jeremybrunet.com"
          >
            jeremy@jeremybrunet.com
          </a>
        }
        description="Or use the form below at your convenience."
      />
      <SectionRow title="Message">
        <ContactForm />
      </SectionRow>
    </>
  )
}
