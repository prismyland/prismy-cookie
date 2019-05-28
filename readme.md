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

## License

MIT
