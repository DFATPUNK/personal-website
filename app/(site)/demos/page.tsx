import { PageHeader } from '@/components/ui/PageHeader'
import { SectionRow } from '@/components/ui/SectionRow'

export const metadata = {
  title: 'Demos',
  description: 'A placeholder catalog for Jérémy Brunet demos.',
}

export default function DemosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Demos"
        title="A catalog boundary, not a demo migration."
        description="The related DFATPUNK/demos repository remains separate in this foundation PR. The full catalog and route strategy are scheduled for the demos phase."
      />
      <SectionRow title="Current boundary">
        <p>
          Existing demo applications continue to live under
          demos.jeremybrunet.com and their own deployments. This page exists so
          the new personal site can grow a typed catalog later without changing
          the demos repository now.
        </p>
      </SectionRow>
    </>
  )
}
