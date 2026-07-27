import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

import { siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--border)] pt-8 text-[13px] leading-5 text-[#666666] sm:mt-16 sm:pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>© Jérémy Brunet</p>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <Link
                className="inline-flex items-center gap-1.5 hover:text-[var(--foreground)]"
                href="/contact"
              >
                Contact
                <Mail aria-hidden size={16} strokeWidth={1.8} />
              </Link>
            </li>
            <li>
              <a
                aria-label="GitHub profile"
                className="inline-flex hover:text-[var(--foreground)]"
                href={siteConfig.links.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github aria-hidden size={16} strokeWidth={1.8} />
              </a>
            </li>
            <li>
              <a
                aria-label="LinkedIn profile"
                className="inline-flex hover:text-[var(--foreground)]"
                href={siteConfig.links.linkedin}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Linkedin aria-hidden size={16} strokeWidth={1.8} />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
