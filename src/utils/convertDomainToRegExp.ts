import escapeStringRegexp from 'escape-string-regexp'

export default (domain: string): RegExp => {
  return new RegExp(
    '^' + escapeStringRegexp(domain).replace(/^\\\*\\\./, '(.*\\.)?') + '$',
    'i',
  )
}
