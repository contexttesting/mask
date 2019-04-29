             
let DEPACK_EXPORT;
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const readline = require('readline');
const stream = require('stream');
const os = require('os');
const child_process = require('child_process');var l = l || {};
l.scope = {};
l.O = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
};
l.Z = function(a) {
  return {next:l.O(a)};
};
l.w = function(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : l.Z(a);
};
l.K = function(a) {
  for (var b, c = []; !(b = a.next()).done;) {
    c.push(b.value);
  }
  return c;
};
l.f = function(a) {
  return a instanceof Array ? a : l.K(l.w(a));
};
l.N = !1;
l.ja = !1;
l.ka = !1;
l.la = !1;
l.ea = l.N || "function" == typeof Object.create ? Object.create : function(a) {
  function b() {
  }
  b.prototype = a;
  return new b;
};
l.ia = function() {
  var a = {Y:!0}, b = {};
  try {
    return b.__proto__ = a, b.Y;
  } catch (c) {
  }
  return !1;
};
l.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : l.ia() ? function(a, b) {
  a.__proto__ = b;
  if (a.__proto__ !== b) {
    throw new TypeError(a + " is not extensible");
  }
  return a;
} : null;
l.S = function(a, b) {
  a.prototype = l.ea(b.prototype);
  a.prototype.constructor = a;
  if (l.setPrototypeOf) {
    var c = l.setPrototypeOf;
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
  a.qa = b.prototype;
};
l.aa = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
l.global = l.aa(this);
l.defineProperty = l.N || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
};
l.B = function(a, b) {
  if (b) {
    var c = l.global;
    a = a.split(".");
    for (var g = 0; g < a.length - 1; g++) {
      var f = a[g];
      f in c || (c[f] = {});
      c = c[f];
    }
    a = a[a.length - 1];
    g = c[a];
    b = b(g);
    b != g && null != b && l.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
  }
};
l.W = !1;
l.B("Promise", function(a) {
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
  if (a && !l.W) {
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
  var f = l.global.setTimeout;
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
    return {resolve:d(this.da), reject:d(this.l)};
  };
  b.prototype.da = function(d) {
    if (d === this) {
      this.l(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (d instanceof b) {
        this.ga(d);
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
    "function" == typeof e ? this.ha(e, d) : this.u(d);
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
        k.c(this.b[d]);
      }
      this.b = null;
    }
  };
  var k = new c;
  b.prototype.ga = function(d) {
    var e = this.i();
    d.G(e.resolve, e.reject);
  };
  b.prototype.ha = function(d, e) {
    var h = this.i();
    try {
      d.call(e, h.resolve, h.reject);
    } catch (m) {
      h.reject(m);
    }
  };
  b.prototype.then = function(d, e) {
    function h(r, t) {
      return "function" == typeof r ? function(v) {
        try {
          m(r(v));
        } catch (q) {
          n(q);
        }
      } : t;
    }
    var m, n, p = new b(function(r, t) {
      m = r;
      n = t;
    });
    this.G(h(d, m), h(e, n));
    return p;
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
    null == this.b ? k.c(h) : this.b.push(h);
  };
  b.resolve = g;
  b.reject = function(d) {
    return new b(function(e, h) {
      h(d);
    });
  };
  b.race = function(d) {
    return new b(function(e, h) {
      for (var m = l.w(d), n = m.next(); !n.done; n = m.next()) {
        g(n.value).G(e, h);
      }
    });
  };
  b.all = function(d) {
    var e = l.w(d), h = e.next();
    return h.done ? g([]) : new b(function(m, n) {
      function p(v) {
        return function(q) {
          r[v] = q;
          t--;
          0 == t && m(r);
        };
      }
      var r = [], t = 0;
      do {
        r.push(void 0), t++, g(h.value).G(p(r.length - 1), n), h = e.next();
      } while (!h.done);
    });
  };
  return b;
});
l.X = "jscomp_symbol_";
l.M = function() {
  l.M = function() {
  };
  l.global.Symbol || (l.global.Symbol = l.Symbol);
};
function aa(a, b) {
  this.b = a;
  l.defineProperty(this, "description", {configurable:!0, writable:!0, value:b});
}
aa.prototype.toString = function() {
  return this.b;
};
l.Symbol = function() {
  function a(c) {
    if (this instanceof a) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new aa(l.X + (c || "") + "_" + b++, c);
  }
  var b = 0;
  return a;
}();
l.I = function() {
  l.M();
  var a = l.global.Symbol.iterator;
  a || (a = l.global.Symbol.iterator = l.global.Symbol("Symbol.iterator"));
  "function" != typeof Array.prototype[a] && l.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return l.ca(l.O(this));
  }});
  l.I = function() {
  };
};
l.ba = function() {
  l.M();
  var a = l.global.Symbol.asyncIterator;
  a || (a = l.global.Symbol.asyncIterator = l.global.Symbol("Symbol.asyncIterator"));
  l.ba = function() {
  };
};
l.ca = function(a) {
  l.I();
  a = {next:a};
  a[l.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
l.L = {};
l.L.$ = function(a) {
  if (!(a instanceof Object)) {
    throw new TypeError("Iterator result " + a + " is not an object");
  }
};
function x() {
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
x.prototype.D = function(a) {
  this.c = a;
};
function ca(a, b) {
  a.i = {R:b, T:!0};
  a.b = a.l || a.o;
}
x.prototype.return = function(a) {
  this.i = {return:a};
  this.b = this.o;
};
function J(a, b, c) {
  a.b = c;
  return {value:b};
}
x.prototype.j = function(a) {
  this.b = a;
};
function da(a) {
  a.l = 0;
  var b = a.i.R;
  a.i = null;
  return b;
}
function ea(a) {
  var b = a.F.splice(0)[0];
  (b = a.i = a.i || b) ? b.T ? a.b = a.l || a.o : void 0 != b.j && a.o < b.j ? (a.b = b.j, a.i = null) : a.b = a.o : a.b = 0;
}
function fa(a) {
  this.b = new x;
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
  return M(a);
}
function ia(a, b, c, g) {
  try {
    var f = b.call(a.b.u, c);
    l.L.$(f);
    if (!f.done) {
      return a.b.A = !1, f;
    }
    var k = f.value;
  } catch (d) {
    return a.b.u = null, ca(a.b, d), M(a);
  }
  a.b.u = null;
  g.call(a.b, k);
  return M(a);
}
function M(a) {
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
    if (b.T) {
      throw b.R;
    }
    return {value:b.return, done:!0};
  }
  return {value:void 0, done:!0};
}
function ja(a) {
  this.next = function(b) {
    ba(a.b);
    a.b.u ? b = ia(a, a.b.u.next, b, a.b.D) : (a.b.D(b), b = M(a));
    return b;
  };
  this.throw = function(b) {
    ba(a.b);
    a.b.u ? b = ia(a, a.b.u["throw"], b, a.b.D) : (ca(a.b, b), b = M(a));
    return b;
  };
  this.return = function(b) {
    return ha(a, b);
  };
  l.I();
  this[Symbol.iterator] = function() {
    return this;
  };
}
l.L.na = function(a, b) {
  b = new ja(new fa(b));
  l.setPrototypeOf && l.setPrototypeOf(b, a.prototype);
  return b;
};
l.P = function(a) {
  function b(g) {
    return a.next(g);
  }
  function c(g) {
    return a.throw(g);
  }
  return new Promise(function(g, f) {
    function k(d) {
      d.done ? g(d.value) : Promise.resolve(d.value).then(b, c).then(k, f);
    }
    k(a.next());
  });
};
l.ma = function(a) {
  return l.P(a());
};
l.h = function(a) {
  return l.P(new ja(new fa(a)));
};
l.B("Object.is", function(a) {
  return a ? a : function(b, c) {
    return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c;
  };
});
l.B("Array.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    var g = this;
    g instanceof String && (g = String(g));
    var f = g.length;
    c = c || 0;
    for (0 > c && (c = Math.max(c + f, 0)); c < f; c++) {
      var k = g[c];
      if (k === b || Object.is(k, b)) {
        return !0;
      }
    }
    return !1;
  };
});
l.H = function(a, b, c) {
  if (null == a) {
    throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
  }
  if (b instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
  }
  return a + "";
};
l.B("String.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    return -1 !== l.H(this, b, "includes").indexOf(b, c || 0);
  };
});
l.B("String.prototype.repeat", function(a) {
  return a ? a : function(b) {
    var c = l.H(this, null, "repeat");
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
l.oa = function(a, b) {
  l.I();
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
l.B("String.prototype.endsWith", function(a) {
  return a ? a : function(b, c) {
    var g = l.H(this, b, "endsWith");
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
l.fa = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
l.assign = "function" == typeof Object.assign ? Object.assign : function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var g = arguments[c];
    if (g) {
      for (var f in g) {
        l.fa(g, f) && (a[f] = g[f]);
      }
    }
  }
  return a;
};
l.B("Object.assign", function(a) {
  return a || l.assign;
});
l.B("String.prototype.startsWith", function(a) {
  return a ? a : function(b, c) {
    var g = l.H(this, b, "startsWith"), f = g.length, k = b.length;
    c = Math.max(0, Math.min(c | 0, g.length));
    for (var d = 0; d < k && c < f;) {
      if (g[c++] != b[d++]) {
        return !1;
      }
    }
    return d >= k;
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
  var g = b.length, f = a.length, k = 1, d = g + f, e = [{g:-1, s:[]}], h = na(c, e[0], b, a, 0);
  if (e[0].g + 1 >= g && h + 1 >= f) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; k <= d;) {
    a: {
      for (h = -1 * k; h <= k; h += 2) {
        var m = e[h - 1];
        var n = e[h + 1], p = (n ? n.g : 0) - h;
        m && (e[h - 1] = void 0);
        var r = m && m.g + 1 < g;
        p = n && 0 <= p && p < f;
        if (r || p) {
          !r || p && m.g < n.g ? (m = {g:n.g, s:n.s.slice(0)}, oa(m.s, void 0, !0)) : (m.g++, oa(m.s, !0, void 0));
          p = na(c, m, b, a, h);
          if (m.g + 1 >= g && p + 1 >= f) {
            h = pa(c, m.s, b, a);
            break a;
          }
          e[h] = m;
        } else {
          e[h] = void 0;
        }
      }
      k++;
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
  var k = c.length, d = g.length, e = b.g;
  f = e - f;
  for (var h = 0; e + 1 < k && f + 1 < d && a.equals(c[e + 1], g[f + 1]);) {
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
  for (var f = 0, k = b.length, d = 0, e = 0; f < k; f++) {
    var h = b[f];
    if (h.v) {
      h.value = a.join(g.slice(e, e + h.count)), e += h.count, f && b[f - 1].m && (h = b[f - 1], b[f - 1] = b[f], b[f] = h);
    } else {
      if (h.m) {
        h.value = a.join(c.slice(d, d + h.count));
      } else {
        var m = c.slice(d, d + h.count);
        m = m.map(function(n, p) {
          p = g[e + p];
          return p.length > n.length ? p : n;
        });
        h.value = a.join(m);
      }
      d += h.count;
      h.m || (e += h.count);
    }
  }
  c = b[k - 1];
  1 < k && "string" === typeof c.value && (c.m || c.v) && a.equals("", c.value) && (b[k - 2].value += c.value, b.pop());
  return b;
}
;var qa = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, ra = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function N(a, b) {
  return (b = qa[b]) ? "\u001b[" + b + "m" + a + "\u001b[0m" : a;
}
function sa(a) {
  return (a = ra[a]) ? "\u001b[" + a + "m \u001b[0m" : " ";
}
function ta(a, b) {
  return la(a, b).map(function(c) {
    var g = c.v, f = c.value, k = f.split(" ");
    return c.m ? k.map(function(d) {
      return d.replace(/\n$/mg, "\u23ce\n");
    }).map(function(d) {
      return N(d, "green");
    }).join(sa("green")) : g ? k.map(function(d) {
      return d.replace(/\n$/mg, "\u23ce\n");
    }).map(function(d) {
      return N(d, "red");
    }).join(sa("red")) : N(f, "grey");
  }).join("");
}
;var T = fs, ua = T.lstatSync, va = T.readFileSync, wa = T.readdirSync, xa = T.writeFileSync;
var ya = path, za = ya.basename, Aa = ya.dirname, Ba = ya.join;
var Ca = assert, Da = Ca.deepStrictEqual, Ea = Ca.equal, Fa = Ca.strictEqual;
function Ga(a, b) {
  var c = ["preValue", "key", "newLine", "value"], g = !0;
  g = void 0 === g ? !1 : g;
  var f = [];
  b.replace(a, function(k, d) {
    for (var e = [], h = 1; h < arguments.length; ++h) {
      e[h - 1] = arguments[h];
    }
    h = e[e.length - 2];
    h = g ? {position:h} : {};
    e = e.slice(0, e.length - 2).reduce(function(m, n, p) {
      p = c[p];
      if (!p || void 0 === n) {
        return m;
      }
      m[p] = n;
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
  var c, g = new Promise(function(f, k) {
    c = Ia(a, b, k);
  });
  return {timeout:c, promise:g};
}
function Ka(a, b, c) {
  var g, f, k;
  return l.h(function(d) {
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
      k = g.timeout;
      d.l = 0;
      d.o = 2;
      return J(d, Promise.race([a, f]), 4);
    }
    if (2 != d.b) {
      return d.return(d.c);
    }
    d.F = [d.i];
    d.l = 0;
    d.o = 0;
    clearTimeout(k);
    return ea(d);
  });
}
;function La(a, b) {
  var c = b = void 0 === b ? {} : b, g = Object.assign({}, c);
  b = c.timeout;
  var f = void 0 === c.password ? !1 : c.password, k = void 0 === c.output ? process.stdout : c.output;
  c = void 0 === c.input ? process.stdin : c.input;
  g = (delete g.timeout, delete g.password, delete g.output, delete g.input, g);
  k = Ha(Object.assign({}, {input:c, output:k}, g));
  if (f) {
    var d = k.output;
    k._writeToOutput = function(e) {
      if (["\r\n", "\n", "\r"].includes(e)) {
        return d.write(e);
      }
      e = e.split(a);
      "2" == e.length ? (d.write(a), d.write("*".repeat(e[1].length))) : d.write("*");
    };
  }
  f = new Promise(k.question.bind(k, a));
  b = b ? Ka(f, b, "reloquent: " + a) : f;
  k.promise = Ma(b, k);
  return k;
}
function Ma(a, b) {
  var c;
  return l.h(function(g) {
    if (1 == g.b) {
      return g.l = 0, g.o = 2, J(g, a, 4);
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
  return l.h(function(f) {
    if (1 == f.b) {
      if ("object" != typeof a) {
        throw Error("Please give an object with questions");
      }
      c = Object.keys(a);
      return J(f, c.reduce(function(k, d) {
        var e, h, m, n, p, r, t, v, q, u, B, C, y;
        return l.h(function(z) {
          switch(z.b) {
            case 1:
              return J(z, k, 2);
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
              }m.text = m.text + (m.text.endsWith("?") ? "" : ":") + " ";
              m.defaultValue && (n = m.defaultValue);
              if (!m.getDefault) {
                z.j(3);
                break;
              }
              return J(z, m.getDefault(), 4);
            case 4:
              p = z.c;
            case 3:
              return r = n || "", n && p && n != p ? r = "\u001b[90m" + n + "\u001b[0m" : n && n == p && (r = ""), t = p || "", v = m.text + (r ? "[" + r + "] " : "") + (t ? "[" + t + "] " : ""), q = La(v, {timeout:b, password:m.password}), u = q.promise, J(z, u, 5);
            case 5:
              C = (B = z.c) || p || m.defaultValue;
              "function" == typeof m.validation && m.validation(C);
              if ("function" != typeof m.postProcess) {
                z.j(6);
                break;
              }
              return J(z, m.postProcess(C), 7);
            case 7:
              C = z.c;
            case 6:
              return y = {}, z.return(Object.assign({}, e, (y[d] = C, y)));
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
  return l.h(function(c) {
    if (1 == c.b) {
      return J(c, Na({question:"Show more (d), skip (s), or update (u): [u]"}, void 0), 2);
    }
    a = c.c;
    b = a.question;
    return c.return(b);
  });
}
function Pa() {
  var a = void 0 === a ? {} : a;
  var b, c, g, f, k, d, e;
  return l.h(function(h) {
    if (1 == h.b) {
      return b = a, c = void 0 === b.defaultYes ? !0 : b.defaultYes, g = b.timeout, f = "Update the result".endsWith("?"), k = (f ? "Update the result".replace(/\?$/, "") : "Update the result") + " (y/n)" + (f ? "?" : ""), J(h, Na({question:{text:k, defaultValue:c ? "y" : "n"}}, g), 2);
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
  c = [{position:0, separator:""}].concat(l.f(c));
  return c.reduce(function(g, f, k, d) {
    var e = f.position;
    f = f.separator;
    var h = f.length;
    k = d[k + 1];
    if (!k) {
      return k = a.slice(e + h), g.push({position:e, separator:f, match:k}), g;
    }
    k = a.slice(e + h, k.position);
    g.push({position:e, separator:f, match:k});
    return g;
  }, []);
}
;function Ra(a) {
  function b(p, r) {
    var t, v, q, u, B, C, y, z, F;
    return l.h(function() {
      t = new RegExp("" + k.source + p + "\r?$");
      v = m.reduce(function(A, w, E) {
        return A ? A : t.test(w) ? E + 1 : A;
      }, null);
      q = Error(r.message);
      u = "Error: " + r.message + "\n    at " + p + " (" + c + ":" + v + ":1)";
      q.stack = u;
      r.property && r.actual && (B = r, C = B.property, y = B.actual, z = B.expected, F = function() {
        var A, w, E, K, L, H, I;
        return l.h(function(D) {
          switch(D.b) {
            case 1:
              A = h[C];
              if (!A) {
                return D.return(!1);
              }
              w = A.start + n;
              E = d.slice(0, w);
              K = d.slice(w + A.length);
              L = "" + E + y + K;
              console.error('Result does not match property "%s"\n  at %s (%s:%s:1)', C, N(p, "blue"), c, v);
              H = !1;
              return J(D, Oa(), 2);
            case 2:
              I = D.c;
              if ("d" != I) {
                I && "u" != I || (H = !0);
                D.j(3);
                break;
              }
              console.log(N("Actual: ", "blue"));
              console.log(y);
              console.log(N("Expected: ", "blue"));
              console.log(z);
              return J(D, Pa(), 4);
            case 4:
              H = D.c;
            case 3:
              if (!H) {
                return D.return(!1);
              }
              n += y.length - A.length;
              return J(D, xa(c, L), 5);
            case 5:
              return d = "" + va(c), D.return(!0);
          }
        });
      }, q.handleUpdate = F);
      throw q;
    });
  }
  var c = a.path, g = void 0 === a.propStartRe ? /\/\*/ : a.propStartRe, f = void 0 === a.propEndRe ? /\/\*\*\// : a.propEndRe, k = a.splitRe;
  k || (k = c.endsWith(".md") ? /^## /gm : /^\/\/ /gm);
  var d = "" + va(c);
  a = k.exec(d);
  if (!a) {
    throw Error(c + " does not contain tests.");
  }
  var e = d.slice(0, a.index).replace(/\n\n$/, "");
  a = d.slice(a.index);
  k.lastIndex = 0;
  var h = {};
  a = Qa(a, k).filter(function(p) {
    return p.match;
  }).map(function(p) {
    var r = p.match, t = p.position, v = p.separator, q = l.w(Sa(r));
    p = q.next().value;
    q = q.next().value;
    var u = l.w(Ta(q, new RegExp("\n" + g.source)));
    q = u.next().value;
    u = u.next().value;
    var B = r.indexOf(u);
    r = q.replace(/\n$/, "");
    q = Ga(new RegExp("(" + g.source + " +(.+) +\\*\\/(\n?))([\\s\\S]*?)\n" + f.source, "g"), u).reduce(function(C, y) {
      var z = y.key, F = y.newLine, A = y.value;
      h[z] = {start:t + B + y.position + y.preValue.length + v.length, length:A.length};
      y = {};
      return Object.assign({}, C, (y[z] = !A && F ? F : A, y));
    }, {});
    return Object.assign({}, {name:p, input:r}, e ? {preamble:e} : {}, q);
  });
  var m = d.split("\n"), n = 0;
  return a.map(function(p) {
    var r = Object.assign({}, p);
    p = p.name;
    r = (delete r.name, r);
    var t = b.bind(null, p);
    return Object.assign({}, r, {name:p, V:t});
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
    return c ? f.replace(Ya, function(k, d) {
      return k.replace(d, d.replace(cb, "~"));
    }) : f;
  }).join("\n");
}
;function eb(a, b, c) {
  c = void 0 === c ? !1 : c;
  return function(g) {
    var f = arguments.callee.caller;
    var k = Wa(2, !0);
    var d = g instanceof Error, e = d ? g.message : g;
    f = ["Error: " + e].concat(l.f(null !== f && a === f || c ? [b] : [k, b])).join("\n");
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
  var k = void 0 === a.C ? fb(!0) : a.C, d = a.proxyError;
  var e = U.call(this, b) || this;
  e.b = [];
  e.J = new Promise(function(h, m) {
    e.on("finish", function() {
      var n;
      g ? n = Buffer.concat(e.b) : n = e.b.join("");
      h(n);
      e.b = [];
    });
    e.once("error", function(n) {
      if (-1 == n.stack.indexOf("\n")) {
        k(n);
      } else {
        var p = db(n.stack);
        n.stack = p;
        d && k(n);
      }
      m(n);
    });
    f && gb(e, f).pipe(e);
  });
  return e;
}
l.S(jb, U);
jb.prototype._write = function(a, b, c) {
  this.b.push(a);
  c();
};
l.global.Object.defineProperties(jb.prototype, {promise:{configurable:!0, enumerable:!0, get:function() {
  return this.J;
}}});
function kb(a) {
  var b = void 0 === b ? {} : b;
  var c, g, f;
  return l.h(function(k) {
    if (1 == k.b) {
      return c = new jb(Object.assign({}, {rs:a}, b, {C:fb(!0)})), g = c.promise, J(k, g, 2);
    }
    f = k.c;
    return k.return(f);
  });
}
;function lb(a, b) {
  return l.h(function(c) {
    return J(c, b(a), 0);
  });
}
function mb(a, b) {
  return l.h(function(c) {
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
    return J(c, lb(a, b), 0);
  });
}
function nb(a) {
  var b, c, g, f, k, d, e, h, m, n, p, r;
  return l.h(function(t) {
    if (1 == t.b) {
      if (!a) {
        throw Error("Config expected.");
      }
      b = fb(!0);
      c = a;
      g = Object.assign({}, c);
      f = c.fn;
      k = void 0 === c.args ? [] : c.args;
      d = c.context;
      e = c.error;
      h = (delete g.fn, delete g.args, delete g.context, delete g.error, g);
      if ("function" != typeof f) {
        throw Error("Function expected.");
      }
      m = Array.isArray(k) ? k : [k];
      t.l = 2;
      return J(t, ob(f, d, m, e, h), 4);
    }
    if (2 != t.b) {
      return n = t.c, t.return(n);
    }
    p = da(t);
    r = b(p);
    throw r;
  });
}
function ob(a, b, c, g, f) {
  var k, d, e;
  return l.h(function(h) {
    switch(h.b) {
      case 1:
        return k = Error(), h.l = 2, b ? J(h, a.call.apply(a, [b].concat(l.f(c))), 5) : J(h, a.apply(null, l.f(c)), 5);
      case 5:
        throw k;
      case 2:
        d = da(h);
        if (d === k) {
          throw e = a.name && "fn" !== a.name ? a.name + " " : "", Error("Function " + e + "should have thrown.");
        }
        if (g && g !== d) {
          throw Error(d + " is not strict equal to " + g + ".");
        }
        return J(h, Object.keys(f).reduce(function(m, n) {
          var p, r;
          return l.h(function(t) {
            if (1 == t.b) {
              return J(t, m, 2);
            }
            p = f[n];
            r = d[n];
            return J(t, mb(r, p), 0);
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
      h = d.map(function(q, u) {
        n = u;
        (q = c(q, e[u])) && (q = g("[" + u + "]") + "\n" + q);
        return q;
      }).filter(Boolean);
      m = e.slice(n + 1).map(function(q, u) {
        return g("[" + (n + u + 1) + "]") + "\n" + f(void 0, q);
      });
      return [].concat(l.f(h), l.f(m)).join("\n");
    }
    if ("object" == typeof d && "object" == typeof e) {
      var p = [], r = [], t = [];
      Object.keys(d).forEach(function(q) {
        q in e ? t.push(q) : r.push(q);
      });
      Object.keys(e).forEach(function(q) {
        q in d || p.push(q);
      });
      h = r.map(function(q) {
        return f("" + q + (": " + rb(d[q])));
      });
      m = p.map(function(q) {
        return f(void 0, q + ": " + rb(e[q]));
      });
      var v = t.map(function(q) {
        k++;
        var u = c(d[q], e[q]), B = "";
        u && (B += g(Array.isArray(d[q]) && Array.isArray(e[q]) ? q + ".Array" : q), B += "\n" + u);
        k--;
        return B;
      }).filter(Boolean);
      return [].concat(l.f(h), l.f(m), l.f(v)).join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", d, e);
  }
  function g(d) {
    var e = " ".repeat(2 * k);
    return pb("%s%s", e, d);
  }
  function f(d, e) {
    var h = " ".repeat(2 * k);
    e = void 0 !== e ? N("+ " + rb(e), "green") : null;
    d = void 0 !== d ? N("- " + rb(d), "red") : null;
    var m = [];
    d && m.push(pb("%s%s", h, d));
    e && m.push(pb("%s%s", h, e));
    return m.join("\n");
  }
  var k = 0;
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
    return c ? f.replace(ub, function(k, d) {
      return k.replace(d, d.replace(wb, "~"));
    }) : f;
  }).join("\n");
}
;function yb(a, b, c) {
  c = void 0 === c ? !1 : c;
  return function(g) {
    var f = arguments.callee.caller;
    var k = tb(2, !0);
    var d = g instanceof Error, e = d ? g.message : g;
    f = ["Error: " + e].concat(l.f(null !== f && a === f || c ? [b] : [k, b])).join("\n");
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
  var k = void 0 === a.C ? zb(!0) : a.C, d = a.proxyError;
  var e = U.call(this, b) || this;
  e.b = [];
  e.J = new Promise(function(h, m) {
    e.on("finish", function() {
      var n;
      g ? n = Buffer.concat(e.b) : n = e.b.join("");
      h(n);
      e.b = [];
    });
    e.once("error", function(n) {
      if (-1 == n.stack.indexOf("\n")) {
        k(n);
      } else {
        var p = xb(n.stack);
        n.stack = p;
        d && k(n);
      }
      m(n);
    });
    f && Ab(e, f).pipe(e);
  });
  return e;
}
l.S(X, U);
X.prototype._write = function(a, b, c) {
  this.b.push(a);
  c();
};
l.global.Object.defineProperties(X.prototype, {promise:{configurable:!0, enumerable:!0, get:function() {
  return this.J;
}}});
function Db(a) {
  var b = void 0 === b ? {} : b;
  var c, g, f;
  return l.h(function(k) {
    if (1 == k.b) {
      return c = new X(Object.assign({}, {rs:a}, b, {C:zb(!0)})), g = c.promise, J(k, g, 2);
    }
    f = k.c;
    return k.return(f);
  });
}
;function Eb(a) {
  var b, c, g, f, k, d;
  return l.h(function(e) {
    if (1 == e.b) {
      return b = l, c = b.w, J(e, Promise.all([new Promise(function(h, m) {
        a.on("error", m).on("exit", function(n) {
          h(n);
        });
      }), a.stdout ? Db(a.stdout) : void 0, a.stderr ? Db(a.stderr) : void 0]), 2);
    }
    g = c.call(b, e.c);
    f = g.next().value;
    k = g.next().value;
    d = g.next().value;
    return e.return({code:f, stdout:k, stderr:d});
  });
}
;function Fb(a, b, c, g) {
  c = void 0 === c ? [] : c;
  if (g = void 0 === g ? null : g) {
    a.on("data", function(e) {
      return g.write(e);
    });
  }
  c = l.w(c);
  var f = c.next().value, k = l.K(c);
  if (f) {
    var d = function(e) {
      var h = l.w(f), m = h.next().value;
      h = h.next().value;
      m.test(e) && (e = h + "\n", g && g.write(e), b.write(e), e = l.w(k), f = e.next().value, k = l.K(e), f || a.removeListener("data", d));
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
  var g = b.length, f = a.length, k = 1, d = g + f, e = [{g:-1, s:[]}], h = Jb(c, e[0], b, a, 0);
  if (e[0].g + 1 >= g && h + 1 >= f) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; k <= d;) {
    a: {
      for (h = -1 * k; h <= k; h += 2) {
        var m = e[h - 1];
        var n = e[h + 1], p = (n ? n.g : 0) - h;
        m && (e[h - 1] = void 0);
        var r = m && m.g + 1 < g;
        p = n && 0 <= p && p < f;
        if (r || p) {
          !r || p && m.g < n.g ? (m = {g:n.g, s:n.s.slice(0)}, Kb(m.s, void 0, !0)) : (m.g++, Kb(m.s, !0, void 0));
          p = Jb(c, m, b, a, h);
          if (m.g + 1 >= g && p + 1 >= f) {
            h = Lb(c, m.s, b, a);
            break a;
          }
          e[h] = m;
        } else {
          e[h] = void 0;
        }
      }
      k++;
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
  var k = c.length, d = g.length, e = b.g;
  f = e - f;
  for (var h = 0; e + 1 < k && f + 1 < d && a.equals(c[e + 1], g[f + 1]);) {
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
  for (var f = 0, k = b.length, d = 0, e = 0; f < k; f++) {
    var h = b[f];
    if (h.v) {
      h.value = a.join(g.slice(e, e + h.count)), e += h.count, f && b[f - 1].m && (h = b[f - 1], b[f - 1] = b[f], b[f] = h);
    } else {
      if (h.m) {
        h.value = a.join(c.slice(d, d + h.count));
      } else {
        var m = c.slice(d, d + h.count);
        m = m.map(function(n, p) {
          p = g[e + p];
          return p.length > n.length ? p : n;
        });
        h.value = a.join(m);
      }
      d += h.count;
      h.m || (e += h.count);
    }
  }
  c = b[k - 1];
  1 < k && "string" === typeof c.value && (c.m || c.v) && a.equals("", c.value) && (b[k - 2].value += c.value, b.pop());
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
    var g = c.v, f = c.value, k = f.split(" ");
    return c.m ? k.map(function(d) {
      return d.replace(/\n$/mg, "\u23ce\n");
    }).map(function(d) {
      return Y(d, "green");
    }).join(Ob("green")) : g ? k.map(function(d) {
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
      h = d.map(function(q, u) {
        n = u;
        (q = c(q, e[u])) && (q = g("[" + u + "]") + "\n" + q);
        return q;
      }).filter(Boolean);
      m = e.slice(n + 1).map(function(q, u) {
        return g("[" + (n + u + 1) + "]") + "\n" + f(void 0, q);
      });
      return [].concat(l.f(h), l.f(m)).join("\n");
    }
    if ("object" == typeof d && "object" == typeof e) {
      var p = [], r = [], t = [];
      Object.keys(d).forEach(function(q) {
        q in e ? t.push(q) : r.push(q);
      });
      Object.keys(e).forEach(function(q) {
        q in d || p.push(q);
      });
      h = r.map(function(q) {
        return f("" + q + (": " + Sb(d[q])));
      });
      m = p.map(function(q) {
        return f(void 0, q + ": " + Sb(e[q]));
      });
      var v = t.map(function(q) {
        k++;
        var u = c(d[q], e[q]), B = "";
        u && (B += g(Array.isArray(d[q]) && Array.isArray(e[q]) ? q + ".Array" : q), B += "\n" + u);
        k--;
        return B;
      }).filter(Boolean);
      return [].concat(l.f(h), l.f(m), l.f(v)).join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", d, e);
  }
  function g(d) {
    var e = " ".repeat(2 * k);
    return Qb("%s%s", e, d);
  }
  function f(d, e) {
    var h = " ".repeat(2 * k);
    e = void 0 !== e ? Y("+ " + Sb(e), "green") : null;
    d = void 0 !== d ? Y("- " + Sb(d), "red") : null;
    var m = [];
    d && m.push(Qb("%s%s", h, d));
    e && m.push(Qb("%s%s", h, e));
    return m.join("\n");
  }
  var k = 0;
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
  var f, k, d, e, h, m, n, p, r, t;
  return l.h(function(v) {
    switch(v.b) {
      case 1:
        f = {stdio:"pipe", execArgv:[]};
        if ("string" == typeof a) {
          return v.return({U:a, args:b, options:f});
        }
        k = a;
        d = k.module;
        e = k.getArgs;
        h = k.options;
        m = k.getOptions;
        if (!e) {
          n = b;
          v.j(2);
          break;
        }
        return J(v, e.call.apply(e, [g, b].concat(l.f(c))), 3);
      case 3:
        n = v.c;
      case 2:
        p = n;
        r = f;
        if (h) {
          r = Object.assign({}, f, h);
          v.j(4);
          break;
        }
        if (!m) {
          v.j(4);
          break;
        }
        return J(v, m.call.apply(m, [g].concat(l.f(c))), 6);
      case 6:
        t = v.c, r = Object.assign({}, f, t);
      case 4:
        return v.return({U:d, args:p, options:r});
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
          var k = Rb(b, f);
          d.message = [d.message, k].filter(Boolean).join("\n");
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
  a.replace(/(['"])?([\s\S]+?)\1(\s+|$)/g, function(f, k) {
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
  var b, c, g, f, k, d, e, h, m, n, p, r, t, v, q, u, B, C, y, z, F, A, w, E, K, L, H, I, D, $a, P, ab, bb;
  return l.h(function(G) {
    switch(G.b) {
      case 1:
        return b = a, c = b.forkConfig, g = b.input, f = void 0 === b.props ? {} : b.props, k = void 0 === b.contexts ? [] : b.contexts, d = g ? Wb(g) : [], J(G, Tb(c, d, k, Object.assign({}, f, {input:g})), 2);
      case 2:
        e = G.c;
        h = e.U;
        m = e.args;
        n = e.options;
        if (!h) {
          throw Error("Please specify a module to fork");
        }
        var O = sb(h, m, n), Q = Eb(O);
        O.promise = Q;
        O.spawnCommand = O.spawnargs.join(" ");
        p = O;
        r = p.promise;
        t = p.stdout;
        v = p.stdin;
        q = p.stderr;
        u = c;
        B = void 0 === u.includeAnswers ? !0 : u.includeAnswers;
        C = u.log;
        y = u.inputs;
        z = u.stderrInputs;
        F = void 0 === u.stripAnsi ? !0 : u.stripAnsi;
        A = u.preprocess;
        w = new Va;
        E = new Va;
        !0 === C ? (w.pipe(process.stdout), E.pipe(process.stderr)) : C && (C.stdout && w.pipe(C.stdout), C.stderr && E.pipe(C.stderr));
        K = B && y;
        L = B && z;
        K && (H = new X({rs:w}));
        L && (I = new X({rs:E}));
        D = w;
        $a = E;
        Fb(t, v, y, D);
        Fb(q, v, z, $a);
        return J(G, r, 3);
      case 3:
        P = G.c;
        if (!K) {
          G.j(4);
          break;
        }
        H.end();
        return J(G, H.promise, 5);
      case 5:
        ab = G.c, Object.assign(P, {stdout:ab});
      case 4:
        if (!L) {
          G.j(6);
          break;
        }
        I.end();
        return J(G, I.promise, 7);
      case 7:
        bb = G.c, Object.assign(P, {stderr:bb});
      case 6:
        O = P.code;
        var R = P.stdout, S = P.stderr;
        if ("object" == typeof A) {
          var W = A.stdout;
          Q = A.stderr;
        } else {
          "function" == typeof A && (W = Q = A);
        }
        R = R.replace(/\r?\n$/, "");
        S = S.replace(/\r?\n$/, "");
        R = F ? R.replace(/\033\[.*?m/g, "") : R;
        S = F ? S.replace(/\033\[.*?m/g, "") : S;
        W = W ? W(R) : R;
        Q = Q ? Q(S) : S;
        Ub(W, f.stdout, "stdout");
        Ub(Q, f.stderr, "stderr");
        if (f.code && O != f.code) {
          throw G = Error("Fork exited with code " + O + " != " + f.code), G.pa = "code", G;
        }
        return G.return(P);
    }
  });
}
;function Yb(a) {
  var b = a.input, c = a.error, g = a.expected, f = a.props, k = a.getThrowsConfig, d = a.getTransform, e = a.getResults, h = a.assertResults, m = a.mapActual, n = a.getReadable, p = a.forkConfig;
  return function(r) {
    for (var t = [], v = 0; v < arguments.length; ++v) {
      t[v] = arguments[v];
    }
    var q, u, B, C, y, z, F, A;
    return l.h(function(w) {
      switch(w.b) {
        case 1:
          q = Object.assign({}, {input:b}, f);
          if (c) {
            if (!k) {
              throw Error('No "getThrowsConfig" function is given.');
            }
            F = k.call.apply(k, [q].concat(l.f(t)));
            return J(w, Zb(F, c), 19);
          }
          if (d) {
            return $b(g), J(w, d.call.apply(d, [q].concat(l.f(t))), 17);
          }
          if (n) {
            return $b(g), J(w, n.call.apply(n, [q].concat(l.f(t))), 15);
          }
          if (p) {
            return f.inputs && (p.inputs = ac(f.inputs)), J(w, Xb({forkConfig:p, input:b, props:f, contexts:t}), 12);
          }
          if (!e) {
            throw Error("Nothing was tested.");
          }
          return J(w, e.call.apply(e, [q].concat(l.f(t))), 11);
        case 11:
          u = w.c;
          w.j(3);
          break;
        case 12:
          B = w.c;
          if (!e) {
            C = B;
            w.j(13);
            break;
          }
          return J(w, e.call.apply(e, [q].concat(l.f(t))), 14);
        case 14:
          C = w.c;
        case 13:
          u = C;
          w.j(3);
          break;
        case 15:
          return y = w.c, J(w, kb(y), 16);
        case 16:
          u = w.c;
          w.j(3);
          break;
        case 17:
          return z = w.c, z.end(b), J(w, kb(z), 18);
        case 18:
          u = w.c;
          w.j(3);
          break;
        case 19:
          return w.return();
        case 3:
          if (void 0 !== g) {
            if (A = m(u), "string" != typeof g) {
              try {
                Da(A, g, void 0);
              } catch (E) {
                throw w = qb(g, A), E.message = [E.message, w].filter(Boolean).join("\n"), E;
              }
            } else {
              if ("string" != (typeof A).toLowerCase()) {
                throw Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".');
              }
              try {
                Ea(A, g);
              } catch (E) {
                throw w = ta(g, A), console.log(w), E.property = "expected", E;
              }
            }
          }
          if (h) {
            return J(w, h.call(q, u, f), 0);
          }
          w.j(0);
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
    var c = l.w(b.split(/: +/));
    b = c.next().value;
    c = c.next().value;
    return [new RegExp(b), c];
  });
}
function Zb(a, b) {
  return l.h(function(c) {
    return J(c, nb(Object.assign({}, a, {message:b})), 0);
  });
}
;function bc(a, b, c) {
  c = void 0 === c ? null : c;
  var g = a.startsWith("!"), f = g ? a.replace(/^!/, "") : a;
  try {
    var k = ua(f);
  } catch (h) {
    if ("ENOENT" != h.code) {
      throw h;
    }
    f = cc(f, c);
    k = ua(f);
  }
  if (k.isFile()) {
    var d = dc(f, b);
  } else {
    if (k.isDirectory()) {
      var e = wa(f);
      d = e.reduce(function(h, m) {
        var n = Ba(f, m);
        m = m.replace(/\.\w+?$/, "");
        var p = {};
        return Object.assign({}, h, (p[m] = bc(n, b, e), p));
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
    } catch (k) {
      throw Error('Could not parse JSON property "' + g + '": ' + k.message + ".");
    }
  }, {});
}
function dc(a, b) {
  if (!b) {
    throw Error('No configuration is given. A config should at least contain either a "getThrowsConfig", "getResults", "getTransform" or "getReadable" functions.');
  }
  var c = b.context, g = b.persistentContext, f = b.getResults, k = b.getTransform, d = b.getReadable, e = b.getThrowsConfig, h = void 0 === b.mapActual ? function(r) {
    return r;
  } : b.mapActual, m = b.assertResults, n = void 0 === b.jsonProps ? [] : b.jsonProps, p = b.fork;
  return Ra({path:a, splitRe:b.splitRe, propEndRe:b.propEndRe, propStartRe:b.propStartRe}).reduce(function(r, t) {
    var v = Object.assign({}, t), q = t.name, u = t.input, B = t.error, C = t.V;
    t = (delete v.name, delete v.input, delete v.error, delete v.V, v);
    var y;
    q in r && (y = 'Repeated use of the test name "' + q + '".');
    try {
      var z = ec(t, n), F = Object.assign({}, z);
      var A = z.expected;
      var w = (delete F.expected, F);
    } catch (K) {
      y = K.message;
    }
    var E;
    y ? E = function() {
      throw Error(y);
    } : E = Yb({input:u, error:B, getThrowsConfig:e, getTransform:k, getReadable:d, getResults:f, expected:A, assertResults:m, props:w, mapActual:h, forkConfig:p});
    r[q] = function(K) {
      for (var L = [], H = 0; H < arguments.length; ++H) {
        L[H] = arguments[H];
      }
      var I;
      return l.h(function(D) {
        if (1 == D.b) {
          return D.l = 2, J(D, E.apply(null, l.f(L)), 4);
        }
        if (2 != D.b) {
          D.b = 0, D.l = 0;
        } else {
          return I = da(D), process.env.DEBUG && console.log(N(I.stack, "red")), J(D, C(I), 0);
        }
      });
    };
    return r;
  }, Object.assign({}, c ? {context:c} : {}, g ? {persistentContext:g} : {}));
}
;DEPACK_EXPORT = bc;


module.exports = DEPACK_EXPORT
//# sourceMappingURL=index.js.map