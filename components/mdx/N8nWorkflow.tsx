type N8nWorkflowProps = {
  description?: string
  embedUrl?: string
  height?: number
  href?: string
  sourceUrl?: string
  title: string
}

const sensitiveUrlParts = [
  'credential',
  'execution',
  'rest/',
  'webhook',
  'webhooks',
]

function getSafePublicUrl(value: string, label: string) {
  const url = new URL(value)
  const serialized = url.toString()
  const lowerUrl = serialized.toLowerCase()

  if (url.protocol !== 'https:') {
    throw new Error(`${label} must use HTTPS.`)
  }

  if (sensitiveUrlParts.some((part) => lowerUrl.includes(part))) {
    throw new Error(`${label} must not expose private n8n endpoints.`)
  }

  return serialized
}

export function N8nWorkflow({
  description,
  embedUrl,
  height = 520,
  href,
  sourceUrl,
  title,
}: N8nWorkflowProps) {
  if (!embedUrl && !href) {
    throw new Error('N8nWorkflow requires either embedUrl or href.')
  }

  const safeEmbedUrl = embedUrl
    ? getSafePublicUrl(embedUrl, 'n8n embedUrl')
    : undefined
  const safeHref = href ? getSafePublicUrl(href, 'n8n href') : safeEmbedUrl
  const safeSourceUrl = sourceUrl
    ? getSafePublicUrl(sourceUrl, 'n8n sourceUrl')
    : undefined
  const frameHeight = Math.min(Math.max(height, 240), 1000)

  return (
    <section className="my-8 border border-[var(--border)] p-4">
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
          {description}
        </p>
      ) : null}
      {safeEmbedUrl ? (
        <iframe
          className="mt-4 block w-full border border-[var(--border)]"
          height={frameHeight}
          loading="lazy"
          sandbox="allow-popups allow-same-origin allow-scripts"
          src={safeEmbedUrl}
          title={title}
        />
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {safeHref ? (
          <a
            className="border-b border-[var(--border)] text-[var(--accent)]"
            href={safeHref}
            rel="noreferrer"
            target="_blank"
          >
            Open workflow reference
          </a>
        ) : null}
        {safeSourceUrl ? (
          <a
            className="border-b border-[var(--border)] text-[var(--accent)]"
            href={safeSourceUrl}
            rel="noreferrer"
            target="_blank"
          >
            Source
          </a>
        ) : null}
      </div>
    </section>
  )
}
