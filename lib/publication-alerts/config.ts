export const PUBLICATION_ALERT_INVITATION =
  'Get notified when this essay is published and when I release another major essay or demo.'
export const PUBLICATION_ALERT_HELPER =
  'No newsletter. Only occasional publication alerts. Unsubscribe anytime.'
export const PUBLICATION_ALERT_EMAIL_LABEL = 'Email address'
export const PUBLICATION_ALERT_EMAIL_PLACEHOLDER = 'you@example.com'
export const PUBLICATION_ALERT_COMPACT_EMAIL_PLACEHOLDER = 'email@example.com'
export const PUBLICATION_ALERT_BUTTON_LABEL = 'Notify me'
export const PUBLICATION_ALERT_COMPACT_BUTTON_LABEL = 'Get publication alerts'
export const PUBLICATION_ALERT_SUCCESS_MESSAGE = "You're on the list."
export const PUBLICATION_ALERT_UNAVAILABLE_MESSAGE =
  'Publication alerts are temporarily unavailable. Please try again later.'
export const PUBLICATION_ALERT_RESUBSCRIBE_MESSAGE =
  'This address cannot be rejoined automatically. Email jeremy@jeremybrunet.com if you want to rejoin.'
export const PUBLICATION_ALERT_VALIDATION_MESSAGE =
  'Please enter a valid email address.'
export const PUBLICATION_ALERT_REQUEST_BODY_MAX_BYTES = 3000
export const PUBLICATION_ALERT_WEBHOOK_TIMEOUT_MS = 8000
export const PUBLICATION_ALERT_WEBHOOK_RESPONSE_MAX_BYTES = 6000
export const PUBLICATION_ALERT_GENERAL_TAG = 'publication-alerts'

export type PublicationAlertSubmission = {
  email: string
  source: string
  tags: readonly [typeof PUBLICATION_ALERT_GENERAL_TAG, string]
  submittedAt: string
  sourceUrl: string
}
