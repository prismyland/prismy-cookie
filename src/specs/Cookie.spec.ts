import test from 'ava'
import got from 'got'
import { testServer } from 'prismy-test-server'
import { CookieJar } from 'tough-cookie'
import { BaseHandler } from 'prismy'
import { Cookie, CookieStore } from '..'
import cookie from 'cookie'

test('CookieStore#get returns received cookies', async t => {
  class Handler extends BaseHandler {
    async execute(@Cookie() cookies: CookieStore) {
      return cookies.get()
    }
  }

  await testServer(Handler, async url => {
    const cookieJar = new CookieJar()
    cookieJar.setCookieSync(cookie.serialize('message', 'Hello, World!'), url)

    const response = await got.get(url, {
      cookieJar,
      json: true
    })

    t.deepEqual(response.body, {
      message: 'Hello, World!'
    })
  })
})

test('CookieStore#get returns empty object if cookie does not exist ', async t => {
  class Handler extends BaseHandler {
    async execute(@Cookie() cookies: CookieStore) {
      return cookies.get()
    }
  }

  await testServer(Handler, async url => {
    const response = await got.get(url, {
      json: true
    })

    t.deepEqual(response.body, {})
  })
})

test('it replaces decode function', async t => {
  class Handler extends BaseHandler {
    async execute(@Cookie() cookies: any) {
      return cookies.get({
        decode: (value: string) => decodeURIComponent(value) + '123'
      }).message
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
