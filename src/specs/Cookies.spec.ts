import test from 'ava'
import got from 'got'
import { testServer } from 'prismy-test-server'
import cookie from 'cookie'
import { CookieJar } from 'tough-cookie'
import { BaseHandler } from 'prismy'
import { Cookies } from '..'

test('it selects cookies', async t => {
  class Handler extends BaseHandler {
    async execute(@Cookies() cookies: any) {
      return cookies.message
    }
  }

  await testServer(Handler, async url => {
    const cookieJar = new CookieJar()
    cookieJar.setCookieSync(cookie.serialize('message', 'Hello, World!'), url)

    const response = await got.get(url, {
      cookieJar
    })

    t.is(response.body, 'Hello, World!')
  })
})

test('it replaces decode function', async t => {
  class Handler extends BaseHandler {
    async execute(
      @Cookies({
        decode: (value: string) => decodeURIComponent(value) + '123'
      })
      cookies: any
    ) {
      return cookies.message
    }
  }

  await testServer(Handler, async url => {
    const cookieJar = new CookieJar()
    cookieJar.setCookieSync(cookie.serialize('message', 'Hello, World!'), url)

    const response = await got.get(url, {
      cookieJar
    })

    t.is(response.body, 'Hello, World!123')
  })
})
