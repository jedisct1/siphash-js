siphash.js
==========

A pure Javascript implementation of
[SipHash-2-4](http://131002.net/siphash/siphash.pdf)

> SipHash is a family of pseudorandom functions optimized for short
> inputs. Target applications include network traffic authentication and
> hash-table lookups protected against hash-flooding denial-of-service
> attacks. SipHash has well-defined security goals and competitive
> performance.

This package also includes implementations of SipHash-1-3, SipHash128, and SipHash128-1-3.

Installation
------------

Server-side installation (io.js/nodejs):

    $ npm install siphash

Browser-side/single-line minified version: use
[lib/siphash.js.min](https://raw.githubusercontent.com/jedisct1/siphash-js/master/lib/siphash.js.min).
or use Bower:

    $ bower install siphash

Usage
-----

```javascript
var siphash = require("siphash"),
    key = siphash.string16_to_key("This is the key!"),
    message = "Short test message",
    hash_hex = siphash.hash_hex(key, message);
```

A key is an array of 4 integers, and each of them will be clamped to
32 bits in order to build a 128-bit key.
For a random key, just generate 4 random integers instead of calling
`string16_to_key()`.

```javascript
var siphash = require("siphash"),
    key = [ 0xdeadbeef, 0xcafebabe, 0x8badf00d, 0x1badb002 ],
    message = "Short test message",
    hash_hex = siphash.hash_hex(key, message);
```

The 64-bit hash can also be obtained as two 32-bit values with
`hash(key, message)`:

```javascript
var siphash = require("siphash"),
    key = [ 0xdeadbeef, 0xcafebabe, 0x8badf00d, 0x1badb002 ],
    message = "Short test message",
    hash = siphash.hash(key, message),
    hash_msb = hash.h,
    hash_lsb = hash.l;
```

A 53-bit unsigned integer can be obtained with `hash_uint(key, message)`:

```javascript
var siphash = require("siphash"),
    key = siphash.string16_to_key("0123456789ABCDEF"),
    message = "Short test message",
    index = siphash.hash_uint(key, message);
```

SipHash-1-3
-----------
SipHash-1-3 is a faster variant of SipHash-2-4 with fewer rounds, which is still believed to be secure
enough for typical uses. This variant is available here:
[siphash13.js](https://raw.githubusercontent.com/jedisct1/siphash-js/master/lib/siphash13.js.min)


SipHash-double
--------------

Although not part of the module, an implementation of SipHash with
128-bit output is also available:
[siphash-double.js](https://raw.githubusercontent.com/jedisct1/siphash-js/master/lib/siphash-double.js.min)

SipHash-1-3 with a 128-bit output is also part of the package:
[siphash13-double.js](https://raw.githubusercontent.com/jedisct1/siphash-js/master/lib/siphash13-double.js.min)
