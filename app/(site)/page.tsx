import { PageHeader } from '@/components/ui/PageHeader'
import { SectionRow } from '@/components/ui/SectionRow'

export default function HomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Who I am?"
        title="A quiet foundation for a technical portfolio."
        description="This first PR establishes the Next.js shell, routing, and content boundaries. Final profile copy arrives in the dedicated Who I am? phase."
      />

      <SectionRow title="Career">
        <p>
          Placeholder section. Career entries will be added as typed local
          content in PR 2 without inventing unverified facts.
        </p>
      </SectionRow>
      <SectionRow title="Academics">
        <p>
          Placeholder section. Academic entries, certifications, and learning
          paths will use structured content once the final material is ready.
        </p>
      </SectionRow>
      <SectionRow title="Testimonials">
        <p>
          Placeholder section. Testimonials will stay empty until real quotes
          and attribution are provided.
        </p>
      </SectionRow>
    </>
  )
}
