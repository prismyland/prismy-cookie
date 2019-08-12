# `prismy-cookie`

:cookie: Cookie for [prismy](https://github.com/prismyland/prismy).

[![Build Status](https://travis-ci.com/prismyland/prismy-cookie.svg?branch=master)](https://travis-ci.com/prismyland/prismy-cookie)
[![codecov](https://codecov.io/gh/prismyland/prismy-cookie/branch/master/graph/badge.svg)](https://codecov.io/gh/prismyland/prismy-cookie)
[![NPM download](https://img.shields.io/npm/dm/prismy-cookie.svg)](https://www.npmjs.com/package/prismy-cookie)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/prismyland/prismy-cookie.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/prismyland/prismy-cookie/context:javascript)

## Installation

```sh
npm i prismy-cookie
```

## Usage

```ts
import {
  prismy,
  res,
  createUrlEncodedBodySelector,
  methodSelector,
  contextSelector,
  Context
} from 'prismy'
import {
  createCookiesSelector,
  ParsedCookies,
  appendCookie
} from 'prismy-cookie'

const urlEncodedBodySelector = createUrlEncodedBodySelector()
const cookiesSelector = createCookiesSelector()
const handler = prismy<[string | undefined, ParsedCookies, Context]>(
  [methodSelector, cookiesSelector, contextSelector],
  async (method, cookies, context) => {
    if (method === 'POST') {
      const { message } = await urlEncodedBodySelector(context)

      return appendCookie(res('OK!'), ['message', message as string])
    }

    return res(cookies.message)
  }
)

export default prismy(handler)
```

## License

MIT
