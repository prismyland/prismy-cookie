import { Context } from 'prismy'
import cookie from 'cookie'
import {
  CookieStore,
  CookieParseOptions,
  CookieSerializeOptions
} from './CookieStore'

export class InternalCookieStore implements CookieStore {
  constructor(private context: Context) {}

  get(options?: CookieParseOptions) {
    options = {
      ...options
    }
    return cookie.parse(this.context.req.headers.cookie || '', options)
  }

  set(
    ...cookies: Array<
      [string, string, CookieSerializeOptions] | [string, string]
    >
  ) {
    const presetSerializedCookies = this.context.res.getHeader('Set-Cookie') as
      | string[]
      | undefined
    const serializedCookies = cookies.map(([key, value, options]) => {
      return cookie.serialize(key, value, options)
    })

    this.context.res.setHeader('Set-Cookie', [
      ...(presetSerializedCookies != null ? presetSerializedCookies : []),
      ...serializedCookies
    ])
  }
}
