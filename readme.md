# `prismy-test-server`

:cookie: Cookie for [prismy](https://github.com/BoostIO/prismy).

```ts
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

export default prismy(Handler)
```

## APIs

### `@SetCookie()`

Injects cookie setter.

#### `CookieSetter`

`(...cokies: Array<[string, string, SetCookieOptions] | [string, string]>) => void`

Set cookie. Each cookie tuple should be like `['name', 'value', options]`. It will serialize cookie via `cookie.serialize` with options.

#### `SetCookieOptions`

Same to `CookieSerializeOptions` of `cookie`.

### `@Cookies(options?: CookiesOptions)`

Injects parsed cookies. It is parsing cookie via `cookie.parse`

#### `CookiesOptions`

## License

MIT
