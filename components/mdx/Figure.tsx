type FigureProps = {
  alt: string
  caption?: string
  height?: number
  src: string
  width?: number
}

export function Figure({ alt, caption, height, src, width }: FigureProps) {
  if (!alt.trim()) {
    throw new Error('MDX figures require meaningful alternative text.')
  }

  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={alt}
        className="h-auto max-w-full"
        height={height}
        loading="lazy"
        src={src}
        width={width}
      />
      {caption ? (
        <figcaption className="mt-2 text-sm text-[var(--muted-foreground)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
