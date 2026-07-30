import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

function readProjectFile(filePath: string) {
  return fs.readFileSync(path.join(process.cwd(), filePath), 'utf8')
}

describe('visual design system', () => {
  it('uses a white MatX-aligned background while preserving accent tokens', () => {
    const globals = readProjectFile('app/globals.css')

    expect(globals).toContain('--background: #ffffff;')
    expect(globals).toContain('--foreground: #1a1a1a;')
    expect(globals).toContain('--muted-foreground: #3a3a3a;')
    expect(globals).toContain('--border: #eeeeee;')
    expect(globals).toContain('--accent: #265d73;')
    expect(globals).toContain('--secondary-accent: #8d3434;')
  })

  it('loads a deterministic sans and mono font through next/font', () => {
    const layout = readProjectFile('app/layout.tsx')
    const globals = readProjectFile('app/globals.css')

    expect(layout).toContain("import { Geist, Geist_Mono } from 'next/font/google'")
    expect(layout).toContain("variable: '--font-sans'")
    expect(layout).toContain("variable: '--font-mono'")
    expect(layout).toContain('className={`${sans.variable} ${mono.variable}`}')
    expect(globals).toContain("var(--font-sans), 'Helvetica Neue'")
    expect(globals).not.toContain('Inter, ui-sans-serif')
  })

  it('keeps bordered neutral tags across profile, essays, demos, and essays', () => {
    for (const filePath of [
      'app/(site)/page.tsx',
      'app/(site)/essays/page.tsx',
      'app/(site)/demos/page.tsx',
      'app/(site)/demos/[slug]/page.tsx',
      'components/mdx/StandardEssay.tsx',
    ]) {
      expect(readProjectFile(filePath)).toContain(
        'border border-[var(--border)] px-2 py-1',
      )
    }
  })

  it('keeps section row headings close to the audited MatX row labels', () => {
    const sectionRow = readProjectFile('components/ui/SectionRow.tsx')

    expect(sectionRow).toContain('sm:grid-cols-[140px_1fr]')
    expect(sectionRow).toContain('border-t border-[#dddddd] py-5')
    expect(sectionRow).toContain('text-xs font-normal uppercase')
    expect(sectionRow).toContain('tracking-[0.06em]')
  })
})
