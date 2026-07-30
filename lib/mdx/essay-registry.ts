import FoundationSampleEssay from '@/content/essays/foundation-sample.mdx'
import EventDrivenDatabaseEssay from '@/content/essays/how-to-manage-automations-event-driven-database.mdx'
import type { Essay } from '@/lib/content/essays'
import type { ComponentType } from 'react'

type MdxEssayComponent = ComponentType<Record<string, unknown>>
type ImmersiveEssayComponent = ComponentType<{ essay: Essay }>

const standardEssayRegistry: Record<string, MdxEssayComponent> = {
  'foundation-sample': FoundationSampleEssay,
  'how-to-manage-automations-event-driven-database':
    EventDrivenDatabaseEssay,
}

const immersiveEssayRegistry: Record<string, ImmersiveEssayComponent> = {}

export function getStandardEssayComponent(slug: string) {
  return standardEssayRegistry[slug]
}

export function getImmersiveEssayComponent(slug: string) {
  return immersiveEssayRegistry[slug]
}

export function getRegisteredImmersiveEssaySlugs() {
  return Object.keys(immersiveEssayRegistry)
}
