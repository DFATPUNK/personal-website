import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

function extractSection(source: string, heading: string) {
  const start = source.indexOf(`## ${heading}`)

  expect(start).toBeGreaterThan(-1)

  const next = source.indexOf('\n## ', start + 1)

  return source.slice(start, next === -1 ? undefined : next)
}

describe('release checklist classification', () => {
  it('keeps optional future work out of release blockers', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'docs/release-content-checklist.md'),
      'utf8',
    )
    const required = extractSection(source, 'Still required before release')
    const deferred = extractSection(source, 'Deferred after V2 launch')

    expect(required).toContain('At least one recent local essay')
    expect(required).toContain('foundation-sample')
    expect(required).toContain('CONTACT_WEBHOOK_URL')
    expect(required).toContain('v2 -> main')
    expect(required).toContain('unresolved defects')
    expect(required).not.toContain('Topic aggregation/filtering')
    expect(required).not.toContain('External demo visual harmonization')
    expect(required).not.toContain('CS229 immersive demo')

    expect(deferred).toContain('Topic aggregation/filtering')
    expect(deferred).toContain('External demo visual harmonization')
    expect(deferred).toContain('CS229 immersive demo')
  })
})
