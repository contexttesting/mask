             
let DEPACK_EXPORT;
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const readline = require('readline');
const stream = require('stream');
const os = require('os');
const child_process = require('child_process');var k = k || {};
k.scope = {};
k.P = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
};
k.aa = function(a) {
  return {next:k.P(a)};
};
k.w = function(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : k.aa(a);
};
k.L = function(a) {
  for (var b, c = []; !(b = a.next()).done;) {
    c.push(b.value);
  }
  return c;
};
k.f = function(a) {
  return a instanceof Array ? a : k.L(k.w(a));
};
k.O = !1;
k.la = !1;
k.ma = !1;
k.na = !1;
k.ga = k.O || "function" == typeof Object.create ? Object.create : function(a) {
  function b() {
  }
  b.prototype = a;
  return new b;
};
k.ka = function() {
  var a = {$:!0}, b = {};
  try {
    return b.__proto__ = a, b.$;
  } catch (c) {
  }
  return !1;
};
k.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : k.ka() ? function(a, b) {
  a.__proto__ = b;
  if (a.__proto__ !== b) {
    throw new TypeError(a + " is not extensible");
  }
  return a;
} : null;
k.T = function(a, b) {
  a.prototype = k.ga(b.prototype);
  a.prototype.constructor = a;
  if (k.setPrototypeOf) {
    var c = k.setPrototypeOf;
    c(a, b);
  } else {
    for (c in b) {
      if ("prototype" != c) {
        if (Object.defineProperties) {
          var g = Object.getOwnPropertyDescriptor(b, c);
          g && Object.defineProperty(a, c, g);
        } else {
          a[c] = b[c];
        }
      }
    }
  }
  a.ua = b.prototype;
};
k.ca = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
k.global = k.ca(this);
k.defineProperty = k.O || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
};
k.B = function(a, b) {
  if (b) {
    var c = k.global;
    a = a.split(".");
    for (var g = 0; g < a.length - 1; g++) {
      var f = a[g];
      f in c || (c[f] = {});
      c = c[f];
    }
    a = a[a.length - 1];
    g = c[a];
    b = b(g);
    b != g && null != b && k.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
  }
};
k.Y = !1;
k.B("Promise", function(a) {
  function b(d) {
    this.c = 0;
    this.o = void 0;
    this.b = [];
    var e = this.i();
    try {
      d(e.resolve, e.reject);
    } catch (h) {
      e.reject(h);
    }
  }
  function c() {
    this.b = null;
  }
  function g(d) {
    return d instanceof b ? d : new b(function(e) {
      e(d);
    });
  }
  if (a && !k.Y) {
    return a;
  }
  c.prototype.c = function(d) {
    if (null == this.b) {
      this.b = [];
      var e = this;
      this.i(function() {
        e.o();
      });
    }
    this.b.push(d);
  };
  var f = k.global.setTimeout;
  c.prototype.i = function(d) {
    f(d, 0);
  };
  c.prototype.o = function() {
    for (; this.b && this.b.length;) {
      var d = this.b;
      this.b = [];
      for (var e = 0; e < d.length; ++e) {
        var h = d[e];
        d[e] = null;
        try {
          h();
        } catch (m) {
          this.l(m);
        }
      }
    }
    this.b = null;
  };
  c.prototype.l = function(d) {
    this.i(function() {
      throw d;
    });
  };
  b.prototype.i = function() {
    function d(m) {
      return function(n) {
        h || (h = !0, m.call(e, n));
      };
    }
    var e = this, h = !1;
    return {resolve:d(this.fa), reject:d(this.l)};
  };
  b.prototype.fa = function(d) {
    if (d === this) {
      this.l(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (d instanceof b) {
        this.ia(d);
      } else {
        a: {
          switch(typeof d) {
            case "object":
              var e = null != d;
              break a;
            case "function":
              e = !0;
              break a;
            default:
              e = !1;
          }
        }
        e ? this.F(d) : this.u(d);
      }
    }
  };
  b.prototype.F = function(d) {
    var e = void 0;
    try {
      e = d.then;
    } catch (h) {
      this.l(h);
      return;
    }
    "function" == typeof e ? this.ja(e, d) : this.u(d);
  };
  b.prototype.l = function(d) {
    this.A(2, d);
  };
  b.prototype.u = function(d) {
    this.A(1, d);
  };
  b.prototype.A = function(d, e) {
    if (0 != this.c) {
      throw Error("Cannot settle(" + d + ", " + e + "): Promise already settled in state" + this.c);
    }
    this.c = d;
    this.o = e;
    this.D();
  };
  b.prototype.D = function() {
    if (null != this.b) {
      for (var d = 0; d < this.b.length; ++d) {
        l.c(this.b[d]);
      }
      this.b = null;
    }
  };
  var l = new c;
  b.prototype.ia = function(d) {
    var e = this.i();
    d.G(e.resolve, e.reject);
  };
  b.prototype.ja = function(d, e) {
    var h = this.i();
    try {
      d.call(e, h.resolve, h.reject);
    } catch (m) {
      h.reject(m);
    }
  };
  b.prototype.then = function(d, e) {
    function h(r, t) {
      return "function" == typeof r ? function(u) {
        try {
          m(r(u));
        } catch (p) {
          n(p);
        }
      } : t;
    }
    var m, n, q = new b(function(r, t) {
      m = r;
      n = t;
    });
    this.G(h(d, m), h(e, n));
    return q;
  };
  b.prototype.catch = function(d) {
    return this.then(void 0, d);
  };
  b.prototype.G = function(d, e) {
    function h() {
      switch(m.c) {
        case 1:
          d(m.o);
          break;
        case 2:
          e(m.o);
          break;
        default:
          throw Error("Unexpected state: " + m.c);
      }
    }
    var m = this;
    null == this.b ? l.c(h) : this.b.push(h);
  };
  b.resolve = g;
  b.reject = function(d) {
    return new b(function(e, h) {
      h(d);
    });
  };
  b.race = function(d) {
    return new b(function(e, h) {
      for (var m = k.w(d), n = m.next(); !n.done; n = m.next()) {
        g(n.value).G(e, h);
      }
    });
  };
  b.all = function(d) {
    var e = k.w(d), h = e.next();
    return h.done ? g([]) : new b(function(m, n) {
      function q(u) {
        return function(p) {
          r[u] = p;
          t--;
          0 == t && m(r);
        };
      }
      var r = [], t = 0;
      do {
        r.push(void 0), t++, g(h.value).G(q(r.length - 1), n), h = e.next();
      } while (!h.done);
    });
  };
  return b;
});
k.Z = "jscomp_symbol_";
k.N = function() {
  k.N = function() {
  };
  k.global.Symbol || (k.global.Symbol = k.Symbol);
};
function aa(a, b) {
  this.b = a;
  k.defineProperty(this, "description", {configurable:!0, writable:!0, value:b});
}
aa.prototype.toString = function() {
  return this.b;
};
k.Symbol = function() {
  function a(c) {
    if (this instanceof a) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new aa(k.Z + (c || "") + "_" + b++, c);
  }
  var b = 0;
  return a;
}();
k.I = function() {
  k.N();
  var a = k.global.Symbol.iterator;
  a || (a = k.global.Symbol.iterator = k.global.Symbol("Symbol.iterator"));
  "function" != typeof Array.prototype[a] && k.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return k.ea(k.P(this));
  }});
  k.I = function() {
  };
};
k.da = function() {
  k.N();
  var a = k.global.Symbol.asyncIterator;
  a || (a = k.global.Symbol.asyncIterator = k.global.Symbol("Symbol.asyncIterator"));
  k.da = function() {
  };
};
k.ea = function(a) {
  k.I();
  a = {next:a};
  a[k.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
k.M = {};
k.M.ba = function(a) {
  if (!(a instanceof Object)) {
    throw new TypeError("Iterator result " + a + " is not an object");
  }
};
function w() {
  this.A = !1;
  this.u = null;
  this.c = void 0;
  this.b = 1;
  this.o = this.l = 0;
  this.F = this.i = null;
}
function ba(a) {
  if (a.A) {
    throw new TypeError("Generator is already running");
  }
  a.A = !0;
}
w.prototype.D = function(a) {
  this.c = a;
};
function ca(a, b) {
  a.i = {S:b, U:!0};
  a.b = a.l || a.o;
}
w.prototype.return = function(a) {
  this.i = {return:a};
  this.b = this.o;
};
function I(a, b, c) {
  a.b = c;
  return {value:b};
}
w.prototype.j = function(a) {
  this.b = a;
};
function da(a) {
  a.l = 0;
  var b = a.i.S;
  a.i = null;
  return b;
}
function ea(a) {
  var b = a.F.splice(0)[0];
  (b = a.i = a.i || b) ? b.U ? a.b = a.l || a.o : void 0 != b.j && a.o < b.j ? (a.b = b.j, a.i = null) : a.b = a.o : a.b = 0;
}
function fa(a) {
  this.b = new w;
  this.c = a;
}
function ha(a, b) {
  ba(a.b);
  var c = a.b.u;
  if (c) {
    return ia(a, "return" in c ? c["return"] : function(g) {
      return {value:g, done:!0};
    }, b, a.b.return);
  }
  a.b.return(b);
  return J(a);
}
function ia(a, b, c, g) {
  try {
    var f = b.call(a.b.u, c);
    k.M.ba(f);
    if (!f.done) {
      return a.b.A = !1, f;
    }
    var l = f.value;
  } catch (d) {
    return a.b.u = null, ca(a.b, d), J(a);
  }
  a.b.u = null;
  g.call(a.b, l);
  return J(a);
}
function J(a) {
  for (; a.b.b;) {
    try {
      var b = a.c(a.b);
      if (b) {
        return a.b.A = !1, {value:b.value, done:!1};
      }
    } catch (c) {
      a.b.c = void 0, ca(a.b, c);
    }
  }
  a.b.A = !1;
  if (a.b.i) {
    b = a.b.i;
    a.b.i = null;
    if (b.U) {
      throw b.S;
    }
    return {value:b.return, done:!0};
  }
  return {value:void 0, done:!0};
}
function ja(a) {
  this.next = function(b) {
    ba(a.b);
    a.b.u ? b = ia(a, a.b.u.next, b, a.b.D) : (a.b.D(b), b = J(a));
    return b;
  };
  this.throw = function(b) {
    ba(a.b);
    a.b.u ? b = ia(a, a.b.u["throw"], b, a.b.D) : (ca(a.b, b), b = J(a));
    return b;
  };
  this.return = function(b) {
    return ha(a, b);
  };
  k.I();
  this[Symbol.iterator] = function() {
    return this;
  };
}
k.M.pa = function(a, b) {
  b = new ja(new fa(b));
  k.setPrototypeOf && k.setPrototypeOf(b, a.prototype);
  return b;
};
k.R = function(a) {
  function b(g) {
    return a.next(g);
  }
  function c(g) {
    return a.throw(g);
  }
  return new Promise(function(g, f) {
    function l(d) {
      d.done ? g(d.value) : Promise.resolve(d.value).then(b, c).then(l, f);
    }
    l(a.next());
  });
};
k.oa = function(a) {
  return k.R(a());
};
k.h = function(a) {
  return k.R(new ja(new fa(a)));
};
k.B("Object.is", function(a) {
  return a ? a : function(b, c) {
    return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c;
  };
});
k.B("Array.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    var g = this;
    g instanceof String && (g = String(g));
    var f = g.length;
    c = c || 0;
    for (0 > c && (c = Math.max(c + f, 0)); c < f; c++) {
      var l = g[c];
      if (l === b || Object.is(l, b)) {
        return !0;
      }
    }
    return !1;
  };
});
k.H = function(a, b, c) {
  if (null == a) {
    throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
  }
  if (b instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
  }
  return a + "";
};
k.B("String.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    return -1 !== k.H(this, b, "includes").indexOf(b, c || 0);
  };
});
k.B("String.prototype.repeat", function(a) {
  return a ? a : function(b) {
    var c = k.H(this, null, "repeat");
    if (0 > b || 1342177279 < b) {
      throw new RangeError("Invalid count value");
    }
    b |= 0;
    for (var g = ""; b;) {
      if (b & 1 && (g += c), b >>>= 1) {
        c += c;
      }
    }
    return g;
  };
});
k.ra = function(a, b) {
  k.I();
  a instanceof String && (a += "");
  var c = 0, g = {next:function() {
    if (c < a.length) {
      var f = c++;
      return {value:b(f, a[f]), done:!1};
    }
    g.next = function() {
      return {done:!0, value:void 0};
    };
    return g.next();
  }};
  g[Symbol.iterator] = function() {
    return g;
  };
  return g;
};
k.B("String.prototype.endsWith", function(a) {
  return a ? a : function(b, c) {
    var g = k.H(this, b, "endsWith");
    void 0 === c && (c = g.length);
    c = Math.max(0, Math.min(c | 0, g.length));
    for (var f = b.length; 0 < f && 0 < c;) {
      if (g[--c] != b[--f]) {
        return !1;
      }
    }
    return 0 >= f;
  };
});
k.ha = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
k.assign = "function" == typeof Object.assign ? Object.assign : function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var g = arguments[c];
    if (g) {
      for (var f in g) {
        k.ha(g, f) && (a[f] = g[f]);
      }
    }
  }
  return a;
};
k.B("Object.assign", function(a) {
  return a || k.assign;
});
k.B("String.prototype.startsWith", function(a) {
  return a ? a : function(b, c) {
    var g = k.H(this, b, "startsWith"), f = g.length, l = b.length;
    c = Math.max(0, Math.min(c | 0, g.length));
    for (var d = 0; d < l && c < f;) {
      if (g[c++] != b[d++]) {
        return !1;
      }
    }
    return d >= l;
  };
});
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function ka() {
}
function la(a, b) {
  var c = new ka;
  a = ma(a.split(""));
  b = ma(b.split(""));
  var g = b.length, f = a.length, l = 1, d = g + f, e = [{g:-1, s:[]}], h = na(c, e[0], b, a, 0);
  if (e[0].g + 1 >= g && h + 1 >= f) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; l <= d;) {
    a: {
      for (h = -1 * l; h <= l; h += 2) {
        var m = e[h - 1];
        var n = e[h + 1], q = (n ? n.g : 0) - h;
        m && (e[h - 1] = void 0);
        var r = m && m.g + 1 < g;
        q = n && 0 <= q && q < f;
        if (r || q) {
          !r || q && m.g < n.g ? (m = {g:n.g, s:n.s.slice(0)}, oa(m.s, void 0, !0)) : (m.g++, oa(m.s, !0, void 0));
          q = na(c, m, b, a, h);
          if (m.g + 1 >= g && q + 1 >= f) {
            h = pa(c, m.s, b, a);
            break a;
          }
          e[h] = m;
        } else {
          e[h] = void 0;
        }
      }
      l++;
      h = void 0;
    }
    if (h) {
      return h;
    }
  }
}
function oa(a, b, c) {
  var g = a[a.length - 1];
  g && g.m === b && g.v === c ? a[a.length - 1] = {count:g.count + 1, m:b, v:c} : a.push({count:1, m:b, v:c});
}
function na(a, b, c, g, f) {
  var l = c.length, d = g.length, e = b.g;
  f = e - f;
  for (var h = 0; e + 1 < l && f + 1 < d && a.equals(c[e + 1], g[f + 1]);) {
    e++, f++, h++;
  }
  h && b.s.push({count:h});
  b.g = e;
  return f;
}
ka.prototype.equals = function(a, b) {
  return a === b;
};
function ma(a) {
  for (var b = [], c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
ka.prototype.join = function(a) {
  return a.join("");
};
function pa(a, b, c, g) {
  for (var f = 0, l = b.length, d = 0, e = 0; f < l; f++) {
    var h = b[f];
    if (h.v) {
      h.value = a.join(g.slice(e, e + h.count)), e += h.count, f && b[f - 1].m && (h = b[f - 1], b[f - 1] = b[f], b[f] = h);
    } else {
      if (h.m) {
        h.value = a.join(c.slice(d, d + h.count));
      } else {
        var m = c.slice(d, d + h.count);
        m = m.map(function(n, q) {
          q = g[e + q];
          return q.length > n.length ? q : n;
        });
        h.value = a.join(m);
      }
      d += h.count;
      h.m || (e += h.count);
    }
  }
  c = b[l - 1];
  1 < l && "string" === typeof c.value && (c.m || c.v) && a.equals("", c.value) && (b[l - 2].value += c.value, b.pop());
  return b;
}
;var qa = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, ra = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function K(a, b) {
  return (b = qa[b]) ? "\u001b[" + b + "m" + a + "\u001b[0m" : a;
}
function sa(a) {
  return (a = ra[a]) ? "\u001b[" + a + "m \u001b[0m" : " ";
}
function ta(a, b) {
  return la(a, b).map(function(c) {
    var g = c.v, f = c.value, l = f.split(" ");
    return c.m ? l.map(function(d) {
      return d.replace(/\n$/mg, "\u23ce\n");
    }).map(function(d) {
      return K(d, "green");
    }).join(sa("green")) : g ? l.map(function(d) {
      return d.replace(/\n$/mg, "\u23ce\n");
    }).map(function(d) {
      return K(d, "red");
    }).join(sa("red")) : K(f, "grey");
  }).join("");
}
;var S = fs, ua = S.lstatSync, va = S.readFileSync, wa = S.readdirSync, xa = S.writeFileSync;
var ya = path, za = ya.basename, Aa = ya.dirname, Ba = ya.join;
var Ca = assert, Da = Ca.deepStrictEqual, Ea = Ca.equal, Fa = Ca.strictEqual;
function Ga(a, b) {
  var c = ["preValue", "key", "newLine", "value"], g = !0;
  g = void 0 === g ? !1 : g;
  var f = [];
  b.replace(a, function(l, d) {
    for (var e = [], h = 1; h < arguments.length; ++h) {
      e[h - 1] = arguments[h];
    }
    h = e[e.length - 2];
    h = g ? {position:h} : {};
    e = e.slice(0, e.length - 2).reduce(function(m, n, q) {
      q = c[q];
      if (!q || void 0 === n) {
        return m;
      }
      m[q] = n;
      return m;
    }, h);
    f.push(e);
  });
  return f;
}
;var Ha = readline.createInterface;
function Ia(a, b, c) {
  return setTimeout(function() {
    var g = Error((a ? a : "Promise") + " has timed out after " + b + "ms");
    g.stack = g.message;
    c(g);
  }, b);
}
function Ja(a, b) {
  var c, g = new Promise(function(f, l) {
    c = Ia(a, b, l);
  });
  return {timeout:c, promise:g};
}
function Ka(a, b, c) {
  var g, f, l;
  return k.h(function(d) {
    if (1 == d.b) {
      if (!(a instanceof Promise)) {
        throw Error("Promise expected");
      }
      if (!b) {
        throw Error("Timeout must be a number");
      }
      if (0 > b) {
        throw Error("Timeout cannot be negative");
      }
      g = Ja(c, b);
      f = g.promise;
      l = g.timeout;
      d.l = 0;
      d.o = 2;
      return I(d, Promise.race([a, f]), 4);
    }
    if (2 != d.b) {
      return d.return(d.c);
    }
    d.F = [d.i];
    d.l = 0;
    d.o = 0;
    clearTimeout(l);
    return ea(d);
  });
}
;function La(a, b) {
  var c = b = void 0 === b ? {} : b, g = Object.assign({}, c);
  b = c.timeout;
  var f = void 0 === c.password ? !1 : c.password, l = void 0 === c.output ? process.stdout : c.output;
  c = void 0 === c.input ? process.stdin : c.input;
  g = (delete g.timeout, delete g.password, delete g.output, delete g.input, g);
  var d = Ha(Object.assign({}, {input:c, output:l}, g));
  f && (d.b = function(e) {
    if (["\r\n", "\n", "\r"].includes(e)) {
      return d.output.write(e);
    }
    e = e.split(a);
    "2" == e.length ? (d.output.write(a), d.output.write("*".repeat(e[1].length))) : d.output.write("*");
  });
  f = new Promise(d.question.bind(d, a));
  b = b ? Ka(f, b, "reloquent: " + a) : f;
  d.promise = Ma(b, d);
  return d;
}
function Ma(a, b) {
  var c;
  return k.h(function(g) {
    if (1 == g.b) {
      return g.l = 0, g.o = 2, I(g, a, 4);
    }
    if (2 != g.b) {
      return c = g.c, g.return(c);
    }
    g.F = [g.i];
    g.l = 0;
    g.o = 0;
    b.close();
    return ea(g);
  });
}
;function Na(a, b) {
  var c, g;
  return k.h(function(f) {
    if (1 == f.b) {
      if ("object" != typeof a) {
        throw Error("Please give an object with questions");
      }
      c = Object.keys(a);
      return I(f, c.reduce(function(l, d) {
        var e, h, m, n, q, r, t, u, p, v, B, y, A;
        return k.h(function(z) {
          switch(z.b) {
            case 1:
              return I(z, l, 2);
            case 2:
              e = z.c;
              h = a[d];
              switch(typeof h) {
                case "object":
                  m = Object.assign({}, h);
                  break;
                case "string":
                  m = {text:h};
                  break;
                default:
                  throw Error("A question must be a string or an object.");
              }m.text = "" + m.text + (m.text.endsWith("?") ? "" : ":") + " ";
              m.defaultValue && (n = m.defaultValue);
              if (!m.getDefault) {
                z.j(3);
                break;
              }
              return I(z, m.getDefault(), 4);
            case 4:
              q = z.c;
            case 3:
              return r = n || "", n && q && n != q ? r = "\u001b[90m" + n + "\u001b[0m" : n && n == q && (r = ""), t = q || "", u = m.text + (r ? "[" + r + "] " : "") + (t ? "[" + t + "] " : ""), p = La(u, {timeout:b, password:m.password}), v = p.promise, I(z, v, 5);
            case 5:
              y = (B = z.c) || q || m.defaultValue;
              "function" == typeof m.validation && m.validation(y);
              if ("function" != typeof m.postProcess) {
                z.j(6);
                break;
              }
              return I(z, m.postProcess(y), 7);
            case 7:
              y = z.c;
            case 6:
              return A = {}, z.return(Object.assign({}, e, (A[d] = y, A)));
          }
        });
      }, {}), 2);
    }
    g = f.c;
    return f.return(g);
  });
}
;function Oa() {
  var a, b;
  return k.h(function(c) {
    if (1 == c.b) {
      return I(c, Na({question:"Show more (d), skip (s), or update (u): [u]"}, void 0), 2);
    }
    a = c.c;
    b = a.question;
    return c.return(b);
  });
}
function Pa() {
  var a = void 0 === a ? {} : a;
  var b, c, g, f, l, d, e;
  return k.h(function(h) {
    if (1 == h.b) {
      return b = a, c = void 0 === b.defaultYes ? !0 : b.defaultYes, g = b.timeout, f = "Update the result".endsWith("?"), l = (f ? "Update the result".replace(/\?$/, "") : "Update the result") + " (y/n)" + (f ? "?" : ""), I(h, Na({question:{text:l, defaultValue:c ? "y" : "n"}}, g), 2);
    }
    d = h.c;
    e = d.question;
    return h.return("y" == e);
  });
}
;function Qa(a, b) {
  var c = [];
  a.replace(b, function(g, f) {
    c.push({position:f, separator:g});
  });
  c = [{position:0, separator:""}].concat(k.f(c));
  return c.reduce(function(g, f, l, d) {
    var e = f.position;
    f = f.separator;
    var h = f.length;
    l = d[l + 1];
    if (!l) {
      return l = a.slice(e + h), g.push({position:e, separator:f, match:l}), g;
    }
    l = a.slice(e + h, l.position);
    g.push({position:e, separator:f, match:l});
    return g;
  }, []);
}
;function Ra(a) {
  function b(n, q, r) {
    var t, u, p, v, B;
    return k.h(function() {
      t = new RegExp("" + l.source + n + "\r?$");
      u = h.reduce(function(y, A, z) {
        return y ? y : t.test(A) ? z + 1 : y;
      }, null);
      p = Error(r.message);
      v = "Error: " + r.message + "\n    at " + n + " (" + c + ":" + u + ":1)";
      p.stack = v;
      r.J && r.actual && (B = function() {
        var y, A, z, F, C, x, D;
        return k.h(function(E) {
          switch(E.b) {
            case 1:
              y = q[r.J];
              if (!y) {
                return E.return(!1);
              }
              A = y.start + m;
              z = d.slice(0, A);
              F = d.slice(A + y.length);
              C = "" + z + r.actual + F;
              console.error('Result does not match property "%s"\n  at %s (%s:%s:1)', r.J, K(n, "blue"), c, u);
              x = !1;
              return I(E, Oa(), 2);
            case 2:
              D = E.c;
              if ("d" != D) {
                D && "u" != D || (x = !0);
                E.j(3);
                break;
              }
              console.log(K("Actual: ", "blue"));
              console.log(r.actual);
              console.log(K("Expected: ", "blue"));
              console.log(r.expected);
              return I(E, Pa(), 4);
            case 4:
              x = E.c;
            case 3:
              if (!x) {
                return E.return(!1);
              }
              m += r.actual.length - y.length;
              return I(E, xa(c, C), 5);
            case 5:
              return d = "" + va(c), E.return(!0);
          }
        });
      }, p.qa = B);
      throw p;
    });
  }
  var c = a.path, g = void 0 === a.propStartRe ? /\/\*/ : a.propStartRe, f = void 0 === a.propEndRe ? /\/\*\*\// : a.propEndRe, l = a.splitRe;
  l || (l = c.endsWith(".md") ? /^## /gm : /^\/\/ /gm);
  var d = "" + va(c);
  a = l.exec(d);
  if (!a) {
    throw Error(c + " does not contain tests.");
  }
  var e = d.slice(0, a.index).replace(/\n\n$/, "");
  a = d.slice(a.index);
  l.lastIndex = 0;
  a = Qa(a, l).filter(function(n) {
    return n.match;
  }).map(function(n) {
    var q = n.match, r = n.position, t = n.separator, u = k.w(Sa(q));
    n = u.next().value;
    u = u.next().value;
    var p = k.w(Ta(u, new RegExp("\n" + g.source)));
    u = p.next().value;
    p = p.next().value;
    var v = q.indexOf(p);
    q = u.replace(/\n$/, "");
    var B = {};
    u = Ga(new RegExp("(" + g.source + " +(.+) +\\*\\/(\n?))([\\s\\S]*?)\n" + f.source, "g"), p).reduce(function(y, A) {
      var z = A.key, F = A.sa, C = A.value;
      B[z] = {start:r + v + A.position + A.ta.length + t.length, length:C.length};
      A = {};
      return Object.assign({}, y, (A[z] = !C && F ? F : C, A));
    }, {});
    return Object.assign({}, {name:n, input:q, X:B}, e ? {preamble:e} : {}, u);
  });
  var h = d.split("\n"), m = 0;
  return a.map(function(n) {
    var q = Object.assign({}, n), r = n.name;
    n = n.X;
    q = (delete q.name, delete q.X, q);
    n = b.bind(null, r, n);
    return Object.assign({}, q, {name:r, W:n});
  });
}
function Ta(a, b) {
  var c = a.search(b);
  if (0 > c) {
    throw Error('Could not process "' + a + '": propStart re ' + b + " returned -1");
  }
  return [a.substr(0, c), a.substr(c + 1)];
}
function Sa(a) {
  var b = a.indexOf("\n");
  return [a.substr(0, b), a.substr(b + 1)];
}
;var Ua = stream, Va = Ua.PassThrough, U = Ua.Writable;
function Wa(a, b) {
  var c = Error().stack;
  a = void 0 === a ? 0 : a;
  b = void 0 === b ? !1 : b;
  if (0 === a && !b) {
    return c;
  }
  c = c.split("\n", b ? a + 1 : void 0);
  return b ? c[c.length - 1] : c.slice(a).join("\n");
}
;var Xa = os.homedir;
var Ya = /\s+at.*(?:\(|\s)(.*)\)?/, Za = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, cb = Xa();
function db(a) {
  var b = {}, c = void 0 === b.pretty ? !1 : b.pretty;
  b = (void 0 === b.ignoredModules ? ["pirates"] : b.ignoredModules).join("|");
  var g = new RegExp(Za.source.replace("IGNORED_MODULES", b));
  return a.replace(/\\/g, "/").split("\n").filter(function(f) {
    f = f.match(Ya);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !g.test(f);
  }).filter(function(f) {
    return f.trim();
  }).map(function(f) {
    return c ? f.replace(Ya, function(l, d) {
      return l.replace(d, d.replace(cb, "~"));
    }) : f;
  }).join("\n");
}
;function eb(a, b, c) {
  c = void 0 === c ? !1 : c;
  return function(g) {
    var f = arguments.callee.caller;
    var l = Wa(2, !0);
    var d = g instanceof Error, e = d ? g.message : g;
    f = ["Error: " + e].concat(k.f(null !== f && a === f || c ? [b] : [l, b])).join("\n");
    f = db(f);
    return Object.assign(d ? g : Error(), {message:e, stack:f});
  };
}
;function fb(a) {
  var b = arguments.callee.caller;
  var c = Wa(2 + ((void 0 === a ? 0 : a) ? 1 : 0));
  return eb(b, c, a);
}
;function gb(a, b) {
  b.once("error", function(c) {
    a.emit("error", c);
  });
  return b;
}
;var hb = ["", ""];
hb.raw = hb.slice();
var ib = ["", ""];
ib.raw = ib.slice();
function jb(a) {
  var b = a || {}, c = Object.assign({}, b), g = void 0 === b.binary ? !1 : b.binary, f = void 0 === b.rs ? null : b.rs;
  b = (delete c.binary, delete c.rs, c);
  a = a || {};
  var l = void 0 === a.C ? fb(!0) : a.C, d = a.proxyError;
  var e = U.call(this, b) || this;
  e.b = [];
  e.K = new Promise(function(h, m) {
    e.on("finish", function() {
      var n;
      g ? n = Buffer.concat(e.b) : n = e.b.join("");
      h(n);
      e.b = [];
    });
    e.once("error", function(n) {
      if (-1 == n.stack.indexOf("\n")) {
        l(n);
      } else {
        var q = db(n.stack);
        n.stack = q;
        d && l(n);
      }
      m(n);
    });
    f && gb(e, f).pipe(e);
  });
  return e;
}
k.T(jb, U);
jb.prototype._write = function(a, b, c) {
  this.b.push(a);
  c();
};
k.global.Object.defineProperties(jb.prototype, {promise:{configurable:!0, enumerable:!0, get:function() {
  return this.K;
}}});
function kb(a) {
  var b = void 0 === b ? {} : b;
  var c, g, f;
  return k.h(function(l) {
    if (1 == l.b) {
      return c = new jb(Object.assign({}, {rs:a}, b, {C:fb(!0)})), g = c.promise, I(l, g, 2);
    }
    f = l.c;
    return l.return(f);
  });
}
;function lb(a, b) {
  return k.h(function(c) {
    return I(c, b(a), 0);
  });
}
function mb(a, b) {
  return k.h(function(c) {
    if (b instanceof RegExp) {
      if (!b.test(a)) {
        throw Error(a + " does not match regular expression " + b);
      }
      return c.j(0);
    }
    if ("function" != typeof b) {
      if (b && a != b) {
        throw c = ta("" + a, "" + b), Error(c + "\n" + (a + " != " + b));
      }
      return c.j(0);
    }
    return I(c, lb(a, b), 0);
  });
}
function nb(a) {
  var b, c, g, f, l, d, e, h, m, n, q, r;
  return k.h(function(t) {
    if (1 == t.b) {
      if (!a) {
        throw Error("Config expected.");
      }
      b = fb(!0);
      c = a;
      g = Object.assign({}, c);
      f = c.fn;
      l = void 0 === c.args ? [] : c.args;
      d = c.context;
      e = c.error;
      h = (delete g.fn, delete g.args, delete g.context, delete g.error, g);
      if ("function" != typeof f) {
        throw Error("Function expected.");
      }
      m = Array.isArray(l) ? l : [l];
      t.l = 2;
      return I(t, ob(f, d, m, e, h), 4);
    }
    if (2 != t.b) {
      return n = t.c, t.return(n);
    }
    q = da(t);
    r = b(q);
    throw r;
  });
}
function ob(a, b, c, g, f) {
  var l, d, e;
  return k.h(function(h) {
    switch(h.b) {
      case 1:
        return l = Error(), h.l = 2, b ? I(h, a.call.apply(a, [b].concat(k.f(c))), 5) : I(h, a.apply(null, k.f(c)), 5);
      case 5:
        throw l;
      case 2:
        d = da(h);
        if (d === l) {
          throw e = a.name && "fn" !== a.name ? a.name + " " : "", Error("Function " + e + "should have thrown.");
        }
        if (g && g !== d) {
          throw Error(d + " is not strict equal to " + g + ".");
        }
        return I(h, Object.keys(f).reduce(function(m, n) {
          var q, r;
          return k.h(function(t) {
            if (1 == t.b) {
              return I(t, m, 2);
            }
            q = f[n];
            r = d[n];
            return I(t, mb(r, q), 0);
          });
        }, {}), 8);
      case 8:
        return h.return(d);
    }
  });
}
;function pb(a, b) {
  for (var c = [], g = 1; g < arguments.length; ++g) {
    c[g - 1] = arguments[g];
  }
  var f = -1;
  return a.replace(/%s/g, function() {
    f++;
    return c[f];
  });
}
function qb(a, b) {
  function c(d, e) {
    if (d instanceof Date && e instanceof Date) {
      var h = d.getTime() != e.getTime() ? !1 : void 0;
      return h ? "" : f(d, e);
    }
    if (d instanceof Date && !(e instanceof Date) || !(d instanceof Date) && e instanceof Date || Array.isArray(d) && !Array.isArray(e) || !Array.isArray(d) && Array.isArray(e)) {
      return f(d, e);
    }
    if (V(d) && V(e) || !V(d) && V(e) || V(d) && !V(e)) {
      return d != e ? f(d, e) : "";
    }
    if (d.constructor && !e.constructor) {
      return f(d.constructor.name, e);
    }
    if (!d.constructor && e.constructor) {
      return f(d, e.constructor.name);
    }
    if (d.constructor && e.constructor) {
      if (d.constructor.name != e.constructor.name) {
        return f(d.constructor.name, e.constructor.name);
      }
      h = d.valueOf();
      var m = e.valueOf();
      if (V(h) && V(m) && h != m) {
        return f(h, m);
      }
    }
    if (Array.isArray(d) && Array.isArray(e)) {
      var n;
      h = d.map(function(p, v) {
        n = v;
        (p = c(p, e[v])) && (p = g("[" + v + "]") + "\n" + p);
        return p;
      }).filter(Boolean);
      m = e.slice(n + 1).map(function(p, v) {
        return g("[" + (n + v + 1) + "]") + "\n" + f(void 0, p);
      });
      return [].concat(k.f(h), k.f(m)).join("\n");
    }
    if ("object" == typeof d && "object" == typeof e) {
      var q = [], r = [], t = [];
      Object.keys(d).forEach(function(p) {
        p in e ? t.push(p) : r.push(p);
      });
      Object.keys(e).forEach(function(p) {
        p in d || q.push(p);
      });
      h = r.map(function(p) {
        return f("" + p + (": " + rb(d[p])));
      });
      m = q.map(function(p) {
        return f(void 0, p + ": " + rb(e[p]));
      });
      var u = t.map(function(p) {
        l++;
        var v = c(d[p], e[p]), B = "";
        v && (B += g(Array.isArray(d[p]) && Array.isArray(e[p]) ? p + ".Array" : p), B += "\n" + v);
        l--;
        return B;
      }).filter(Boolean);
      return [].concat(k.f(h), k.f(m), k.f(u)).join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", d, e);
  }
  function g(d) {
    var e = " ".repeat(2 * l);
    return pb("%s%s", e, d);
  }
  function f(d, e) {
    var h = " ".repeat(2 * l);
    e = void 0 !== e ? K("+ " + rb(e), "green") : null;
    d = void 0 !== d ? K("- " + rb(d), "red") : null;
    var m = [];
    d && m.push(pb("%s%s", h, d));
    e && m.push(pb("%s%s", h, e));
    return m.join("\n");
  }
  var l = 0;
  return c(a, b);
}
function V(a) {
  return null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a);
}
function rb(a) {
  return Array.isArray(a) ? "Array[" + a.toString() + "]" : a && a.toString ? a.toString() : "" + a;
}
;var sb = child_process.fork;
function tb(a, b) {
  var c = Error().stack;
  a = void 0 === a ? 0 : a;
  b = void 0 === b ? !1 : b;
  if (0 === a && !b) {
    return c;
  }
  c = c.split("\n", b ? a + 1 : void 0);
  return b ? c[c.length - 1] : c.slice(a).join("\n");
}
;var ub = /\s+at.*(?:\(|\s)(.*)\)?/, vb = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, wb = Xa();
function xb(a) {
  var b = {}, c = void 0 === b.pretty ? !1 : b.pretty;
  b = (void 0 === b.ignoredModules ? ["pirates"] : b.ignoredModules).join("|");
  var g = new RegExp(vb.source.replace("IGNORED_MODULES", b));
  return a.replace(/\\/g, "/").split("\n").filter(function(f) {
    f = f.match(ub);
    if (null === f || !f[1]) {
      return !0;
    }
    f = f[1];
    return f.includes(".app/Contents/Resources/electron.asar") || f.includes(".app/Contents/Resources/default_app.asar") ? !1 : !g.test(f);
  }).filter(function(f) {
    return f.trim();
  }).map(function(f) {
    return c ? f.replace(ub, function(l, d) {
      return l.replace(d, d.replace(wb, "~"));
    }) : f;
  }).join("\n");
}
;function yb(a, b, c) {
  c = void 0 === c ? !1 : c;
  return function(g) {
    var f = arguments.callee.caller;
    var l = tb(2, !0);
    var d = g instanceof Error, e = d ? g.message : g;
    f = ["Error: " + e].concat(k.f(null !== f && a === f || c ? [b] : [l, b])).join("\n");
    f = xb(f);
    return Object.assign(d ? g : Error(), {message:e, stack:f});
  };
}
;function zb(a) {
  var b = arguments.callee.caller;
  var c = tb(2 + ((void 0 === a ? 0 : a) ? 1 : 0));
  return yb(b, c, a);
}
;function Ab(a, b) {
  b.once("error", function(c) {
    a.emit("error", c);
  });
  return b;
}
;var Bb = ["", ""];
Bb.raw = Bb.slice();
var Cb = ["", ""];
Cb.raw = Cb.slice();
function X(a) {
  var b = a || {}, c = Object.assign({}, b), g = void 0 === b.binary ? !1 : b.binary, f = void 0 === b.rs ? null : b.rs;
  b = (delete c.binary, delete c.rs, c);
  a = a || {};
  var l = void 0 === a.C ? zb(!0) : a.C, d = a.proxyError;
  var e = U.call(this, b) || this;
  e.b = [];
  e.K = new Promise(function(h, m) {
    e.on("finish", function() {
      var n;
      g ? n = Buffer.concat(e.b) : n = e.b.join("");
      h(n);
      e.b = [];
    });
    e.once("error", function(n) {
      if (-1 == n.stack.indexOf("\n")) {
        l(n);
      } else {
        var q = xb(n.stack);
        n.stack = q;
        d && l(n);
      }
      m(n);
    });
    f && Ab(e, f).pipe(e);
  });
  return e;
}
k.T(X, U);
X.prototype._write = function(a, b, c) {
  this.b.push(a);
  c();
};
k.global.Object.defineProperties(X.prototype, {promise:{configurable:!0, enumerable:!0, get:function() {
  return this.K;
}}});
function Db(a) {
  var b = void 0 === b ? {} : b;
  var c, g, f;
  return k.h(function(l) {
    if (1 == l.b) {
      return c = new X(Object.assign({}, {rs:a}, b, {C:zb(!0)})), g = c.promise, I(l, g, 2);
    }
    f = l.c;
    return l.return(f);
  });
}
;function Eb(a) {
  var b, c, g, f, l, d;
  return k.h(function(e) {
    if (1 == e.b) {
      return b = k, c = b.w, I(e, Promise.all([new Promise(function(h, m) {
        a.on("error", m).on("exit", function(n) {
          h(n);
        });
      }), a.stdout ? Db(a.stdout) : void 0, a.stderr ? Db(a.stderr) : void 0]), 2);
    }
    g = c.call(b, e.c);
    f = g.next().value;
    l = g.next().value;
    d = g.next().value;
    return e.return({code:f, stdout:l, stderr:d});
  });
}
;function Fb(a, b, c, g) {
  c = void 0 === c ? [] : c;
  if (g = void 0 === g ? null : g) {
    a.on("data", function(e) {
      return g.write(e);
    });
  }
  c = k.w(c);
  var f = c.next().value, l = k.L(c);
  if (f) {
    var d = function(e) {
      var h = k.w(f), m = h.next().value;
      h = h.next().value;
      m.test(e) && (e = h + "\n", g && g.write(e), b.write(e), e = k.w(l), f = e.next().value, l = k.L(e), f || a.removeListener("data", d));
    };
    a.on("data", d);
  }
}
;function Gb() {
}
function Hb(a, b) {
  var c = new Gb;
  a = Ib(a.split(""));
  b = Ib(b.split(""));
  var g = b.length, f = a.length, l = 1, d = g + f, e = [{g:-1, s:[]}], h = Jb(c, e[0], b, a, 0);
  if (e[0].g + 1 >= g && h + 1 >= f) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; l <= d;) {
    a: {
      for (h = -1 * l; h <= l; h += 2) {
        var m = e[h - 1];
        var n = e[h + 1], q = (n ? n.g : 0) - h;
        m && (e[h - 1] = void 0);
        var r = m && m.g + 1 < g;
        q = n && 0 <= q && q < f;
        if (r || q) {
          !r || q && m.g < n.g ? (m = {g:n.g, s:n.s.slice(0)}, Kb(m.s, void 0, !0)) : (m.g++, Kb(m.s, !0, void 0));
          q = Jb(c, m, b, a, h);
          if (m.g + 1 >= g && q + 1 >= f) {
            h = Lb(c, m.s, b, a);
            break a;
          }
          e[h] = m;
        } else {
          e[h] = void 0;
        }
      }
      l++;
      h = void 0;
    }
    if (h) {
      return h;
    }
  }
}
function Kb(a, b, c) {
  var g = a[a.length - 1];
  g && g.m === b && g.v === c ? a[a.length - 1] = {count:g.count + 1, m:b, v:c} : a.push({count:1, m:b, v:c});
}
function Jb(a, b, c, g, f) {
  var l = c.length, d = g.length, e = b.g;
  f = e - f;
  for (var h = 0; e + 1 < l && f + 1 < d && a.equals(c[e + 1], g[f + 1]);) {
    e++, f++, h++;
  }
  h && b.s.push({count:h});
  b.g = e;
  return f;
}
Gb.prototype.equals = function(a, b) {
  return a === b;
};
function Ib(a) {
  for (var b = [], c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
Gb.prototype.join = function(a) {
  return a.join("");
};
function Lb(a, b, c, g) {
  for (var f = 0, l = b.length, d = 0, e = 0; f < l; f++) {
    var h = b[f];
    if (h.v) {
      h.value = a.join(g.slice(e, e + h.count)), e += h.count, f && b[f - 1].m && (h = b[f - 1], b[f - 1] = b[f], b[f] = h);
    } else {
      if (h.m) {
        h.value = a.join(c.slice(d, d + h.count));
      } else {
        var m = c.slice(d, d + h.count);
        m = m.map(function(n, q) {
          q = g[e + q];
          return q.length > n.length ? q : n;
        });
        h.value = a.join(m);
      }
      d += h.count;
      h.m || (e += h.count);
    }
  }
  c = b[l - 1];
  1 < l && "string" === typeof c.value && (c.m || c.v) && a.equals("", c.value) && (b[l - 2].value += c.value, b.pop());
  return b;
}
;var Mb = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Nb = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function Y(a, b) {
  return (b = Mb[b]) ? "\u001b[" + b + "m" + a + "\u001b[0m" : a;
}
function Ob(a) {
  return (a = Nb[a]) ? "\u001b[" + a + "m \u001b[0m" : " ";
}
function Pb(a, b) {
  return Hb(a, b).map(function(c) {
    var g = c.v, f = c.value, l = f.split(" ");
    return c.m ? l.map(function(d) {
      return d.replace(/\n$/mg, "\u23ce\n");
    }).map(function(d) {
      return Y(d, "green");
    }).join(Ob("green")) : g ? l.map(function(d) {
      return d.replace(/\n$/mg, "\u23ce\n");
    }).map(function(d) {
      return Y(d, "red");
    }).join(Ob("red")) : Y(f, "grey");
  }).join("");
}
;function Qb(a, b) {
  for (var c = [], g = 1; g < arguments.length; ++g) {
    c[g - 1] = arguments[g];
  }
  var f = -1;
  return a.replace(/%s/g, function() {
    f++;
    return c[f];
  });
}
function Rb(a, b) {
  function c(d, e) {
    if (d instanceof Date && e instanceof Date) {
      var h = d.getTime() != e.getTime() ? !1 : void 0;
      return h ? "" : f(d, e);
    }
    if (d instanceof Date && !(e instanceof Date) || !(d instanceof Date) && e instanceof Date || Array.isArray(d) && !Array.isArray(e) || !Array.isArray(d) && Array.isArray(e)) {
      return f(d, e);
    }
    if (Z(d) && Z(e) || !Z(d) && Z(e) || Z(d) && !Z(e)) {
      return d != e ? f(d, e) : "";
    }
    if (d.constructor && !e.constructor) {
      return f(d.constructor.name, e);
    }
    if (!d.constructor && e.constructor) {
      return f(d, e.constructor.name);
    }
    if (d.constructor && e.constructor) {
      if (d.constructor.name != e.constructor.name) {
        return f(d.constructor.name, e.constructor.name);
      }
      h = d.valueOf();
      var m = e.valueOf();
      if (Z(h) && Z(m) && h != m) {
        return f(h, m);
      }
    }
    if (Array.isArray(d) && Array.isArray(e)) {
      var n;
      h = d.map(function(p, v) {
        n = v;
        (p = c(p, e[v])) && (p = g("[" + v + "]") + "\n" + p);
        return p;
      }).filter(Boolean);
      m = e.slice(n + 1).map(function(p, v) {
        return g("[" + (n + v + 1) + "]") + "\n" + f(void 0, p);
      });
      return [].concat(k.f(h), k.f(m)).join("\n");
    }
    if ("object" == typeof d && "object" == typeof e) {
      var q = [], r = [], t = [];
      Object.keys(d).forEach(function(p) {
        p in e ? t.push(p) : r.push(p);
      });
      Object.keys(e).forEach(function(p) {
        p in d || q.push(p);
      });
      h = r.map(function(p) {
        return f("" + p + (": " + Sb(d[p])));
      });
      m = q.map(function(p) {
        return f(void 0, p + ": " + Sb(e[p]));
      });
      var u = t.map(function(p) {
        l++;
        var v = c(d[p], e[p]), B = "";
        v && (B += g(Array.isArray(d[p]) && Array.isArray(e[p]) ? p + ".Array" : p), B += "\n" + v);
        l--;
        return B;
      }).filter(Boolean);
      return [].concat(k.f(h), k.f(m), k.f(u)).join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", d, e);
  }
  function g(d) {
    var e = " ".repeat(2 * l);
    return Qb("%s%s", e, d);
  }
  function f(d, e) {
    var h = " ".repeat(2 * l);
    e = void 0 !== e ? Y("+ " + Sb(e), "green") : null;
    d = void 0 !== d ? Y("- " + Sb(d), "red") : null;
    var m = [];
    d && m.push(Qb("%s%s", h, d));
    e && m.push(Qb("%s%s", h, e));
    return m.join("\n");
  }
  var l = 0;
  return c(a, b);
}
function Z(a) {
  return null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a);
}
function Sb(a) {
  return Array.isArray(a) ? "Array[" + a.toString() + "]" : a && a.toString ? a.toString() : "" + a;
}
;function Tb(a, b, c, g) {
  b = void 0 === b ? [] : b;
  c = void 0 === c ? [] : c;
  g = void 0 === g ? {} : g;
  var f, l, d, e, h, m, n, q, r, t;
  return k.h(function(u) {
    switch(u.b) {
      case 1:
        f = {stdio:"pipe", execArgv:[]};
        if ("string" == typeof a) {
          return u.return({V:a, args:b, options:f});
        }
        l = a;
        d = l.module;
        e = l.getArgs;
        h = l.options;
        m = l.getOptions;
        if (!e) {
          n = b;
          u.j(2);
          break;
        }
        return I(u, e.call.apply(e, [g, b].concat(k.f(c))), 3);
      case 3:
        n = u.c;
      case 2:
        q = n;
        r = f;
        if (h) {
          r = Object.assign({}, f, h);
          u.j(4);
          break;
        }
        if (!m) {
          u.j(4);
          break;
        }
        return I(u, m.call.apply(m, [g].concat(k.f(c))), 6);
      case 6:
        t = u.c, r = Object.assign({}, f, t);
      case 4:
        return u.return({V:d, args:q, options:r});
    }
  });
}
function Ub(a, b, c) {
  try {
    if ("string" == typeof b) {
      try {
        Fa(a, b);
      } catch (d) {
        var g = Pb(b, a);
        console.log(g);
        throw d;
      }
    } else {
      if (b) {
        var f = JSON.parse(a);
        try {
          Da(f, b, void 0);
        } catch (d) {
          var l = Rb(b, f);
          d.message = [d.message, l].filter(Boolean).join("\n");
          throw d;
        }
      }
    }
  } catch (d) {
    throw c && (d.property = c), d;
  }
}
;function Vb(a) {
  var b = ["q", "a"];
  var c = void 0 === c ? !1 : c;
  var g = [];
  a.replace(/(['"])?([\s\S]+?)\1(\s+|$)/g, function(f, l) {
    for (var d = [], e = 1; e < arguments.length; ++e) {
      d[e - 1] = arguments[e];
    }
    e = d[d.length - 2];
    e = c ? {position:e} : {};
    d = d.slice(0, d.length - 2).reduce(function(h, m, n) {
      n = b[n];
      if (!n || void 0 === m) {
        return h;
      }
      h[n] = m;
      return h;
    }, e);
    g.push(d);
  });
  return g;
}
;function Wb(a) {
  return Vb(a).map(function(b) {
    return b.a;
  });
}
;function Xb(a) {
  var b, c, g, f, l, d, e, h, m, n, q, r, t, u, p, v, B, y, A, z, F, C, x, D, E, T, L, N, H, $a, O, ab, bb;
  return k.h(function(G) {
    switch(G.b) {
      case 1:
        return b = a, c = b.forkConfig, g = b.input, f = void 0 === b.props ? {} : b.props, l = void 0 === b.contexts ? [] : b.contexts, d = g ? Wb(g) : [], I(G, Tb(c, d, l, Object.assign({}, f, {input:g})), 2);
      case 2:
        e = G.c;
        h = e.V;
        m = e.args;
        n = e.options;
        if (!h) {
          throw Error("Please specify a module to fork");
        }
        var M = sb(h, m, n), P = Eb(M);
        M.promise = P;
        M.spawnCommand = M.spawnargs.join(" ");
        q = M;
        r = q.promise;
        t = q.stdout;
        u = q.stdin;
        p = q.stderr;
        v = c;
        B = void 0 === v.includeAnswers ? !0 : v.includeAnswers;
        y = v.log;
        A = v.inputs;
        z = v.stderrInputs;
        F = void 0 === v.stripAnsi ? !0 : v.stripAnsi;
        C = v.preprocess;
        x = new Va;
        D = new Va;
        !0 === y ? (x.pipe(process.stdout), D.pipe(process.stderr)) : y && (y.stdout && x.pipe(y.stdout), y.stderr && D.pipe(y.stderr));
        E = B && A;
        T = B && z;
        E && (L = new X({rs:x}));
        T && (N = new X({rs:D}));
        H = x;
        $a = D;
        Fb(t, u, A, H);
        Fb(p, u, z, $a);
        return I(G, r, 3);
      case 3:
        O = G.c;
        if (!E) {
          G.j(4);
          break;
        }
        L.end();
        return I(G, L.promise, 5);
      case 5:
        ab = G.c, Object.assign(O, {stdout:ab});
      case 4:
        if (!T) {
          G.j(6);
          break;
        }
        N.end();
        return I(G, N.promise, 7);
      case 7:
        bb = G.c, Object.assign(O, {stderr:bb});
      case 6:
        M = O.code;
        var Q = O.stdout, R = O.stderr;
        if ("object" == typeof C) {
          var W = C.stdout;
          P = C.stderr;
        } else {
          "function" == typeof C && (W = P = C);
        }
        Q = Q.replace(/\r?\n$/, "");
        R = R.replace(/\r?\n$/, "");
        Q = F ? Q.replace(/\033\[.*?m/g, "") : Q;
        R = F ? R.replace(/\033\[.*?m/g, "") : R;
        W = W ? W(Q) : Q;
        P = P ? P(R) : R;
        Ub(W, f.stdout, "stdout");
        Ub(P, f.stderr, "stderr");
        if (f.code && M != f.code) {
          throw G = Error("Fork exited with code " + M + " != " + f.code), G.J = "code", G;
        }
        return G.return(O);
    }
  });
}
;function Yb(a) {
  var b = a.input, c = a.error, g = a.getThrowsConfig, f = a.getTransform, l = a.getResults, d = a.expected, e = a.assertResults, h = a.props, m = a.mapActual, n = a.getReadable, q = a.forkConfig;
  return function(r) {
    for (var t = [], u = 0; u < arguments.length; ++u) {
      t[u] = arguments[u];
    }
    var p, v, B, y, A, z, F, C;
    return k.h(function(x) {
      switch(x.b) {
        case 1:
          p = Object.assign({}, {input:b}, h);
          if (c) {
            if (!g) {
              throw Error('No "getThrowsConfig" function is given.');
            }
            F = g.call.apply(g, [p].concat(k.f(t)));
            return I(x, Zb(F, c), 19);
          }
          if (f) {
            return $b(d), I(x, f.call.apply(f, [p].concat(k.f(t))), 17);
          }
          if (n) {
            return $b(d), I(x, n.call.apply(n, [p].concat(k.f(t))), 15);
          }
          if (q) {
            return h.inputs && (q.inputs = ac(h.inputs)), I(x, Xb({forkConfig:q, input:b, props:h, contexts:t}), 12);
          }
          if (!l) {
            throw Error("Nothing was tested.");
          }
          return I(x, l.call.apply(l, [p].concat(k.f(t))), 11);
        case 11:
          v = x.c;
          x.j(3);
          break;
        case 12:
          B = x.c;
          if (!l) {
            y = B;
            x.j(13);
            break;
          }
          return I(x, l.call.apply(l, [p].concat(k.f(t))), 14);
        case 14:
          y = x.c;
        case 13:
          v = y;
          x.j(3);
          break;
        case 15:
          return A = x.c, I(x, kb(A), 16);
        case 16:
          v = x.c;
          x.j(3);
          break;
        case 17:
          return z = x.c, z.end(b), I(x, kb(z), 18);
        case 18:
          v = x.c;
          x.j(3);
          break;
        case 19:
          return x.return();
        case 3:
          if (void 0 !== d) {
            if (C = m(v), "string" != typeof d) {
              try {
                Da(C, d, void 0);
              } catch (D) {
                throw x = qb(d, C), D.message = [D.message, x].filter(Boolean).join("\n"), D;
              }
            } else {
              if ("string" != (typeof C).toLowerCase()) {
                throw Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".');
              }
              try {
                Ea(C, d);
              } catch (D) {
                throw x = ta(d, C), console.log(x), D.J = "expected", D;
              }
            }
          }
          if (e) {
            return I(x, e.call(p, v, h), 0);
          }
          x.j(0);
      }
    });
  };
}
function $b(a) {
  if (void 0 === a) {
    throw Error("No expected output was given.");
  }
}
function ac(a) {
  return a.split("\n").map(function(b) {
    var c = k.w(b.split(/: +/));
    b = c.next().value;
    c = c.next().value;
    return [new RegExp(b), c];
  });
}
function Zb(a, b) {
  return k.h(function(c) {
    return I(c, nb(Object.assign({}, a, {message:b})), 0);
  });
}
;function bc(a, b, c) {
  var g = a.startsWith("!"), f = g ? a.replace(/^!/, "") : a;
  try {
    var l = ua(f);
  } catch (h) {
    if ("ENOENT" != h.code) {
      throw h;
    }
    f = cc(f, c);
    l = ua(f);
  }
  if (l.isFile()) {
    var d = dc(f, b);
  } else {
    if (l.isDirectory()) {
      var e = wa(f);
      d = e.reduce(function(h, m) {
        var n = Ba(f, m);
        m = m.replace(/\.\w+?$/, "");
        var q = {};
        return Object.assign({}, h, (q[m] = bc(n, b, e), q));
      }, {});
    }
  }
  return g ? (c = {}, c[a] = d, c) : d;
}
function cc(a, b) {
  var c = Aa(a);
  b = (b || wa(c)).filter(function(g) {
    return g.startsWith(za(a) + ".");
  });
  if (1 < b.length) {
    throw Error("Could not resolve the result path " + a + ", possible files: " + b.join(", ") + ".");
  }
  if (b.length) {
    a = Ba(c, b[0]);
  } else {
    throw Error("Could not resolve the result path " + a + ".");
  }
  return a;
}
function ec(a, b) {
  return Object.keys(a).reduce(function(c, g) {
    try {
      var f = b.includes(g) ? JSON.parse(a[g]) : a[g];
      c[g] = f;
      return c;
    } catch (l) {
      throw Error('Could not parse JSON property "' + g + '": ' + l.message + ".");
    }
  }, {});
}
function dc(a, b) {
  if (!b) {
    throw Error('No configuration is given. A config should at least contain either a "getThrowsConfig", "getResults", "getTransform" or "getReadable" functions.');
  }
  var c = b.context, g = b.persistentContext, f = b.getResults, l = b.getTransform, d = b.getReadable, e = b.getThrowsConfig, h = void 0 === b.mapActual ? function(r) {
    return r;
  } : b.mapActual, m = b.assertResults, n = void 0 === b.jsonProps ? [] : b.jsonProps, q = b.fork;
  return Ra({path:a, splitRe:b.splitRe, propEndRe:b.propEndRe, propStartRe:b.propStartRe}).reduce(function(r, t) {
    var u = Object.assign({}, t), p = t.name, v = t.input, B = t.error, y = t.W;
    t = (delete u.name, delete u.input, delete u.error, delete u.W, u);
    var A;
    p in r && (A = 'Repeated use of the test name "' + p + '".');
    try {
      var z = ec(t, n), F = Object.assign({}, z);
      var C = z.expected;
      var x = (delete F.expected, F);
    } catch (E) {
      A = E.message;
    }
    var D;
    A ? D = function() {
      throw Error(A);
    } : D = Yb({input:v, error:B, getThrowsConfig:e, getTransform:l, getReadable:d, getResults:f, expected:C, assertResults:m, props:x, mapActual:h, forkConfig:q});
    r[p] = function(E) {
      for (var T = [], L = 0; L < arguments.length; ++L) {
        T[L] = arguments[L];
      }
      var N;
      return k.h(function(H) {
        if (1 == H.b) {
          return H.l = 2, I(H, D.apply(null, k.f(T)), 4);
        }
        if (2 != H.b) {
          H.b = 0, H.l = 0;
        } else {
          return N = da(H), process.env.DEBUG && console.log(K(N.stack, "red")), I(H, y(N), 0);
        }
      });
    };
    return r;
  }, Object.assign({}, c ? {context:c} : {}, g ? {persistentContext:g} : {}));
}
;DEPACK_EXPORT = bc;


module.exports = DEPACK_EXPORT
//# sourceMappingURL=index.js.map