import { IncomingMessage, ServerResponse } from 'http'
import cookie from 'cookie'
import {
  CookieStore,
  CookieParseOptions,
  CookieSerializeOptions
} from './CookieStore'

export type DefaultCookieOptions = CookieParseOptions & CookieSerializeOptions

export class InternalCookieStore implements CookieStore {
  constructor(
    private req: IncomingMessage,
    private res: ServerResponse,
    private defaultOptions: DefaultCookieOptions
  ) {}

  get(options?: CookieParseOptions) {
    options = {
      ...this.defaultOptions,
      ...options
    }
    return cookie.parse(this.req.headers.cookie || '', options)
  }

  set(
    ...cookies: Array<
      [string, string, CookieSerializeOptions] | [string, string]
    >
  ) {
    const serializedCookies = cookies.map(([key, value, options]) => {
      return cookie.serialize(key, value, options)
    })

    this.res.setHeader('Set-Cookie', serializedCookies)
  }
}
