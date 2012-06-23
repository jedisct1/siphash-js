siphash.js
==========

A pure Javascript implementation of
[SipHash-2-4](http://131002.net/siphash/siphash.pdf)

> SipHash is a family of pseudorandom functions optimized for short
> inputs. Target applications include network traffic authentication and
> hash-table lookups protected against hash-flooding denial-of-service
> attacks. SipHash has well-defined security goals and competitive
> performance.

Usage:
------

```javascript
var siphash = require("siphash");
var key = siphash.string16_to_key("0123456789ABCDEF")
var message = "Short test message";
var hash = siphash.hash_hex(key, message);
```
