# `prismy-cookie`

:cookie: Cookie for [prismy](https://github.com/BoostIO/prismy).

[![Build Status](https://travis-ci.com/BoostIO/prismy-cookie.svg?branch=master)](https://travis-ci.com/BoostIO/prismy-cookie)
[![codecov](https://codecov.io/gh/BoostIO/prismy-cookie/branch/master/graph/badge.svg)](https://codecov.io/gh/BoostIO/prismy-cookie)
[![NPM download](https://img.shields.io/npm/dm/prismy-cookie.svg)](https://www.npmjs.com/package/prismy-cookie)
[![Supported by BoostIO](https://github.com/BoostIO/boostio-materials/raw/master/v1/boostio-shield-v1.svg?sanitize=true)](https://boostio.co)

## Installation

```sh
npm i prismy-cookie
```

## Usage

```ts
import { BaseHandler, Method, createJsonBodySelector } from 'prismy'
import { Cookies, SetCookie, CookieSetter } from 'prismy-cookie'

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

Same to `CookieParseOptions` of `cookie`.

## License

MIT
