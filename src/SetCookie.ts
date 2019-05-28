import cookie, { CookieSerializeOptions } from 'cookie'
import { createInjectDecorators, Selector } from 'prismy'

export type SetCookieOptions = CookieSerializeOptions

export type CookieSetter = (
  ...cookies: Array<[string, string, SetCookieOptions] | [string, string]>
) => void

export function createSetCookieSelector(): Selector<CookieSetter> {
  return (req, res) => {
    return (...cookies) => {
      res.setHeader(
        'Set-Cookie',
        cookies.map(([name, value, options]) =>
          serializeCookie(name, value, options)
        )
      )
    }
  }
}

function serializeCookie(
  name: string,
  value: string,
  options: SetCookieOptions = {}
): string {
  return cookie.serialize(name, value, options)
}

export function SetCookie() {
  return createInjectDecorators(createSetCookieSelector())
}
