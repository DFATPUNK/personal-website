const fakeLocalParts = new Set([
  'test',
  'testing',
  'dummy',
  'fake',
  'azerty',
  'qwerty',
  'aaaa',
  'example',
])

const reservedExactDomains = new Set([
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'localhost',
  'invalid',
  'test',
])

const reservedDomainSuffixes = [
  '.example.com',
  '.example.org',
  '.example.net',
  '.test.com',
  '.localhost',
  '.invalid',
  '.test',
]

export function isObviouslyFakeEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const atIndex = normalizedEmail.lastIndexOf('@')

  if (atIndex <= 0 || atIndex === normalizedEmail.length - 1) {
    return false
  }

  const localPart = normalizedEmail.slice(0, atIndex)
  const domain = normalizedEmail.slice(atIndex + 1).replace(/\.$/, '')
  const baseLocalPart = localPart.split('+')[0] ?? localPart

  if (fakeLocalParts.has(baseLocalPart)) {
    return true
  }

  if (reservedExactDomains.has(domain)) {
    return true
  }

  return reservedDomainSuffixes.some((suffix) => domain.endsWith(suffix))
}
