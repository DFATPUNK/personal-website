type AirtableEmbedProps = {
  height?: number
  src: string
  title: string
}

function getSafeAirtableUrl(src: string) {
  const url = new URL(src)
  const isAirtableHost =
    url.hostname === 'airtable.com' || url.hostname === 'www.airtable.com'

  if (url.protocol !== 'https:' || !isAirtableHost) {
    throw new Error('Airtable embeds must use an HTTPS airtable.com URL.')
  }

  return url.toString()
}

export function AirtableEmbed({
  height = 640,
  src,
  title,
}: AirtableEmbedProps) {
  const safeSrc = getSafeAirtableUrl(src)
  const frameHeight = Math.min(Math.max(height, 240), 1200)

  return (
    <figure className="my-8">
      <iframe
        className="block w-full border border-[var(--border)]"
        height={frameHeight}
        loading="lazy"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts"
        src={safeSrc}
        title={title}
      />
      <figcaption className="mt-2 text-sm text-[var(--muted-foreground)]">
        <a href={safeSrc} rel="noreferrer" target="_blank">
          Open Airtable view
        </a>
      </figcaption>
    </figure>
  )
}
