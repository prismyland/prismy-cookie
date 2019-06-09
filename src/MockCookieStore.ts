import { CookieStore, CookieSerializeOptions } from './CookieStore'

export class MockCookieStore implements CookieStore {
  newCookies: Array<
    [string, string, CookieSerializeOptions] | [string, string]
  > = []

  constructor(private currentCookies: { [key: string]: string } = {}) {}

  get() {
    return this.currentCookies
  }

  set(
    ...cookies: Array<
      [string, string, CookieSerializeOptions] | [string, string]
    >
  ) {
    this.newCookies = [...this.newCookies, ...cookies]
  }
}
