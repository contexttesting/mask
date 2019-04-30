             
let DEPACK_EXPORT;
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const readline = require('readline');
const stream = require('stream');
const os = require('os');
const child_process = require('child_process');             
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function F(a, b, c) {
  let g = a[a.length - 1];
  g && g.c === b && g.g === c ? a[a.length - 1] = {count:g.count + 1, c:b, g:c} : a.push({count:1, c:b, g:c});
}
function G(a, b, c, g, f) {
  let h = c.length, e = g.length, d = b.b;
  f = d - f;
  let k = 0;
  for (; d + 1 < h && f + 1 < e && a.equals(c[d + 1], g[f + 1]);) {
    d++, f++, k++;
  }
  k && b.f.push({count:k});
  b.b = d;
  return f;
}
function H(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
function aa(a, b) {
  var c = new ba;
  a = H(a.split(""));
  b = H(b.split(""));
  let g = b.length, f = a.length, h = 1, e = g + f, d = [{b:-1, f:[]}];
  var k = G(c, d[0], b, a, 0);
  if (d[0].b + 1 >= g && k + 1 >= f) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; h <= e;) {
    a: {
      for (k = -1 * h; k <= h; k += 2) {
        var l = d[k - 1];
        let m = d[k + 1];
        var n = (m ? m.b : 0) - k;
        l && (d[k - 1] = void 0);
        let q = l && l.b + 1 < g;
        n = m && 0 <= n && n < f;
        if (q || n) {
          !q || n && l.b < m.b ? (l = {b:m.b, f:m.f.slice(0)}, F(l.f, void 0, !0)) : (l.b++, F(l.f, !0, void 0));
          n = G(c, l, b, a, k);
          if (l.b + 1 >= g && n + 1 >= f) {
            k = ca(c, l.f, b, a);
            break a;
          }
          d[k] = l;
        } else {
          d[k] = void 0;
        }
      }
      h++;
      k = void 0;
    }
    if (k) {
      return k;
    }
  }
}
class ba {
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function ca(a, b, c, g) {
  let f = 0, h = b.length, e = 0, d = 0;
  for (; f < h; f++) {
    var k = b[f];
    if (k.g) {
      k.value = a.join(g.slice(d, d + k.count)), d += k.count, f && b[f - 1].c && (k = b[f - 1], b[f - 1] = b[f], b[f] = k);
    } else {
      if (k.c) {
        k.value = a.join(c.slice(e, e + k.count));
      } else {
        let l = c.slice(e, e + k.count);
        l = l.map(function(n, m) {
          m = g[d + m];
          return m.length > n.length ? m : n;
        });
        k.value = a.join(l);
      }
      e += k.count;
      k.c || (d += k.count);
    }
  }
  c = b[h - 1];
  1 < h && "string" === typeof c.value && (c.c || c.g) && a.equals("", c.value) && (b[h - 2].value += c.value, b.pop());
  return b;
}
;const da = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, ea = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function J(a, b) {
  return (b = da[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function K(a) {
  return (a = ea[a]) ? `\x1b[${a}m${" "}\x1b[0m` : " ";
}
function L(a, b) {
  return aa(a, b).map(({c, g, value:f}) => {
    const h = f.split(" ");
    return c ? h.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => J(e, "green")).join(K("green")) : g ? h.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => J(e, "red")).join(K("red")) : J(f, "grey");
  }).join("");
}
;const {lstatSync:M, readFileSync:N, readdirSync:O, writeFileSync:fa} = fs;
const {basename:ha, dirname:ia, join:P} = path;
const {deepStrictEqual:ja, equal:ka, strictEqual:la} = assert;
function ma(a, b) {
  var c = ["preValue", "key", "newLine", "value"];
  const g = [];
  b.replace(a, (f, ...h) => {
    f = {position:h[h.length - 2]};
    h = h.slice(0, h.length - 2).reduce((e, d, k) => {
      k = c[k];
      if (!k || void 0 === d) {
        return e;
      }
      e[k] = d;
      return e;
    }, f);
    g.push(h);
  });
  return g;
}
;const {createInterface:na} = readline;
function oa(a, b, c) {
  return setTimeout(() => {
    const g = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    g.stack = g.message;
    c(g);
  }, b);
}
function pa(a, b) {
  let c;
  const g = new Promise((f, h) => {
    c = oa(a, b, h);
  });
  return {timeout:c, promise:g};
}
async function qa(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {promise:g, timeout:f} = pa(c, b);
  try {
    return await Promise.race([a, g]);
  } finally {
    clearTimeout(f);
  }
}
;function ra(a, b) {
  var c = b = void 0 === b ? {} : b, g = Object.assign({}, c);
  b = c.timeout;
  var f = void 0 === c.password ? !1 : c.password, h = void 0 === c.output ? process.stdout : c.output;
  c = void 0 === c.input ? process.stdin : c.input;
  g = (delete g.timeout, delete g.password, delete g.output, delete g.input, g);
  h = na(Object.assign({}, {input:c, output:h}, g));
  if (f) {
    const e = h.output;
    h._writeToOutput = d => {
      if (["\r\n", "\n", "\r"].includes(d)) {
        return e.write(d);
      }
      d = d.split(a);
      "2" == d.length ? (e.write(a), e.write("*".repeat(d[1].length))) : e.write("*");
    };
  }
  f = new Promise(h.question.bind(h, a));
  b = b ? qa(f, b, `reloquent: ${a}`) : f;
  h.promise = sa(b, h);
  return h;
}
const sa = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function ta(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(c, g) => {
    c = await c;
    var f = a[g];
    switch(typeof f) {
      case "object":
        f = Object.assign({}, f);
        break;
      case "string":
        f = {text:f};
        break;
      default:
        throw Error("A question must be a string or an object.");
    }
    f.text = `${f.text}${f.text.endsWith("?") ? "" : ":"} `;
    var h;
    if (f.defaultValue) {
      var e = f.defaultValue;
    }
    f.getDefault && (h = await f.getDefault());
    let d = e || "";
    e && h && e != h ? d = `\x1b[90m${e}\x1b[0m` : e && e == h && (d = "");
    e = h || "";
    ({promise:e} = ra(`${f.text}${d ? `[${d}] ` : ""}${e ? `[${e}] ` : ""}`, {timeout:b, password:f.password}));
    h = await e || h || f.defaultValue;
    "function" == typeof f.validation && f.validation(h);
    "function" == typeof f.postProcess && (h = await f.postProcess(h));
    return Object.assign({}, c, {[g]:h});
  }, {});
}
;async function ua() {
  const {question:a} = await ta({question:"Show more (d), skip (s), or update (u): [u]"}, void 0);
  return a;
}
async function va() {
  const {defaultYes:a = !0, timeout:b} = {};
  var c = "Update the result".endsWith("?");
  ({question:c} = await ta({question:{text:`${c ? "Update the result".replace(/\?$/, "") : "Update the result"} (y/n)${c ? "?" : ""}`, defaultValue:a ? "y" : "n"}}, b));
  return "y" == c;
}
;const wa = (a, b) => {
  let c = [];
  a.replace(b, (g, f) => {
    c.push({position:f, separator:g});
  });
  c = [{position:0, separator:""}, ...c];
  return c.reduce((g, {position:f, separator:h}, e, d) => {
    var {length:k} = h;
    e = d[e + 1];
    if (!e) {
      return k = a.slice(f + k), g.push({position:f, separator:h, match:k}), g;
    }
    ({position:e} = e);
    k = a.slice(f + k, e);
    g.push({position:f, separator:h, match:k});
    return g;
  }, []);
};
const Aa = a => {
  const {path:b, propStartRe:c = /\/\*/, propEndRe:g = /\/\*\*\//} = a;
  let {splitRe:f} = a;
  f || (f = b.endsWith(".md") ? /^## /gm : /^\/\/ /gm);
  let h = `${N(b)}`;
  a = f.exec(h);
  if (!a) {
    throw Error(`${b} does not contain tests.`);
  }
  const e = h.slice(0, a.index).replace(/\n\n$/, "");
  a = h.slice(a.index);
  f.lastIndex = 0;
  const d = {};
  a = wa(a, f).filter(m => {
    ({match:m} = m);
    return m;
  }).map(m => {
    var {match:q, position:r, separator:p} = m;
    const [t, u] = xa(q), [w, y] = ya(u, new RegExp(`\n${c.source}`)), B = q.indexOf(y);
    m = w.replace(/\n$/, "");
    const A = ma(new RegExp(`(${c.source} +(.+) +\\*\\/(\n?))([\\s\\S]*?)\n${g.source}`, "g"), y).reduce((x, v) => {
      var {preValue:I, key:E, newLine:D, value:C, position:z} = v;
      d[E] = {start:r + B + z + I.length + p.length, length:C.length};
      return Object.assign({}, x, {[E]:!C && D ? D : C});
    }, {});
    return Object.assign({}, {name:t, input:m}, e ? {preamble:e} : {}, A);
  });
  const k = h.split("\n");
  let l = 0;
  const n = async(m, q) => {
    const r = new RegExp(`${f.source}${m}\r?$`), p = k.reduce((u, w, y) => u ? u : r.test(w) ? y + 1 : u, null), t = Error(q.message);
    t.stack = `Error: ${q.message}\n    at ${m} (${b}:${p}:1)`;
    if (q.property && q.actual) {
      const {property:u, actual:w, expected:y} = q;
      t.handleUpdate = async() => {
        const B = d[u];
        if (!B) {
          return !1;
        }
        var A = B.start + l, x = h.slice(0, A);
        A = h.slice(A + B.length);
        x = `${x}${w}${A}`;
        console.error('Result does not match property "%s"\n  at %s (%s:%s:1)', u, J(m, "blue"), b, p);
        A = !1;
        const v = await ua();
        "d" == v ? (console.log(J("Actual: ", "blue")), console.log(w), console.log(J("Expected: ", "blue")), console.log(y), A = await va()) : v && "u" != v || (A = !0);
        if (!A) {
          return !1;
        }
        l += w.length - B.length;
        await fa(b, x);
        h = `${N(b)}`;
        return !0;
      };
    }
    throw t;
  };
  return a.map(m => {
    var q = Object.assign({}, m);
    m = m.name;
    q = (delete q.name, q);
    const r = n.bind(null, m);
    return Object.assign({}, q, {name:m, m:r});
  });
}, ya = (a, b) => {
  const c = a.search(b);
  if (0 > c) {
    throw Error(`Could not process "${a}": propStart re ${b} returned -1`);
  }
  return [a.substr(0, c), a.substr(c + 1)];
}, xa = a => {
  const b = a.indexOf("\n");
  return [a.substr(0, b), a.substr(b + 1)];
};
const {PassThrough:Ba, Writable:Ca} = stream;
const Da = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, Ea = (a, b = !1) => Da(a, 2 + (b ? 1 : 0)), Fa = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:Ga} = os;
const Ha = /\s+at.*(?:\(|\s)(.*)\)?/, Ia = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, Ja = Ga(), Ka = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, g = c.join("|"), f = new RegExp(Ia.source.replace("IGNORED_MODULES", g));
  return a.replace(/\\/g, "/").split("\n").filter(h => {
    h = h.match(Ha);
    if (null === h || !h[1]) {
      return !0;
    }
    h = h[1];
    return h.includes(".app/Contents/Resources/electron.asar") || h.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(h);
  }).filter(h => h.trim()).map(h => b ? h.replace(Ha, (e, d) => e.replace(d, d.replace(Ja, "~"))) : h).join("\n");
};
function La(a, b, c = !1) {
  return function(g) {
    var f = Fa(arguments), {stack:h} = Error();
    const e = Da(h, 2, !0), d = (h = g instanceof Error) ? g.message : g;
    f = [`Error: ${d}`, ...null !== f && a === f || c ? [b] : [e, b]].join("\n");
    f = Ka(f);
    return Object.assign(h ? g : Error(), {message:d, stack:f});
  };
}
;function R(a) {
  var {stack:b} = Error();
  const c = Fa(arguments);
  b = Ea(b, a);
  return La(c, b, a);
}
;const Ma = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Na extends Ca {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const g = void 0 === b.binary ? !1 : b.binary, f = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {j:h = R(!0), proxyError:e} = a || {}, d = (k, l) => h(l);
    super(b);
    this.h = [];
    this.i = new Promise((k, l) => {
      this.on("finish", () => {
        let n;
        g ? n = Buffer.concat(this.h) : n = this.h.join("");
        k(n);
        this.h = [];
      });
      this.once("error", n => {
        if (-1 == n.stack.indexOf("\n")) {
          d`${n}`;
        } else {
          const m = Ka(n.stack);
          n.stack = m;
          e && d`${n}`;
        }
        l(n);
      });
      f && Ma(this, f).pipe(this);
    });
  }
  _write(a, b, c) {
    this.h.push(a);
    c();
  }
  get promise() {
    return this.i;
  }
}
const Oa = async a => {
  var b = void 0 === b ? {} : b;
  ({promise:a} = new Na(Object.assign({}, {rs:a}, b, {j:R(!0)})));
  return await a;
};
const Pa = async(a, b) => {
  await b(a);
}, Qa = async(a, b) => {
  if (b instanceof RegExp) {
    if (!b.test(a)) {
      throw Error(`${a} does not match regular expression ${b}`);
    }
  } else {
    if ("function" == typeof b) {
      await Pa(a, b);
    } else {
      if (b && a != b) {
        const c = L(`${a}`, `${b}`);
        throw Error(`${c}\n${`${a} != ${b}`}`);
      }
    }
  }
};
async function Ra(a) {
  if (!a) {
    throw Error("Config expected.");
  }
  const b = R(!0);
  var c = Object.assign({}, a);
  const g = a.fn;
  var f = void 0 === a.args ? [] : a.args;
  const h = a.context;
  a = a.error;
  c = (delete c.fn, delete c.args, delete c.context, delete c.error, c);
  if ("function" != typeof g) {
    throw Error("Function expected.");
  }
  f = Array.isArray(f) ? f : [f];
  try {
    return await Sa(g, h, f, a, c);
  } catch (e) {
    throw b(e);
  }
}
const Sa = async(a, b, c, g, f) => {
  const h = Error();
  try {
    throw b ? await a.call(b, ...c) : await a(...c), h;
  } catch (e) {
    if (e === h) {
      throw Error(`Function ${a.name && "fn" !== a.name ? `${a.name} ` : ""}should have thrown.`);
    }
    if (g && g !== e) {
      throw Error(`${e} is not strict equal to ${g}.`);
    }
    await Object.keys(f).reduce(async(d, k) => {
      await d;
      await Qa(e[k], f[k]);
    }, {});
    return e;
  }
};
const S = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function Ta(a, b) {
  let c = 0;
  const g = (e, d = void 0) => {
    const k = " ".repeat(2 * c);
    d = void 0 !== d ? J("+ " + T(d), "green") : null;
    e = void 0 !== e ? J("- " + T(e), "red") : null;
    const l = [];
    e && l.push(S(k, e));
    d && l.push(S(k, d));
    return l.join("\n");
  }, f = e => {
    const d = " ".repeat(2 * c);
    return S(d, e);
  }, h = (e, d) => {
    if (e instanceof Date && d instanceof Date) {
      var k = e.getTime() != d.getTime() ? !1 : void 0;
      return k ? "" : g(e, d);
    }
    if (e instanceof Date && !(d instanceof Date) || !(e instanceof Date) && d instanceof Date || Array.isArray(e) && !Array.isArray(d) || !Array.isArray(e) && Array.isArray(d)) {
      return g(e, d);
    }
    if (U(e) && U(d) || !U(e) && U(d) || U(e) && !U(d)) {
      return e != d ? g(e, d) : "";
    }
    if (e.constructor && !d.constructor) {
      return g(e.constructor.name, d);
    }
    if (!e.constructor && d.constructor) {
      return g(e, d.constructor.name);
    }
    if (e.constructor && d.constructor) {
      if (e.constructor.name != d.constructor.name) {
        return g(e.constructor.name, d.constructor.name);
      }
      k = e.valueOf();
      var l = d.valueOf();
      if (U(k) && U(l) && k != l) {
        return g(k, l);
      }
    }
    if (Array.isArray(e) && Array.isArray(d)) {
      let n;
      k = e.map((m, q) => {
        n = q;
        (m = h(m, d[q])) && (m = `${f(`[${q}]`)}\n${m}`);
        return m;
      }).filter(Boolean);
      l = d.slice(n + 1).map((m, q) => `${f(`[${n + q + 1}]`)}\n${g(void 0, m)}`);
      return [...k, ...l].join("\n");
    }
    if ("object" == typeof e && "object" == typeof d) {
      const n = [], m = [], q = [];
      Object.keys(e).forEach(p => {
        p in d ? q.push(p) : m.push(p);
      });
      Object.keys(d).forEach(p => {
        p in e || n.push(p);
      });
      k = m.map(p => g(`${p}${`: ${T(e[p])}`}`));
      l = n.map(p => g(void 0, `${p}: ${T(d[p])}`));
      const r = q.map(p => {
        c++;
        const t = h(e[p], d[p]);
        let u = "";
        t && (u += f(Array.isArray(e[p]) && Array.isArray(d[p]) ? `${p}.Array` : p), u += "\n" + t);
        c--;
        return u;
      }).filter(Boolean);
      return [...k, ...l, ...r].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", e, d);
  };
  return h(a, b);
}
const U = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), T = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
const {fork:Ua} = child_process;
const Va = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, Wa = (a, b = !1) => Va(a, 2 + (b ? 1 : 0)), Xa = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const Ya = /\s+at.*(?:\(|\s)(.*)\)?/, Za = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, $a = Ga(), ab = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, g = c.join("|"), f = new RegExp(Za.source.replace("IGNORED_MODULES", g));
  return a.replace(/\\/g, "/").split("\n").filter(h => {
    h = h.match(Ya);
    if (null === h || !h[1]) {
      return !0;
    }
    h = h[1];
    return h.includes(".app/Contents/Resources/electron.asar") || h.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(h);
  }).filter(h => h.trim()).map(h => b ? h.replace(Ya, (e, d) => e.replace(d, d.replace($a, "~"))) : h).join("\n");
};
function bb(a, b, c = !1) {
  return function(g) {
    var f = Xa(arguments), {stack:h} = Error();
    const e = Va(h, 2, !0), d = (h = g instanceof Error) ? g.message : g;
    f = [`Error: ${d}`, ...null !== f && a === f || c ? [b] : [e, b]].join("\n");
    f = ab(f);
    return Object.assign(h ? g : Error(), {message:d, stack:f});
  };
}
;function cb(a) {
  var {stack:b} = Error();
  const c = Xa(arguments);
  b = Wa(b, a);
  return bb(c, b, a);
}
;const db = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class V extends Ca {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const g = void 0 === b.binary ? !1 : b.binary, f = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {j:h = cb(!0), proxyError:e} = a || {}, d = (k, l) => h(l);
    super(b);
    this.h = [];
    this.i = new Promise((k, l) => {
      this.on("finish", () => {
        let n;
        g ? n = Buffer.concat(this.h) : n = this.h.join("");
        k(n);
        this.h = [];
      });
      this.once("error", n => {
        if (-1 == n.stack.indexOf("\n")) {
          d`${n}`;
        } else {
          const m = ab(n.stack);
          n.stack = m;
          e && d`${n}`;
        }
        l(n);
      });
      f && db(this, f).pipe(this);
    });
  }
  _write(a, b, c) {
    this.h.push(a);
    c();
  }
  get promise() {
    return this.i;
  }
}
const eb = async a => {
  var b = void 0 === b ? {} : b;
  ({promise:a} = new V(Object.assign({}, {rs:a}, b, {j:cb(!0)})));
  return await a;
};
const fb = async a => {
  const [b, c, g] = await Promise.all([new Promise((f, h) => {
    a.on("error", h).on("exit", e => {
      f(e);
    });
  }), a.stdout ? eb(a.stdout) : void 0, a.stderr ? eb(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:g};
};
const gb = (a, b, c = [], g = null) => {
  if (g) {
    a.on("data", d => g.write(d));
  }
  let [f, ...h] = c;
  if (f) {
    var e = d => {
      const [k, l] = f;
      k.test(d) && (d = `${l}\n`, g && g.write(d), b.write(d), [f, ...h] = h, f || a.removeListener("data", e));
    };
    a.on("data", e);
  }
};
function hb(a, b, c) {
  let g = a[a.length - 1];
  g && g.c === b && g.g === c ? a[a.length - 1] = {count:g.count + 1, c:b, g:c} : a.push({count:1, c:b, g:c});
}
function ib(a, b, c, g, f) {
  let h = c.length, e = g.length, d = b.b;
  f = d - f;
  let k = 0;
  for (; d + 1 < h && f + 1 < e && a.equals(c[d + 1], g[f + 1]);) {
    d++, f++, k++;
  }
  k && b.f.push({count:k});
  b.b = d;
  return f;
}
function jb(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
function kb(a, b) {
  var c = new lb;
  a = jb(a.split(""));
  b = jb(b.split(""));
  let g = b.length, f = a.length, h = 1, e = g + f, d = [{b:-1, f:[]}];
  var k = ib(c, d[0], b, a, 0);
  if (d[0].b + 1 >= g && k + 1 >= f) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; h <= e;) {
    a: {
      for (k = -1 * h; k <= h; k += 2) {
        var l = d[k - 1];
        let m = d[k + 1];
        var n = (m ? m.b : 0) - k;
        l && (d[k - 1] = void 0);
        let q = l && l.b + 1 < g;
        n = m && 0 <= n && n < f;
        if (q || n) {
          !q || n && l.b < m.b ? (l = {b:m.b, f:m.f.slice(0)}, hb(l.f, void 0, !0)) : (l.b++, hb(l.f, !0, void 0));
          n = ib(c, l, b, a, k);
          if (l.b + 1 >= g && n + 1 >= f) {
            k = mb(c, l.f, b, a);
            break a;
          }
          d[k] = l;
        } else {
          d[k] = void 0;
        }
      }
      h++;
      k = void 0;
    }
    if (k) {
      return k;
    }
  }
}
class lb {
  equals(a, b) {
    return a === b;
  }
  join(a) {
    return a.join("");
  }
}
function mb(a, b, c, g) {
  let f = 0, h = b.length, e = 0, d = 0;
  for (; f < h; f++) {
    var k = b[f];
    if (k.g) {
      k.value = a.join(g.slice(d, d + k.count)), d += k.count, f && b[f - 1].c && (k = b[f - 1], b[f - 1] = b[f], b[f] = k);
    } else {
      if (k.c) {
        k.value = a.join(c.slice(e, e + k.count));
      } else {
        let l = c.slice(e, e + k.count);
        l = l.map(function(n, m) {
          m = g[d + m];
          return m.length > n.length ? m : n;
        });
        k.value = a.join(l);
      }
      e += k.count;
      k.c || (d += k.count);
    }
  }
  c = b[h - 1];
  1 < h && "string" === typeof c.value && (c.c || c.g) && a.equals("", c.value) && (b[h - 2].value += c.value, b.pop());
  return b;
}
;const nb = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, ob = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function W(a, b) {
  return (b = nb[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function pb(a) {
  return (a = ob[a]) ? `\x1b[${a}m${" "}\x1b[0m` : " ";
}
function qb(a, b) {
  return kb(a, b).map(({c, g, value:f}) => {
    const h = f.split(" ");
    return c ? h.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => W(e, "green")).join(pb("green")) : g ? h.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => W(e, "red")).join(pb("red")) : W(f, "grey");
  }).join("");
}
;const X = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function rb(a, b) {
  let c = 0;
  const g = (e, d = void 0) => {
    const k = " ".repeat(2 * c);
    d = void 0 !== d ? W("+ " + Y(d), "green") : null;
    e = void 0 !== e ? W("- " + Y(e), "red") : null;
    const l = [];
    e && l.push(X(k, e));
    d && l.push(X(k, d));
    return l.join("\n");
  }, f = e => {
    const d = " ".repeat(2 * c);
    return X(d, e);
  }, h = (e, d) => {
    if (e instanceof Date && d instanceof Date) {
      var k = e.getTime() != d.getTime() ? !1 : void 0;
      return k ? "" : g(e, d);
    }
    if (e instanceof Date && !(d instanceof Date) || !(e instanceof Date) && d instanceof Date || Array.isArray(e) && !Array.isArray(d) || !Array.isArray(e) && Array.isArray(d)) {
      return g(e, d);
    }
    if (Z(e) && Z(d) || !Z(e) && Z(d) || Z(e) && !Z(d)) {
      return e != d ? g(e, d) : "";
    }
    if (e.constructor && !d.constructor) {
      return g(e.constructor.name, d);
    }
    if (!e.constructor && d.constructor) {
      return g(e, d.constructor.name);
    }
    if (e.constructor && d.constructor) {
      if (e.constructor.name != d.constructor.name) {
        return g(e.constructor.name, d.constructor.name);
      }
      k = e.valueOf();
      var l = d.valueOf();
      if (Z(k) && Z(l) && k != l) {
        return g(k, l);
      }
    }
    if (Array.isArray(e) && Array.isArray(d)) {
      let n;
      k = e.map((m, q) => {
        n = q;
        (m = h(m, d[q])) && (m = `${f(`[${q}]`)}\n${m}`);
        return m;
      }).filter(Boolean);
      l = d.slice(n + 1).map((m, q) => `${f(`[${n + q + 1}]`)}\n${g(void 0, m)}`);
      return [...k, ...l].join("\n");
    }
    if ("object" == typeof e && "object" == typeof d) {
      const n = [], m = [], q = [];
      Object.keys(e).forEach(p => {
        p in d ? q.push(p) : m.push(p);
      });
      Object.keys(d).forEach(p => {
        p in e || n.push(p);
      });
      k = m.map(p => g(`${p}${`: ${Y(e[p])}`}`));
      l = n.map(p => g(void 0, `${p}: ${Y(d[p])}`));
      const r = q.map(p => {
        c++;
        const t = h(e[p], d[p]);
        let u = "";
        t && (u += f(Array.isArray(e[p]) && Array.isArray(d[p]) ? `${p}.Array` : p), u += "\n" + t);
        c--;
        return u;
      }).filter(Boolean);
      return [...k, ...l, ...r].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", e, d);
  };
  return h(a, b);
}
const Z = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), Y = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
const sb = async(a, b, c, g) => {
  b = void 0 === b ? [] : b;
  c = void 0 === c ? [] : c;
  g = void 0 === g ? {} : g;
  const f = {stdio:"pipe", execArgv:[]};
  if ("string" == typeof a) {
    return {l:a, args:b, options:f};
  }
  const {module:h, getArgs:e, options:d, getOptions:k} = a;
  a = e ? await e.call(g, b, ...c) : b;
  b = f;
  d ? b = Object.assign({}, f, d) : k && (c = await k.call(g, ...c), b = Object.assign({}, f, c));
  return {l:h, args:a, options:b};
}, tb = (a, b, c) => {
  try {
    if ("string" == typeof b) {
      try {
        la(a, b);
      } catch (f) {
        const h = qb(b, a);
        console.log(h);
        throw f;
      }
    } else {
      if (b) {
        var g = JSON.parse(a);
        try {
          ja(g, b, void 0);
        } catch (f) {
          const h = rb(b, g);
          f.message = [f.message, h].filter(Boolean).join("\n");
          throw f;
        }
      }
    }
  } catch (f) {
    throw c && (f.property = c), f;
  }
};
function ub(a) {
  var b = ["q", "a"];
  const c = [];
  a.replace(/(['"])?([\s\S]+?)\1(\s+|$)/g, (g, ...f) => {
    g = f.slice(0, f.length - 2).reduce((h, e, d) => {
      d = b[d];
      if (!d || void 0 === e) {
        return h;
      }
      h[d] = e;
      return h;
    }, {});
    c.push(g);
  });
  return c;
}
;const vb = a => ub(a).map(({a:b}) => b);
const wb = async a => {
  const {forkConfig:b, input:c, props:g = {}, contexts:f = []} = a;
  a = c ? vb(c) : [];
  const {l:h, args:e, options:d} = await sb(b, a, f, Object.assign({}, g, {input:c}));
  if (!h) {
    throw Error("Please specify a module to fork");
  }
  a = Ua(h, e, d);
  var k = fb(a);
  a.promise = k;
  a.spawnCommand = a.spawnargs.join(" ");
  const {promise:l, stdout:n, stdin:m, stderr:q} = a, {includeAnswers:r = !0, log:p, inputs:t, stderrInputs:u, stripAnsi:w = !0, preprocess:y} = b;
  a = new Ba;
  const B = new Ba;
  !0 === p ? (a.pipe(process.stdout), B.pipe(process.stderr)) : p && (p.stdout && a.pipe(p.stdout), p.stderr && B.pipe(p.stderr));
  const A = r && t;
  k = r && u;
  var x, v;
  A && (x = new V({rs:a}));
  k && (v = new V({rs:B}));
  gb(n, m, t, a);
  gb(q, m, u, B);
  a = await l;
  A && (x.end(), x = await x.promise, Object.assign(a, {stdout:x}));
  k && (v.end(), v = await v.promise, Object.assign(a, {stderr:v}));
  var {code:I, stdout:E, stderr:D} = a, C, z;
  "object" == typeof y ? {stdout:C, stderr:z} = y : "function" == typeof y && (C = z = y);
  E = E.replace(/\r?\n$/, "");
  D = D.replace(/\r?\n$/, "");
  x = w ? E.replace(/\033\[.*?m/g, "") : E;
  v = w ? D.replace(/\033\[.*?m/g, "") : D;
  C = C ? C(x) : x;
  z = z ? z(v) : v;
  tb(C, g.stdout, "stdout");
  tb(z, g.stderr, "stderr");
  if (g.code && I != g.code) {
    throw z = Error(`Fork exited with code ${I} != ${g.code}`), z.o = "code", z;
  }
  return a;
};
const Ab = a => {
  const {input:b, error:c, expected:g, props:f, getThrowsConfig:h, getTransform:e, getResults:d, assertResults:k, mapActual:l, getReadable:n, fork:m} = a;
  return async(...q) => {
    var r = Object.assign({}, {input:b}, f);
    if (c) {
      if (!h) {
        throw Error('No "getThrowsConfig" function is given.');
      }
      r = h.call(r, ...q);
      await xb(r, c);
    } else {
      if (e) {
        yb(g), q = await e.call(r, ...q), q.end(b), q = await Oa(q);
      } else {
        if (n) {
          yb(g), q = await n.call(r, ...q), q = await Oa(q);
        } else {
          if (m) {
            r.inputs && (m.inputs = zb(r.inputs));
            var p = await wb({forkConfig:m, input:b, props:f, contexts:q});
            q = d ? await d.call(r, ...q) : p;
          } else {
            if (d) {
              q = await d.call(r, ...q);
            } else {
              throw Error("Nothing was tested.");
            }
          }
        }
      }
      if (void 0 !== g) {
        if (p = l(q), "string" != typeof g) {
          try {
            ja(p, g, void 0);
          } catch (t) {
            throw r = Ta(g, p), t.message = [t.message, r].filter(Boolean).join("\n"), t;
          }
        } else {
          if ("string" != (typeof p).toLowerCase()) {
            throw Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".');
          }
          try {
            ka(p, g);
          } catch (t) {
            throw r = L(g, p), console.log(r), t.property = "expected", t;
          }
        }
      }
      k && await k.call(r, q, f);
    }
  };
}, yb = a => {
  if (void 0 === a) {
    throw Error("No expected output was given.");
  }
}, zb = a => a.split("\n").map(b => {
  const [c, g] = b.split(/: +/);
  return [new RegExp(c), g];
}), xb = async(a, b) => {
  await Ra(Object.assign({}, a, {message:b}));
};
function Bb(a, b, c) {
  c = void 0 === c ? null : c;
  let g;
  const f = a.startsWith("!");
  let h = f ? a.replace(/^!/, "") : a;
  try {
    g = M(h);
  } catch (d) {
    if ("ENOENT" != d.code) {
      throw d;
    }
    h = Cb(h, c);
    g = M(h);
  }
  let e;
  if (g.isFile()) {
    e = Db(h, b);
  } else {
    if (g.isDirectory()) {
      const d = O(h);
      e = d.reduce((k, l) => {
        const n = P(h, l);
        l = l.replace(/\.\w+?$/, "");
        return Object.assign({}, k, {[l]:Bb(n, b, d)});
      }, {});
    }
  }
  return f ? {[a]:e} : e;
}
const Cb = (a, b) => {
  const c = ia(a);
  b = (b || O(c)).filter(g => g.startsWith(`${ha(a)}.`));
  if (1 < b.length) {
    throw Error(`Could not resolve the result path ${a}, possible files: ${b.join(", ")}.`);
  }
  if (b.length) {
    a = P(c, b[0]);
  } else {
    throw Error(`Could not resolve the result path ${a}.`);
  }
  return a;
}, Eb = (a, b) => Object.keys(a).reduce((c, g) => {
  try {
    const f = b.includes(g) ? JSON.parse(a[g]) : a[g];
    c[g] = f;
    return c;
  } catch (f) {
    throw Error(`Could not parse JSON property "${g}": ${f.message}.`);
  }
}, {}), Db = (a, b) => {
  if (!b) {
    throw Error('No configuration is given. A config should at least contain either a "getThrowsConfig", "getResults", "getTransform" or "getReadable" functions.');
  }
  const {context:c, persistentContext:g, getResults:f, getTransform:h, getReadable:e, getThrowsConfig:d, mapActual:k = t => t, assertResults:l, jsonProps:n = [], splitRe:m, fork:q, propEndRe:r, propStartRe:p} = b;
  return Aa({path:a, splitRe:m, propEndRe:r, propStartRe:p}).reduce((t, u) => {
    var w = Object.assign({}, u), y = u.name, B = u.input, A = u.error, x = u.m;
    u = (delete w.name, delete w.input, delete w.error, delete w.m, w);
    let v, I, E;
    y in t && (v = `Repeated use of the test name "${y}".`);
    try {
      var D = Eb(u, n), C = Object.assign({}, D);
      E = D.expected;
      I = (delete C.expected, C);
    } catch (Q) {
      ({message:D} = Q), v = D;
    }
    let z;
    v ? z = () => {
      throw Error(v);
    } : z = Ab({input:B, error:A, getThrowsConfig:d, getTransform:h, getReadable:e, getResults:f, expected:E, assertResults:l, props:I, mapActual:k, fork:q});
    t[y] = async(...Q) => {
      try {
        await z(...Q);
      } catch (za) {
        process.env.DEBUG && console.log(J(za.stack, "red")), await x(za);
      }
    };
    return t;
  }, Object.assign({}, c ? {context:c} : {}, g ? {persistentContext:g} : {}));
};
DEPACK_EXPORT = Bb;


module.exports = DEPACK_EXPORT
//# sourceMappingURL=depack.js.map