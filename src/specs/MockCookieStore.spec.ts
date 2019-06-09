import test from 'ava'
import { MockCookieStore } from '..'

test('MockCookieStore#constructor accepts default cookies', t => {
  const cookieStore = new MockCookieStore({
    message: 'Hello, World!'
  })

  t.deepEqual(cookieStore.get(), {
    message: 'Hello, World!'
  })
})

test('MockCookieStore#set stores new coookies', t => {
  const cookieStore = new MockCookieStore()
  cookieStore.set(['message', 'Hello, World!'])

  t.deepEqual(cookieStore.newCookies, [['message', 'Hello, World!']])
})
