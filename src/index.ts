import { createInjectDecorators, Selector } from 'prismy'
import { InternalCookieStore } from './InternalCookieStore'
import { CookieStore } from './CookieStore'
export * from './CookieStore'
export * from './MockCookieStore'

const cookieStoreSymbol = Symbol('prismy-cookie')

export function createCookieSelector(): Selector<CookieStore> {
  return context => {
    let cookieStore = context[cookieStoreSymbol]
    if (cookieStore == null) {
      context[cookieStoreSymbol] = cookieStore = new InternalCookieStore(
        context
      )
    }
    return cookieStore
  }
}

export function Cookie() {
  return createInjectDecorators(createCookieSelector())
}
