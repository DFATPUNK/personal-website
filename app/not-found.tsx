import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--secondary-accent)]">
        Not found
      </p>
      <h1 className="text-4xl font-semibold">This page is not available.</h1>
      <p className="mt-5 leading-7 text-[var(--muted-foreground)]">
        The Personal Website V2 foundation only exposes the first public route
        set. Later phases will add the remaining content surfaces.
      </p>
      <Link className="mt-8 text-sm font-semibold text-[var(--accent)]" href="/">
        Return home
      </Link>
    </main>
  )
}
