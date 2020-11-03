import {
  parse,
  serialize,
  CookieParseOptions,
  CookieSerializeOptions,
} from 'cookie'
import {
  SyncSelector,
  headersSelector,
  ResponseObject,
  updateHeaders,
} from 'prismy'

export { CookieParseOptions, CookieSerializeOptions }

export type ParsedCookies = { [key: string]: string }

export function createCookiesSelector(
  options: CookieParseOptions = {}
): SyncSelector<ParsedCookies> {
  const cookiesSymbol = Symbol('prismy-cookie')
  return (context) => {
    let parsedCookie = context[cookiesSymbol] as ParsedCookies | undefined
    if (parsedCookie == null) {
      context[cookiesSymbol] = parsedCookie = parse(
        headersSelector(context).cookie || '',
        options
      )
    }
    return parsedCookie
  }
}

export function setCookie<B>(
  resObject: ResponseObject<B>,
  ...cookies: Array<[string, string, CookieSerializeOptions] | [string, string]>
): ResponseObject<B> {
  return updateHeaders(resObject, {
    'set-cookie': serializeCookies(...cookies),
  })
}

export function appendCookie<B>(
  resObject: ResponseObject<B>,
  ...cookies: Array<[string, string, CookieSerializeOptions] | [string, string]>
): ResponseObject<B> {
  const presetCookieHeaderList =
    (resObject.headers['set-cookie'] as string[] | undefined) || []

  return updateHeaders(resObject, {
    'set-cookie': [...presetCookieHeaderList, ...serializeCookies(...cookies)],
  })
}

function serializeCookies(
  ...cookies: Array<[string, string, CookieSerializeOptions] | [string, string]>
) {
  return cookies.map(([key, value, options]) => serialize(key, value, options))
}
