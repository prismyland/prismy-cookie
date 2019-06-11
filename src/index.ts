import { createInjectDecorators, Selector } from 'prismy'
import {
  DefaultCookieOptions,
  InternalCookieStore
} from './InternalCookieStore'
export * from './CookieStore'
export * from './MockCookieStore'
export { DefaultCookieOptions }

export function createCookieSelector(
  options: DefaultCookieOptions = {}
): Selector<any> {
  return (req, res) => {
    return new InternalCookieStore(req, res, options)
  }
}

export function Cookie() {
  return createInjectDecorators(createCookieSelector())
}
