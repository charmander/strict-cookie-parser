[![Build status][ci-image]][ci]

Parses cookie headers according to [RFC 6265][], producing a [Map][].

For Connect (Express) middleware, see [strict-cookie-middleware][].

```javascript
const strictCookieParser = require('strict-cookie-parser');

strictCookieParser.parseCookieHeader('hello=world; foo=bar ')
// Map { hello => 'world', foo => 'bar' }

strictCookieParser.parseCookieHeader('not a cookie')
// null

strictCookieParser.parseCookiePair('single=pair')
// { name: 'single', value: 'pair' }

strictCookieParser.isCookieName('foo')
// true

strictCookieParser.isCookieName('m=m')
// invalid - cookie names cannot contain =
// false

strictCookieParser.parseCookieValue('"foo"')
// 'foo'

strictCookieParser.parseCookieValue(' foo')
// invalid - unquoted cookie values cannot begin with a space
// null
```


  [RFC 6265]: https://tools.ietf.org/html/rfc6265
  [Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
  [strict-cookie-middleware]: https://github.com/charmander/strict-cookie-middleware

  [ci]: https://github.com/charmander/strict-cookie-parser/actions
  [ci-image]: https://github.com/charmander/strict-cookie-parser/workflows/Node%20CI/badge.svg
