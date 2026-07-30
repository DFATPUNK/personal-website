import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

describe('privacy page', () => {
  it('exists and covers publication-alert data rights', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'app/(site)/privacy/page.tsx'),
      'utf8',
    )

    expect(source).toContain('Jérémy Brunet')
    expect(source).toContain('jeremy@jeremybrunet.com')
    expect(source).toContain('email address, signup time, and signup source')
    expect(source).toContain('occasional notifications for major essays and')
    expect(source).toContain('Mailchimp')
    expect(source).toContain('n8n')
    expect(source).toContain('unsubscribe')
    expect(source).toContain('deletion')
    expect(source).toContain('not')
    expect(source).toContain('sold')
  })
})
