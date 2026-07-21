import createMDX from '@next/mdx'
import rehypeKatex from 'rehype-katex'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
})

const outputFileTracingRoot = dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  outputFileTracingRoot,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

export default withMDX(nextConfig)
