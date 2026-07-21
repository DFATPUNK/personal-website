import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef } from 'react'

import { AirtableEmbed } from './AirtableEmbed'
import { ExecutableSnippet } from './ExecutableSnippet'
import { Figure } from './Figure'
import { N8nWorkflow } from './N8nWorkflow'

function MdxImage({ alt = '', ...props }: ComponentPropsWithoutRef<'img'>) {
  if (!alt.trim()) {
    throw new Error('MDX images require meaningful alternative text.')
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} loading="lazy" {...props} />
}

function MdxTable(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="mdx-table-scroll">
      <table {...props} />
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  AirtableEmbed,
  ExecutableSnippet,
  Figure,
  N8nWorkflow,
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
  img: MdxImage,
  table: MdxTable,
}
