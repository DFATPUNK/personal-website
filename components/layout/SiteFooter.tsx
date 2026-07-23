import Link from 'next/link'

import { siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted-foreground)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>© Jérémy Brunet</p>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link className="hover:text-[var(--accent)]" href="/contact">
                Contact
              </Link>
            </li>
            <li>
              <a
                aria-label="LinkedIn profile for Jérémy Brunet"
                className="hover:text-[var(--accent)]"
                href={siteConfig.links.linkedin}
                rel="noopener noreferrer"
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
