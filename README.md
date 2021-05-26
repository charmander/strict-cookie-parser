[![Build status][ci-image]][ci]

Parses cookie headers according to [RFC 6265][], producing a [Map][].

For Connect (Express) middleware, see [strict-cookie-middleware][].

```javascript
import { parseCookieHeader } from 'strict-cookie-parser';

parseCookieHeader('hello=world; foo=bar')
// Map { 'hello' => 'world', 'foo' => 'bar' }

parseCookieHeader('not a cookie')
// null
```

```javascript
import {
    parseCookiePair,
    isCookieName,
    parseCookieValue,
} from 'strict-cookie-parser';

parseCookiePair('single=pair')
// { name: 'single', value: 'pair' }

isCookieName('foo')
// true

isCookieName('m=m')
// invalid - cookie names cannot contain =
// false

parseCookieValue('"foo"')
// 'foo'

parseCookieValue(' foo')
// invalid - unquoted cookie values cannot begin with a space
// null
```


  [RFC 6265]: https://tools.ietf.org/html/rfc6265
  [Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
  [strict-cookie-middleware]: https://github.com/charmander/strict-cookie-middleware

  [ci]: https://github.com/charmander/strict-cookie-parser/actions
  [ci-image]: https://github.com/charmander/strict-cookie-parser/workflows/Node%20CI/badge.svg
