interface IU64 {
    l: number;
    h: number;
}

const SipHash13 = (() => {
    "use strict";

    function _add(a: IU64, b: IU64) {
        const rl = a.l + b.l,
            a2 = {
                h: a.h + b.h + (rl / 2 >>> 31) >>> 0,
                l: rl >>> 0,
            };
        a.h = a2.h;
        a.l = a2.l;
    }

    function _xor(a: IU64, b: IU64) {
        a.h ^= b.h;
        a.h >>>= 0;
        a.l ^= b.l;
        a.l >>>= 0;
    }

    function _rotl(a: IU64, n: number) {
        const a2 = {
            h: a.h << n | a.l >>> (32 - n),
            l: a.l << n | a.h >>> (32 - n),
        };
        a.h = a2.h;
        a.l = a2.l;
    }

    function _rotl32(a: IU64) {
        const al = a.l;
        a.l = a.h;
        a.h = al;
    }

    function _compress(v0: IU64, v1: IU64, v2: IU64, v3: IU64) {
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

    function _get_int(a: Uint8Array, offset: number) {
        return a[offset + 3] << 24 |
            a[offset + 2] << 16 |
            a[offset + 1] << 8 |
            a[offset];
    }

    function hash(key: Uint32Array, m: Uint8Array | string): IU64 {
        if (typeof m === "string") {
            m = string_to_u8(m);
        }
        const k0 = {
            h: key[1] >>> 0,
            l: key[0] >>> 0,
        },
            k1 = {
                h: key[3] >>> 0,
                l: key[2] >>> 0,
            },
            v0 = {
                h: k0.h,
                l: k0.l,
            },
            v2 = k0,
            v1 = {
                h: k1.h,
                l: k1.l,
            },
            v3 = k1,
            ml = m.length,
            ml7 = ml - 7,
            buf = new Uint8Array(new ArrayBuffer(8));

        _xor(v0, {
            h: 0x736f6d65,
            l: 0x70736575,
        });
        _xor(v1, {
            h: 0x646f7261,
            l: 0x6e646f6d,
        });
        _xor(v2, {
            h: 0x6c796765,
            l: 0x6e657261,
        });
        _xor(v3, {
            h: 0x74656462,
            l: 0x79746573,
        });
        let mp = 0;
        while (mp < ml7) {
            const mi = {
                h: _get_int(m, mp + 4),
                l: _get_int(m, mp),
            };
            _xor(v3, mi);
            _compress(v0, v1, v2, v3);
            _xor(v0, mi);
            mp += 8;
        }
        buf[7] = ml;
        let ic = 0;
        while (mp < ml) {
            buf[ic++] = m[mp++];
        }
        while (ic < 7) {
            buf[ic++] = 0;
        }
        const mil = {
            h: buf[7] << 24 | buf[6] << 16 | buf[5] << 8 | buf[4],
            l: buf[3] << 24 | buf[2] << 16 | buf[1] << 8 | buf[0],
        };
        _xor(v3, mil);
        _compress(v0, v1, v2, v3);
        _xor(v0, mil);
        _xor(v2, {
            h: 0,
            l: 0xff,
        });
        _compress(v0, v1, v2, v3);
        _compress(v0, v1, v2, v3);
        _compress(v0, v1, v2, v3);

        const h = v0;
        _xor(h, v1);
        _xor(h, v2);
        _xor(h, v3);

        return h;
    }

    function hash_hex(key: Uint32Array, m: Uint8Array | string): string {
        const r = hash(key, m);
        return ("0000000" + r.h.toString(16)).substr(-8) +
            ("0000000" + r.l.toString(16)).substr(-8);
    }

    function hash_uint(key: Uint32Array, m: Uint8Array | string): number {
        const r = hash(key, m);
        return (r.h & 0x1fffff) * 0x100000000 + r.l;
    }

    function string_to_u8(str: string): Uint8Array {
        if (typeof TextEncoder === "function") {
            return new TextEncoder().encode(str);
        }
        str = unescape(encodeURIComponent(str));
        const bytes = new Uint8Array(str.length);
        for (let i = 0, j = str.length; i < j; i++) {
            bytes[i] = str.charCodeAt(i);
        }
        return bytes;
    }

    function string16_to_key(str: string): Uint32Array {
        const u8 = string_to_u8(str);
        if (u8.length !== 16) {
            throw Error("Key length must be 16 bytes");
        }
        const key = new Uint32Array(4);
        key[0] = _get_int(u8, 0);
        key[1] = _get_int(u8, 4);
        key[2] = _get_int(u8, 8);
        key[3] = _get_int(u8, 12);
        return key;
    }

    return {
        hash,
        hash_hex,
        hash_uint,
        string16_to_key,
        string_to_u8,
    };
})();

module.exports = SipHash13;