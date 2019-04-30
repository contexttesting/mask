             
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
function G(a, b, c, d, f) {
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
function I(a) {
  let b = [];
  for (let c = 0; c < a.length; c++) {
    a[c] && b.push(a[c]);
  }
  return b;
}
function aa(a, b) {
  var c = new ba;
  a = I(a.split(""));
  b = I(b.split(""));
  let d = b.length, f = a.length, h = 1, e = d + f, g = [{b:-1, f:[]}];
  var k = G(c, g[0], b, a, 0);
  if (g[0].b + 1 >= d && k + 1 >= f) {
    return [{value:c.join(b), count:b.length}];
  }
  for (; h <= e;) {
    a: {
      for (k = -1 * h; k <= h; k += 2) {
        var l = g[k - 1];
        let m = g[k + 1];
        var q = (m ? m.b : 0) - k;
        l && (g[k - 1] = void 0);
        let n = l && l.b + 1 < d;
        q = m && 0 <= q && q < f;
        if (n || q) {
          !n || q && l.b < m.b ? (l = {b:m.b, f:m.f.slice(0)}, F(l.f, void 0, !0)) : (l.b++, F(l.f, !0, void 0));
          q = G(c, l, b, a, k);
          if (l.b + 1 >= d && q + 1 >= f) {
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
        l = l.map(function(q, m) {
          m = d[g + m];
          return m.length > q.length ? m : q;
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
function J(a, b) {
  return (b = da[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function K(a) {
  return (a = ea[a]) ? `\x1b[${a}m${" "}\x1b[0m` : " ";
}
function L(a, b) {
  return aa(a, b).map(({c, g:d, value:f}) => {
    const h = f.split(" ");
    return c ? h.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => J(e, "green")).join(K("green")) : d ? h.map(e => e.replace(/\n$/mg, "\u23ce\n")).map(e => J(e, "red")).join(K("red")) : J(f, "grey");
  }).join("");
}
;const {lstatSync:M, readFileSync:N, readdirSync:P, writeFileSync:fa} = fs;
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
    d.stack = d.message;
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
  let h = `${N(b)}`;
  a = f.exec(h);
  if (!a) {
    throw Error(`${b} does not contain tests.`);
  }
  const e = h.slice(0, a.index).replace(/\n\n$/, "");
  a = h.slice(a.index);
  f.lastIndex = 0;
  const g = {};
  a = va(a, f).filter(m => {
    ({match:m} = m);
    return m;
  }).map(m => {
    var {match:n, position:r, separator:p} = m;
    const [u, t] = wa(n), [w, y] = xa(t, new RegExp(`\n${c.source}`)), B = n.indexOf(y);
    m = w.replace(/\n$/, "");
    const A = R(new RegExp(`(${c.source} +(.+) +\\*\\/(\n?))([\\s\\S]*?)\n${d.source}`, "g"), y, ["preValue", "key", "newLine", "value"], !0).reduce((x, v) => {
      var {preValue:H, key:E, newLine:D, value:C, position:z} = v;
      g[E] = {start:r + B + z + H.length + p.length, length:C.length};
      return Object.assign({}, x, {[E]:!C && D ? D : C});
    }, {});
    return Object.assign({}, {name:u, input:m}, e ? {preamble:e} : {}, A);
  });
  const k = h.split("\n");
  let l = 0;
  const q = async(m, n) => {
    const r = new RegExp(`${f.source}${m}\r?$`), p = k.reduce((t, w, y) => t ? t : r.test(w) ? y + 1 : t, null), u = Error(n.message);
    u.stack = `Error: ${n.message}\n    at ${m} (${b}:${p}:1)`;
    if (n.property && n.actual) {
      const {property:t, actual:w, expected:y} = n;
      u.handleUpdate = async() => {
        const B = g[t];
        if (!B) {
          return !1;
        }
        var A = B.start + l, x = h.slice(0, A);
        A = h.slice(A + B.length);
        x = `${x}${w}${A}`;
        console.error('Result does not match property "%s"\n  at %s (%s:%s:1)', t, J(m, "blue"), b, p);
        A = !1;
        const v = await ta();
        "d" == v ? (console.log(J("Actual: ", "blue")), console.log(w), console.log(J("Expected: ", "blue")), console.log(y), A = await ua()) : v && "u" != v || (A = !0);
        if (!A) {
          return !1;
        }
        l += w.length - B.length;
        await fa(b, x);
        h = `${N(b)}`;
        return !0;
      };
    }
    throw u;
  };
  return a.map(m => {
    var n = Object.assign({}, m);
    m = m.name;
    n = (delete n.name, n);
    const r = q.bind(null, m);
    return Object.assign({}, n, {name:m, j:r});
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
    const {m:h = U(!0), proxyError:e} = a || {}, g = (k, l) => h(l);
    super(b);
    this.h = [];
    this.l = new Promise((k, l) => {
      this.on("finish", () => {
        let q;
        d ? q = Buffer.concat(this.h) : q = this.h.join("");
        k(q);
        this.h = [];
      });
      this.once("error", q => {
        if (-1 == q.stack.indexOf("\n")) {
          g`${q}`;
        } else {
          const m = Ha(q.stack);
          q.stack = m;
          e && g`${q}`;
        }
        l(q);
      });
      f && Ja(this, f).pipe(this);
    });
  }
  _write(a, b, c) {
    this.h.push(a);
    c();
  }
  get promise() {
    return this.l;
  }
}
const W = async a => {
  var b = void 0 === b ? {} : b;
  ({promise:a} = new V(Object.assign({}, {rs:a}, b, {m:U(!0)})));
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
        const c = L(`${a}`, `${b}`);
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
    g = void 0 !== g ? J("+ " + Y(g), "green") : null;
    e = void 0 !== e ? J("- " + Y(e), "red") : null;
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
      let q;
      k = e.map((m, n) => {
        q = n;
        (m = h(m, g[n])) && (m = `${f(`[${n}]`)}\n${m}`);
        return m;
      }).filter(Boolean);
      l = g.slice(q + 1).map((m, n) => `${f(`[${q + n + 1}]`)}\n${d(void 0, m)}`);
      return [...k, ...l].join("\n");
    }
    if ("object" == typeof e && "object" == typeof g) {
      const q = [], m = [], n = [];
      Object.keys(e).forEach(p => {
        p in g ? n.push(p) : m.push(p);
      });
      Object.keys(g).forEach(p => {
        p in e || q.push(p);
      });
      k = m.map(p => d(`${p}${`: ${Y(e[p])}`}`));
      l = q.map(p => d(void 0, `${p}: ${Y(g[p])}`));
      const r = n.map(p => {
        c++;
        const u = h(e[p], g[p]);
        let t = "";
        u && (t += f(Array.isArray(e[p]) && Array.isArray(g[p]) ? `${p}.Array` : p), t += "\n" + u);
        c--;
        return t;
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
        const f = L(b, a);
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
  const {promise:l, stdout:q, stdin:m, stderr:n} = a, {includeAnswers:r = !0, log:p, inputs:u, stderrInputs:t, stripAnsi:w = !0, preprocess:y} = b;
  a = new T;
  const B = new T;
  !0 === p ? (a.pipe(process.stdout), B.pipe(process.stderr)) : p && (p.stdout && a.pipe(p.stdout), p.stderr && B.pipe(p.stderr));
  const A = r && u;
  k = r && t;
  var x, v;
  A && (x = new V({rs:a}));
  k && (v = new V({rs:B}));
  Sa(q, m, u, a);
  Sa(n, m, t, B);
  a = await l;
  A && (x.end(), x = await x.promise, Object.assign(a, {stdout:x}));
  k && (v.end(), v = await v.promise, Object.assign(a, {stderr:v}));
  var {code:H, stdout:E, stderr:D} = a, C, z;
  "object" == typeof y ? {stdout:C, stderr:z} = y : "function" == typeof y && (C = z = y);
  E = E.replace(/\r?\n$/, "");
  D = D.replace(/\r?\n$/, "");
  x = w ? E.replace(/\033\[.*?m/g, "") : E;
  v = w ? D.replace(/\033\[.*?m/g, "") : D;
  C = C ? C(x) : x;
  z = z ? z(v) : v;
  Ua(C, d.stdout, "stdout");
  Ua(z, d.stderr, "stderr");
  if (d.code && H != d.code) {
    throw z = Error(`Fork exited with code ${H} != ${d.code}`), z.o = "code", z;
  }
  return a;
};
const $a = a => {
  const {input:b, error:c, expected:d, props:f, getThrowsConfig:h, getTransform:e, getResults:g, assertResults:k, mapActual:l, getReadable:q, fork:m} = a;
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
        if (q) {
          Ya(d), n = await q.call(r, ...n), n = await W(n);
        } else {
          if (m) {
            r.inputs && (m.inputs = Za(r.inputs));
            var p = await Wa({forkConfig:m, input:b, props:f, contexts:n});
            n = g ? await g.call(r, ...n) : p;
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
        if (p = l(n), "string" != typeof d) {
          Pa(p, d);
        } else {
          if ("string" != (typeof p).toLowerCase()) {
            throw Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".');
          }
          try {
            la(p, d);
          } catch (u) {
            throw r = L(d, p), console.log(r), u.property = "expected", u;
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
    d = M(h);
  } catch (g) {
    if ("ENOENT" != g.code) {
      throw g;
    }
    h = bb(h, c);
    d = M(h);
  }
  let e;
  if (d.isFile()) {
    e = cb(h, b);
  } else {
    if (d.isDirectory()) {
      const g = P(h);
      e = g.reduce((k, l) => {
        const q = Q(h, l);
        l = l.replace(/\.\w+?$/, "");
        return Object.assign({}, k, {[l]:ab(q, b, g)});
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
  const {context:c, persistentContext:d, getResults:f, getTransform:h, getReadable:e, getThrowsConfig:g, mapActual:k = u => u, assertResults:l, jsonProps:q = [], splitRe:m, fork:n, propEndRe:r, propStartRe:p} = b;
  return ya({path:a, splitRe:m, propEndRe:r, propStartRe:p}).reduce((u, t) => {
    var w = Object.assign({}, t), y = t.name, B = t.input, A = t.error, x = t.j;
    t = (delete w.name, delete w.input, delete w.error, delete w.j, w);
    let v, H, E;
    y in u && (v = `Repeated use of the test name "${y}".`);
    try {
      var D = db(t, q), C = Object.assign({}, D);
      E = D.expected;
      H = (delete C.expected, C);
    } catch (O) {
      ({message:D} = O), v = D;
    }
    let z;
    v ? z = () => {
      throw Error(v);
    } : z = $a({input:B, error:A, getThrowsConfig:g, getTransform:h, getReadable:e, getResults:f, expected:E, assertResults:l, props:H, mapActual:k, fork:n});
    u[y] = async(...O) => {
      try {
        await z(...O);
      } catch (ka) {
        process.env.DEBUG && console.log(J(ka.stack, "red")), await x(ka);
      }
    };
    return u;
  }, Object.assign({}, c ? {context:c} : {}, d ? {persistentContext:d} : {}));
};
DEPACK_EXPORT = ab;


module.exports = DEPACK_EXPORT
//# sourceMappingURL=depack.js.map