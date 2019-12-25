import { isInternalLink } from './Main'

describe('Header', () => {

  test('should return false given external link', () => {
    expect(isInternalLink('https://google.com')).toBe(false)
  })

  describe('Sub Header', () => {

    test('should return true given internal link', () => {
      expect(isInternalLink('/some-page')).toBe(true)
    })

  })

})