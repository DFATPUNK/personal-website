'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { siteConfig } from '@/lib/site-config'

function isActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = (
    <ul className="space-y-1">
      {siteConfig.navigation.map((item) => {
        const active = isActive(pathname, item.href)

        return (
          <li key={item.href}>
            <Link
              aria-current={active ? 'page' : undefined}
              className={[
                'block border-l-2 px-3 py-2 text-sm transition-colors',
                active
                  ? 'border-[var(--accent)] text-[var(--foreground)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:border-[var(--border)] hover:text-[var(--foreground)]',
              ].join(' ')}
              href={item.href}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)] lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-4 lg:block lg:px-8 lg:py-10">
        <Link
          className="block text-sm font-semibold"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          {siteConfig.name}
        </Link>
        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          className="inline-flex size-10 items-center justify-center border border-[var(--border)] text-[var(--foreground)] lg:hidden"
          type="button"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden size={18} /> : <Menu aria-hidden size={18} />}
        </button>
        <div className="mt-12 hidden lg:block">
          <p className="mb-8 max-w-36 text-xs leading-6 text-[var(--muted-foreground)]">
            Jérémy Brunet. Technical portfolio, essays, and demos.
          </p>
          <nav aria-label="Primary navigation">{links}</nav>
        </div>
      </div>
      {isOpen ? (
        <nav
          aria-label="Primary navigation"
          className="border-t border-[var(--border)] px-5 py-3 lg:hidden"
        >
          {links}
        </nav>
      ) : null}
    </header>
  )
}
