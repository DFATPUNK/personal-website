import {
  demoAvailabilityLabels,
  type DemoAvailabilityState,
} from '@/lib/demos/availability-contract'

type DemoAvailabilityIndicatorProps = {
  state: DemoAvailabilityState
  loading?: boolean
}

export function DemoAvailabilityIndicator({
  state,
  loading = false,
}: DemoAvailabilityIndicatorProps) {
  const label = loading ? 'Checking status' : demoAvailabilityLabels[state]

  return (
    <span
      aria-live="polite"
      className="demo-availability"
      data-state={state}
    >
      <span aria-hidden="true" className="demo-availability__light" />
      <span className="demo-availability__label">{label}</span>
    </span>
  )
}
