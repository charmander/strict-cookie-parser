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
// request.cookies available. Compatible with Connect (Express).
```


  [RFC 6265]: https://tools.ietf.org/html/rfc6265
  [Map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

  [ci]: https://travis-ci.org/charmander/strict-cookie-parser
  [ci-image]: https://api.travis-ci.org/charmander/strict-cookie-parser.svg
