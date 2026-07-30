import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { academicEntries } from '../lib/content/academics'

const certificatePaths = [
  '/certificates/codecademy-machine-learning-engineer.pdf',
  '/certificates/zapier_certificate.pdf',
  '/certificates/cs50.pdf',
] as const

describe('certificate assets', () => {
  it('exposes the expected public certificate paths from local assets', () => {
    const linkedCertificatePaths = academicEntries.flatMap((entry) =>
      (entry.links ?? [])
        .map((link) => link.href)
        .filter((href) => href.endsWith('.pdf')),
    )

    expect(linkedCertificatePaths).toEqual(certificatePaths)
    expect(linkedCertificatePaths.every((href) => href.startsWith('/certificates/'))).toBe(
      true,
    )
    expect(linkedCertificatePaths.join(' ')).not.toContain('dropbox.com')
  })

  it('keeps each public certificate non-empty and PDF-signed', () => {
    for (const publicPath of certificatePaths) {
      const filePath = path.join(process.cwd(), 'public', publicPath)
      const file = fs.readFileSync(filePath)

      expect(file.length).toBeGreaterThan(0)
      expect(file.subarray(0, 4).toString('utf8')).toBe('%PDF')
    }
  })
})
