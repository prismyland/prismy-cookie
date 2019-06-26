import test from 'ava'
import got from 'got'
import { testServer } from 'prismy-test-server'
import { CookieJar } from 'tough-cookie'
import { BaseHandler, Method, createJsonBodySelector } from 'prismy'
import { Cookie, CookieStore } from '..'

test('integration test', async t => {
  class Handler extends BaseHandler {
    async handle(@Method() method: string, @Cookie() cookie: CookieStore) {
      if (method === 'POST') {
        const { message } = await this.select(createJsonBodySelector())
        cookie.set(['message', message])

        return 'Saved!'
      }

      return cookie.get().message
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
