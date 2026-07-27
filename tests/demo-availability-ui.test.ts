import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

describe('demo availability UI source', () => {
  const indicator = fs.readFileSync(
    path.join(process.cwd(), 'components/ui/DemoAvailabilityIndicator.tsx'),
    'utf8',
  )
  const client = fs.readFileSync(
    path.join(process.cwd(), 'components/ui/DemoAvailabilityClient.tsx'),
    'utf8',
  )
  const css = fs.readFileSync(
    path.join(process.cwd(), 'app/globals.css'),
    'utf8',
  )
  const demosIndex = fs.readFileSync(
    path.join(process.cwd(), 'app/(site)/demos/page.tsx'),
    'utf8',
  )

  it('renders all labels beside a real light without emoji', () => {
    expect(indicator).toContain('demo-availability__light')
    expect(indicator).toContain('demo-availability__label')
    expect(indicator).not.toMatch(/[🟢🟠🔴⚪]/)
    expect(css).toContain("data-state='active'")
    expect(css).toContain("data-state='waking'")
    expect(css).toContain("data-state='inactive'")
    expect(css).toContain("data-state='unavailable'")
    expect(css).toContain('box-shadow')
  })

  it('pulses only waking and disables the pulse for reduced motion', () => {
    expect(css).toContain('demo-availability-waking')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('animation: none')
  })

  it('does not wake from the demos index', () => {
    expect(demosIndex).toContain('mode="index"')
    expect(client).toContain("mode === 'context'")
    expect(client).toContain('window.sessionStorage.getItem(sessionStorageKey)')
    expect(client).toContain('window.sessionStorage.setItem(sessionStorageKey')
    expect(client).toContain('clearTimeout(timer)')
    expect(client).toContain('controller.abort()')
  })
})
