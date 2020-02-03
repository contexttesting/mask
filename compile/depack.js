#!/usr/bin/env node
             
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const os = require('os');
const readline = require('readline');
const stream = require('stream');
const child_process = require('child_process');             
/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
function C(a, b, d) {
  let g = a[a.length - 1];
  g && g.c === b && g.g === d ? a[a.length - 1] = {count:g.count + 1, c:b, g:d} : a.push({count:1, c:b, g:d});
}
function D(a, b, d, g, f) {
  let h = d.length, c = g.length, e = b.b;
  f = e - f;
  let k = 0;
  for (; e + 1 < h && f + 1 < c && a.equals(d[e + 1], g[f + 1]);) {
    e++, f++, k++;
  }
  k && b.f.push({count:k});
  b.b = e;
  return f;
}
function F(a) {
  let b = [];
  for (let d = 0; d < a.length; d++) {
    a[d] && b.push(a[d]);
  }
  return b;
}
function aa(a, b) {
  var d = new ba;
  a = F(a.split(""));
  b = F(b.split(""));
  let g = b.length, f = a.length, h = 1, c = g + f, e = [{b:-1, f:[]}];
  var k = D(d, e[0], b, a, 0);
  if (e[0].b + 1 >= g && k + 1 >= f) {
    return [{value:d.join(b), count:b.length}];
  }
  for (; h <= c;) {
    a: {
      for (k = -1 * h; k <= h; k += 2) {
        var l = e[k - 1];
        let m = e[k + 1];
        var q = (m ? m.b : 0) - k;
        l && (e[k - 1] = void 0);
        let r = l && l.b + 1 < g;
        q = m && 0 <= q && q < f;
        if (r || q) {
          !r || q && l.b < m.b ? (l = {b:m.b, f:m.f.slice(0)}, C(l.f, void 0, !0)) : (l.b++, C(l.f, !0, void 0));
          q = D(d, l, b, a, k);
          if (l.b + 1 >= g && q + 1 >= f) {
            k = ca(d, l.f, b, a);
            break a;
          }
          e[k] = l;
        } else {
          e[k] = void 0;
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
function ca(a, b, d, g) {
  let f = 0, h = b.length, c = 0, e = 0;
  for (; f < h; f++) {
    var k = b[f];
    if (k.g) {
      k.value = a.join(g.slice(e, e + k.count)), e += k.count, f && b[f - 1].c && (k = b[f - 1], b[f - 1] = b[f], b[f] = k);
    } else {
      if (k.c) {
        k.value = a.join(d.slice(c, c + k.count));
      } else {
        let l = d.slice(c, c + k.count);
        l = l.map(function(q, m) {
          m = g[e + m];
          return m.length > q.length ? m : q;
        });
        k.value = a.join(l);
      }
      c += k.count;
      k.c || (e += k.count);
    }
  }
  d = b[h - 1];
  1 < h && "string" === typeof d.value && (d.c || d.g) && a.equals("", d.value) && (b[h - 2].value += d.value, b.pop());
  return b;
}
;const da = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, ea = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function I(a, b) {
  return (b = da[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function J(a) {
  return (a = ea[a]) ? `\x1b[${a}m${" "}\x1b[0m` : " ";
}
function K(a, b) {
  return aa(a, b).map(({c:d, g, value:f}) => {
    const h = f.split(" ");
    return d ? h.map(c => c.replace(/\n$/mg, "\u23ce\n")).map(c => I(c, "green")).join(J("green")) : g ? h.map(c => c.replace(/\n$/mg, "\u23ce\n")).map(c => I(c, "red")).join(J("red")) : I(f, "grey");
  }).join("");
}
;const L = fs.lstatSync, M = fs.readFileSync, N = fs.readdirSync, fa = fs.writeFileSync;
const O = path.basename, ha = path.dirname, Q = path.join;
const ia = assert.deepStrictEqual, ja = assert.equal, ka = assert.strictEqual;
function R(a, b, d, g = !1) {
  const f = [];
  b.replace(a, (h, ...c) => {
    h = c[c.length - 2];
    h = g ? {position:h} : {};
    c = c.slice(0, c.length - 2).reduce((e, k, l) => {
      l = d[l];
      if (!l || void 0 === k) {
        return e;
      }
      e[l] = k;
      return e;
    }, h);
    f.push(c);
  });
  return f;
}
;const ma = readline.createInterface;
function na(a, b, d) {
  return setTimeout(() => {
    const g = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    g.stack = `Error: ${g.message}`;
    d(g);
  }, b);
}
function oa(a, b) {
  let d;
  const g = new Promise((f, h) => {
    d = na(a, b, h);
  });
  return {timeout:d, promise:g};
}
async function pa(a, b, d) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {promise:g, timeout:f} = oa(d, b);
  try {
    return await Promise.race([a, g]);
  } finally {
    clearTimeout(f);
  }
}
;function qa(a, b = {}) {
  const {timeout:d, password:g = !1, output:f = process.stdout, input:h = process.stdin, ...c} = b;
  b = ma({input:h, output:f, ...c});
  if (g) {
    const k = b.output;
    b._writeToOutput = l => {
      if (["\r\n", "\n", "\r"].includes(l)) {
        return k.write(l);
      }
      l = l.split(a);
      "2" == l.length ? (k.write(a), k.write("*".repeat(l[1].length))) : k.write("*");
    };
  }
  var e = new Promise(b.question.bind(b, a));
  e = d ? pa(e, d, `reloquent: ${a}`) : e;
  b.promise = ra(e, b);
  return b;
}
const ra = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function sa(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(d, g) => {
    d = await d;
    var f = a[g];
    switch(typeof f) {
      case "object":
        f = {...f};
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
      var c = f.defaultValue;
    }
    f.getDefault && (h = await f.getDefault());
    let e = c || "";
    c && h && c != h ? e = `\x1b[90m${c}\x1b[0m` : c && c == h && (e = "");
    c = h || "";
    ({promise:c} = qa(`${f.text}${e ? `[${e}] ` : ""}${c ? `[${c}] ` : ""}`, {timeout:b, password:f.password}));
    h = await c || h || f.defaultValue;
    "function" == typeof f.validation && f.validation(h);
    "function" == typeof f.postProcess && (h = await f.postProcess(h));
    return {...d, [g]:h};
  }, {});
}
;async function ta() {
  const {question:a} = await sa({question:"Show more (d), skip (s), or update (u): [u]"}, void 0);
  return a;
}
async function ua() {
  const {defaultYes:a = !0, timeout:b} = {};
  var d = "Update the result".endsWith("?");
  ({question:d} = await sa({question:{text:`${d ? "Update the result".replace(/\?$/, "") : "Update the result"} (y/n)${d ? "?" : ""}`, defaultValue:a ? "y" : "n"}}, b));
  return "y" == d;
}
;const va = (a, b) => {
  let d = [];
  a.replace(b, (g, f) => {
    d.push({position:f, separator:g});
  });
  d = [{position:0, separator:""}, ...d];
  return d.reduce((g, {position:f, separator:h}, c, e) => {
    var k = h.length;
    c = e[c + 1];
    if (!c) {
      return k = a.slice(f + k), g.push({position:f, separator:h, match:k}), g;
    }
    k = a.slice(f + k, c.position);
    g.push({position:f, separator:h, match:k});
    return g;
  }, []);
}, wa = (a, b, d) => Object.keys(a).reduce((g, f) => {
  let h;
  const c = a[f];
  if (b.includes(f)) {
    try {
      h = JSON.parse(c);
    } catch (e) {
      throw Error(`Could not parse JSON property "${f}": ${e.message}.`);
    }
  } else {
    if (d.includes(f)) {
      try {
        h = eval(`(${c})`);
      } catch (e) {
        throw Error(`Could not evaluate JS property "${f}": ${e.message}.`);
      }
    } else {
      h = c;
    }
  }
  g[f] = h;
  return g;
}, {});
const S = os.EOL, xa = os.homedir;
const Aa = a => {
  const {path:b, propStartRe:d = /\/\*/, propEndRe:g = /\/\*\*\//} = a;
  let {splitRe:f} = a;
  f || (f = b.endsWith(".md") ? /^## /gm : /^\/\/ /gm);
  let h = `${M(b)}`;
  const c = f.exec(h);
  if (!c) {
    throw Error(`${b} does not contain tests.`);
  }
  const e = h.slice(0, c.index).replace(/\r?\n\r?\n$/, "");
  a = h.slice(c.index);
  f.lastIndex = 0;
  a = va(a, f).filter(({match:m}) => m).map(({match:m, position:r, separator:p}) => {
    const [n, t] = ya(m), [x, v] = za(t, new RegExp(`\\r?\\n${d.source}`)), z = m.indexOf(v);
    m = x.replace(/\r?\n$/, "");
    const w = c.index + z + r + p.length, y = {};
    r = R(new RegExp(`(${d.source} +(.+) +\\*\\/(\\r?\\n?))([\\s\\S]*?)\\r?\\n${g.source}`, "g"), v, ["preValue", "key", "newLine", "value"], !0).reduce((u, {preValue:A, key:B, newLine:G, value:E, position:H}) => {
      y[B] = {start:w + H + A.length, length:E.length};
      return {...u, [B]:!E && G ? G : E};
    }, {});
    return {name:n, input:m, s:y, ...e ? {preamble:e} : {}, ...r};
  });
  const k = h.split(S);
  let l = 0;
  const q = async(m, r, p) => {
    const n = new RegExp(`${f.source}${m}\r?$`), t = k.reduce((v, z, w) => v ? v : n.test(z) ? w + 1 : v, null), x = Error(p.message);
    x.stack = `Error: ${p.message}${S}    at ${m} (${b}:${t}:1)`;
    if (p.property && p.actual) {
      const {property:v, actual:z, expected:w} = p;
      x.handleUpdate = async() => {
        const y = r[v];
        if (!y) {
          return !1;
        }
        var u = y.start + l, A = h.slice(0, u);
        u = h.slice(u + y.length);
        A = `${A}${z}${u}`;
        console.error('Result does not match property "%s"', v);
        console.error("  at %s (%s:%s:1)", I(m, "blue"), b, t);
        u = !1;
        const B = await ta();
        "d" == B ? (console.log(I("Actual: ", "blue")), console.log(z), console.log(I("Expected: ", "blue")), console.log(w), u = await ua()) : B && "u" != B || (u = !0);
        if (!u) {
          return !1;
        }
        l += z.length - y.length;
        await fa(b, A);
        h = `${M(b)}`;
        return !0;
      };
    }
    throw x;
  };
  return a.map(({name:m, s:r, ...p}) => {
    r = q.bind(null, m, r);
    return {...p, name:m, o:r};
  });
}, za = (a, b) => {
  const d = a.search(b);
  if (0 > d) {
    throw Error(`Could not process "${a}": propStart re ${b} returned -1`);
  }
  return [a.substr(0, d), a.substr(d + 1)];
}, ya = a => {
  const b = a.indexOf(S);
  return [a.substr(0, b), a.substr(b + S.length)];
}, Ba = (a, b, d = console.log) => {
  try {
    ja(a, b);
  } catch (g) {
    throw a = K(b, a), d(a), g.property = "expected", g;
  }
};
const Ca = stream.PassThrough, Da = stream.Writable;
const Ea = (a, b = 0, d = !1) => {
  if (0 === b && !d) {
    return a;
  }
  a = a.split("\n", d ? b + 1 : void 0);
  return d ? a[a.length - 1] : a.slice(b).join("\n");
}, Fa = (a, b = !1) => Ea(a, 2 + (b ? 1 : 0)), Ga = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const Ha = /\s+at.*(?:\(|\s)(.*)\)?/, Ia = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, Ja = xa(), Ka = a => {
  const {pretty:b = !1, ignoredModules:d = ["pirates"]} = {}, g = d.join("|"), f = new RegExp(Ia.source.replace("IGNORED_MODULES", g));
  return a.replace(/\\/g, "/").split("\n").filter(h => {
    h = h.match(Ha);
    if (null === h || !h[1]) {
      return !0;
    }
    h = h[1];
    return h.includes(".app/Contents/Resources/electron.asar") || h.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(h);
  }).filter(h => h.trim()).map(h => b ? h.replace(Ha, (c, e) => c.replace(e, e.replace(Ja, "~"))) : h).join("\n");
};
function La(a, b, d = !1) {
  return function(g) {
    var f = Ga(arguments), {stack:h} = Error();
    const c = Ea(h, 2, !0), e = (h = g instanceof Error) ? g.message : g;
    f = [`Error: ${e}`, ...null !== f && a === f || d ? [b] : [c, b]].join("\n");
    f = Ka(f);
    return Object.assign(h ? g : Error(), {message:e, stack:f});
  };
}
;function T(a) {
  var {stack:b} = Error();
  const d = Ga(arguments);
  b = Fa(b, a);
  return La(d, b, a);
}
;const Ma = (a, b) => {
  b.once("error", d => {
    a.emit("error", d);
  });
  return b;
};
class U extends Da {
  constructor(a) {
    const {binary:b = !1, rs:d = null, ...g} = a || {}, {m:f = T(!0), proxyError:h} = a || {}, c = (e, k) => f(k);
    super(g);
    this.h = [];
    this.l = new Promise((e, k) => {
      this.on("finish", () => {
        let l;
        b ? l = Buffer.concat(this.h) : l = this.h.join("");
        e(l);
        this.h = [];
      });
      this.once("error", l => {
        if (-1 == l.stack.indexOf("\n")) {
          c`${l}`;
        } else {
          const q = Ka(l.stack);
          l.stack = q;
          h && c`${l}`;
        }
        k(l);
      });
      d && Ma(this, d).pipe(this);
    });
  }
  _write(a, b, d) {
    this.h.push(a);
    d();
  }
  get promise() {
    return this.l;
  }
}
const V = async a => {
  ({promise:a} = new U({rs:a, m:T(!0)}));
  return await a;
};
const Na = async(a, b) => {
  await b(a);
}, Oa = async(a, b) => {
  if (b instanceof RegExp) {
    if (!b.test(a)) {
      throw Error(`${a} does not match regular expression ${b}`);
    }
  } else {
    if ("function" == typeof b) {
      await Na(a, b);
    } else {
      if (b && a != b) {
        const d = K(`${a}`, `${b}`);
        throw Error(`${d}\n${`${a} != ${b}`}`);
      }
    }
  }
};
async function Pa(a) {
  if (!a) {
    throw Error("Config expected.");
  }
  const b = T(!0), {fn:d, args:g = [], context:f, error:h, ...c} = a;
  if ("function" != typeof d) {
    throw Error("Function expected.");
  }
  a = Array.isArray(g) ? g : [g];
  try {
    return await Qa(d, f, a, h, c);
  } catch (e) {
    throw b(e);
  }
}
const Qa = async(a, b, d, g, f) => {
  const h = Error();
  try {
    throw b ? await a.call(b, ...d) : await a(...d), h;
  } catch (c) {
    if (c === h) {
      throw Error(`Function ${a.name && "fn" !== a.name ? `${a.name} ` : ""}should have thrown.`);
    }
    if (g && g !== c) {
      throw Error(`${c} is not strict equal to ${g}.`);
    }
    await Object.keys(f).reduce(async(e, k) => {
      await e;
      await Oa(c[k], f[k]);
    }, {});
    return c;
  }
};
const W = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function Ra(a, b) {
  let d = 0;
  const g = (c, e) => {
    const k = " ".repeat(2 * d);
    e = void 0 !== e ? I("+ " + X(e), "green") : null;
    c = void 0 !== c ? I("- " + X(c), "red") : null;
    const l = [];
    c && l.push(W(k, c));
    e && l.push(W(k, e));
    return l.join("\n");
  }, f = c => {
    const e = " ".repeat(2 * d);
    return W(e, c);
  }, h = (c, e) => {
    if (c instanceof Date && e instanceof Date) {
      var k = c.getTime() != e.getTime() ? !1 : void 0;
      return k ? "" : g(c, e);
    }
    if (c instanceof Date && !(e instanceof Date) || !(c instanceof Date) && e instanceof Date || Array.isArray(c) && !Array.isArray(e) || !Array.isArray(c) && Array.isArray(e)) {
      return g(c, e);
    }
    if (Y(c) && Y(e) || !Y(c) && Y(e) || Y(c) && !Y(e)) {
      return c != e ? g(c, e) : "";
    }
    if (c.constructor && !e.constructor) {
      return g(c.constructor.name, e);
    }
    if (!c.constructor && e.constructor) {
      return g(c, e.constructor.name);
    }
    if (c.constructor && e.constructor) {
      if (c.constructor.name != e.constructor.name) {
        return g(c.constructor.name, e.constructor.name);
      }
      k = c.valueOf();
      var l = e.valueOf();
      if (Y(k) && Y(l) && k != l) {
        return g(k, l);
      }
    }
    if (Array.isArray(c) && Array.isArray(e)) {
      let q;
      k = c.map((m, r) => {
        q = r;
        (m = h(m, e[r])) && (m = `${f(`[${r}]`)}\n${m}`);
        return m;
      }).filter(Boolean);
      l = e.slice(q + 1).map((m, r) => `${f(`[${q + r + 1}]`)}\n${g(void 0, m)}`);
      return [...k, ...l].join("\n");
    }
    if ("object" == typeof c && "object" == typeof e) {
      const q = [], m = [], r = [];
      Object.keys(c).forEach(n => {
        n in e ? r.push(n) : m.push(n);
      });
      Object.keys(e).forEach(n => {
        n in c || q.push(n);
      });
      k = m.map(n => g(`${n}${`: ${X(c[n])}`}`));
      l = q.map(n => g(void 0, `${n}: ${X(e[n])}`));
      const p = r.map(n => {
        d++;
        const t = h(c[n], e[n]);
        let x = "";
        t && (x += f(Array.isArray(c[n]) && Array.isArray(e[n]) ? `${n}.Array` : n), x += "\n" + t);
        d--;
        return x;
      }).filter(Boolean);
      return [...k, ...l, ...p].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", c, e);
  };
  return h(a, b);
}
const Y = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), X = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
function Sa(a, b) {
  try {
    ia(a, b, void 0);
  } catch (d) {
    throw a = Ra(b, a), d.message = [d.message, a].filter(Boolean).join("\n"), d;
  }
}
;const Ta = child_process.fork;
const Ua = async a => {
  const [b, d, g] = await Promise.all([new Promise((f, h) => {
    a.on("error", h).on("exit", c => {
      f(c);
    });
  }), a.stdout ? V(a.stdout) : void 0, a.stderr ? V(a.stderr) : void 0]);
  return {code:b, stdout:d, stderr:g};
};
const Va = (a, b, d = [], g = null) => {
  if (g) {
    a.on("data", e => g.write(e));
  }
  let [f, ...h] = d;
  if (f) {
    var c = e => {
      const [k, l] = f;
      k.test(e) && (e = `${l}\n`, g && g.write(e), b.write(e), [f, ...h] = h, f || a.removeListener("data", c));
    };
    a.on("data", c);
  }
};
const Wa = async(a, b = [], d = [], g = {}) => {
  const f = {stdio:"pipe", execArgv:[]};
  if ("string" == typeof a) {
    return {j:a, args:b, options:f};
  }
  const h = a.module;
  var c = a.getArgs;
  const e = a.options;
  a = a.getOptions;
  b = c ? await c.call(g, b, ...d) : b;
  c = f;
  e ? c = {...f, ...e} : a && (d = await a.call(g, ...d), c = {...f, ...d});
  return {j:h, args:b, options:c};
}, Xa = (a, b, d) => {
  try {
    if ("string" == typeof b) {
      try {
        ka(a, b);
      } catch (g) {
        const f = K(b, a);
        console.log(f);
        throw g;
      }
    } else {
      if (b) {
        const g = JSON.parse(a);
        Sa(g, b);
      }
    }
  } catch (g) {
    throw d && (g.property = d), g;
  }
};
const Ya = a => R(/(['"])?([\s\S]+?)\1(\s+|$)/g, a, ["q", "a"]).map(({a:b}) => b);
const $a = async a => {
  const {forkConfig:b, input:d, props:g = {}, contexts:f = []} = a;
  a = d ? Ya(d) : [];
  const {j:h, args:c, options:e} = await Wa(b, a, f, {...g, input:d});
  if (!h) {
    throw Error("Please specify a module to fork");
  }
  a = Ta(h, c, e);
  var k = Ua(a);
  a.promise = k;
  a.spawnCommand = a.spawnargs.join(" ");
  const {promise:l, stdout:q, stdin:m, stderr:r} = a, {includeAnswers:p = !0, log:n, inputs:t, stderrInputs:x, stripAnsi:v = !0, preprocess:z} = b;
  var w = new Ca;
  const y = new Ca;
  !0 === n ? (w.pipe(process.stdout), y.pipe(process.stderr)) : n && (n.stdout && w.pipe(n.stdout), n.stderr && y.pipe(n.stderr));
  k = p && t;
  a = p && x;
  var u, A;
  k && (u = new U({rs:w}));
  a && (A = new U({rs:y}));
  Va(q, m, t, w);
  Va(r, m, x, y);
  w = await l;
  k && (u.end(), u = await u.promise, Object.assign(w, {stdout:u}));
  a && (A.end(), A = await A.promise, Object.assign(w, {stderr:A}));
  Za(w, g, v, z);
  return w;
}, Za = ({code:a, stdout:b, stderr:d}, g, f, h) => {
  var c, e;
  "object" == typeof h ? {stdout:c, stderr:e} = h : "function" == typeof h && (c = e = h);
  b = b.replace(/\r?\n$/, "");
  d = d.replace(/\r?\n$/, "");
  b = f ? b.replace(/\033\[.*?m/g, "") : b;
  d = f ? d.replace(/\033\[.*?m/g, "") : d;
  c = c ? c(b) : b;
  e = e ? e(d) : d;
  Xa(c, g.stdout, "stdout");
  Xa(e, g.stderr, "stderr");
  if (g.code && a != g.code) {
    throw a = Error(`Fork exited with code ${a} != ${g.code}`), a.u = "code", a;
  }
};
const db = a => {
  const b = a.input, d = a.error, g = a.expected, f = a.props, h = a.getThrowsConfig, c = a.getTransform, e = a.getResults, k = a.assertResults, l = a.mapActual, q = a.getReadable, m = a.fork, r = a.i;
  return async(...p) => {
    var n = {input:b, ...f};
    if (d) {
      if (!h) {
        throw Error('No "getThrowsConfig" function is given.');
      }
      n = h.call(n, ...p);
      await ab(n, d);
    } else {
      if (c) {
        bb(g), p = await c.call(n, ...p), p.end(b), p = await V(p);
      } else {
        if (q) {
          bb(g), p = await q.call(n, ...p), p = await V(p);
        } else {
          if (m) {
            n.inputs && (m.inputs = cb(n.inputs));
            var t = await $a({forkConfig:m, input:b, props:f, contexts:p});
            p = e ? await e.call(n, ...p) : t;
          } else {
            if (e) {
              p = await e.call(n, ...p);
            } else {
              throw Error("Nothing was tested.");
            }
          }
        }
      }
      if (void 0 !== g) {
        if (t = l(p), "string" != typeof g) {
          Sa(t, g);
        } else {
          if ("string" != (typeof t).toLowerCase()) {
            throw Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".');
          }
          Ba(t, g, r);
        }
      }
      k && await k.call(n, p, f);
    }
  };
}, bb = a => {
  if (void 0 === a) {
    throw Error("No expected output was given.");
  }
}, cb = a => a.split(S).map(b => {
  const [d, g] = b.split(/: +/);
  return [new RegExp(d), g];
}), ab = async(a, b) => {
  await Pa({...a, message:b});
};
function Z(a, b, d = null) {
  if (Array.isArray(a)) {
    return a.reduce((e, k) => {
      const l = O(k.replace(/\.\w+?$/, ""));
      k = Z(k, b, d);
      Object.assign(e, {[l]:k});
      return e;
    }, {});
  }
  let g;
  const f = a.startsWith("!");
  let h = f ? a.replace(/^!/, "") : a;
  try {
    g = L(h);
  } catch (e) {
    if ("ENOENT" != e.code) {
      throw e;
    }
    h = eb(h, d);
    g = L(h);
  }
  let c;
  if (g.isFile()) {
    c = fb(h, b);
  } else {
    if (g.isDirectory()) {
      const e = N(h);
      c = e.reduce((k, l) => {
        const q = Q(h, l);
        l = l.replace(/\.\w+?$/, "");
        return {...k, [l]:Z(q, b, e)};
      }, {});
    }
  }
  return f ? {[a]:c} : c;
}
const eb = (a, b) => {
  const d = ha(a);
  b = (b || N(d)).filter(g => g.startsWith(`${O(a)}.`));
  if (1 < b.length) {
    throw Error(`Could not resolve the result path ${a}, possible files: ${b.join(", ")}.`);
  }
  if (b.length) {
    a = Q(d, b[0]);
  } else {
    throw Error(`Could not resolve the result path ${a}.`);
  }
  return a;
}, fb = (a, b) => {
  if (!b) {
    throw Error('No configuration is given. A config should at least contain either a "getThrowsConfig", "getResults", "getTransform" or "getReadable" functions.');
  }
  const {context:d, persistentContext:g, getResults:f, getTransform:h, getReadable:c, getThrowsConfig:e, mapActual:k = v => v, assertResults:l, jsonProps:q = [], jsProps:m = [], splitRe:r, fork:p, propEndRe:n, propStartRe:t, i:x} = b;
  return Aa({path:a, splitRe:r, propEndRe:n, propStartRe:t}).reduce((v, {name:z, input:w, error:y, o:u, ...A}) => {
    let B, G, E;
    z in v && (B = `Repeated use of the test name "${z}".`);
    try {
      ({expected:E, ...G} = wa(A, q, m));
    } catch ({message:P}) {
      B = P;
    }
    let H;
    B ? H = () => {
      throw Error(B);
    } : H = db({input:w, error:y, getThrowsConfig:e, getTransform:h, getReadable:c, getResults:f, expected:E, assertResults:l, props:G, mapActual:k, fork:p, i:x});
    v[z] = async(...P) => {
      try {
        await H(...P);
      } catch (la) {
        process.env.DEBUG && console.log(I(la.stack, "red")), await u(la);
      }
    };
    return v;
  }, {...d ? {context:d} : {}, ...g ? {persistentContext:g} : {}});
};
module.exports = Z;

