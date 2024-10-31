import "./chunk-UV5CTPV7.js";

// node_modules/@jeffriggle/bison/dist/esm/index.js
var bison = function(t) {
  var e = {};
  function r(n) {
    if (e[n])
      return e[n].exports;
    var o = e[n] = { i: n, l: false, exports: {} };
    return t[n].call(o.exports, o, o.exports, r), o.l = true, o.exports;
  }
  return r.m = t, r.c = e, r.d = function(t2, e2, n) {
    r.o(t2, e2) || Object.defineProperty(t2, e2, { enumerable: true, get: n });
  }, r.r = function(t2) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
  }, r.t = function(t2, e2) {
    if (1 & e2 && (t2 = r(t2)), 8 & e2)
      return t2;
    if (4 & e2 && "object" == typeof t2 && t2 && t2.__esModule)
      return t2;
    var n = /* @__PURE__ */ Object.create(null);
    if (r.r(n), Object.defineProperty(n, "default", { enumerable: true, value: t2 }), 2 & e2 && "string" != typeof t2)
      for (var o in t2)
        r.d(n, o, (function(e3) {
          return t2[e3];
        }).bind(null, o));
    return n;
  }, r.n = function(t2) {
    var e2 = t2 && t2.__esModule ? function() {
      return t2.default;
    } : function() {
      return t2;
    };
    return r.d(e2, "a", e2), e2;
  }, r.o = function(t2, e2) {
    return Object.prototype.hasOwnProperty.call(t2, e2);
  }, r.p = "", r(r.s = 2);
}([function(t, e, r) {
  "use strict";
  (function(t2) {
    var n = r(4), o = r(5), i = r(6);
    function u() {
      return f.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
    }
    function a(t3, e2) {
      if (u() < e2)
        throw new RangeError("Invalid typed array length");
      return f.TYPED_ARRAY_SUPPORT ? (t3 = new Uint8Array(e2)).__proto__ = f.prototype : (null === t3 && (t3 = new f(e2)), t3.length = e2), t3;
    }
    function f(t3, e2, r2) {
      if (!(f.TYPED_ARRAY_SUPPORT || this instanceof f))
        return new f(t3, e2, r2);
      if ("number" == typeof t3) {
        if ("string" == typeof e2)
          throw new Error("If encoding is specified then the first argument must be a string");
        return l(this, t3);
      }
      return s(this, t3, e2, r2);
    }
    function s(t3, e2, r2, n2) {
      if ("number" == typeof e2)
        throw new TypeError('"value" argument must not be a number');
      return "undefined" != typeof ArrayBuffer && e2 instanceof ArrayBuffer ? function(t4, e3, r3, n3) {
        if (e3.byteLength, r3 < 0 || e3.byteLength < r3)
          throw new RangeError("'offset' is out of bounds");
        if (e3.byteLength < r3 + (n3 || 0))
          throw new RangeError("'length' is out of bounds");
        e3 = void 0 === r3 && void 0 === n3 ? new Uint8Array(e3) : void 0 === n3 ? new Uint8Array(e3, r3) : new Uint8Array(e3, r3, n3);
        f.TYPED_ARRAY_SUPPORT ? (t4 = e3).__proto__ = f.prototype : t4 = h(t4, e3);
        return t4;
      }(t3, e2, r2, n2) : "string" == typeof e2 ? function(t4, e3, r3) {
        "string" == typeof r3 && "" !== r3 || (r3 = "utf8");
        if (!f.isEncoding(r3))
          throw new TypeError('"encoding" must be a valid string encoding');
        var n3 = 0 | y(e3, r3), o2 = (t4 = a(t4, n3)).write(e3, r3);
        o2 !== n3 && (t4 = t4.slice(0, o2));
        return t4;
      }(t3, e2, r2) : function(t4, e3) {
        if (f.isBuffer(e3)) {
          var r3 = 0 | p(e3.length);
          return 0 === (t4 = a(t4, r3)).length || e3.copy(t4, 0, 0, r3), t4;
        }
        if (e3) {
          if ("undefined" != typeof ArrayBuffer && e3.buffer instanceof ArrayBuffer || "length" in e3)
            return "number" != typeof e3.length || (n3 = e3.length) != n3 ? a(t4, 0) : h(t4, e3);
          if ("Buffer" === e3.type && i(e3.data))
            return h(t4, e3.data);
        }
        var n3;
        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }(t3, e2);
    }
    function c(t3) {
      if ("number" != typeof t3)
        throw new TypeError('"size" argument must be a number');
      if (t3 < 0)
        throw new RangeError('"size" argument must not be negative');
    }
    function l(t3, e2) {
      if (c(e2), t3 = a(t3, e2 < 0 ? 0 : 0 | p(e2)), !f.TYPED_ARRAY_SUPPORT)
        for (var r2 = 0; r2 < e2; ++r2)
          t3[r2] = 0;
      return t3;
    }
    function h(t3, e2) {
      var r2 = e2.length < 0 ? 0 : 0 | p(e2.length);
      t3 = a(t3, r2);
      for (var n2 = 0; n2 < r2; n2 += 1)
        t3[n2] = 255 & e2[n2];
      return t3;
    }
    function p(t3) {
      if (t3 >= u())
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + u().toString(16) + " bytes");
      return 0 | t3;
    }
    function y(t3, e2) {
      if (f.isBuffer(t3))
        return t3.length;
      if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t3) || t3 instanceof ArrayBuffer))
        return t3.byteLength;
      "string" != typeof t3 && (t3 = "" + t3);
      var r2 = t3.length;
      if (0 === r2)
        return 0;
      for (var n2 = false; ; )
        switch (e2) {
          case "ascii":
          case "latin1":
          case "binary":
            return r2;
          case "utf8":
          case "utf-8":
          case void 0:
            return k(t3).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return 2 * r2;
          case "hex":
            return r2 >>> 1;
          case "base64":
            return F(t3).length;
          default:
            if (n2)
              return k(t3).length;
            e2 = ("" + e2).toLowerCase(), n2 = true;
        }
    }
    function d(t3, e2, r2) {
      var n2 = false;
      if ((void 0 === e2 || e2 < 0) && (e2 = 0), e2 > this.length)
        return "";
      if ((void 0 === r2 || r2 > this.length) && (r2 = this.length), r2 <= 0)
        return "";
      if ((r2 >>>= 0) <= (e2 >>>= 0))
        return "";
      for (t3 || (t3 = "utf8"); ; )
        switch (t3) {
          case "hex":
            return B(this, e2, r2);
          case "utf8":
          case "utf-8":
            return R(this, e2, r2);
          case "ascii":
            return S(this, e2, r2);
          case "latin1":
          case "binary":
            return P(this, e2, r2);
          case "base64":
            return I(this, e2, r2);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return U(this, e2, r2);
          default:
            if (n2)
              throw new TypeError("Unknown encoding: " + t3);
            t3 = (t3 + "").toLowerCase(), n2 = true;
        }
    }
    function g(t3, e2, r2) {
      var n2 = t3[e2];
      t3[e2] = t3[r2], t3[r2] = n2;
    }
    function v(t3, e2, r2, n2, o2) {
      if (0 === t3.length)
        return -1;
      if ("string" == typeof r2 ? (n2 = r2, r2 = 0) : r2 > 2147483647 ? r2 = 2147483647 : r2 < -2147483648 && (r2 = -2147483648), r2 = +r2, isNaN(r2) && (r2 = o2 ? 0 : t3.length - 1), r2 < 0 && (r2 = t3.length + r2), r2 >= t3.length) {
        if (o2)
          return -1;
        r2 = t3.length - 1;
      } else if (r2 < 0) {
        if (!o2)
          return -1;
        r2 = 0;
      }
      if ("string" == typeof e2 && (e2 = f.from(e2, n2)), f.isBuffer(e2))
        return 0 === e2.length ? -1 : w(t3, e2, r2, n2, o2);
      if ("number" == typeof e2)
        return e2 &= 255, f.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? o2 ? Uint8Array.prototype.indexOf.call(t3, e2, r2) : Uint8Array.prototype.lastIndexOf.call(t3, e2, r2) : w(t3, [e2], r2, n2, o2);
      throw new TypeError("val must be string, number or Buffer");
    }
    function w(t3, e2, r2, n2, o2) {
      var i2, u2 = 1, a2 = t3.length, f2 = e2.length;
      if (void 0 !== n2 && ("ucs2" === (n2 = String(n2).toLowerCase()) || "ucs-2" === n2 || "utf16le" === n2 || "utf-16le" === n2)) {
        if (t3.length < 2 || e2.length < 2)
          return -1;
        u2 = 2, a2 /= 2, f2 /= 2, r2 /= 2;
      }
      function s2(t4, e3) {
        return 1 === u2 ? t4[e3] : t4.readUInt16BE(e3 * u2);
      }
      if (o2) {
        var c2 = -1;
        for (i2 = r2; i2 < a2; i2++)
          if (s2(t3, i2) === s2(e2, -1 === c2 ? 0 : i2 - c2)) {
            if (-1 === c2 && (c2 = i2), i2 - c2 + 1 === f2)
              return c2 * u2;
          } else
            -1 !== c2 && (i2 -= i2 - c2), c2 = -1;
      } else
        for (r2 + f2 > a2 && (r2 = a2 - f2), i2 = r2; i2 >= 0; i2--) {
          for (var l2 = true, h2 = 0; h2 < f2; h2++)
            if (s2(t3, i2 + h2) !== s2(e2, h2)) {
              l2 = false;
              break;
            }
          if (l2)
            return i2;
        }
      return -1;
    }
    function b(t3, e2, r2, n2) {
      r2 = Number(r2) || 0;
      var o2 = t3.length - r2;
      n2 ? (n2 = Number(n2)) > o2 && (n2 = o2) : n2 = o2;
      var i2 = e2.length;
      if (i2 % 2 != 0)
        throw new TypeError("Invalid hex string");
      n2 > i2 / 2 && (n2 = i2 / 2);
      for (var u2 = 0; u2 < n2; ++u2) {
        var a2 = parseInt(e2.substr(2 * u2, 2), 16);
        if (isNaN(a2))
          return u2;
        t3[r2 + u2] = a2;
      }
      return u2;
    }
    function T(t3, e2, r2, n2) {
      return V(k(e2, t3.length - r2), t3, r2, n2);
    }
    function m(t3, e2, r2, n2) {
      return V(function(t4) {
        for (var e3 = [], r3 = 0; r3 < t4.length; ++r3)
          e3.push(255 & t4.charCodeAt(r3));
        return e3;
      }(e2), t3, r2, n2);
    }
    function E(t3, e2, r2, n2) {
      return m(t3, e2, r2, n2);
    }
    function A(t3, e2, r2, n2) {
      return V(F(e2), t3, r2, n2);
    }
    function _(t3, e2, r2, n2) {
      return V(function(t4, e3) {
        for (var r3, n3, o2, i2 = [], u2 = 0; u2 < t4.length && !((e3 -= 2) < 0); ++u2)
          r3 = t4.charCodeAt(u2), n3 = r3 >> 8, o2 = r3 % 256, i2.push(o2), i2.push(n3);
        return i2;
      }(e2, t3.length - r2), t3, r2, n2);
    }
    function I(t3, e2, r2) {
      return 0 === e2 && r2 === t3.length ? n.fromByteArray(t3) : n.fromByteArray(t3.slice(e2, r2));
    }
    function R(t3, e2, r2) {
      r2 = Math.min(t3.length, r2);
      for (var n2 = [], o2 = e2; o2 < r2; ) {
        var i2, u2, a2, f2, s2 = t3[o2], c2 = null, l2 = s2 > 239 ? 4 : s2 > 223 ? 3 : s2 > 191 ? 2 : 1;
        if (o2 + l2 <= r2)
          switch (l2) {
            case 1:
              s2 < 128 && (c2 = s2);
              break;
            case 2:
              128 == (192 & (i2 = t3[o2 + 1])) && (f2 = (31 & s2) << 6 | 63 & i2) > 127 && (c2 = f2);
              break;
            case 3:
              i2 = t3[o2 + 1], u2 = t3[o2 + 2], 128 == (192 & i2) && 128 == (192 & u2) && (f2 = (15 & s2) << 12 | (63 & i2) << 6 | 63 & u2) > 2047 && (f2 < 55296 || f2 > 57343) && (c2 = f2);
              break;
            case 4:
              i2 = t3[o2 + 1], u2 = t3[o2 + 2], a2 = t3[o2 + 3], 128 == (192 & i2) && 128 == (192 & u2) && 128 == (192 & a2) && (f2 = (15 & s2) << 18 | (63 & i2) << 12 | (63 & u2) << 6 | 63 & a2) > 65535 && f2 < 1114112 && (c2 = f2);
          }
        null === c2 ? (c2 = 65533, l2 = 1) : c2 > 65535 && (c2 -= 65536, n2.push(c2 >>> 10 & 1023 | 55296), c2 = 56320 | 1023 & c2), n2.push(c2), o2 += l2;
      }
      return function(t4) {
        var e3 = t4.length;
        if (e3 <= 4096)
          return String.fromCharCode.apply(String, t4);
        var r3 = "", n3 = 0;
        for (; n3 < e3; )
          r3 += String.fromCharCode.apply(String, t4.slice(n3, n3 += 4096));
        return r3;
      }(n2);
    }
    e.Buffer = f, e.SlowBuffer = function(t3) {
      +t3 != t3 && (t3 = 0);
      return f.alloc(+t3);
    }, e.INSPECT_MAX_BYTES = 50, f.TYPED_ARRAY_SUPPORT = void 0 !== t2.TYPED_ARRAY_SUPPORT ? t2.TYPED_ARRAY_SUPPORT : function() {
      try {
        var t3 = new Uint8Array(1);
        return t3.__proto__ = { __proto__: Uint8Array.prototype, foo: function() {
          return 42;
        } }, 42 === t3.foo() && "function" == typeof t3.subarray && 0 === t3.subarray(1, 1).byteLength;
      } catch (t4) {
        return false;
      }
    }(), e.kMaxLength = u(), f.poolSize = 8192, f._augment = function(t3) {
      return t3.__proto__ = f.prototype, t3;
    }, f.from = function(t3, e2, r2) {
      return s(null, t3, e2, r2);
    }, f.TYPED_ARRAY_SUPPORT && (f.prototype.__proto__ = Uint8Array.prototype, f.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && f[Symbol.species] === f && Object.defineProperty(f, Symbol.species, { value: null, configurable: true })), f.alloc = function(t3, e2, r2) {
      return function(t4, e3, r3, n2) {
        return c(e3), e3 <= 0 ? a(t4, e3) : void 0 !== r3 ? "string" == typeof n2 ? a(t4, e3).fill(r3, n2) : a(t4, e3).fill(r3) : a(t4, e3);
      }(null, t3, e2, r2);
    }, f.allocUnsafe = function(t3) {
      return l(null, t3);
    }, f.allocUnsafeSlow = function(t3) {
      return l(null, t3);
    }, f.isBuffer = function(t3) {
      return !(null == t3 || !t3._isBuffer);
    }, f.compare = function(t3, e2) {
      if (!f.isBuffer(t3) || !f.isBuffer(e2))
        throw new TypeError("Arguments must be Buffers");
      if (t3 === e2)
        return 0;
      for (var r2 = t3.length, n2 = e2.length, o2 = 0, i2 = Math.min(r2, n2); o2 < i2; ++o2)
        if (t3[o2] !== e2[o2]) {
          r2 = t3[o2], n2 = e2[o2];
          break;
        }
      return r2 < n2 ? -1 : n2 < r2 ? 1 : 0;
    }, f.isEncoding = function(t3) {
      switch (String(t3).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    }, f.concat = function(t3, e2) {
      if (!i(t3))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (0 === t3.length)
        return f.alloc(0);
      var r2;
      if (void 0 === e2)
        for (e2 = 0, r2 = 0; r2 < t3.length; ++r2)
          e2 += t3[r2].length;
      var n2 = f.allocUnsafe(e2), o2 = 0;
      for (r2 = 0; r2 < t3.length; ++r2) {
        var u2 = t3[r2];
        if (!f.isBuffer(u2))
          throw new TypeError('"list" argument must be an Array of Buffers');
        u2.copy(n2, o2), o2 += u2.length;
      }
      return n2;
    }, f.byteLength = y, f.prototype._isBuffer = true, f.prototype.swap16 = function() {
      var t3 = this.length;
      if (t3 % 2 != 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (var e2 = 0; e2 < t3; e2 += 2)
        g(this, e2, e2 + 1);
      return this;
    }, f.prototype.swap32 = function() {
      var t3 = this.length;
      if (t3 % 4 != 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (var e2 = 0; e2 < t3; e2 += 4)
        g(this, e2, e2 + 3), g(this, e2 + 1, e2 + 2);
      return this;
    }, f.prototype.swap64 = function() {
      var t3 = this.length;
      if (t3 % 8 != 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (var e2 = 0; e2 < t3; e2 += 8)
        g(this, e2, e2 + 7), g(this, e2 + 1, e2 + 6), g(this, e2 + 2, e2 + 5), g(this, e2 + 3, e2 + 4);
      return this;
    }, f.prototype.toString = function() {
      var t3 = 0 | this.length;
      return 0 === t3 ? "" : 0 === arguments.length ? R(this, 0, t3) : d.apply(this, arguments);
    }, f.prototype.equals = function(t3) {
      if (!f.isBuffer(t3))
        throw new TypeError("Argument must be a Buffer");
      return this === t3 || 0 === f.compare(this, t3);
    }, f.prototype.inspect = function() {
      var t3 = "", r2 = e.INSPECT_MAX_BYTES;
      return this.length > 0 && (t3 = this.toString("hex", 0, r2).match(/.{2}/g).join(" "), this.length > r2 && (t3 += " ... ")), "<Buffer " + t3 + ">";
    }, f.prototype.compare = function(t3, e2, r2, n2, o2) {
      if (!f.isBuffer(t3))
        throw new TypeError("Argument must be a Buffer");
      if (void 0 === e2 && (e2 = 0), void 0 === r2 && (r2 = t3 ? t3.length : 0), void 0 === n2 && (n2 = 0), void 0 === o2 && (o2 = this.length), e2 < 0 || r2 > t3.length || n2 < 0 || o2 > this.length)
        throw new RangeError("out of range index");
      if (n2 >= o2 && e2 >= r2)
        return 0;
      if (n2 >= o2)
        return -1;
      if (e2 >= r2)
        return 1;
      if (this === t3)
        return 0;
      for (var i2 = (o2 >>>= 0) - (n2 >>>= 0), u2 = (r2 >>>= 0) - (e2 >>>= 0), a2 = Math.min(i2, u2), s2 = this.slice(n2, o2), c2 = t3.slice(e2, r2), l2 = 0; l2 < a2; ++l2)
        if (s2[l2] !== c2[l2]) {
          i2 = s2[l2], u2 = c2[l2];
          break;
        }
      return i2 < u2 ? -1 : u2 < i2 ? 1 : 0;
    }, f.prototype.includes = function(t3, e2, r2) {
      return -1 !== this.indexOf(t3, e2, r2);
    }, f.prototype.indexOf = function(t3, e2, r2) {
      return v(this, t3, e2, r2, true);
    }, f.prototype.lastIndexOf = function(t3, e2, r2) {
      return v(this, t3, e2, r2, false);
    }, f.prototype.write = function(t3, e2, r2, n2) {
      if (void 0 === e2)
        n2 = "utf8", r2 = this.length, e2 = 0;
      else if (void 0 === r2 && "string" == typeof e2)
        n2 = e2, r2 = this.length, e2 = 0;
      else {
        if (!isFinite(e2))
          throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        e2 |= 0, isFinite(r2) ? (r2 |= 0, void 0 === n2 && (n2 = "utf8")) : (n2 = r2, r2 = void 0);
      }
      var o2 = this.length - e2;
      if ((void 0 === r2 || r2 > o2) && (r2 = o2), t3.length > 0 && (r2 < 0 || e2 < 0) || e2 > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      n2 || (n2 = "utf8");
      for (var i2 = false; ; )
        switch (n2) {
          case "hex":
            return b(this, t3, e2, r2);
          case "utf8":
          case "utf-8":
            return T(this, t3, e2, r2);
          case "ascii":
            return m(this, t3, e2, r2);
          case "latin1":
          case "binary":
            return E(this, t3, e2, r2);
          case "base64":
            return A(this, t3, e2, r2);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return _(this, t3, e2, r2);
          default:
            if (i2)
              throw new TypeError("Unknown encoding: " + n2);
            n2 = ("" + n2).toLowerCase(), i2 = true;
        }
    }, f.prototype.toJSON = function() {
      return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
    };
    function S(t3, e2, r2) {
      var n2 = "";
      r2 = Math.min(t3.length, r2);
      for (var o2 = e2; o2 < r2; ++o2)
        n2 += String.fromCharCode(127 & t3[o2]);
      return n2;
    }
    function P(t3, e2, r2) {
      var n2 = "";
      r2 = Math.min(t3.length, r2);
      for (var o2 = e2; o2 < r2; ++o2)
        n2 += String.fromCharCode(t3[o2]);
      return n2;
    }
    function B(t3, e2, r2) {
      var n2 = t3.length;
      (!e2 || e2 < 0) && (e2 = 0), (!r2 || r2 < 0 || r2 > n2) && (r2 = n2);
      for (var o2 = "", i2 = e2; i2 < r2; ++i2)
        o2 += x(t3[i2]);
      return o2;
    }
    function U(t3, e2, r2) {
      for (var n2 = t3.slice(e2, r2), o2 = "", i2 = 0; i2 < n2.length; i2 += 2)
        o2 += String.fromCharCode(n2[i2] + 256 * n2[i2 + 1]);
      return o2;
    }
    function L(t3, e2, r2) {
      if (t3 % 1 != 0 || t3 < 0)
        throw new RangeError("offset is not uint");
      if (t3 + e2 > r2)
        throw new RangeError("Trying to access beyond buffer length");
    }
    function O(t3, e2, r2, n2, o2, i2) {
      if (!f.isBuffer(t3))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (e2 > o2 || e2 < i2)
        throw new RangeError('"value" argument is out of bounds');
      if (r2 + n2 > t3.length)
        throw new RangeError("Index out of range");
    }
    function Y(t3, e2, r2, n2) {
      e2 < 0 && (e2 = 65535 + e2 + 1);
      for (var o2 = 0, i2 = Math.min(t3.length - r2, 2); o2 < i2; ++o2)
        t3[r2 + o2] = (e2 & 255 << 8 * (n2 ? o2 : 1 - o2)) >>> 8 * (n2 ? o2 : 1 - o2);
    }
    function M(t3, e2, r2, n2) {
      e2 < 0 && (e2 = 4294967295 + e2 + 1);
      for (var o2 = 0, i2 = Math.min(t3.length - r2, 4); o2 < i2; ++o2)
        t3[r2 + o2] = e2 >>> 8 * (n2 ? o2 : 3 - o2) & 255;
    }
    function N(t3, e2, r2, n2, o2, i2) {
      if (r2 + n2 > t3.length)
        throw new RangeError("Index out of range");
      if (r2 < 0)
        throw new RangeError("Index out of range");
    }
    function j(t3, e2, r2, n2, i2) {
      return i2 || N(t3, 0, r2, 4), o.write(t3, e2, r2, n2, 23, 4), r2 + 4;
    }
    function D(t3, e2, r2, n2, i2) {
      return i2 || N(t3, 0, r2, 8), o.write(t3, e2, r2, n2, 52, 8), r2 + 8;
    }
    f.prototype.slice = function(t3, e2) {
      var r2, n2 = this.length;
      if ((t3 = ~~t3) < 0 ? (t3 += n2) < 0 && (t3 = 0) : t3 > n2 && (t3 = n2), (e2 = void 0 === e2 ? n2 : ~~e2) < 0 ? (e2 += n2) < 0 && (e2 = 0) : e2 > n2 && (e2 = n2), e2 < t3 && (e2 = t3), f.TYPED_ARRAY_SUPPORT)
        (r2 = this.subarray(t3, e2)).__proto__ = f.prototype;
      else {
        var o2 = e2 - t3;
        r2 = new f(o2, void 0);
        for (var i2 = 0; i2 < o2; ++i2)
          r2[i2] = this[i2 + t3];
      }
      return r2;
    }, f.prototype.readUIntLE = function(t3, e2, r2) {
      t3 |= 0, e2 |= 0, r2 || L(t3, e2, this.length);
      for (var n2 = this[t3], o2 = 1, i2 = 0; ++i2 < e2 && (o2 *= 256); )
        n2 += this[t3 + i2] * o2;
      return n2;
    }, f.prototype.readUIntBE = function(t3, e2, r2) {
      t3 |= 0, e2 |= 0, r2 || L(t3, e2, this.length);
      for (var n2 = this[t3 + --e2], o2 = 1; e2 > 0 && (o2 *= 256); )
        n2 += this[t3 + --e2] * o2;
      return n2;
    }, f.prototype.readUInt8 = function(t3, e2) {
      return e2 || L(t3, 1, this.length), this[t3];
    }, f.prototype.readUInt16LE = function(t3, e2) {
      return e2 || L(t3, 2, this.length), this[t3] | this[t3 + 1] << 8;
    }, f.prototype.readUInt16BE = function(t3, e2) {
      return e2 || L(t3, 2, this.length), this[t3] << 8 | this[t3 + 1];
    }, f.prototype.readUInt32LE = function(t3, e2) {
      return e2 || L(t3, 4, this.length), (this[t3] | this[t3 + 1] << 8 | this[t3 + 2] << 16) + 16777216 * this[t3 + 3];
    }, f.prototype.readUInt32BE = function(t3, e2) {
      return e2 || L(t3, 4, this.length), 16777216 * this[t3] + (this[t3 + 1] << 16 | this[t3 + 2] << 8 | this[t3 + 3]);
    }, f.prototype.readIntLE = function(t3, e2, r2) {
      t3 |= 0, e2 |= 0, r2 || L(t3, e2, this.length);
      for (var n2 = this[t3], o2 = 1, i2 = 0; ++i2 < e2 && (o2 *= 256); )
        n2 += this[t3 + i2] * o2;
      return n2 >= (o2 *= 128) && (n2 -= Math.pow(2, 8 * e2)), n2;
    }, f.prototype.readIntBE = function(t3, e2, r2) {
      t3 |= 0, e2 |= 0, r2 || L(t3, e2, this.length);
      for (var n2 = e2, o2 = 1, i2 = this[t3 + --n2]; n2 > 0 && (o2 *= 256); )
        i2 += this[t3 + --n2] * o2;
      return i2 >= (o2 *= 128) && (i2 -= Math.pow(2, 8 * e2)), i2;
    }, f.prototype.readInt8 = function(t3, e2) {
      return e2 || L(t3, 1, this.length), 128 & this[t3] ? -1 * (255 - this[t3] + 1) : this[t3];
    }, f.prototype.readInt16LE = function(t3, e2) {
      e2 || L(t3, 2, this.length);
      var r2 = this[t3] | this[t3 + 1] << 8;
      return 32768 & r2 ? 4294901760 | r2 : r2;
    }, f.prototype.readInt16BE = function(t3, e2) {
      e2 || L(t3, 2, this.length);
      var r2 = this[t3 + 1] | this[t3] << 8;
      return 32768 & r2 ? 4294901760 | r2 : r2;
    }, f.prototype.readInt32LE = function(t3, e2) {
      return e2 || L(t3, 4, this.length), this[t3] | this[t3 + 1] << 8 | this[t3 + 2] << 16 | this[t3 + 3] << 24;
    }, f.prototype.readInt32BE = function(t3, e2) {
      return e2 || L(t3, 4, this.length), this[t3] << 24 | this[t3 + 1] << 16 | this[t3 + 2] << 8 | this[t3 + 3];
    }, f.prototype.readFloatLE = function(t3, e2) {
      return e2 || L(t3, 4, this.length), o.read(this, t3, true, 23, 4);
    }, f.prototype.readFloatBE = function(t3, e2) {
      return e2 || L(t3, 4, this.length), o.read(this, t3, false, 23, 4);
    }, f.prototype.readDoubleLE = function(t3, e2) {
      return e2 || L(t3, 8, this.length), o.read(this, t3, true, 52, 8);
    }, f.prototype.readDoubleBE = function(t3, e2) {
      return e2 || L(t3, 8, this.length), o.read(this, t3, false, 52, 8);
    }, f.prototype.writeUIntLE = function(t3, e2, r2, n2) {
      (t3 = +t3, e2 |= 0, r2 |= 0, n2) || O(this, t3, e2, r2, Math.pow(2, 8 * r2) - 1, 0);
      var o2 = 1, i2 = 0;
      for (this[e2] = 255 & t3; ++i2 < r2 && (o2 *= 256); )
        this[e2 + i2] = t3 / o2 & 255;
      return e2 + r2;
    }, f.prototype.writeUIntBE = function(t3, e2, r2, n2) {
      (t3 = +t3, e2 |= 0, r2 |= 0, n2) || O(this, t3, e2, r2, Math.pow(2, 8 * r2) - 1, 0);
      var o2 = r2 - 1, i2 = 1;
      for (this[e2 + o2] = 255 & t3; --o2 >= 0 && (i2 *= 256); )
        this[e2 + o2] = t3 / i2 & 255;
      return e2 + r2;
    }, f.prototype.writeUInt8 = function(t3, e2, r2) {
      return t3 = +t3, e2 |= 0, r2 || O(this, t3, e2, 1, 255, 0), f.TYPED_ARRAY_SUPPORT || (t3 = Math.floor(t3)), this[e2] = 255 & t3, e2 + 1;
    }, f.prototype.writeUInt16LE = function(t3, e2, r2) {
      return t3 = +t3, e2 |= 0, r2 || O(this, t3, e2, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[e2] = 255 & t3, this[e2 + 1] = t3 >>> 8) : Y(this, t3, e2, true), e2 + 2;
    }, f.prototype.writeUInt16BE = function(t3, e2, r2) {
      return t3 = +t3, e2 |= 0, r2 || O(this, t3, e2, 2, 65535, 0), f.TYPED_ARRAY_SUPPORT ? (this[e2] = t3 >>> 8, this[e2 + 1] = 255 & t3) : Y(this, t3, e2, false), e2 + 2;
    }, f.prototype.writeUInt32LE = function(t3, e2, r2) {
      return t3 = +t3, e2 |= 0, r2 || O(this, t3, e2, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[e2 + 3] = t3 >>> 24, this[e2 + 2] = t3 >>> 16, this[e2 + 1] = t3 >>> 8, this[e2] = 255 & t3) : M(this, t3, e2, true), e2 + 4;
    }, f.prototype.writeUInt32BE = function(t3, e2, r2) {
      return t3 = +t3, e2 |= 0, r2 || O(this, t3, e2, 4, 4294967295, 0), f.TYPED_ARRAY_SUPPORT ? (this[e2] = t3 >>> 24, this[e2 + 1] = t3 >>> 16, this[e2 + 2] = t3 >>> 8, this[e2 + 3] = 255 & t3) : M(this, t3, e2, false), e2 + 4;
    }, f.prototype.writeIntLE = function(t3, e2, r2, n2) {
      if (t3 = +t3, e2 |= 0, !n2) {
        var o2 = Math.pow(2, 8 * r2 - 1);
        O(this, t3, e2, r2, o2 - 1, -o2);
      }
      var i2 = 0, u2 = 1, a2 = 0;
      for (this[e2] = 255 & t3; ++i2 < r2 && (u2 *= 256); )
        t3 < 0 && 0 === a2 && 0 !== this[e2 + i2 - 1] && (a2 = 1), this[e2 + i2] = (t3 / u2 >> 0) - a2 & 255;
      return e2 + r2;
    }, f.prototype.writeIntBE = function(t3, e2, r2, n2) {
      if (t3 = +t3, e2 |= 0, !n2) {
        var o2 = Math.pow(2, 8 * r2 - 1);
        O(this, t3, e2, r2, o2 - 1, -o2);
      }
      var i2 = r2 - 1, u2 = 1, a2 = 0;
      for (this[e2 + i2] = 255 & t3; --i2 >= 0 && (u2 *= 256); )
        t3 < 0 && 0 === a2 && 0 !== this[e2 + i2 + 1] && (a2 = 1), this[e2 + i2] = (t3 / u2 >> 0) - a2 & 255;
      return e2 + r2;
    }, f.prototype.writeInt8 = function(t3, e2, r2) {
      return t3 = +t3, e2 |= 0, r2 || O(this, t3, e2, 1, 127, -128), f.TYPED_ARRAY_SUPPORT || (t3 = Math.floor(t3)), t3 < 0 && (t3 = 255 + t3 + 1), this[e2] = 255 & t3, e2 + 1;
    }, f.prototype.writeInt16LE = function(t3, e2, r2) {
      return t3 = +t3, e2 |= 0, r2 || O(this, t3, e2, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[e2] = 255 & t3, this[e2 + 1] = t3 >>> 8) : Y(this, t3, e2, true), e2 + 2;
    }, f.prototype.writeInt16BE = function(t3, e2, r2) {
      return t3 = +t3, e2 |= 0, r2 || O(this, t3, e2, 2, 32767, -32768), f.TYPED_ARRAY_SUPPORT ? (this[e2] = t3 >>> 8, this[e2 + 1] = 255 & t3) : Y(this, t3, e2, false), e2 + 2;
    }, f.prototype.writeInt32LE = function(t3, e2, r2) {
      return t3 = +t3, e2 |= 0, r2 || O(this, t3, e2, 4, 2147483647, -2147483648), f.TYPED_ARRAY_SUPPORT ? (this[e2] = 255 & t3, this[e2 + 1] = t3 >>> 8, this[e2 + 2] = t3 >>> 16, this[e2 + 3] = t3 >>> 24) : M(this, t3, e2, true), e2 + 4;
    }, f.prototype.writeInt32BE = function(t3, e2, r2) {
      return t3 = +t3, e2 |= 0, r2 || O(this, t3, e2, 4, 2147483647, -2147483648), t3 < 0 && (t3 = 4294967295 + t3 + 1), f.TYPED_ARRAY_SUPPORT ? (this[e2] = t3 >>> 24, this[e2 + 1] = t3 >>> 16, this[e2 + 2] = t3 >>> 8, this[e2 + 3] = 255 & t3) : M(this, t3, e2, false), e2 + 4;
    }, f.prototype.writeFloatLE = function(t3, e2, r2) {
      return j(this, t3, e2, true, r2);
    }, f.prototype.writeFloatBE = function(t3, e2, r2) {
      return j(this, t3, e2, false, r2);
    }, f.prototype.writeDoubleLE = function(t3, e2, r2) {
      return D(this, t3, e2, true, r2);
    }, f.prototype.writeDoubleBE = function(t3, e2, r2) {
      return D(this, t3, e2, false, r2);
    }, f.prototype.copy = function(t3, e2, r2, n2) {
      if (r2 || (r2 = 0), n2 || 0 === n2 || (n2 = this.length), e2 >= t3.length && (e2 = t3.length), e2 || (e2 = 0), n2 > 0 && n2 < r2 && (n2 = r2), n2 === r2)
        return 0;
      if (0 === t3.length || 0 === this.length)
        return 0;
      if (e2 < 0)
        throw new RangeError("targetStart out of bounds");
      if (r2 < 0 || r2 >= this.length)
        throw new RangeError("sourceStart out of bounds");
      if (n2 < 0)
        throw new RangeError("sourceEnd out of bounds");
      n2 > this.length && (n2 = this.length), t3.length - e2 < n2 - r2 && (n2 = t3.length - e2 + r2);
      var o2, i2 = n2 - r2;
      if (this === t3 && r2 < e2 && e2 < n2)
        for (o2 = i2 - 1; o2 >= 0; --o2)
          t3[o2 + e2] = this[o2 + r2];
      else if (i2 < 1e3 || !f.TYPED_ARRAY_SUPPORT)
        for (o2 = 0; o2 < i2; ++o2)
          t3[o2 + e2] = this[o2 + r2];
      else
        Uint8Array.prototype.set.call(t3, this.subarray(r2, r2 + i2), e2);
      return i2;
    }, f.prototype.fill = function(t3, e2, r2, n2) {
      if ("string" == typeof t3) {
        if ("string" == typeof e2 ? (n2 = e2, e2 = 0, r2 = this.length) : "string" == typeof r2 && (n2 = r2, r2 = this.length), 1 === t3.length) {
          var o2 = t3.charCodeAt(0);
          o2 < 256 && (t3 = o2);
        }
        if (void 0 !== n2 && "string" != typeof n2)
          throw new TypeError("encoding must be a string");
        if ("string" == typeof n2 && !f.isEncoding(n2))
          throw new TypeError("Unknown encoding: " + n2);
      } else
        "number" == typeof t3 && (t3 &= 255);
      if (e2 < 0 || this.length < e2 || this.length < r2)
        throw new RangeError("Out of range index");
      if (r2 <= e2)
        return this;
      var i2;
      if (e2 >>>= 0, r2 = void 0 === r2 ? this.length : r2 >>> 0, t3 || (t3 = 0), "number" == typeof t3)
        for (i2 = e2; i2 < r2; ++i2)
          this[i2] = t3;
      else {
        var u2 = f.isBuffer(t3) ? t3 : k(new f(t3, n2).toString()), a2 = u2.length;
        for (i2 = 0; i2 < r2 - e2; ++i2)
          this[i2 + e2] = u2[i2 % a2];
      }
      return this;
    };
    var C = /[^+\/0-9A-Za-z-_]/g;
    function x(t3) {
      return t3 < 16 ? "0" + t3.toString(16) : t3.toString(16);
    }
    function k(t3, e2) {
      var r2;
      e2 = e2 || 1 / 0;
      for (var n2 = t3.length, o2 = null, i2 = [], u2 = 0; u2 < n2; ++u2) {
        if ((r2 = t3.charCodeAt(u2)) > 55295 && r2 < 57344) {
          if (!o2) {
            if (r2 > 56319) {
              (e2 -= 3) > -1 && i2.push(239, 191, 189);
              continue;
            }
            if (u2 + 1 === n2) {
              (e2 -= 3) > -1 && i2.push(239, 191, 189);
              continue;
            }
            o2 = r2;
            continue;
          }
          if (r2 < 56320) {
            (e2 -= 3) > -1 && i2.push(239, 191, 189), o2 = r2;
            continue;
          }
          r2 = 65536 + (o2 - 55296 << 10 | r2 - 56320);
        } else
          o2 && (e2 -= 3) > -1 && i2.push(239, 191, 189);
        if (o2 = null, r2 < 128) {
          if ((e2 -= 1) < 0)
            break;
          i2.push(r2);
        } else if (r2 < 2048) {
          if ((e2 -= 2) < 0)
            break;
          i2.push(r2 >> 6 | 192, 63 & r2 | 128);
        } else if (r2 < 65536) {
          if ((e2 -= 3) < 0)
            break;
          i2.push(r2 >> 12 | 224, r2 >> 6 & 63 | 128, 63 & r2 | 128);
        } else {
          if (!(r2 < 1114112))
            throw new Error("Invalid code point");
          if ((e2 -= 4) < 0)
            break;
          i2.push(r2 >> 18 | 240, r2 >> 12 & 63 | 128, r2 >> 6 & 63 | 128, 63 & r2 | 128);
        }
      }
      return i2;
    }
    function F(t3) {
      return n.toByteArray(function(t4) {
        if ((t4 = function(t5) {
          return t5.trim ? t5.trim() : t5.replace(/^\s+|\s+$/g, "");
        }(t4).replace(C, "")).length < 2)
          return "";
        for (; t4.length % 4 != 0; )
          t4 += "=";
        return t4;
      }(t3));
    }
    function V(t3, e2, r2, n2) {
      for (var o2 = 0; o2 < n2 && !(o2 + r2 >= e2.length || o2 >= t3.length); ++o2)
        e2[o2 + r2] = t3[o2];
      return o2;
    }
  }).call(this, r(3));
}, function(t, e, r) {
  "use strict";
  e.__esModule = true, e.largeNumberType = e.dateType = e.objectKey = e.largeObjectType = e.objectType = e.smallObjectType = e.largeArrayType = e.arrayType = e.smallArrayType = e.doubleType = e.floatType = e.numberType = e.smallNumberType = e.nanoNumberType = e.largeStringType = e.stringType = e.smallStringType = e.booleanType = e.nullType = e.undefinedType = void 0, e.undefinedType = 0, e.nullType = 1, e.booleanType = 2, e.smallStringType = 3, e.stringType = 4, e.largeStringType = 5, e.nanoNumberType = 6, e.smallNumberType = 7, e.numberType = 8, e.floatType = 9, e.doubleType = 10, e.smallArrayType = 11, e.arrayType = 12, e.largeArrayType = 13, e.smallObjectType = 14, e.objectType = 15, e.largeObjectType = 16, e.objectKey = 17, e.dateType = 18, e.largeNumberType = 19;
}, function(t, e, r) {
  "use strict";
  (function(t2) {
    e.__esModule = true, e.decode = e.encode = void 0;
    var n = r(7), o = r(8);
    e.encode = function(e2) {
      return n.encodeValue(t2.alloc(0), e2);
    }, e.decode = function(t3) {
      var e2 = o.decodeType(t3, 0);
      return o.decodeValue(t3, e2.value, e2.offset).value;
    };
  }).call(this, r(0).Buffer);
}, function(t, e) {
  var r;
  r = /* @__PURE__ */ function() {
    return this;
  }();
  try {
    r = r || new Function("return this")();
  } catch (t2) {
    "object" == typeof window && (r = window);
  }
  t.exports = r;
}, function(t, e, r) {
  "use strict";
  e.byteLength = function(t2) {
    var e2 = s(t2), r2 = e2[0], n2 = e2[1];
    return 3 * (r2 + n2) / 4 - n2;
  }, e.toByteArray = function(t2) {
    var e2, r2, n2 = s(t2), u2 = n2[0], a2 = n2[1], f2 = new i(function(t3, e3, r3) {
      return 3 * (e3 + r3) / 4 - r3;
    }(0, u2, a2)), c2 = 0, l = a2 > 0 ? u2 - 4 : u2;
    for (r2 = 0; r2 < l; r2 += 4)
      e2 = o[t2.charCodeAt(r2)] << 18 | o[t2.charCodeAt(r2 + 1)] << 12 | o[t2.charCodeAt(r2 + 2)] << 6 | o[t2.charCodeAt(r2 + 3)], f2[c2++] = e2 >> 16 & 255, f2[c2++] = e2 >> 8 & 255, f2[c2++] = 255 & e2;
    2 === a2 && (e2 = o[t2.charCodeAt(r2)] << 2 | o[t2.charCodeAt(r2 + 1)] >> 4, f2[c2++] = 255 & e2);
    1 === a2 && (e2 = o[t2.charCodeAt(r2)] << 10 | o[t2.charCodeAt(r2 + 1)] << 4 | o[t2.charCodeAt(r2 + 2)] >> 2, f2[c2++] = e2 >> 8 & 255, f2[c2++] = 255 & e2);
    return f2;
  }, e.fromByteArray = function(t2) {
    for (var e2, r2 = t2.length, o2 = r2 % 3, i2 = [], u2 = 0, a2 = r2 - o2; u2 < a2; u2 += 16383)
      i2.push(c(t2, u2, u2 + 16383 > a2 ? a2 : u2 + 16383));
    1 === o2 ? (e2 = t2[r2 - 1], i2.push(n[e2 >> 2] + n[e2 << 4 & 63] + "==")) : 2 === o2 && (e2 = (t2[r2 - 2] << 8) + t2[r2 - 1], i2.push(n[e2 >> 10] + n[e2 >> 4 & 63] + n[e2 << 2 & 63] + "="));
    return i2.join("");
  };
  for (var n = [], o = [], i = "undefined" != typeof Uint8Array ? Uint8Array : Array, u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, f = u.length; a < f; ++a)
    n[a] = u[a], o[u.charCodeAt(a)] = a;
  function s(t2) {
    var e2 = t2.length;
    if (e2 % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var r2 = t2.indexOf("=");
    return -1 === r2 && (r2 = e2), [r2, r2 === e2 ? 0 : 4 - r2 % 4];
  }
  function c(t2, e2, r2) {
    for (var o2, i2, u2 = [], a2 = e2; a2 < r2; a2 += 3)
      o2 = (t2[a2] << 16 & 16711680) + (t2[a2 + 1] << 8 & 65280) + (255 & t2[a2 + 2]), u2.push(n[(i2 = o2) >> 18 & 63] + n[i2 >> 12 & 63] + n[i2 >> 6 & 63] + n[63 & i2]);
    return u2.join("");
  }
  o["-".charCodeAt(0)] = 62, o["_".charCodeAt(0)] = 63;
}, function(t, e) {
  e.read = function(t2, e2, r, n, o) {
    var i, u, a = 8 * o - n - 1, f = (1 << a) - 1, s = f >> 1, c = -7, l = r ? o - 1 : 0, h = r ? -1 : 1, p = t2[e2 + l];
    for (l += h, i = p & (1 << -c) - 1, p >>= -c, c += a; c > 0; i = 256 * i + t2[e2 + l], l += h, c -= 8)
      ;
    for (u = i & (1 << -c) - 1, i >>= -c, c += n; c > 0; u = 256 * u + t2[e2 + l], l += h, c -= 8)
      ;
    if (0 === i)
      i = 1 - s;
    else {
      if (i === f)
        return u ? NaN : 1 / 0 * (p ? -1 : 1);
      u += Math.pow(2, n), i -= s;
    }
    return (p ? -1 : 1) * u * Math.pow(2, i - n);
  }, e.write = function(t2, e2, r, n, o, i) {
    var u, a, f, s = 8 * i - o - 1, c = (1 << s) - 1, l = c >> 1, h = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0, p = n ? 0 : i - 1, y = n ? 1 : -1, d = e2 < 0 || 0 === e2 && 1 / e2 < 0 ? 1 : 0;
    for (e2 = Math.abs(e2), isNaN(e2) || e2 === 1 / 0 ? (a = isNaN(e2) ? 1 : 0, u = c) : (u = Math.floor(Math.log(e2) / Math.LN2), e2 * (f = Math.pow(2, -u)) < 1 && (u--, f *= 2), (e2 += u + l >= 1 ? h / f : h * Math.pow(2, 1 - l)) * f >= 2 && (u++, f /= 2), u + l >= c ? (a = 0, u = c) : u + l >= 1 ? (a = (e2 * f - 1) * Math.pow(2, o), u += l) : (a = e2 * Math.pow(2, l - 1) * Math.pow(2, o), u = 0)); o >= 8; t2[r + p] = 255 & a, p += y, a /= 256, o -= 8)
      ;
    for (u = u << o | a, s += o; s > 0; t2[r + p] = 255 & u, p += y, u /= 256, s -= 8)
      ;
    t2[r + p - y] |= 128 * d;
  };
}, function(t, e) {
  var r = {}.toString;
  t.exports = Array.isArray || function(t2) {
    return "[object Array]" == r.call(t2);
  };
}, function(t, e, r) {
  "use strict";
  (function(t2) {
    var n = this && this.__spreadArrays || function() {
      for (var t3 = 0, e2 = 0, r2 = arguments.length; e2 < r2; e2++)
        t3 += arguments[e2].length;
      var n2 = Array(t3), o2 = 0;
      for (e2 = 0; e2 < r2; e2++)
        for (var i2 = arguments[e2], u2 = 0, a2 = i2.length; u2 < a2; u2++, o2++)
          n2[o2] = i2[u2];
      return n2;
    };
    e.__esModule = true, e.encodeValue = e.encodeKeyValuePair = void 0;
    var o = r(1), i = function(e2, r2, n2, o2) {
      var i2 = e2.length;
      if (i2 < 255) {
        var u2 = t2.alloc(2);
        return u2.writeInt8(r2, 0), u2.writeUInt8(i2, 1), u2;
      }
      if (i2 < 65535) {
        var a2 = t2.alloc(3);
        return a2.writeInt8(n2, 0), a2.writeUInt16LE(i2, 1), a2;
      }
      var f2 = t2.alloc(5);
      return f2.writeInt8(o2, 0), f2.writeUInt32LE(i2, 1), f2;
    }, u = function(e2, r2) {
      var n2 = t2.alloc(5);
      return n2.writeInt8(o.floatType), n2.writeFloatLE(r2, 1), t2.concat([e2, n2]);
    }, a = function(e2, r2) {
      var n2 = t2.alloc(9);
      return n2.writeInt8(o.doubleType), n2.writeDoubleLE(r2, 1), t2.concat([e2, n2]);
    }, f = function(e2, r2) {
      var n2 = !Number.isInteger(r2), i2 = Math.abs(r2);
      return i2 < 128 ? n2 ? u(e2, r2) : function(e3, r3) {
        var n3 = t2.alloc(2);
        return n3.writeInt8(o.nanoNumberType), n3.writeInt8(r3, 1), t2.concat([e3, n3]);
      }(e2, r2) : i2 < 32768 ? n2 ? u(e2, r2) : function(e3, r3) {
        var n3 = t2.alloc(3);
        return n3.writeInt8(o.smallNumberType), n3.writeInt16LE(r3, 1), t2.concat([e3, n3]);
      }(e2, r2) : i2 < 2147483648 ? n2 ? a(e2, r2) : function(e3, r3) {
        var n3 = t2.alloc(5);
        return n3.writeInt8(o.numberType), n3.writeInt32LE(r3, 1), t2.concat([e3, n3]);
      }(e2, r2) : n2 ? a(e2, r2) : function(e3, r3) {
        var n3 = t2.alloc(9);
        return n3.writeInt8(o.largeNumberType), n3.writeBigInt64LE(r3, 1), t2.concat([e3, n3]);
      }(e2, BigInt(r2));
    }, s = function(e2, r2) {
      if (void 0 === r2)
        return function(e3) {
          var r3 = t2.alloc(1);
          return r3.writeInt8(o.undefinedType), t2.concat([e3, r3]);
        }(e2);
      if (null === r2)
        return function(e3) {
          var r3 = t2.alloc(1);
          return r3.writeInt8(o.nullType), t2.concat([e3, r3]);
        }(e2);
      if ("boolean" == typeof r2)
        return function(e3, r3) {
          var n2 = t2.alloc(2);
          return n2.writeInt8(o.booleanType), n2.writeInt8(r3 ? 1 : 0, 1), t2.concat([e3, n2]);
        }(e2, r2);
      if ("string" == typeof r2)
        return function(e3, r3) {
          var n2 = t2.alloc(r3.length);
          n2.write(r3);
          var u2 = t2.concat([i(r3, o.smallStringType, o.stringType, o.largeStringType), n2]);
          return t2.concat([e3, u2]);
        }(e2, r2);
      if ("number" == typeof r2)
        return f(e2, r2);
      if (Array.isArray(r2))
        return function(e3, r3) {
          var u2 = i(r3, o.smallArrayType, o.arrayType, o.largeArrayType), a2 = [];
          return r3.forEach(function(e4) {
            a2.push(s(t2.alloc(0), e4));
          }), t2.concat(n([e3, u2], a2));
        }(e2, r2);
      if (r2 instanceof Date)
        return l(e2, r2);
      if ("object" == typeof r2)
        return function(e3, r3) {
          var u2 = Object.keys(r3), a2 = i(u2, o.smallObjectType, o.objectKey, o.largeObjectType), f2 = [];
          return u2.forEach(function(e4) {
            f2.push(c(t2.alloc(0), e4, r3[e4]));
          }), t2.concat(n([e3, a2], f2));
        }(e2, r2);
      throw new Error("Unkown type for " + typeof r2);
    };
    e.encodeValue = s;
    var c = function(e2, r2, n2) {
      var i2 = t2.alloc(r2.length + 2);
      return i2.writeInt8(o.objectKey), i2.writeUInt8(r2.length, 1), i2.write(r2, 2), t2.concat([e2, s(i2, n2)]);
    };
    e.encodeKeyValuePair = c;
    var l = function(e2, r2) {
      var n2 = t2.alloc(9);
      return n2.writeInt8(o.dateType), n2.writeBigUInt64LE(BigInt(r2.getTime()), 1), t2.concat([e2, n2]);
    };
  }).call(this, r(0).Buffer);
}, function(t, e, r) {
  "use strict";
  e.__esModule = true, e.decodeNull = e.decodeUndefined = e.decodeValue = e.decodeDate = e.decodeKeyValuePair = e.decodeLargeObject = e.decodeObject = e.decodeSmallObject = e.decodeLargeArray = e.decodeArray = e.decodeSmallArray = e.decodeLargeString = e.decodeString = e.decodeSmallString = e.decodeDouble = e.decodeFloat = e.decodeSmallNumber = e.decodeNanoNumber = e.decodeNumber = e.decodeBoolean = e.decodeType = void 0;
  var n = r(1), o = function(t2, e2) {
    return { value: t2.readInt8(e2), offset: e2 + 1 };
  };
  e.decodeType = o;
  var i = function(t2, e2) {
    return { value: void 0, offset: e2 };
  };
  e.decodeUndefined = i;
  var u = function(t2, e2) {
    return { value: null, offset: e2 };
  };
  e.decodeNull = u;
  var a = function(t2, e2) {
    var r2 = t2.readUInt8(e2);
    return { value: t2.toString("utf8", e2 + 1, e2 + r2 + 1), offset: e2 + r2 + 1 };
  };
  e.decodeSmallString = a;
  var f = function(t2, e2) {
    var r2 = t2.readUInt16LE(e2);
    return { value: t2.toString("utf8", e2 + 2, e2 + r2 + 2), offset: e2 + r2 + 2 };
  };
  e.decodeString = f;
  var s = function(t2, e2) {
    var r2 = t2.readUInt32LE(e2);
    return { value: t2.toString("utf8", e2 + 4, e2 + r2 + 4), offset: e2 + r2 + 4 };
  };
  e.decodeLargeString = s;
  var c = function(t2, e2) {
    return { value: 1 === t2.readInt8(e2), offset: e2 + 1 };
  };
  e.decodeBoolean = c;
  var l = function(t2, e2) {
    return { value: t2.readInt8(e2), offset: e2 + 1 };
  };
  e.decodeNanoNumber = l;
  var h = function(t2, e2) {
    return { value: t2.readInt16LE(e2), offset: e2 + 2 };
  };
  e.decodeSmallNumber = h;
  var p = function(t2, e2) {
    return { value: t2.readInt32LE(e2), offset: e2 + 4 };
  };
  e.decodeNumber = p;
  var y = function(t2, e2) {
    return { value: t2.readFloatLE(e2), offset: e2 + 4 };
  };
  e.decodeFloat = y;
  var d = function(t2, e2) {
    return { value: t2.readDoubleLE(e2), offset: e2 + 8 };
  };
  e.decodeDouble = d;
  var g = function(t2, e2) {
    var r2 = t2.readInt8(e2);
    return b(t2, e2 + 1, r2);
  };
  e.decodeSmallArray = g;
  var v = function(t2, e2) {
    var r2 = t2.readInt16LE(e2);
    return b(t2, e2 + 2, r2);
  };
  e.decodeArray = v;
  var w = function(t2, e2) {
    var r2 = t2.readInt32LE(e2);
    return b(t2, e2 + 4, r2);
  };
  e.decodeLargeArray = w;
  var b = function(t2, e2, r2) {
    for (var n2 = e2, i2 = 0, u2 = []; i2 < r2; ) {
      var a2 = o(t2, n2), f2 = I(t2, a2.value, a2.offset);
      u2.push(f2.value), n2 = f2.offset, i2++;
    }
    return { value: u2, offset: n2 };
  }, T = function(t2, e2) {
    var r2 = t2.readInt8(e2);
    return A(t2, e2 + 1, r2);
  };
  e.decodeSmallObject = T;
  var m = function(t2, e2) {
    var r2 = t2.readInt16LE(e2);
    return A(t2, e2 + 2, r2);
  };
  e.decodeObject = m;
  var E = function(t2, e2) {
    var r2 = t2.readInt32LE(e2);
    return A(t2, e2 + 4, r2);
  };
  e.decodeLargeObject = E;
  var A = function(t2, e2, r2) {
    for (var n2 = e2, i2 = {}, u2 = 0; u2 < r2; ) {
      var a2 = o(t2, n2), f2 = R(t2, a2.offset);
      n2 = f2.offset, i2[f2.key] = f2.value, u2++;
    }
    return { value: i2, offset: n2 };
  }, _ = function(t2, e2) {
    return { value: new Date(Number(t2.readBigUInt64LE(e2))), offset: e2 + 8 };
  };
  e.decodeDate = _;
  var I = function(t2, e2, r2) {
    if (e2 === n.undefinedType)
      return i(0, r2);
    if (e2 === n.nullType)
      return u(0, r2);
    if (e2 === n.booleanType)
      return c(t2, r2);
    if (e2 === n.smallStringType)
      return a(t2, r2);
    if (e2 === n.stringType)
      return f(t2, r2);
    if (e2 === n.largeStringType)
      return s(t2, r2);
    if (e2 === n.largeNumberType)
      return function(t3, e3) {
        return { value: t3.readBigInt64LE(e3), offset: e3 + 8 };
      }(t2, r2);
    if (e2 === n.numberType)
      return p(t2, r2);
    if (e2 === n.nanoNumberType)
      return l(t2, r2);
    if (e2 === n.smallNumberType)
      return h(t2, r2);
    if (e2 === n.floatType)
      return y(t2, r2);
    if (e2 === n.doubleType)
      return d(t2, r2);
    if (e2 === n.smallArrayType)
      return g(t2, r2);
    if (e2 === n.arrayType)
      return v(t2, r2);
    if (e2 === n.largeArrayType)
      return w(t2, r2);
    if (e2 === n.smallObjectType)
      return T(t2, r2);
    if (e2 === n.objectType)
      return m(t2, r2);
    if (e2 === n.largeObjectType)
      return E(t2, r2);
    if (e2 === n.dateType)
      return _(t2, r2);
    throw new Error("Unknown type " + e2);
  };
  e.decodeValue = I;
  var R = function(t2, e2) {
    var r2 = function(t3, e3) {
      var r3 = t3.readUInt8(e3);
      return { value: t3.toString("utf8", e3 + 1, e3 + r3 + 1), offset: e3 + r3 + 1 };
    }(t2, e2), n2 = o(t2, r2.offset), i2 = I(t2, n2.value, n2.offset);
    return { key: r2.value, value: i2.value, offset: i2.offset };
  };
  e.decodeKeyValuePair = R;
}]);
var esm_default = bison;
export {
  bison,
  esm_default as default
};
/*! Bundled license information:

@jeffriggle/bison/dist/esm/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <http://feross.org>
   * @license  MIT
   *)
*/
//# sourceMappingURL=@jeffriggle_bison_dist_esm_index.js.map
