import convertDomainToRegExp from './convertDomainToRegExp'

test('accept empty string', () => {
  expect(convertDomainToRegExp('')).toStrictEqual(/^$/i)
})

test('regexp must be case insensitive', () => {
  const regexp = convertDomainToRegExp('google.com')
  expect(regexp.test('GooGlE.CoM')).toBe(true)
})

test('regexp must be exact match', () => {
  const regexp = convertDomainToRegExp('google.com')
  expect(regexp.test('google.com ')).toBe(false)
  expect(regexp.test(' google.com')).toBe(false)
  expect(regexp.test(' google.com ')).toBe(false)
})

test('accept wild card', () => {
  const regexp = convertDomainToRegExp('*.google.com')
  expect(regexp.test('google.com')).toBe(true)
  expect(regexp.test('.google.com')).toBe(true)
  expect(regexp.test('www.google.com')).toBe(true)
  expect(regexp.test('www.google.com.hk')).toBe(false)
})

test('wild card must be start with `*.`', () => {
  expect(convertDomainToRegExp('*google.com').test('google.com')).toBe(false)
  expect(convertDomainToRegExp('google.*').test('google.com')).toBe(false)
  expect(convertDomainToRegExp('google.*.hk').test('google.com.hk')).toBe(false)
})

test('should escape regexp syntax in domain', () => {
  const regexp = convertDomainToRegExp('google.com')
  expect(regexp.test('google_com')).toBe(false)
})
