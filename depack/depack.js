             
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
  let d = a[a.length - 1];
  d && d.c === b && d.g === c ? a[a.length - 1] = {count:d.count + 1, c:b, g:c} : a.push({count:1, c:b, g:c});
}
function H(a, b, c, d, f) {
  let h = c.length, e = d.length, g = b.b;
  f = g - f;
  let k = 0;
  for (; g + 1 < h && f + 1 < e && a.equals(c[g + 1], d[f + 1]);) {
    g++, f++, k++;
  }
  k && b.f.push({count:k});
  b.b = g;
  return f;
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
  let d = b.length, f = a.length, h = 1, e = d + f, g = [{b:-1, f:[]}];
  var k = H(c, g[0], b, a, 0);
  if (g[0].b + 1 >= d && k + 1 >= f) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; h <= e;) {
    a: {
      for (k = -1 * h; k <= h; k += 2) {
        var l = g[k - 1];
        let m = g[k + 1];
        var p = (m ? m.b : 0) - k;
        l && (g[k - 1] = void 0);
        let n = l && l.b + 1 < d;
        p = m && 0 <= p && p < f;
        if (n || p) {
          !n || p && l.b < m.b ? (l = {b:m.b, f:m.f.slice(0)}, F(l.f, void 0, !0)) : (l.b++, F(l.f, !0, void 0));
          p = H(c, l, b, a, k);
          if (l.b + 1 >= d && p + 1 >= f) {
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
function ca(a, b, c, d) {
  let f = 0, h = b.length, e = 0, g = 0;
  for (; f < h; f++) {
    var k = b[f];
    if (k.g) {
      k.value = a.join(d.slice(g, g + k.count)), g += k.count, f && b[f - 1].c && (k = b[f - 1], b[f - 1] = b[f], b[f] = k);
    } else {
      if (k.c) {
        k.value = a.join(c.slice(e, e + k.count));
      } else {
        let l = c.slice(e, e + k.count);
        l = l.map(function(p, m) {
          m = d[g + m];
          return m.length > p.length ? m : p;
        });
        k.value = a.join(l);
      }
      e += k.count;
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
  return aa(a, b).map(({c, g:d, value:f}) => {
    const h = f.split(" ");
    return c ? h.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => K(e, "green")).join(L("green")) : d ? h.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => K(e, "red")).join(L("red")) : K(f, "grey");
  }).join("");
}
;const {lstatSync:N, readFileSync:O, readdirSync:P, writeFileSync:fa} = fs;
const {basename:ha, dirname:ia, join:Q} = path;
const {deepStrictEqual:ja, equal:la, strictEqual:ma} = assert;
function R(a, b, c, d = !1) {
  const f = [];
  b.replace(a, (h, ...e) => {
    h = e[e.length - 2];
    h = d ? {position:h} : {};
    e = e.slice(0, e.length - 2).reduce((g, k, l) => {
      l = c[l];
      if (!l || void 0 === k) {
        return g;
      }
      g[l] = k;
      return g;
    }, h);
    f.push(e);
  });
  return f;
}
;const {createInterface:na} = readline;
function oa(a, b, c) {
  return setTimeout(() => {
    const d = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    d.stack = `Error: ${d.message}`;
    c(d);
  }, b);
}
function pa(a, b) {
  let c;
  const d = new Promise((f, h) => {
    c = oa(a, b, h);
  });
  return {timeout:c, promise:d};
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
  const {promise:d, timeout:f} = pa(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(f);
  }
}
;function ra(a, b) {
  var c = b = void 0 === b ? {} : b, d = Object.assign({}, c);
  b = c.timeout;
  var f = void 0 === c.password ? !1 : c.password, h = void 0 === c.output ? process.stdout : c.output;
  c = void 0 === c.input ? process.stdin : c.input;
  d = (delete d.timeout, delete d.password, delete d.output, delete d.input, d);
  h = na(Object.assign({}, {input:c, output:h}, d));
  if (f) {
    const e = h.output;
    h._writeToOutput = g => {
      if (["\r\n", "\n", "\r"].includes(g)) {
        return e.write(g);
      }
      g = g.split(a);
      "2" == g.length ? (e.write(a), e.write("*".repeat(g[1].length))) : e.write("*");
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
async function S(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(c, d) => {
    c = await c;
    var f = a[d];
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
    let g = e || "";
    e && h && e != h ? g = `\x1b[90m${e}\x1b[0m` : e && e == h && (g = "");
    e = h || "";
    ({promise:e} = ra(`${f.text}${g ? `[${g}] ` : ""}${e ? `[${e}] ` : ""}`, {timeout:b, password:f.password}));
    h = await e || h || f.defaultValue;
    "function" == typeof f.validation && f.validation(h);
    "function" == typeof f.postProcess && (h = await f.postProcess(h));
    return Object.assign({}, c, {[d]:h});
  }, {});
}
;async function ta() {
  const {question:a} = await S({question:"Show more (d), skip (s), or update (u): [u]"}, void 0);
  return a;
}
async function ua() {
  const {defaultYes:a = !0, timeout:b} = {};
  var c = "Update the result".endsWith("?");
  ({question:c} = await S({question:{text:`${c ? "Update the result".replace(/\?$/, "") : "Update the result"} (y/n)${c ? "?" : ""}`, defaultValue:a ? "y" : "n"}}, b));
  return "y" == c;
}
;const va = (a, b) => {
  let c = [];
  a.replace(b, (d, f) => {
    c.push({position:f, separator:d});
  });
  c = [{position:0, separator:""}, ...c];
  return c.reduce((d, {position:f, separator:h}, e, g) => {
    var {length:k} = h;
    e = g[e + 1];
    if (!e) {
      return k = a.slice(f + k), d.push({position:f, separator:h, match:k}), d;
    }
    ({position:e} = e);
    k = a.slice(f + k, e);
    d.push({position:f, separator:h, match:k});
    return d;
  }, []);
};
const ya = a => {
  const {path:b, propStartRe:c = /\/\*/, propEndRe:d = /\/\*\*\//} = a;
  let {splitRe:f} = a;
  f || (f = b.endsWith(".md") ? /^## /gm : /^\/\/ /gm);
  let h = `${O(b)}`;
  const e = f.exec(h);
  if (!e) {
    throw Error(`${b} does not contain tests.`);
  }
  const g = h.slice(0, e.index).replace(/\n\n$/, "");
  a = h.slice(e.index);
  f.lastIndex = 0;
  a = va(a, f).filter(m => {
    ({match:m} = m);
    return m;
  }).map(m => {
    var {match:n, position:r, separator:q} = m;
    const [v, u] = wa(n), [x, y] = xa(u, new RegExp(`\n${c.source}`));
    var A = n.indexOf(y);
    m = x.replace(/\n$/, "");
    const D = e.index + A + r + q.length, t = {};
    A = R(new RegExp(`(${c.source} +(.+) +\\*\\/(\n?))([\\s\\S]*?)\n${d.source}`, "g"), y, ["preValue", "key", "newLine", "value"], !0).reduce((w, E) => {
      var {preValue:G, key:B, newLine:C, value:z, position:I} = E;
      t[B] = {start:D + I + G.length, length:z.length};
      return Object.assign({}, w, {[B]:!z && C ? C : z});
    }, {});
    return Object.assign({}, {name:v, input:m, l:t}, g ? {preamble:g} : {}, A);
  });
  const k = h.split("\n");
  let l = 0;
  const p = async(m, n, r) => {
    const q = new RegExp(`${f.source}${m}\r?$`), v = k.reduce((x, y, A) => x ? x : q.test(y) ? A + 1 : x, null), u = Error(r.message);
    u.stack = `Error: ${r.message}\n    at ${m} (${b}:${v}:1)`;
    if (r.property && r.actual) {
      const {property:x, actual:y, expected:A} = r;
      u.handleUpdate = async() => {
        const D = n[x];
        if (!D) {
          return !1;
        }
        var t = D.start + l, w = h.slice(0, t);
        t = h.slice(t + D.length);
        w = `${w}${y}${t}`;
        console.error('Result does not match property "%s"\n  at %s (%s:%s:1)', x, K(m, "blue"), b, v);
        t = !1;
        const E = await ta();
        "d" == E ? (console.log(K("Actual: ", "blue")), console.log(y), console.log(K("Expected: ", "blue")), console.log(A), t = await ua()) : E && "u" != E || (t = !0);
        if (!t) {
          return !1;
        }
        l += y.length - D.length;
        await fa(b, w);
        h = `${O(b)}`;
        return !0;
      };
    }
    throw u;
  };
  return a.map(m => {
    var n = Object.assign({}, m), r = m.name;
    m = m.l;
    n = (delete n.name, delete n.l, n);
    m = p.bind(null, r, m);
    return Object.assign({}, n, {name:r, j:m});
  });
}, xa = (a, b) => {
  const c = a.search(b);
  if (0 > c) {
    throw Error(`Could not process "${a}": propStart re ${b} returned -1`);
  }
  return [a.substr(0, c), a.substr(c + 1)];
}, wa = a => {
  const b = a.indexOf("\n");
  return [a.substr(0, b), a.substr(b + 1)];
};
const {PassThrough:T, Writable:za} = stream;
const Aa = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, Ba = (a, b = !1) => Aa(a, 2 + (b ? 1 : 0)), Ca = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:Da} = os;
const Ea = /\s+at.*(?:\(|\s)(.*)\)?/, Fa = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, Ga = Da(), Ha = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), f = new RegExp(Fa.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(h => {
    h = h.match(Ea);
    if (null === h || !h[1]) {
      return !0;
    }
    h = h[1];
    return h.includes(".app/Contents/Resources/electron.asar") || h.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(h);
  }).filter(h => h.trim()).map(h => b ? h.replace(Ea, (e, g) => e.replace(g, g.replace(Ga, "~"))) : h).join("\n");
};
function Ia(a, b, c = !1) {
  return function(d) {
    var f = Ca(arguments), {stack:h} = Error();
    const e = Aa(h, 2, !0), g = (h = d instanceof Error) ? d.message : d;
    f = [`Error: ${g}`, ...null !== f && a === f || c ? [b] : [e, b]].join("\n");
    f = Ha(f);
    return Object.assign(h ? d : Error(), {message:g, stack:f});
  };
}
;function U(a) {
  var {stack:b} = Error();
  const c = Ca(arguments);
  b = Ba(b, a);
  return Ia(c, b, a);
}
;const Ja = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class V extends za {
  constructor(a) {
    var b = a || {}, c = Object.assign({}, b);
    const d = void 0 === b.binary ? !1 : b.binary, f = void 0 === b.rs ? null : b.rs;
    b = (delete c.binary, delete c.rs, c);
    const {o:h = U(!0), proxyError:e} = a || {}, g = (k, l) => h(l);
    super(b);
    this.h = [];
    this.m = new Promise((k, l) => {
      this.on("finish", () => {
        let p;
        d ? p = Buffer.concat(this.h) : p = this.h.join("");
        k(p);
        this.h = [];
      });
      this.once("error", p => {
        if (-1 == p.stack.indexOf("\n")) {
          g`${p}`;
        } else {
          const m = Ha(p.stack);
          p.stack = m;
          e && g`${p}`;
        }
        l(p);
      });
      f && Ja(this, f).pipe(this);
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
const Ka = async(a, b) => {
  await b(a);
}, La = async(a, b) => {
  if (b instanceof RegExp) {
    if (!b.test(a)) {
      throw Error(`${a} does not match regular expression ${b}`);
    }
  } else {
    if ("function" == typeof b) {
      await Ka(a, b);
    } else {
      if (b && a != b) {
        const c = M(`${a}`, `${b}`);
        throw Error(`${c}\n${`${a} != ${b}`}`);
      }
    }
  }
};
async function Ma(a) {
  if (!a) {
    throw Error("Config expected.");
  }
  const b = U(!0);
  var c = Object.assign({}, a);
  const d = a.fn;
  var f = void 0 === a.args ? [] : a.args;
  const h = a.context;
  a = a.error;
  c = (delete c.fn, delete c.args, delete c.context, delete c.error, c);
  if ("function" != typeof d) {
    throw Error("Function expected.");
  }
  f = Array.isArray(f) ? f : [f];
  try {
    return await Na(d, h, f, a, c);
  } catch (e) {
    throw b(e);
  }
}
const Na = async(a, b, c, d, f) => {
  const h = Error();
  try {
    throw b ? await a.call(b, ...c) : await a(...c), h;
  } catch (e) {
    if (e === h) {
      throw Error(`Function ${a.name && "fn" !== a.name ? `${a.name} ` : ""}should have thrown.`);
    }
    if (d && d !== e) {
      throw Error(`${e} is not strict equal to ${d}.`);
    }
    await Object.keys(f).reduce(async(g, k) => {
      await g;
      await La(e[k], f[k]);
    }, {});
    return e;
  }
};
const X = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function Oa(a, b) {
  let c = 0;
  const d = (e, g = void 0) => {
    const k = " ".repeat(2 * c);
    g = void 0 !== g ? K("+ " + Y(g), "green") : null;
    e = void 0 !== e ? K("- " + Y(e), "red") : null;
    const l = [];
    e && l.push(X(k, e));
    g && l.push(X(k, g));
    return l.join("\n");
  }, f = e => {
    const g = " ".repeat(2 * c);
    return X(g, e);
  }, h = (e, g) => {
    if (e instanceof Date && g instanceof Date) {
      var k = e.getTime() != g.getTime() ? !1 : void 0;
      return k ? "" : d(e, g);
    }
    if (e instanceof Date && !(g instanceof Date) || !(e instanceof Date) && g instanceof Date || Array.isArray(e) && !Array.isArray(g) || !Array.isArray(e) && Array.isArray(g)) {
      return d(e, g);
    }
    if (Z(e) && Z(g) || !Z(e) && Z(g) || Z(e) && !Z(g)) {
      return e != g ? d(e, g) : "";
    }
    if (e.constructor && !g.constructor) {
      return d(e.constructor.name, g);
    }
    if (!e.constructor && g.constructor) {
      return d(e, g.constructor.name);
    }
    if (e.constructor && g.constructor) {
      if (e.constructor.name != g.constructor.name) {
        return d(e.constructor.name, g.constructor.name);
      }
      k = e.valueOf();
      var l = g.valueOf();
      if (Z(k) && Z(l) && k != l) {
        return d(k, l);
      }
    }
    if (Array.isArray(e) && Array.isArray(g)) {
      let p;
      k = e.map((m, n) => {
        p = n;
        (m = h(m, g[n])) && (m = `${f(`[${n}]`)}\n${m}`);
        return m;
      }).filter(Boolean);
      l = g.slice(p + 1).map((m, n) => `${f(`[${p + n + 1}]`)}\n${d(void 0, m)}`);
      return [...k, ...l].join("\n");
    }
    if ("object" == typeof e && "object" == typeof g) {
      const p = [], m = [], n = [];
      Object.keys(e).forEach(q => {
        q in g ? n.push(q) : m.push(q);
      });
      Object.keys(g).forEach(q => {
        q in e || p.push(q);
      });
      k = m.map(q => d(`${q}${`: ${Y(e[q])}`}`));
      l = p.map(q => d(void 0, `${q}: ${Y(g[q])}`));
      const r = n.map(q => {
        c++;
        const v = h(e[q], g[q]);
        let u = "";
        v && (u += f(Array.isArray(e[q]) && Array.isArray(g[q]) ? `${q}.Array` : q), u += "\n" + v);
        c--;
        return u;
      }).filter(Boolean);
      return [...k, ...l, ...r].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", e, g);
  };
  return h(a, b);
}
const Z = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), Y = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
function Pa(a, b) {
  try {
    ja(a, b, void 0);
  } catch (c) {
    throw a = Oa(b, a), c.message = [c.message, a].filter(Boolean).join("\n"), c;
  }
}
;const {fork:Qa} = child_process;
const Ra = async a => {
  const [b, c, d] = await Promise.all([new Promise((f, h) => {
    a.on("error", h).on("exit", e => {
      f(e);
    });
  }), a.stdout ? W(a.stdout) : void 0, a.stderr ? W(a.stderr) : void 0]);
  return {code:b, stdout:c, stderr:d};
};
const Sa = (a, b, c = [], d = null) => {
  if (d) {
    a.on("data", g => d.write(g));
  }
  let [f, ...h] = c;
  if (f) {
    var e = g => {
      const [k, l] = f;
      k.test(g) && (g = `${l}\n`, d && d.write(g), b.write(g), [f, ...h] = h, f || a.removeListener("data", e));
    };
    a.on("data", e);
  }
};
const Ta = async(a, b, c, d) => {
  b = void 0 === b ? [] : b;
  c = void 0 === c ? [] : c;
  d = void 0 === d ? {} : d;
  const f = {stdio:"pipe", execArgv:[]};
  if ("string" == typeof a) {
    return {i:a, args:b, options:f};
  }
  const {module:h, getArgs:e, options:g, getOptions:k} = a;
  a = e ? await e.call(d, b, ...c) : b;
  b = f;
  g ? b = Object.assign({}, f, g) : k && (c = await k.call(d, ...c), b = Object.assign({}, f, c));
  return {i:h, args:a, options:b};
}, Ua = (a, b, c) => {
  try {
    if ("string" == typeof b) {
      try {
        ma(a, b);
      } catch (d) {
        const f = M(b, a);
        console.log(f);
        throw d;
      }
    } else {
      if (b) {
        const d = JSON.parse(a);
        Pa(d, b);
      }
    }
  } catch (d) {
    throw c && (d.property = c), d;
  }
};
const Va = a => R(/(['"])?([\s\S]+?)\1(\s+|$)/g, a, ["q", "a"]).map(({a:b}) => b);
const Wa = async a => {
  const {forkConfig:b, input:c, props:d = {}, contexts:f = []} = a;
  a = c ? Va(c) : [];
  const {i:h, args:e, options:g} = await Ta(b, a, f, Object.assign({}, d, {input:c}));
  if (!h) {
    throw Error("Please specify a module to fork");
  }
  a = Qa(h, e, g);
  var k = Ra(a);
  a.promise = k;
  a.spawnCommand = a.spawnargs.join(" ");
  const {promise:l, stdout:p, stdin:m, stderr:n} = a, {includeAnswers:r = !0, log:q, inputs:v, stderrInputs:u, stripAnsi:x = !0, preprocess:y} = b;
  a = new T;
  const A = new T;
  !0 === q ? (a.pipe(process.stdout), A.pipe(process.stderr)) : q && (q.stdout && a.pipe(q.stdout), q.stderr && A.pipe(q.stderr));
  const D = r && v;
  k = r && u;
  var t, w;
  D && (t = new V({rs:a}));
  k && (w = new V({rs:A}));
  Sa(p, m, v, a);
  Sa(n, m, u, A);
  a = await l;
  D && (t.end(), t = await t.promise, Object.assign(a, {stdout:t}));
  k && (w.end(), w = await w.promise, Object.assign(a, {stderr:w}));
  var {code:E, stdout:G, stderr:B} = a, C, z;
  "object" == typeof y ? {stdout:C, stderr:z} = y : "function" == typeof y && (C = z = y);
  G = G.replace(/\r?\n$/, "");
  B = B.replace(/\r?\n$/, "");
  t = x ? G.replace(/\033\[.*?m/g, "") : G;
  w = x ? B.replace(/\033\[.*?m/g, "") : B;
  C = C ? C(t) : t;
  z = z ? z(w) : w;
  Ua(C, d.stdout, "stdout");
  Ua(z, d.stderr, "stderr");
  if (d.code && E != d.code) {
    throw z = Error(`Fork exited with code ${E} != ${d.code}`), z.s = "code", z;
  }
  return a;
};
const $a = a => {
  const {input:b, error:c, expected:d, props:f, getThrowsConfig:h, getTransform:e, getResults:g, assertResults:k, mapActual:l, getReadable:p, fork:m} = a;
  return async(...n) => {
    var r = Object.assign({}, {input:b}, f);
    if (c) {
      if (!h) {
        throw Error('No "getThrowsConfig" function is given.');
      }
      r = h.call(r, ...n);
      await Xa(r, c);
    } else {
      if (e) {
        Ya(d), n = await e.call(r, ...n), n.end(b), n = await W(n);
      } else {
        if (p) {
          Ya(d), n = await p.call(r, ...n), n = await W(n);
        } else {
          if (m) {
            r.inputs && (m.inputs = Za(r.inputs));
            var q = await Wa({forkConfig:m, input:b, props:f, contexts:n});
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
      if (void 0 !== d) {
        if (q = l(n), "string" != typeof d) {
          Pa(q, d);
        } else {
          if ("string" != (typeof q).toLowerCase()) {
            throw Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".');
          }
          try {
            la(q, d);
          } catch (v) {
            throw r = M(d, q), console.log(r), v.property = "expected", v;
          }
        }
      }
      k && await k.call(r, n, f);
    }
  };
}, Ya = a => {
  if (void 0 === a) {
    throw Error("No expected output was given.");
  }
}, Za = a => a.split("\n").map(b => {
  const [c, d] = b.split(/: +/);
  return [new RegExp(c), d];
}), Xa = async(a, b) => {
  await Ma(Object.assign({}, a, {message:b}));
};
function ab(a, b, c) {
  c = void 0 === c ? null : c;
  let d;
  const f = a.startsWith("!");
  let h = f ? a.replace(/^!/, "") : a;
  try {
    d = N(h);
  } catch (g) {
    if ("ENOENT" != g.code) {
      throw g;
    }
    h = bb(h, c);
    d = N(h);
  }
  let e;
  if (d.isFile()) {
    e = cb(h, b);
  } else {
    if (d.isDirectory()) {
      const g = P(h);
      e = g.reduce((k, l) => {
        const p = Q(h, l);
        l = l.replace(/\.\w+?$/, "");
        return Object.assign({}, k, {[l]:ab(p, b, g)});
      }, {});
    }
  }
  return f ? {[a]:e} : e;
}
const bb = (a, b) => {
  const c = ia(a);
  b = (b || P(c)).filter(d => d.startsWith(`${ha(a)}.`));
  if (1 < b.length) {
    throw Error(`Could not resolve the result path ${a}, possible files: ${b.join(", ")}.`);
  }
  if (b.length) {
    a = Q(c, b[0]);
  } else {
    throw Error(`Could not resolve the result path ${a}.`);
  }
  return a;
}, db = (a, b) => Object.keys(a).reduce((c, d) => {
  try {
    const f = b.includes(d) ? JSON.parse(a[d]) : a[d];
    c[d] = f;
    return c;
  } catch (f) {
    throw Error(`Could not parse JSON property "${d}": ${f.message}.`);
  }
}, {}), cb = (a, b) => {
  if (!b) {
    throw Error('No configuration is given. A config should at least contain either a "getThrowsConfig", "getResults", "getTransform" or "getReadable" functions.');
  }
  const {context:c, persistentContext:d, getResults:f, getTransform:h, getReadable:e, getThrowsConfig:g, mapActual:k = v => v, assertResults:l, jsonProps:p = [], splitRe:m, fork:n, propEndRe:r, propStartRe:q} = b;
  return ya({path:a, splitRe:m, propEndRe:r, propStartRe:q}).reduce((v, u) => {
    var x = Object.assign({}, u), y = u.name, A = u.input, D = u.error, t = u.j;
    u = (delete x.name, delete x.input, delete x.error, delete x.j, x);
    let w, E, G;
    y in v && (w = `Repeated use of the test name "${y}".`);
    try {
      var B = db(u, p), C = Object.assign({}, B);
      G = B.expected;
      E = (delete C.expected, C);
    } catch (I) {
      ({message:B} = I), w = B;
    }
    let z;
    w ? z = () => {
      throw Error(w);
    } : z = $a({input:A, error:D, getThrowsConfig:g, getTransform:h, getReadable:e, getResults:f, expected:G, assertResults:l, props:E, mapActual:k, fork:n});
    v[y] = async(...I) => {
      try {
        await z(...I);
      } catch (ka) {
        process.env.DEBUG && console.log(K(ka.stack, "red")), await t(ka);
      }
    };
    return v;
  }, Object.assign({}, c ? {context:c} : {}, d ? {persistentContext:d} : {}));
};
DEPACK_EXPORT = ab;


module.exports = DEPACK_EXPORT