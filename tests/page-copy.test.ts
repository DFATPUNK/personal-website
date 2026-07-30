import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

describe('page introduction copy', () => {
  it('uses the approved demos introduction without hosting-architecture copy', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'app/(site)/demos/page.tsx'),
      'utf8',
    )

    expect(source).toContain('title="Demos and contexts."')
    expect(source).toContain(
      'Please note that some demos rely on on-demand databases and may need a short warm-up.',
    )
    expect(source).toContain('Read context')
    expect(source).not.toContain('Short landing pages live here')
    expect(source).not.toContain('dedicated demos host')
    expect(source).not.toContain('availability indicator')
  })

  it('uses the approved essays introduction and metadata categories', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'app/(site)/essays/page.tsx'),
      'utf8',
    )

    expect(source).toContain('eyebrow="Essays"')
    expect(source).toContain('title="Essays, notebooks, and tutorials."')
    expect(source).toContain(
      'My writing, from newest to oldest, including past external publications.',
    )
    expect(source).toContain(
      'Essays, notebooks, tutorials, and external publications by Jérémy Brunet.',
    )
    expect(source).not.toContain('notebook renderer')
  })
})
