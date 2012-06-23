
var SipHash = (function() {
    function _add(a, b) {
        var rl = a.l + b.l;
        var a2 = { h: a.h + b.h + (rl / 2 >>> 31) >>> 0,
                   l: rl >>> 0 };
        a.h = a2.h; a.l = a2.l;
    }

    function _xor(a, b) {
        a.h ^= b.h; a.h >>>= 0;
        a.l ^= b.l; a.l >>>= 0;
    }

    function _rotl(a, n) {
        var a2 = {
            h: a.h << n | a.l >>> (32 - n),
            l: a.l << n | a.h >>> (32 - n)
        };
        a.h = a2.h; a.l = a2.l;
    }

    function _rotl32(a) {
        var a2 = { h: a.l, l: a.h };
        a.h = a2.h; a.l = a2.l;
    }

    function _compress(v0, v1, v2, v3) {
        _add(v0, v1);
        _add(v2, v3);
        _rotl(v1, 13);
        _rotl(v3, 16);
        _xor(v1, v0);
        _xor(v3, v2);
        _rotl32(v0);
        _add(v2, v1);
        _add(v0, v3);
        _rotl(v1, 17);
        _rotl(v3, 21);
        _xor(v1, v2);
        _xor(v3, v0);
        _rotl32(v2);
    }

    function _get_int(a, offset) {
        return a.charCodeAt(offset + 3) << 24 |
               a.charCodeAt(offset + 2) << 16 |
               a.charCodeAt(offset + 1) << 8 |
               a.charCodeAt(offset);
    }

    function hash(key, m) {
        var k0 = { h: key[1] >>> 0, l: key[0] >>> 0 };
        var k1 = { h: key[3] >>> 0, l: key[2] >>> 0 };
        var v0 = { h: k0.h, l: k0.l }, v2 = k0;
        var v1 = { h: k1.h, l: k1.l }, v3 = k1;
        var mi, mp = 0, ml = m.length, ml8 = ml - 8;
        var buf = new Uint8Array(new ArrayBuffer(8));

        _xor(v0, { h: 0x736f6d65, l: 0x70736575 });
        _xor(v1, { h: 0x646f7261, l: 0x6e646f6d });
        _xor(v2, { h: 0x6c796765, l: 0x6e657261 });
        _xor(v3, { h: 0x74656462, l: 0x79746573 });
        while (mp <= ml8) {
            mi = { h: m.charCodeAt(mp + 7) << 24 | m.charCodeAt(mp + 6) << 16 |
                      m.charCodeAt(mp + 5) <<  8 | m.charCodeAt(mp + 4),
                   l: m.charCodeAt(mp + 3) << 24 | m.charCodeAt(mp + 2) << 16 |
                      m.charCodeAt(mp + 1) <<  8 | m.charCodeAt(mp) };
            _xor(v3, mi);
            _compress(v0, v1, v2, v3);
            _compress(v0, v1, v2, v3);
            _xor(v0, mi);
            mp += 8;
        }
        buf[7] = ml;
        var ic = 0;
        while (mp < ml) {
            buf[ic++] = m.charCodeAt(mp++);
        }
        while (ic < 7) {
            buf[ic++] = 0;
        }
        mi = { h: buf[7] << 24 | buf[6] << 16 | buf[5] << 8 | buf[4],
               l: buf[3] << 24 | buf[2] << 16 | buf[1] << 8 | buf[0] };
       _xor(v3, mi);
       _compress(v0, v1, v2, v3);
       _compress(v0, v1, v2, v3);
       _xor(v0, mi);
       _xor(v2, { h: 0, l: 0xff });
       _compress(v0, v1, v2, v3);
       _compress(v0, v1, v2, v3);
       _compress(v0, v1, v2, v3);
       _compress(v0, v1, v2, v3);

       var h = v0;
       _xor(h, v1);
       _xor(h, v2);
       _xor(h, v3);

       return h;
    }

    function string16_to_key(a) {
        return [_get_int(a, 0), _get_int(a, 4),
                _get_int(a, 8), _get_int(a, 12)];
    }

    function hash_hex(key, m) {
        var r = hash(key, m);
        return ("0000000" + r.h.toString(16)).substr(-8) +
               ("0000000" + r.l.toString(16)).substr(-8);
    }

    function hash_uint(key, m) {
        var r = hash(key, m);
        return (r.h & 0x1fffff) * 0x100000000 + r.l;
    }

    return {
        string16_to_key: string16_to_key,
        hash: hash,
        hash_hex: hash_hex,
        hash_uint: hash_uint
    };
})();

var module = module || { }, exports = module.exports = SipHash;
