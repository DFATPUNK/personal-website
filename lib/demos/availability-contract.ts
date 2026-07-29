import type { DemoAvailabilityKey } from '@/lib/content/demos'

export const demoAvailabilityStates = [
  'active',
  'waking',
  'inactive',
  'unavailable',
] as const

export type DemoAvailabilityState = (typeof demoAvailabilityStates)[number]

export type DemoAvailabilityStatus = {
  key: DemoAvailabilityKey
  state: DemoAvailabilityState
  checkedAt: string
}

export type DemoAvailabilityStatuses = Record<
  DemoAvailabilityKey,
  DemoAvailabilityStatus
>

export const demoAvailabilityLabels = {
  active: 'Active',
  waking: 'Waking up',
  inactive: 'Inactive',
  unavailable: 'Unavailable',
} satisfies Record<DemoAvailabilityState, string>
