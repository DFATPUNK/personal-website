'use client'

import {
  Check,
  Copy,
  Linkedin,
  Mail,
  Share2,
  SquareArrowOutUpRight,
} from 'lucide-react'
import { useState } from 'react'

type ShareControlsProps = {
  title: string
  url: string
}

type CopyState = 'idle' | 'copied' | 'failed' | 'unavailable'

function copyWithSelectionFallback(value: string) {
  const textarea = document.createElement('textarea')

  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-1000px'
  document.body.append(textarea)
  textarea.select()

  try {
    return document.execCommand('copy')
  } finally {
    textarea.remove()
  }
}

export function ShareControls({ title, url }: ShareControlsProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const emailHref = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  const xHref = `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`

  async function copyUrl() {
    if (!navigator.clipboard) {
      if (copyWithSelectionFallback(url)) {
        setCopyState('copied')
        window.setTimeout(() => setCopyState('idle'), 2400)
      } else {
        setCopyState('unavailable')
      }
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 2400)
    } catch {
      if (copyWithSelectionFallback(url)) {
        setCopyState('copied')
        window.setTimeout(() => setCopyState('idle'), 2400)
      } else {
        setCopyState('failed')
      }
    }
  }

  async function shareUrl() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
      }
    }

    await copyUrl()
  }

  const copyFeedback = {
    copied: 'Copied',
    failed: 'Copy failed',
    idle: '',
    unavailable: 'Copy unavailable',
  }[copyState]

  return (
    <section aria-label="Share this essay" className="border-t border-[var(--border)] pt-6">
      <div className="flex flex-wrap gap-2">
        <button
          aria-label="Copy essay URL"
          className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          type="button"
          onClick={copyUrl}
        >
          {copyState === 'copied' ? (
            <Check aria-hidden size={15} />
          ) : (
            <Copy aria-hidden size={15} />
          )}
          Copy link
        </button>
        <button
          aria-label="Share essay"
          className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          type="button"
          onClick={shareUrl}
        >
          <Share2 aria-hidden size={15} />
          Share
        </button>
        <a
          aria-label="Share essay by email"
          className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          href={emailHref}
        >
          <Mail aria-hidden size={15} />
          Email
        </a>
        <a
          aria-label="Share essay on LinkedIn"
          className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          href={linkedInHref}
          rel="noreferrer"
          target="_blank"
        >
          <Linkedin aria-hidden size={15} />
          LinkedIn
        </a>
        <a
          aria-label="Share essay on X"
          className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          href={xHref}
          rel="noreferrer"
          target="_blank"
        >
          <SquareArrowOutUpRight aria-hidden size={15} />
          X
        </a>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-[var(--muted-foreground)]">
        {copyFeedback}
      </p>
    </section>
  )
}
