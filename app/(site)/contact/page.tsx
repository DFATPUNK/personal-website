import { ContactForm } from '@/components/contact/ContactForm'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionRow } from '@/components/ui/SectionRow'

export const metadata = {
  title: 'Contact',
  description: 'Contact Jérémy Brunet about work, roles, essays, or code.',
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Send a focused note."
        description="Choose the closest topic and write the context I need to understand the message. The form validates on the server before delivery."
      />
      <SectionRow title="Message">
        <ContactForm />
      </SectionRow>
    </>
  )
}
