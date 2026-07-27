import type { Metadata } from 'next'

import { PageHeader } from '@/components/ui/PageHeader'
import { absoluteUrl } from '@/lib/seo/urls'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'Privacy information for publication-alert email signups on jeremybrunet.com.',
  alternates: {
    canonical: absoluteUrl('/privacy'),
  },
}

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Publication alerts privacy."
        description="A concise note about the email-alert form on this website."
      />
      <div className="site-prose">
        <p>
          The controller for publication-alert signups is Jérémy Brunet. You can
          contact him at{' '}
          <a href="mailto:jeremy@jeremybrunet.com">jeremy@jeremybrunet.com</a>.
        </p>
        <p>
          The signup collects your email address, signup time, and signup source
          so Jérémy can send occasional notifications for major essays and
          demos. The data is processed in Mailchimp, with n8n used for
          automation.
        </p>
        <p>
          Your data is kept until you unsubscribe or ask for deletion. It is not
          sold. You may unsubscribe through Mailchimp links in future emails, or
          request deletion by emailing{' '}
          <a href="mailto:jeremy@jeremybrunet.com">jeremy@jeremybrunet.com</a>.
        </p>
      </div>
    </>
  )
}
