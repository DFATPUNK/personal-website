export const EMAIL_MAX_LENGTH = 254
export const MESSAGE_MIN_LENGTH = 10
export const MESSAGE_MAX_LENGTH = 5000
export const HONEYPOT_MAX_LENGTH = 200
export const CONTACT_REQUEST_BODY_MAX_BYTES = 12_000
export const CONTACT_WEBHOOK_TIMEOUT_MS = 8000
export const CONTACT_SUCCESS_MESSAGE = 'Thanks - your message has been sent.'
export const CONTACT_VALIDATION_MESSAGE =
  'Please review the highlighted fields.'
export const CONTACT_DELIVERY_FAILURE_MESSAGE =
  'Your message could not be sent right now. Please try again later.'

export const CONTACT_TOPICS = [
  {
    value: 'need-help',
    label: 'Need your help',
    messageLabel: 'Where are you stuck?',
    helperText:
      'Describe what you do, the current process, where you are blocked, and which tools and services you use.',
    placeholder: "I'm an HR manager at Acme Inc. My day starts with...",
    rows: 7,
  },
  {
    value: 'job-offer',
    label: 'Job offer',
    messageLabel:
      'Describe the open position and why you think I may fit in.',
    helperText:
      'Describe the role, the team context, and what you expect from the person in this position.',
    placeholder:
      'We are hiring for a role focused on automation and internal tools...',
    rows: 7,
  },
  {
    value: 'essay-code-comment',
    label: 'Essay/code comment',
    messageLabel:
      'A penny for your thoughts! Quote the name of the essay or repository.',
    helperText:
      'You can refer to an essay, repository, code snippet, or demo.',
    placeholder:
      'About the event-driven database essay, I had a thought on...',
    rows: 7,
  },
  {
    value: 'other',
    label: 'Other',
    messageLabel:
      "Write me your message and I'll get back to you as soon as I've read it.",
    helperText: 'Use this for anything that does not fit the other topics.',
    placeholder: 'Hello Jérémy, I wanted to ask about...',
    rows: 9,
  },
] as const

export type ContactTopic = (typeof CONTACT_TOPICS)[number]['value']

export type ContactFormInput = {
  email: string
  topic: ContactTopic
  message: string
  preferredInterviewDate?: string
  honeypot?: string
}

export type ContactSubmission = {
  email: string
  topic: ContactTopic
  message: string
  preferredInterviewDate?: string
  submittedAt: string
  source: string
}

export const CONTACT_TOPIC_VALUES = CONTACT_TOPICS.map((topic) => topic.value)

export const contactTopicsByValue = new Map(
  CONTACT_TOPICS.map((topic) => [topic.value, topic]),
)
