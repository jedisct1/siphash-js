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
var siphash = require("siphash"),
    key = siphash.string16_to_key("0123456789ABCDEF"),
    message = "Short test message",
    hash = siphash.hash_hex(key, message);
```

A key is an array of 4 integers, and each of them will be clamped to
32 bits in order to build a 128-bit key.
For a random key, just generate 4 random integers instead of calling
`string16_to_key()`.

The raw 64-bit hash can be obtained with `hash(key, message)` instead of
`hash_hex(key, message)`.
