import escapeStringRegexp from 'escape-string-regexp'

export default function convertDomainToRegExp(domain: string): RegExp {
  return new RegExp(
    '^' + escapeStringRegexp(domain).replace(/^\\\*\\\./, '(.*\\.)?') + '$',
    'i',
  )
}
