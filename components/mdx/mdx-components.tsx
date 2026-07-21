import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  a: ({ href = '', children }) => {
    const isInternal = href.startsWith('/')

    if (isInternal) {
      return <Link href={href}>{children}</Link>
    }

    return (
      <a href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    )
  },
}
