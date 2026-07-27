import type { Metadata } from 'next'

import { PageHeader } from '@/components/ui/PageHeader'
import { SectionRow } from '@/components/ui/SectionRow'
import { academicsEmptyState } from '@/lib/content/academics'
import { careerEmptyState } from '@/lib/content/career'
import { profileContent } from '@/lib/content/profile'
import { testimonialsEmptyState } from '@/lib/content/testimonials'
import { absoluteUrl } from '@/lib/seo/urls'
import { topics, type TopicSlug } from '@/lib/topics/registry'

const topicLabels = new Map(topics.map((topic) => [topic.slug, topic.label]))

export const metadata: Metadata = {
  title: 'Technical Portfolio',
  description:
    'Jérémy Brunet designs intelligent automations across SaaS, event-driven data architecture, applied AI, MCP, and machine-learning pipelines.',
  alternates: {
    canonical: absoluteUrl('/'),
  },
}

export default function HomePage() {
  const { introduction, career, previousRoles, academics, testimonials } =
    profileContent

  return (
    <>
      <PageHeader
        eyebrow={introduction.eyebrow}
        title={introduction.title}
        description={introduction.summary}
      />

      <SectionRow title="Introduction">
        <div className="space-y-4">
          {introduction.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </SectionRow>
      <SectionRow title="Career">
        {career.length > 0 ? (
          <div className="space-y-6">
            {career.map((entry) => (
              <article key={entry.id} className="space-y-2">
                <div>
                  <h3 className="font-semibold">{entry.role}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {entry.organization} · {entry.startDate}
                    {entry.endDate ? ` - ${entry.endDate}` : ''}
                  </p>
                </div>
                <p>{entry.summary}</p>
                <TopicList tags={entry.tags} />
                <LinkList links={entry.links} />
              </article>
            ))}
            {previousRoles.length > 0 ? (
              <div className="border-l-2 border-[var(--border)] pl-4 text-sm text-[var(--muted-foreground)]">
                <p className="font-medium text-[var(--foreground)]">
                  Previous roles include:
                </p>
                <ul className="mt-2 space-y-1">
                  {previousRoles.map((entry) => (
                    <li key={entry.id}>
                      {entry.role} at {entry.organization}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <EmptyState
            description={careerEmptyState.description}
            title={careerEmptyState.title}
          />
        )}
      </SectionRow>
      <SectionRow title="Academics">
        {academics.length > 0 ? (
          <div className="space-y-6">
            {academics.map((entry) => (
              <article key={entry.id} className="space-y-2">
                <div>
                  <h3 className="font-semibold">{entry.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {entry.institution}
                    {entry.date ? ` · ${entry.date}` : ''}
                  </p>
                </div>
                {entry.description ? <p>{entry.description}</p> : null}
                <TopicList tags={entry.tags} />
                <LinkList
                  links={[
                    ...(entry.url
                      ? [{ href: entry.url, label: 'See certificate' }]
                      : []),
                    ...(entry.links ?? []),
                  ]}
                />
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            description={academicsEmptyState.description}
            title={academicsEmptyState.title}
          />
        )}
      </SectionRow>
      <SectionRow title="Testimonials">
        {testimonials.length > 0 ? (
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.id} className="space-y-3">
                <blockquote className="border-l-2 border-[var(--border)] pl-4 text-[var(--foreground)]">
                  <div className="space-y-4">
                    {testimonial.quote.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </blockquote>
                <figcaption className="text-sm text-[var(--muted-foreground)]">
                  {testimonial.author}
                  {testimonial.role ? `, ${testimonial.role}` : ''}
                  {testimonial.organization
                    ? ` at ${testimonial.organization}`
                    : ''}
                </figcaption>
                <TopicList tags={testimonial.tags} />
              </figure>
            ))}
          </div>
        ) : (
          <EmptyState
            description={testimonialsEmptyState.description}
            title={testimonialsEmptyState.title}
          />
        )}
      </SectionRow>
    </>
  )
}

function TopicList({ tags }: { tags: readonly TopicSlug[] | undefined }) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <ul className="flex flex-wrap gap-2 text-xs text-[#666666]">
      {tags.map((tag) => (
        <li key={tag} className="border border-[var(--border)] px-2 py-1">
          {topicLabels.get(tag) ?? tag}
        </li>
      ))}
    </ul>
  )
}

function LinkList({
  links,
}: {
  links: readonly { href: string; label: string }[] | undefined
}) {
  if (!links || links.length === 0) {
    return null
  }

  return (
    <ul className="space-y-1 text-sm text-[var(--foreground)]">
      {links.map((link) => (
        <li key={link.href}>
          <a
            className="border-b border-[var(--muted-foreground)] hover:border-[var(--foreground)]"
            href={link.href}
            rel={isExternalUrl(link.href) ? 'noopener noreferrer' : undefined}
            target={isExternalUrl(link.href) ? '_blank' : undefined}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function isExternalUrl(href: string) {
  return /^https?:\/\//.test(href)
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="border-l-2 border-[var(--border)] pl-4">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  )
}
