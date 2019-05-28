import cookie from 'cookie'
import { createInjectDecorators, Selector } from 'prismy'

export interface CookiesOptions {
  decode?: (value: string) => string
}

export function createCookiesSelector(options?: CookiesOptions): Selector<any> {
  return (req, res) => {
    return cookie.parse(req.headers.cookie || '', options)
  }
}

export function Cookies(options?: CookiesOptions) {
  return createInjectDecorators(createCookiesSelector(options))
}
