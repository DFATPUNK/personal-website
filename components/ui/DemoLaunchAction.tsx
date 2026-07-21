type DemoLaunchActionProps = {
  demoTitle: string
  externalUrl: string
  linkClassName?: string
}

export function DemoLaunchAction({
  demoTitle,
  externalUrl,
  linkClassName,
}: DemoLaunchActionProps) {
  return (
    <>
      <a
        aria-label={`Open live demo for ${demoTitle}`}
        className={['hidden lg:inline-flex', linkClassName]
          .filter(Boolean)
          .join(' ')}
        href={externalUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        Open live demo
      </a>
      <span className="text-[var(--muted-foreground)] lg:hidden">
        Switch to desktop to open live demo
      </span>
    </>
  )
}
