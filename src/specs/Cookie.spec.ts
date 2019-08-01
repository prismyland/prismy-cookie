import test from 'ava'
import got from 'got'
import { testServer } from 'prismy-test-server'
import { CookieJar } from 'tough-cookie'
import { BaseHandler } from 'prismy'
import { Cookie, CookieStore } from '..'
import cookie from 'cookie'

test('CookieStore#get returns received cookies', async t => {
  class Handler extends BaseHandler {
    async handle(@Cookie() cookies: CookieStore) {
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
    async handle(@Cookie() cookie: CookieStore) {
      return cookie.get()
    }
  }

  await testServer(Handler, async url => {
    const response = await got.get(url, {
      json: true
    })

    t.deepEqual(response.body, {})
  })
})

test('CookieStore#get accepts custom decode function', async t => {
  class Handler extends BaseHandler {
    async handle(@Cookie() cookie: CookieStore) {
      return cookie.get({
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

test('Cookie#set sets cookie', async t => {
  class Handler extends BaseHandler {
    async handle(@Cookie() cookie: CookieStore) {
      cookie.set(['message', 'Hello, World!'])

      return 'OK'
    }
  }

  await testServer(Handler, async url => {
    const response = await got.get(url)

    t.deepEqual(response.headers['set-cookie'], [
      `message=${encodeURIComponent('Hello, World!')}`
    ])
  })
})

test('Cookie#set appends cookie if other cookies are already set', async t => {
  class Handler extends BaseHandler {
    async handle(@Cookie() cookie: CookieStore) {
      cookie.set(['message', 'Hello, World!'])
      cookie.set(['message2', 'Hello, World2!'])

      return 'OK'
    }
  }

  await testServer(Handler, async url => {
    const response = await got.get(url)

    t.deepEqual(response.headers['set-cookie'], [
      `message=${encodeURIComponent('Hello, World!')}`,
      `message2=${encodeURIComponent('Hello, World2!')}`
    ])
  })
})

test('Cookie reuses a instantiated CookieStore if available', async t => {
  class Handler extends BaseHandler {
    async handle(
      @Cookie() cookie: CookieStore,
      @Cookie() cookie2: CookieStore
    ) {
      return JSON.stringify(cookie === cookie2)
    }
  }
  await testServer(Handler, async url => {
    const response = await got.get(url)
    t.deepEqual(response.body, 'true')
  })
})
