import test from 'ava'
import got from 'got'
import { testServer } from 'prismy-test-server'
import { SetCookie, CookieSetter } from '..'

test('it sets cookie', async t => {
  class Handler {
    async execute(@SetCookie() setCookie: CookieSetter) {
      setCookie(['message', 'Hello, World!'])
      return ''
    }
  }

  await testServer(Handler, async url => {
    const response = await got.get(url)

    t.deepEqual(response.headers['set-cookie'], [
      `message=${encodeURIComponent('Hello, World!')}`
    ])
  })
})

test('it sets multiple cookies', async t => {
  class Handler {
    async execute(@SetCookie() setCookie: CookieSetter) {
      setCookie(['message', 'Hello, World!'], ['weather', 'Sunny'])
      return ''
    }
  }

  await testServer(Handler, async url => {
    const response = await got.get(url)

    t.deepEqual(response.headers['set-cookie'], [
      `message=${encodeURIComponent('Hello, World!')}`,
      `weather=${encodeURIComponent('Sunny')}`
    ])
  })
})

test('it passes options to cookie.serialize', async t => {
  class Handler {
    async execute(@SetCookie() setCookie: CookieSetter) {
      setCookie(['message', 'Hello, World!', { secure: true }])
      return ''
    }
  }

  await testServer(Handler, async url => {
    const response = await got.get(url)

    t.deepEqual(response.headers['set-cookie'], [
      `message=${encodeURIComponent('Hello, World!')}; Secure`
    ])
  })
})
