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

test('MockCookieStore#set stores new cookies', t => {
  const cookieStore = new MockCookieStore()
  cookieStore.set(['message', 'Hello, World!'])

  t.deepEqual(cookieStore.newCookies, [['message', 'Hello, World!']])
})

test('MockCookieStore#set append cookies to newCookies if there are preset cookies', t => {
  const cookieStore = new MockCookieStore()
  cookieStore.set(['message', 'Hello, World!'])
  cookieStore.set(['message2', 'Hello, World2!'])

  t.deepEqual(cookieStore.newCookies, [
    ['message', 'Hello, World!'],
    ['message2', 'Hello, World2!']
  ])
})
