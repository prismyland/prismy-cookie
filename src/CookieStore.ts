import { CookieParseOptions, CookieSerializeOptions } from 'cookie'
export { CookieParseOptions, CookieSerializeOptions }

export abstract class CookieStore {
  abstract get(
    options?: CookieParseOptions
  ): {
    [key: string]: string
  }

  abstract set(
    ...cookies: Array<
      [string, string, CookieSerializeOptions] | [string, string]
    >
  ): void
}
