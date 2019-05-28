import test from 'ava'
import got from 'got'
import { testServer } from 'prismy-test-server'
import { CookieJar } from 'tough-cookie'
import { BaseHandler, Method, createJsonBodySelector } from 'prismy'
import { Cookies, SetCookie, CookieSetter } from '..'

test('integration test', async t => {
  class Handler extends BaseHandler {
    async execute(
      @Method() method: string,
      @SetCookie() setCookie: CookieSetter,
      @Cookies() cookies: any
    ) {
      if (method === 'POST') {
        const { message } = await this.select(createJsonBodySelector())
        setCookie(['message', message])

        return 'Saved!'
      }
      return cookies.message
    }
  }

  await testServer(Handler, async url => {
    const cookieJar = new CookieJar()
    await got.post(url, {
      cookieJar,
      body: JSON.stringify({ message: 'Hello, World!' })
    })

    const response = await got.get(url, {
      cookieJar
    })
    t.is(response.body, 'Hello, World!')
  })
})
