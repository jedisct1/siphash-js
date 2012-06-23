siphash.js
==========

A pure Javascript implementation of
[SipHash-2-4](http://131002.net/siphash/siphash.pdf)

> SipHash is a family of pseudorandom functions optimized for short
> inputs. Target applications include network traffic authentication and
> hash-table lookups protected against hash-flooding denial-of-service
> attacks. SipHash has well-dened security goals and competitive
> performance.

Usage:
------

    SipHash.hash([k0, k1, k2, k3], <message>);
    SipHash.hash_hex([k0, k1, k2, k3], <message>);
    SipHash.string16_to_key(<16 characters string>);
