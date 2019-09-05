             
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
  let f = a[a.length - 1];
  f && f.c === b && f.g === c ? a[a.length - 1] = {count:f.count + 1, c:b, g:c} : a.push({count:1, c:b, g:c});
}
function H(a, b, c, f, e) {
  let h = c.length, d = f.length, g = b.b;
  e = g - e;
  let k = 0;
  for (; g + 1 < h && e + 1 < d && a.equals(c[g + 1], f[e + 1]);) {
    g++, e++, k++;
  }
  k && b.f.push({count:k});
  b.b = g;
  return e;
}
function J(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
function aa(a, b) {
  var c = new ba;
  a = J(a.split(""));
  b = J(b.split(""));
  let f = b.length, e = a.length, h = 1, d = f + e, g = [{b:-1, f:[]}];
  var k = H(c, g[0], b, a, 0);
  if (g[0].b + 1 >= f && k + 1 >= e) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; h <= d;) {
    a: {
      for (k = -1 * h; k <= h; k += 2) {
        var l = g[k - 1];
        let m = g[k + 1];
        var p = (m ? m.b : 0) - k;
        l && (g[k - 1] = void 0);
        let n = l && l.b + 1 < f;
        p = m && 0 <= p && p < e;
        if (n || p) {
          !n || p && l.b < m.b ? (l = {b:m.b, f:m.f.slice(0)}, F(l.f, void 0, !0)) : (l.b++, F(l.f, !0, void 0));
          p = H(c, l, b, a, k);
          if (l.b + 1 >= f && p + 1 >= e) {
            k = ca(c, l.f, b, a);
            break a;
          }
          g[k] = l;
        } else {
          g[k] = void 0;
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
function ca(a, b, c, f) {
  let e = 0, h = b.length, d = 0, g = 0;
  for (; e < h; e++) {
    var k = b[e];
    if (k.g) {
      k.value = a.join(f.slice(g, g + k.count)), g += k.count, e && b[e - 1].c && (k = b[e - 1], b[e - 1] = b[e], b[e] = k);
    } else {
      if (k.c) {
        k.value = a.join(c.slice(d, d + k.count));
      } else {
        let l = c.slice(d, d + k.count);
        l = l.map(function(p, m) {
          m = f[g + m];
          return m.length > p.length ? m : p;
        });
        k.value = a.join(l);
      }
      d += k.count;
      k.c || (g += k.count);
    }
  }
  c = b[h - 1];
  1 < h && "string" === typeof c.value && (c.c || c.g) && a.equals("", c.value) && (b[h - 2].value += c.value, b.pop());
  return b;
}
;const da = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, ea = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function K(a, b) {
  return (b = da[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function L(a) {
  return (a = ea[a]) ? `\x1b[${a}m${" "}\x1b[0m` : " ";
}
function M(a, b) {
  return aa(a, b).map(({c, g:f, value:e}) => {
    const h = e.split(" ");
    return c ? h.map(d => d.replace(/\n$/mg, "\u23ce\n")).map(d => K(d, "green")).join(L("green")) : f ? h.map(d => d.replace(/\n$/mg, "\u23ce\n")).map(d => K(d, "red")).join(L("red")) : K(e, "grey");
  }).join("");
}
;const {lstatSync:N, readFileSync:O, readdirSync:Q, writeFileSync:fa} = fs;
const {basename:ha, dirname:ia, join:R} = path;
const {deepStrictEqual:ja, equal:ka, strictEqual:ma} = assert;
function S(a, b, c, f = !1) {
  const e = [];
  b.replace(a, (h, ...d) => {
    h = d[d.length - 2];
    h = f ? {position:h} : {};
    d = d.slice(0, d.length - 2).reduce((g, k, l) => {
      l = c[l];
      if (!l || void 0 === k) {
        return g;
      }
      g[l] = k;
      return g;
    }, h);
    e.push(d);
  });
  return e;
}
;const {createInterface:na} = readline;
function oa(a, b, c) {
  return setTimeout(() => {
    const f = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    f.stack = `Error: ${f.message}`;
    c(f);
  }, b);
}
function pa(a, b) {
  let c;
  const f = new Promise((e, h) => {
    c = oa(a, b, h);
  });
  return {timeout:c, promise:f};
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
  const {promise:f, timeout:e} = pa(c, b);
  try {
    return await Promise.race([a, f]);
  } finally {
    clearTimeout(e);
  }
}
;function ra(a, b) {
  var c = b = void 0 === b ? {} : b, f = Object.assign({}, c);
  b = c.timeout;
  var e = void 0 === c.password ? !1 : c.password, h = void 0 === c.output ? process.stdout : c.output;
  c = void 0 === c.input ? process.stdin : c.input;
  f = (delete f.timeout, delete f.password, delete f.output, delete f.input, f);
  h = na(Object.assign({}, {input:c, output:h}, f));
  if (e) {
    const d = h.output;
    h._writeToOutput = g => {
      if (["\r\n", "\n", "\r"].includes(g)) {
        return d.write(g);
      }
      g = g.split(a);
      "2" == g.length ? (d.write(a), d.write("*".repeat(g[1].length))) : d.write("*");
    };
  }
  e = new Promise(h.question.bind(h, a));
  b = b ? qa(e, b, `reloquent: ${a}`) : e;
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
async function T(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(c, f) => {
    c = await c;
    var e = a[f];
    switch(typeof e) {
      case "object":
        e = Object.assign({}, e);
        break;
      case "string":
        e = {text:e};
        break;
      default:
        throw Error("A question must be a string or an object.");
    }
    e.text = `${e.text}${e.text.endsWith("?") ? "" : ":"} `;
    var h;
    if (e.defaultValue) {
      var d = e.defaultValue;
    }
    e.getDefault && (h = await e.getDefault());
    let g = d || "";
    d && h && d != h ? g = `\x1b[90m${d}\x1b[0m` : d && d == h && (g = "");
    d = h || "";
    ({promise:d} = ra(`${e.text}${g ? `[${g}] ` : ""}${d ? `[${d}] ` : ""}`, {timeout:b, password:e.password}));
    h = await d || h || e.defaultValue;
    "function" == typeof e.validation && e.validation(h);
    "function" == typeof e.postProcess && (h = await e.postProcess(h));
    return Object.assign({}, c, {[f]:h});
  }, {});
}
;async function ta() {
  const {question:a} = await T({question:"Show more (d), skip (s), or update (u): [u]"}, void 0);
  return a;
}
async function ua() {
  const {defaultYes:a = !0, timeout:b} = {};
  var c = "Update the result".endsWith("?");
  ({question:c} = await T({question:{text:`${c ? "Update the result".replace(/\?$/, "") : "Update the result"} (y/n)${c ? "?" : ""}`, defaultValue:a ? "y" : "n"}}, b));
  return "y" == c;
}
;const va = (a, b) => {
  let c = [];
  a.replace(b, (f, e) => {
    c.push({position:e, separator:f});
  });
  c = [{position:0, separator:""}, ...c];
  return c.reduce((f, {position:e, separator:h}, d, g) => {
    var {length:k} = h;
    d = g[d + 1];
    if (!d) {
      return k = a.slice(e + k), f.push({position:e, separator:h, match:k}), f;
    }
    ({position:d} = d);
    k = a.slice(e + k, d);
    f.push({position:e, separator:h, match:k});
    return f;
  }, []);
}, wa = (a, b, c) => Object.keys(a).reduce((f, e) => {
  let h;
  const d = a[e];
  if (b.includes(e)) {
    try {
      h = JSON.parse(d);
    } catch (g) {
      throw Error(`Could not parse JSON property "${e}": ${g.message}.`);
    }
  } else {
    if (c.includes(e)) {
      try {
        h = eval(`(${d})`);
      } catch (g) {
        throw Error(`Could not evaluate JS property "${e}": ${g.message}.`);
      }
    } else {
      h = d;
    }
  }
  f[e] = h;
  return f;
}, {});
const za = a => {
  const {path:b, propStartRe:c = /\/\*/, propEndRe:f = /\/\*\*\//} = a;
  let {splitRe:e} = a;
  e || (e = b.endsWith(".md") ? /^## /gm : /^\/\/ /gm);
  let h = `${O(b)}`;
  const d = e.exec(h);
  if (!d) {
    throw Error(`${b} does not contain tests.`);
  }
  const g = h.slice(0, d.index).replace(/\n\n$/, "");
  a = h.slice(d.index);
  e.lastIndex = 0;
  a = va(a, e).filter(m => {
    ({match:m} = m);
    return m;
  }).map(m => {
    var {match:n, position:r, separator:q} = m;
    const [A, w] = xa(n), [u, v] = ya(w, new RegExp(`\n${c.source}`));
    var x = n.indexOf(v);
    m = u.replace(/\n$/, "");
    const D = d.index + x + r + q.length, t = {};
    x = S(new RegExp(`(${c.source} +(.+) +\\*\\/(\n?))([\\s\\S]*?)\n${f.source}`, "g"), v, ["preValue", "key", "newLine", "value"], !0).reduce((y, C) => {
      var {preValue:G, key:E, newLine:B, value:z, position:I} = C;
      t[E] = {start:D + I + G.length, length:z.length};
      return Object.assign({}, y, {[E]:!z && B ? B : z});
    }, {});
    return Object.assign({}, {name:A, input:m, l:t}, g ? {preamble:g} : {}, x);
  });
  const k = h.split("\n");
  let l = 0;
  const p = async(m, n, r) => {
    const q = new RegExp(`${e.source}${m}\r?$`), A = k.reduce((u, v, x) => u ? u : q.test(v) ? x + 1 : u, null), w = Error(r.message);
    w.stack = `Error: ${r.message}\n    at ${m} (${b}:${A}:1)`;
    if (r.property && r.actual) {
      const {property:u, actual:v, expected:x} = r;
      w.handleUpdate = async() => {
        const D = n[u];
        if (!D) {
          return !1;
        }
        var t = D.start + l, y = h.slice(0, t);
        t = h.slice(t + D.length);
        y = `${y}${v}${t}`;
        console.error('Result does not match property "%s"\n  at %s (%s:%s:1)', u, K(m, "blue"), b, A);
        t = !1;
        const C = await ta();
        "d" == C ? (console.log(K("Actual: ", "blue")), console.log(v), console.log(K("Expected: ", "blue")), console.log(x), t = await ua()) : C && "u" != C || (t = !0);
        if (!t) {
          return !1;
        }
        l += v.length - D.length;
        await fa(b, y);
        h = `${O(b)}`;
        return !0;
      };
    }
    throw w;
  };
  return a.map(m => {
    var n = Object.assign({}, m), r = m.name;
    m = m.l;
    n = (delete n.name, delete n.l, n);
    m = p.bind(null, r, m);
    return Object.assign({}, n, {name:r, j:m});
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
const {PassThrough:Aa, Writable:Ba} = stream;
const Ca = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, Da = (a, b = !1) => Ca(a, 2 + (b ? 1 : 0)), Ea = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:Fa} = os;
const Ga = /\s+at.*(?:\(|\s)(.*)\)?/, Ha = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, Ia = Fa(), Ja = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, f = c.join("|"), e = new RegExp(Ha.source.replace("IGNORED_MODULES", f));
  return a.replace(/\\/g, "/").split("\n").filter(h => {
    h = h.match(Ga);
    if (null === h || !h[1]) {
      return !0;
    }
    h = h[1];
    return h.includes(".app/Contents/Resources/electron.asar") || h.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(h);
  }).filter(h => h.trim()).map(h => b ? h.replace(Ga, (d, g) => d.replace(g, g.replace(Ia, "~"))) : h).join("\n");
};
function Ka(a, b, c = !1) {
  return function(f) {
    var e = Ea(arguments), {stack:h} = Error();
    const d = Ca(h, 2, !0), g = (h = f instanceof Error) ? f.message : f;
    e = [`Error: ${g}`, ...null !== e && a === e || c ? [b] : [d, b]].join("\n");
    e = Ja(e);
    return Object.assign(h ? f : Error(), {message:g, stack:e});
  };
}
;function U(a) {
  var {stack:b} = Error();
  const c = Ea(arguments);
  b = Da(b, a);
  return Ka(c, b, a);
}
;const La = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class V extends Ba {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const f = void 0 === b.binary ? !1 : b.binary, e = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {o:h = U(!0), proxyError:d} = a || {}, g = (k, l) => h(l);
    super(b);
    this.h = [];
    this.m = new Promise((k, l) => {
      this.on("finish", () => {
        let p;
        f ? p = Buffer.concat(this.h) : p = this.h.join("");
        k(p);
        this.h = [];
      });
      this.once("error", p => {
        if (-1 == p.stack.indexOf("\n")) {
          g`${p}`;
        } else {
          const m = Ja(p.stack);
          p.stack = m;
          d && g`${p}`;
        }
        l(p);
      });
      e && La(this, e).pipe(this);
    });
  }
  _write(a, b, c) {
    this.h.push(a);
    c();
  }
  get promise() {
    return this.m;
  }
}
const W = async a => {
  var b = void 0 === b ? {} : b;
  ({promise:a} = new V(Object.assign({}, {rs:a}, b, {o:U(!0)})));
  return await a;
};
const Ma = async(a, b) => {
  await b(a);
}, Na = async(a, b) => {
  if (b instanceof RegExp) {
    if (!b.test(a)) {
      throw Error(`${a} does not match regular expression ${b}`);
    }
  } else {
    if ("function" == typeof b) {
      await Ma(a, b);
    } else {
      if (b && a != b) {
        const c = M(`${a}`, `${b}`);
        throw Error(`${c}\n${`${a} != ${b}`}`);
      }
    }
  }
};
async function Oa(a) {
  if (!a) {
    throw Error("Config expected.");
  }
  const b = U(!0);
  var c = Object.assign({}, a);
  const f = a.fn;
  var e = void 0 === a.args ? [] : a.args;
  const h = a.context;
  a = a.error;
  c = (delete c.fn, delete c.args, delete c.context, delete c.error, c);
  if ("function" != typeof f) {
    throw Error("Function expected.");
  }
  e = Array.isArray(e) ? e : [e];
  try {
    return await Pa(f, h, e, a, c);
  } catch (d) {
    throw b(d);
  }
}
const Pa = async(a, b, c, f, e) => {
  const h = Error();
  try {
    throw b ? await a.call(b, ...c) : await a(...c), h;
  } catch (d) {
    if (d === h) {
      throw Error(`Function ${a.name && "fn" !== a.name ? `${a.name} ` : ""}should have thrown.`);
    }
    if (f && f !== d) {
      throw Error(`${d} is not strict equal to ${f}.`);
    }
    await Object.keys(e).reduce(async(g, k) => {
      await g;
      await Na(d[k], e[k]);
    }, {});
    return d;
  }
};
const X = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function Qa(a, b) {
  let c = 0;
  const f = (d, g = void 0) => {
    const k = " ".repeat(2 * c);
    g = void 0 !== g ? K("+ " + Y(g), "green") : null;
    d = void 0 !== d ? K("- " + Y(d), "red") : null;
    const l = [];
    d && l.push(X(k, d));
    g && l.push(X(k, g));
    return l.join("\n");
  }, e = d => {
    const g = " ".repeat(2 * c);
    return X(g, d);
  }, h = (d, g) => {
    if (d instanceof Date && g instanceof Date) {
      var k = d.getTime() != g.getTime() ? !1 : void 0;
      return k ? "" : f(d, g);
    }
    if (d instanceof Date && !(g instanceof Date) || !(d instanceof Date) && g instanceof Date || Array.isArray(d) && !Array.isArray(g) || !Array.isArray(d) && Array.isArray(g)) {
      return f(d, g);
    }
    if (Z(d) && Z(g) || !Z(d) && Z(g) || Z(d) && !Z(g)) {
      return d != g ? f(d, g) : "";
    }
    if (d.constructor && !g.constructor) {
      return f(d.constructor.name, g);
    }
    if (!d.constructor && g.constructor) {
      return f(d, g.constructor.name);
    }
    if (d.constructor && g.constructor) {
      if (d.constructor.name != g.constructor.name) {
        return f(d.constructor.name, g.constructor.name);
      }
      k = d.valueOf();
      var l = g.valueOf();
      if (Z(k) && Z(l) && k != l) {
        return f(k, l);
      }
    }
    if (Array.isArray(d) && Array.isArray(g)) {
      let p;
      k = d.map((m, n) => {
        p = n;
        (m = h(m, g[n])) && (m = `${e(`[${n}]`)}\n${m}`);
        return m;
      }).filter(Boolean);
      l = g.slice(p + 1).map((m, n) => `${e(`[${p + n + 1}]`)}\n${f(void 0, m)}`);
      return [...k, ...l].join("\n");
    }
    if ("object" == typeof d && "object" == typeof g) {
      const p = [], m = [], n = [];
      Object.keys(d).forEach(q => {
        q in g ? n.push(q) : m.push(q);
      });
      Object.keys(g).forEach(q => {
        q in d || p.push(q);
      });
      k = m.map(q => f(`${q}${`: ${Y(d[q])}`}`));
      l = p.map(q => f(void 0, `${q}: ${Y(g[q])}`));
      const r = n.map(q => {
        c++;
        const A = h(d[q], g[q]);
        let w = "";
        A && (w += e(Array.isArray(d[q]) && Array.isArray(g[q]) ? `${q}.Array` : q), w += "\n" + A);
        c--;
        return w;
      }).filter(Boolean);
      return [...k, ...l, ...r].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", d, g);
  };
  return h(a, b);
}
const Z = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), Y = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
function Ra(a, b) {
  try {
    ja(a, b, void 0);
  } catch (c) {
    throw a = Qa(b, a), c.message = [c.message, a].filter(Boolean).join("\n"), c;
  }
}
;const {fork:Sa} = child_process;
const Ta = async a => {
  const [b, c, f] = await Promise.all([new Promise((e, h) => {
    a.on("error", h).on("exit", d => {
      e(d);
    });
  }), a.stdout ? W(a.stdout) : void 0, a.stderr ? W(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:f};
};
const Ua = (a, b, c = [], f = null) => {
  if (f) {
    a.on("data", g => f.write(g));
  }
  let [e, ...h] = c;
  if (e) {
    var d = g => {
      const [k, l] = e;
      k.test(g) && (g = `${l}\n`, f && f.write(g), b.write(g), [e, ...h] = h, e || a.removeListener("data", d));
    };
    a.on("data", d);
  }
};
const Va = async(a, b, c, f) => {
  b = void 0 === b ? [] : b;
  c = void 0 === c ? [] : c;
  f = void 0 === f ? {} : f;
  const e = {stdio:"pipe", execArgv:[]};
  if ("string" == typeof a) {
    return {i:a, args:b, options:e};
  }
  const {module:h, getArgs:d, options:g, getOptions:k} = a;
  a = d ? await d.call(f, b, ...c) : b;
  b = e;
  g ? b = Object.assign({}, e, g) : k && (c = await k.call(f, ...c), b = Object.assign({}, e, c));
  return {i:h, args:a, options:b};
}, Wa = (a, b, c) => {
  try {
    if ("string" == typeof b) {
      try {
        ma(a, b);
      } catch (f) {
        const e = M(b, a);
        console.log(e);
        throw f;
      }
    } else {
      if (b) {
        const f = JSON.parse(a);
        Ra(f, b);
      }
    }
  } catch (f) {
    throw c && (f.property = c), f;
  }
};
const Xa = a => S(/(['"])?([\s\S]+?)\1(\s+|$)/g, a, ["q", "a"]).map(({a:b}) => b);
const Ya = async a => {
  const {forkConfig:b, input:c, props:f = {}, contexts:e = []} = a;
  a = c ? Xa(c) : [];
  const {i:h, args:d, options:g} = await Va(b, a, e, Object.assign({}, f, {input:c}));
  if (!h) {
    throw Error("Please specify a module to fork");
  }
  a = Sa(h, d, g);
  var k = Ta(a);
  a.promise = k;
  a.spawnCommand = a.spawnargs.join(" ");
  const {promise:l, stdout:p, stdin:m, stderr:n} = a, {includeAnswers:r = !0, log:q, inputs:A, stderrInputs:w, stripAnsi:u = !0, preprocess:v} = b;
  a = new Aa;
  const x = new Aa;
  !0 === q ? (a.pipe(process.stdout), x.pipe(process.stderr)) : q && (q.stdout && a.pipe(q.stdout), q.stderr && x.pipe(q.stderr));
  const D = r && A;
  k = r && w;
  var t, y;
  D && (t = new V({rs:a}));
  k && (y = new V({rs:x}));
  Ua(p, m, A, a);
  Ua(n, m, w, x);
  a = await l;
  D && (t.end(), t = await t.promise, Object.assign(a, {stdout:t}));
  k && (y.end(), y = await y.promise, Object.assign(a, {stderr:y}));
  var {code:C, stdout:G, stderr:E} = a, B, z;
  "object" == typeof v ? {stdout:B, stderr:z} = v : "function" == typeof v && (B = z = v);
  G = G.replace(/\r?\n$/, "");
  E = E.replace(/\r?\n$/, "");
  t = u ? G.replace(/\033\[.*?m/g, "") : G;
  y = u ? E.replace(/\033\[.*?m/g, "") : E;
  B = B ? B(t) : t;
  z = z ? z(y) : y;
  Wa(B, f.stdout, "stdout");
  Wa(z, f.stderr, "stderr");
  if (f.code && C != f.code) {
    throw z = Error(`Fork exited with code ${C} != ${f.code}`), z.s = "code", z;
  }
  return a;
};
const bb = a => {
  const {input:b, error:c, expected:f, props:e, getThrowsConfig:h, getTransform:d, getResults:g, assertResults:k, mapActual:l, getReadable:p, fork:m} = a;
  return async(...n) => {
    var r = Object.assign({}, {input:b}, e);
    if (c) {
      if (!h) {
        throw Error('No "getThrowsConfig" function is given.');
      }
      r = h.call(r, ...n);
      await Za(r, c);
    } else {
      if (d) {
        $a(f), n = await d.call(r, ...n), n.end(b), n = await W(n);
      } else {
        if (p) {
          $a(f), n = await p.call(r, ...n), n = await W(n);
        } else {
          if (m) {
            r.inputs && (m.inputs = ab(r.inputs));
            var q = await Ya({forkConfig:m, input:b, props:e, contexts:n});
            n = g ? await g.call(r, ...n) : q;
          } else {
            if (g) {
              n = await g.call(r, ...n);
            } else {
              throw Error("Nothing was tested.");
            }
          }
        }
      }
      if (void 0 !== f) {
        if (q = l(n), "string" != typeof f) {
          Ra(q, f);
        } else {
          if ("string" != (typeof q).toLowerCase()) {
            throw Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".');
          }
          try {
            ka(q, f);
          } catch (A) {
            throw r = M(f, q), console.log(r), A.property = "expected", A;
          }
        }
      }
      k && await k.call(r, n, e);
    }
  };
}, $a = a => {
  if (void 0 === a) {
    throw Error("No expected output was given.");
  }
}, ab = a => a.split("\n").map(b => {
  const [c, f] = b.split(/: +/);
  return [new RegExp(c), f];
}), Za = async(a, b) => {
  await Oa(Object.assign({}, a, {message:b}));
};
function cb(a, b, c) {
  c = void 0 === c ? null : c;
  let f;
  const e = a.startsWith("!");
  let h = e ? a.replace(/^!/, "") : a;
  try {
    f = N(h);
  } catch (g) {
    if ("ENOENT" != g.code) {
      throw g;
    }
    h = db(h, c);
    f = N(h);
  }
  let d;
  if (f.isFile()) {
    d = eb(h, b);
  } else {
    if (f.isDirectory()) {
      const g = Q(h);
      d = g.reduce((k, l) => {
        const p = R(h, l);
        l = l.replace(/\.\w+?$/, "");
        return Object.assign({}, k, {[l]:cb(p, b, g)});
      }, {});
    }
  }
  return e ? {[a]:d} : d;
}
const db = (a, b) => {
  const c = ia(a);
  b = (b || Q(c)).filter(f => f.startsWith(`${ha(a)}.`));
  if (1 < b.length) {
    throw Error(`Could not resolve the result path ${a}, possible files: ${b.join(", ")}.`);
  }
  if (b.length) {
    a = R(c, b[0]);
  } else {
    throw Error(`Could not resolve the result path ${a}.`);
  }
  return a;
}, eb = (a, b) => {
  if (!b) {
    throw Error('No configuration is given. A config should at least contain either a "getThrowsConfig", "getResults", "getTransform" or "getReadable" functions.');
  }
  const {context:c, persistentContext:f, getResults:e, getTransform:h, getReadable:d, getThrowsConfig:g, mapActual:k = w => w, assertResults:l, jsonProps:p = [], jsProps:m = [], splitRe:n, fork:r, propEndRe:q, propStartRe:A} = b;
  return za({path:a, splitRe:n, propEndRe:q, propStartRe:A}).reduce((w, u) => {
    var v = Object.assign({}, u), x = u.name, D = u.input, t = u.error, y = u.j;
    u = (delete v.name, delete v.input, delete v.error, delete v.j, v);
    let C, G, E;
    x in w && (C = `Repeated use of the test name "${x}".`);
    try {
      var B = wa(u, p, m), z = Object.assign({}, B);
      E = B.expected;
      G = (delete z.expected, z);
    } catch (P) {
      ({message:B} = P), C = B;
    }
    let I;
    C ? I = () => {
      throw Error(C);
    } : I = bb({input:D, error:t, getThrowsConfig:g, getTransform:h, getReadable:d, getResults:e, expected:E, assertResults:l, props:G, mapActual:k, fork:r});
    w[x] = async(...P) => {
      try {
        await I(...P);
      } catch (la) {
        process.env.DEBUG && console.log(K(la.stack, "red")), await y(la);
      }
    };
    return w;
  }, Object.assign({}, c ? {context:c} : {}, f ? {persistentContext:f} : {}));
};
DEPACK_EXPORT = cb;


module.exports = DEPACK_EXPORT