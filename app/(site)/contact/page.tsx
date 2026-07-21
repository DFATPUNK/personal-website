import { PageHeader } from '@/components/ui/PageHeader'
import { SectionRow } from '@/components/ui/SectionRow'

export const metadata = {
  title: 'Contact',
  description: 'Contact placeholder for the Personal Website V2 foundation.',
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="A safe contact system will arrive in its own PR."
        description="This route is intentionally static in the foundation. Conditional fields, server validation, anti-spam, and n8n delivery are reserved for PR 5."
      />
      <SectionRow title="For now">
        <p>
          The current production contact path remains preserved on the archive
          branch. The future form will validate on the server before forwarding
          to a configured transport.
        </p>
      </SectionRow>
    </>
  )
}
