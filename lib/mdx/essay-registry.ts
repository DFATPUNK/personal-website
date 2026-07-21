import FoundationSampleEssay from '@/content/essays/foundation-sample.mdx'
import type { Essay } from '@/lib/content/essays'
import type { ComponentType } from 'react'

type MdxEssayComponent = ComponentType<Record<string, unknown>>
type ImmersiveEssayComponent = ComponentType<{ essay: Essay }>

const standardEssayRegistry: Record<string, MdxEssayComponent> = {
  'foundation-sample': FoundationSampleEssay,
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
