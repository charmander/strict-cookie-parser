# strict-cookie-parser

[![Build status][ci-image]][ci]

A module to parse cookie headers according to [RFC 6265][].
It produces a [Map][], for which you may need to provide a substitute.

```javascript
const strictCookieParser = require("strict-cookie-parser");

strictCookieParser.parseCookieHeader("hello=world; foo=bar ")
// Map { hello: "world", foo: "bar" }

strictCookieParser.parseCookieHeader("not a cookie")
// null

app.use(strictCookieParser.middleware);
```

The middleware is compatible with [Connect][] (and therefore Express).
It adds a `cookies` property to the request, which is always a Map –
even for invalid headers.


  [RFC 6265]: https://tools.ietf.org/html/rfc6265
  [Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
  [Connect]: https://github.com/senchalabs/connect

  [ci]: https://travis-ci.org/charmander/strict-cookie-parser
  [ci-image]: https://api.travis-ci.org/charmander/strict-cookie-parser.svg
