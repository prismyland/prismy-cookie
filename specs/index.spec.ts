import test from 'ava'
import got from 'got'
import { prismy, res } from 'prismy'
import { testHandler } from 'prismy-test'
import { CookieJar } from 'tough-cookie'
import { serialize } from 'cookie'
import { createCookiesSelector, setCookie, appendCookie } from '../src'

test('createCookiesSelector creates cookiesSelector', async (t) => {
  const cookiesSelector = createCookiesSelector()

  const handler = prismy([cookiesSelector], (cookies) => {
    return res(cookies)
  })

  await testHandler(handler, async (url) => {
    const cookieJar = new CookieJar()
    cookieJar.setCookieSync(serialize('message', 'Hello, World!'), url)

    const response = await got(url, {
      cookieJar,
      responseType: 'json',
    })

    t.deepEqual(response.body, {
      message: 'Hello, World!',
    })
  })
})

test('cookiesSelector returns empty object if cookie does not exist', async (t) => {
  const cookiesSelector = createCookiesSelector()

  const handler = prismy([cookiesSelector], (cookies) => {
    return res(cookies)
  })

  await testHandler(handler, async (url) => {
    const cookieJar = new CookieJar()

    const response = await got(url, {
      cookieJar,
      responseType: 'json',
    })

    t.deepEqual(response.body, {})
  })
})

test('createCookiesSelector accepts custom decode function', async (t) => {
  const cookiesSelector = createCookiesSelector({
    decode: (value: string) => decodeURIComponent(value) + '123',
  })

  const handler = prismy([cookiesSelector], (cookies) => {
    return res(cookies)
  })

  await testHandler(handler, async (url) => {
    const cookieJar = new CookieJar()
    cookieJar.setCookieSync(serialize('message', 'Hello, World!'), url)

    const response = await got(url, {
      cookieJar,
      responseType: 'json',
    })

    t.deepEqual(response.body, {
      message: 'Hello, World!123',
    })
  })
})

test('cookiesSelector reuses previously parsed cookies', async (t) => {
  const cookiesSelector = createCookiesSelector()

  const handler = prismy(
    [cookiesSelector, cookiesSelector],
    (cookies, cookies2) => {
      return res(JSON.stringify(cookies === cookies2))
    }
  )

  await testHandler(handler, async (url) => {
    const response = await got(url)

    t.deepEqual(response.body, 'true')
  })
})

test('setCookie sets cookies', async (t) => {
  const handler = prismy([], () => {
    return setCookie(res('OK'), ['message', 'Hello, World!'])
  })

  await testHandler(handler, async (url) => {
    const response = await got(url)

    t.deepEqual(response.headers['set-cookie'], [
      `message=${encodeURIComponent('Hello, World!')}`,
    ])
  })
})

test('setCookie replaces preset cookies', async (t) => {
  const handler = prismy([], () => {
    const presetResObject = setCookie(res('OK'), ['message', 'Hello, World!'])
    return setCookie(presetResObject, ['another-message', '¡Hola, Mundo!'])
  })

  await testHandler(handler, async (url) => {
    const response = await got(url)

    t.deepEqual(response.headers['set-cookie'], [
      `another-message=${encodeURIComponent('¡Hola, Mundo!')}`,
    ])
  })
})

test('appendCookie sets cookies', async (t) => {
  const handler = prismy([], () => {
    return appendCookie(res('OK'), ['message', 'Hello, World!'])
  })

  await testHandler(handler, async (url) => {
    const response = await got(url)

    t.deepEqual(response.headers['set-cookie'], [
      `message=${encodeURIComponent('Hello, World!')}`,
    ])
  })
})
test('appendCookie append cookies next to preset cookies', async (t) => {
  const handler = prismy([], () => {
    const presetResObject = setCookie(res('OK'), ['message', 'Hello, World!'])
    return appendCookie(presetResObject, ['another-message', '¡Hola, Mundo!'])
  })

  await testHandler(handler, async (url) => {
    const response = await got(url)

    t.deepEqual(response.headers['set-cookie'], [
      `message=${encodeURIComponent('Hello, World!')}`,
      `another-message=${encodeURIComponent('¡Hola, Mundo!')}`,
    ])
  })
})
