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
import { Cookie, CookieStore } from 'prismy-cookie'

class Handler extends BaseHandler {
  async execute(@Method() method: string, @Cookie() cookie: CookieStore) {
    if (method === 'POST') {
      const { message } = await this.select(createJsonBodySelector())
      cookie.set(['message', message])

      return 'Saved!'
    }
    return cookie.get().message
  }
}

export default prismy(Handler)
```

## APIs

### @Cookie()

Inject `CookieStore`.

### `new CookieStore()`

#### `CookieStore#get(options?: CookiesOptions)`

Select and parse cookies from request. Newly set cookies are not shown in here.

#### `CookieParseOptions`

Type alias of `CookieParseOptions` of `cookie` package.

#### `CookieStore#set(...cookies: Array<[string, string, CookieSerializeOptions] | [string, string])`

Set cookies.

#### `CookieSerializeOptions`

Type alias of `CookieSerializeOptions` of `cookie` package.

### `new MockCookieStore(...cookies: Array<[string, string, CookieSerializeOptions] | [string, string]>)`

Cookie store for unit testing.

#### `MockCookieStore#newCookies: Array<[string, string, CookieSerializeOptions] | [string, string]>`

All cookies called by `CookieStore#set`.

## License

MIT
