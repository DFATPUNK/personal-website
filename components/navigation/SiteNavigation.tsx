'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

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
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileNavRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const firstLink = mobileNavRef.current?.querySelector<HTMLAnchorElement>('a')

    firstLink?.focus()
  }, [isOpen])

  function closeMobileNavigation({ restoreFocus = false } = {}) {
    setIsOpen(false)

    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus())
    }
  }

  function handleMobileNavKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      closeMobileNavigation({ restoreFocus: true })
    }
  }

  const renderLinks = () => (
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
              onClick={() => closeMobileNavigation()}
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
          onClick={() => closeMobileNavigation()}
        >
          {siteConfig.name}
        </Link>
        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="mobile-primary-navigation"
          className="inline-flex size-10 items-center justify-center border border-[var(--border)] text-[var(--foreground)] lg:hidden"
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X aria-hidden size={18} /> : <Menu aria-hidden size={18} />}
        </button>
        <div className="mt-12 hidden lg:block">
          <p className="mb-8 max-w-36 text-xs leading-6 text-[var(--muted-foreground)]">
            Jérémy Brunet. Technical portfolio, essays, and demos.
          </p>
          <nav aria-label="Primary navigation">{renderLinks()}</nav>
        </div>
      </div>
      {isOpen ? (
        <nav
          aria-label="Primary navigation"
          className="border-t border-[var(--border)] px-5 py-3 lg:hidden"
          id="mobile-primary-navigation"
          onKeyDown={handleMobileNavKeyDown}
          ref={mobileNavRef}
        >
          {renderLinks()}
        </nav>
      ) : null}
    </header>
  )
}
