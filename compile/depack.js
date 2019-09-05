#!/usr/bin/env node
             
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
function B(a, b, d) {
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
function H(a) {
  let b = [];
  for (let d = 0; d < a.length; d++) {
    a[d] && b.push(a[d]);
  }
  return b;
}
function aa(a, b) {
  var d = new ba;
  a = H(a.split(""));
  b = H(b.split(""));
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
        let n = l && l.b + 1 < g;
        q = m && 0 <= q && q < f;
        if (n || q) {
          !n || q && l.b < m.b ? (l = {b:m.b, f:m.f.slice(0)}, B(l.f, void 0, !0)) : (l.b++, B(l.f, !0, void 0));
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
;const {lstatSync:L, readFileSync:M, readdirSync:N, writeFileSync:fa} = fs;
const {basename:ha, dirname:ja, join:O} = path;
const {deepStrictEqual:ka, equal:la, strictEqual:ma} = assert;
function P(a, b, d, g = !1) {
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
;const {createInterface:na} = readline;
function oa(a, b, d) {
  return setTimeout(() => {
    const g = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    g.stack = `Error: ${g.message}`;
    d(g);
  }, b);
}
function pa(a, b) {
  let d;
  const g = new Promise((f, h) => {
    d = oa(a, b, h);
  });
  return {timeout:d, promise:g};
}
async function qa(a, b, d) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {promise:g, timeout:f} = pa(d, b);
  try {
    return await Promise.race([a, g]);
  } finally {
    clearTimeout(f);
  }
}
;function ra(a, b = {}) {
  const {timeout:d, password:g = !1, output:f = process.stdout, input:h = process.stdin, ...c} = b;
  b = na({input:h, output:f, ...c});
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
  e = d ? qa(e, d, `reloquent: ${a}`) : e;
  b.promise = sa(e, b);
  return b;
}
const sa = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function Q(a, b) {
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
    ({promise:c} = ra(`${f.text}${e ? `[${e}] ` : ""}${c ? `[${c}] ` : ""}`, {timeout:b, password:f.password}));
    h = await c || h || f.defaultValue;
    "function" == typeof f.validation && f.validation(h);
    "function" == typeof f.postProcess && (h = await f.postProcess(h));
    return {...d, [g]:h};
  }, {});
}
;async function ta() {
  const {question:a} = await Q({question:"Show more (d), skip (s), or update (u): [u]"}, void 0);
  return a;
}
async function ua() {
  const {defaultYes:a = !0, timeout:b} = {};
  var d = "Update the result".endsWith("?");
  ({question:d} = await Q({question:{text:`${d ? "Update the result".replace(/\?$/, "") : "Update the result"} (y/n)${d ? "?" : ""}`, defaultValue:a ? "y" : "n"}}, b));
  return "y" == d;
}
;const va = (a, b) => {
  let d = [];
  a.replace(b, (g, f) => {
    d.push({position:f, separator:g});
  });
  d = [{position:0, separator:""}, ...d];
  return d.reduce((g, {position:f, separator:h}, c, e) => {
    var {length:k} = h;
    c = e[c + 1];
    if (!c) {
      return k = a.slice(f + k), g.push({position:f, separator:h, match:k}), g;
    }
    ({position:c} = c);
    k = a.slice(f + k, c);
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
const za = a => {
  const {path:b, propStartRe:d = /\/\*/, propEndRe:g = /\/\*\*\//} = a;
  let {splitRe:f} = a;
  f || (f = b.endsWith(".md") ? /^## /gm : /^\/\/ /gm);
  let h = `${M(b)}`;
  const c = f.exec(h);
  if (!c) {
    throw Error(`${b} does not contain tests.`);
  }
  const e = h.slice(0, c.index).replace(/\n\n$/, "");
  a = h.slice(c.index);
  f.lastIndex = 0;
  a = va(a, f).filter(({match:m}) => m).map(({match:m, position:n, separator:r}) => {
    const [p, x] = xa(m), [t, y] = ya(x, new RegExp(`\n${d.source}`)), A = m.indexOf(y);
    m = t.replace(/\n$/, "");
    const v = c.index + A + n + r.length, z = {};
    n = P(new RegExp(`(${d.source} +(.+) +\\*\\/(\n?))([\\s\\S]*?)\n${g.source}`, "g"), y, ["preValue", "key", "newLine", "value"], !0).reduce((u, {preValue:w, key:C, newLine:F, value:E, position:G}) => {
      z[C] = {start:v + G + w.length, length:E.length};
      return {...u, [C]:!E && F ? F : E};
    }, {});
    return {name:p, input:m, o:z, ...e ? {preamble:e} : {}, ...n};
  });
  const k = h.split("\n");
  let l = 0;
  const q = async(m, n, r) => {
    const p = new RegExp(`${f.source}${m}\r?$`), x = k.reduce((y, A, v) => y ? y : p.test(A) ? v + 1 : y, null), t = Error(r.message);
    t.stack = `Error: ${r.message}\n    at ${m} (${b}:${x}:1)`;
    if (r.property && r.actual) {
      const {property:y, actual:A, expected:v} = r;
      t.handleUpdate = async() => {
        const z = n[y];
        if (!z) {
          return !1;
        }
        var u = z.start + l, w = h.slice(0, u);
        u = h.slice(u + z.length);
        w = `${w}${A}${u}`;
        console.error('Result does not match property "%s"\n  at %s (%s:%s:1)', y, I(m, "blue"), b, x);
        u = !1;
        const C = await ta();
        "d" == C ? (console.log(I("Actual: ", "blue")), console.log(A), console.log(I("Expected: ", "blue")), console.log(v), u = await ua()) : C && "u" != C || (u = !0);
        if (!u) {
          return !1;
        }
        l += A.length - z.length;
        await fa(b, w);
        h = `${M(b)}`;
        return !0;
      };
    }
    throw t;
  };
  return a.map(({name:m, o:n, ...r}) => {
    n = q.bind(null, m, n);
    return {...r, name:m, m:n};
  });
}, ya = (a, b) => {
  const d = a.search(b);
  if (0 > d) {
    throw Error(`Could not process "${a}": propStart re ${b} returned -1`);
  }
  return [a.substr(0, d), a.substr(d + 1)];
}, xa = a => {
  const b = a.indexOf("\n");
  return [a.substr(0, b), a.substr(b + 1)];
};
const {PassThrough:R, Writable:Aa} = stream;
const S = (a, b = 0, d = !1) => {
  if (0 === b && !d) {
    return a;
  }
  a = a.split("\n", d ? b + 1 : void 0);
  return d ? a[a.length - 1] : a.slice(b).join("\n");
}, Ba = (a, b = !1) => S(a, 2 + (b ? 1 : 0)), T = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:Ca} = os;
const Da = /\s+at.*(?:\(|\s)(.*)\)?/, Ea = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, Fa = Ca(), Ga = a => {
  const {pretty:b = !1, ignoredModules:d = ["pirates"]} = {}, g = d.join("|"), f = new RegExp(Ea.source.replace("IGNORED_MODULES", g));
  return a.replace(/\\/g, "/").split("\n").filter(h => {
    h = h.match(Da);
    if (null === h || !h[1]) {
      return !0;
    }
    h = h[1];
    return h.includes(".app/Contents/Resources/electron.asar") || h.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(h);
  }).filter(h => h.trim()).map(h => b ? h.replace(Da, (c, e) => c.replace(e, e.replace(Fa, "~"))) : h).join("\n");
};
function Ha(a, b, d = !1) {
  return function(g) {
    var f = T(arguments), {stack:h} = Error();
    const c = S(h, 2, !0), e = (h = g instanceof Error) ? g.message : g;
    f = [`Error: ${e}`, ...null !== f && a === f || d ? [b] : [c, b]].join("\n");
    f = Ga(f);
    return Object.assign(h ? g : Error(), {message:e, stack:f});
  };
}
;function U(a) {
  var {stack:b} = Error();
  const d = T(arguments);
  b = Ba(b, a);
  return Ha(d, b, a);
}
;const Ia = (a, b) => {
  b.once("error", d => {
    a.emit("error", d);
  });
  return b;
};
class V extends Aa {
  constructor(a) {
    const {binary:b = !1, rs:d = null, ...g} = a || {}, {l:f = U(!0), proxyError:h} = a || {}, c = (e, k) => f(k);
    super(g);
    this.h = [];
    this.j = new Promise((e, k) => {
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
          const q = Ga(l.stack);
          l.stack = q;
          h && c`${l}`;
        }
        k(l);
      });
      d && Ia(this, d).pipe(this);
    });
  }
  _write(a, b, d) {
    this.h.push(a);
    d();
  }
  get promise() {
    return this.j;
  }
}
const W = async a => {
  ({promise:a} = new V({rs:a, l:U(!0)}));
  return await a;
};
const Ja = async(a, b) => {
  await b(a);
}, Ka = async(a, b) => {
  if (b instanceof RegExp) {
    if (!b.test(a)) {
      throw Error(`${a} does not match regular expression ${b}`);
    }
  } else {
    if ("function" == typeof b) {
      await Ja(a, b);
    } else {
      if (b && a != b) {
        const d = K(`${a}`, `${b}`);
        throw Error(`${d}\n${`${a} != ${b}`}`);
      }
    }
  }
};
async function La(a) {
  if (!a) {
    throw Error("Config expected.");
  }
  const b = U(!0), {fn:d, args:g = [], context:f, error:h, ...c} = a;
  if ("function" != typeof d) {
    throw Error("Function expected.");
  }
  a = Array.isArray(g) ? g : [g];
  try {
    return await Ma(d, f, a, h, c);
  } catch (e) {
    throw b(e);
  }
}
const Ma = async(a, b, d, g, f) => {
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
      await Ka(c[k], f[k]);
    }, {});
    return c;
  }
};
const X = (...a) => {
  let b = -1;
  return "%s%s".replace(/%s/g, () => {
    b++;
    return a[b];
  });
};
function Na(a, b) {
  let d = 0;
  const g = (c, e) => {
    const k = " ".repeat(2 * d);
    e = void 0 !== e ? I("+ " + Y(e), "green") : null;
    c = void 0 !== c ? I("- " + Y(c), "red") : null;
    const l = [];
    c && l.push(X(k, c));
    e && l.push(X(k, e));
    return l.join("\n");
  }, f = c => {
    const e = " ".repeat(2 * d);
    return X(e, c);
  }, h = (c, e) => {
    if (c instanceof Date && e instanceof Date) {
      var k = c.getTime() != e.getTime() ? !1 : void 0;
      return k ? "" : g(c, e);
    }
    if (c instanceof Date && !(e instanceof Date) || !(c instanceof Date) && e instanceof Date || Array.isArray(c) && !Array.isArray(e) || !Array.isArray(c) && Array.isArray(e)) {
      return g(c, e);
    }
    if (Z(c) && Z(e) || !Z(c) && Z(e) || Z(c) && !Z(e)) {
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
      if (Z(k) && Z(l) && k != l) {
        return g(k, l);
      }
    }
    if (Array.isArray(c) && Array.isArray(e)) {
      let q;
      k = c.map((m, n) => {
        q = n;
        (m = h(m, e[n])) && (m = `${f(`[${n}]`)}\n${m}`);
        return m;
      }).filter(Boolean);
      l = e.slice(q + 1).map((m, n) => `${f(`[${q + n + 1}]`)}\n${g(void 0, m)}`);
      return [...k, ...l].join("\n");
    }
    if ("object" == typeof c && "object" == typeof e) {
      const q = [], m = [], n = [];
      Object.keys(c).forEach(p => {
        p in e ? n.push(p) : m.push(p);
      });
      Object.keys(e).forEach(p => {
        p in c || q.push(p);
      });
      k = m.map(p => g(`${p}${`: ${Y(c[p])}`}`));
      l = q.map(p => g(void 0, `${p}: ${Y(e[p])}`));
      const r = n.map(p => {
        d++;
        const x = h(c[p], e[p]);
        let t = "";
        x && (t += f(Array.isArray(c[p]) && Array.isArray(e[p]) ? `${p}.Array` : p), t += "\n" + x);
        d--;
        return t;
      }).filter(Boolean);
      return [...k, ...l, ...r].join("\n");
    }
    console.error("Could not compare two values: %s %s. Please file a bug with differently.", c, e);
  };
  return h(a, b);
}
const Z = a => null === a ? !0 : "string number boolean symbol null undefined".split(" ").includes(typeof a), Y = a => Array.isArray(a) ? `Array[${a.toString()}]` : a && a.toString ? a.toString() : `${a}`;
function Oa(a, b) {
  try {
    ka(a, b, void 0);
  } catch (d) {
    throw a = Na(b, a), d.message = [d.message, a].filter(Boolean).join("\n"), d;
  }
}
;const {fork:Pa} = child_process;
const Qa = async a => {
  const [b, d, g] = await Promise.all([new Promise((f, h) => {
    a.on("error", h).on("exit", c => {
      f(c);
    });
  }), a.stdout ? W(a.stdout) : void 0, a.stderr ? W(a.stderr) : void 0]);
  return {code:b, stdout:d, stderr:g};
};
const Ra = (a, b, d = [], g = null) => {
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
const Sa = async(a, b = [], d = [], g = {}) => {
  const f = {stdio:"pipe", execArgv:[]};
  if ("string" == typeof a) {
    return {i:a, args:b, options:f};
  }
  const {module:h, getArgs:c, options:e, getOptions:k} = a;
  a = c ? await c.call(g, b, ...d) : b;
  b = f;
  e ? b = {...f, ...e} : k && (d = await k.call(g, ...d), b = {...f, ...d});
  return {i:h, args:a, options:b};
}, Ta = (a, b, d) => {
  try {
    if ("string" == typeof b) {
      try {
        ma(a, b);
      } catch (g) {
        const f = K(b, a);
        console.log(f);
        throw g;
      }
    } else {
      if (b) {
        const g = JSON.parse(a);
        Oa(g, b);
      }
    }
  } catch (g) {
    throw d && (g.property = d), g;
  }
};
const Ua = a => P(/(['"])?([\s\S]+?)\1(\s+|$)/g, a, ["q", "a"]).map(({a:b}) => b);
const Wa = async a => {
  const {forkConfig:b, input:d, props:g = {}, contexts:f = []} = a;
  a = d ? Ua(d) : [];
  const {i:h, args:c, options:e} = await Sa(b, a, f, {...g, input:d});
  if (!h) {
    throw Error("Please specify a module to fork");
  }
  a = Pa(h, c, e);
  var k = Qa(a);
  a.promise = k;
  a.spawnCommand = a.spawnargs.join(" ");
  const {promise:l, stdout:q, stdin:m, stderr:n} = a, {includeAnswers:r = !0, log:p, inputs:x, stderrInputs:t, stripAnsi:y = !0, preprocess:A} = b;
  var v = new R;
  const z = new R;
  !0 === p ? (v.pipe(process.stdout), z.pipe(process.stderr)) : p && (p.stdout && v.pipe(p.stdout), p.stderr && z.pipe(p.stderr));
  k = r && x;
  a = r && t;
  var u, w;
  k && (u = new V({rs:v}));
  a && (w = new V({rs:z}));
  Ra(q, m, x, v);
  Ra(n, m, t, z);
  v = await l;
  k && (u.end(), u = await u.promise, Object.assign(v, {stdout:u}));
  a && (w.end(), w = await w.promise, Object.assign(v, {stderr:w}));
  Va(v, g, y, A);
  return v;
}, Va = ({code:a, stdout:b, stderr:d}, g, f, h) => {
  var c, e;
  "object" == typeof h ? {stdout:c, stderr:e} = h : "function" == typeof h && (c = e = h);
  b = b.replace(/\r?\n$/, "");
  d = d.replace(/\r?\n$/, "");
  b = f ? b.replace(/\033\[.*?m/g, "") : b;
  d = f ? d.replace(/\033\[.*?m/g, "") : d;
  c = c ? c(b) : b;
  e = e ? e(d) : d;
  Ta(c, g.stdout, "stdout");
  Ta(e, g.stderr, "stderr");
  if (g.code && a != g.code) {
    throw a = Error(`Fork exited with code ${a} != ${g.code}`), a.s = "code", a;
  }
};
const $a = a => {
  const {input:b, error:d, expected:g, props:f, getThrowsConfig:h, getTransform:c, getResults:e, assertResults:k, mapActual:l, getReadable:q, fork:m} = a;
  return async(...n) => {
    var r = {input:b, ...f};
    if (d) {
      if (!h) {
        throw Error('No "getThrowsConfig" function is given.');
      }
      r = h.call(r, ...n);
      await Xa(r, d);
    } else {
      if (c) {
        Ya(g), n = await c.call(r, ...n), n.end(b), n = await W(n);
      } else {
        if (q) {
          Ya(g), n = await q.call(r, ...n), n = await W(n);
        } else {
          if (m) {
            r.inputs && (m.inputs = Za(r.inputs));
            var p = await Wa({forkConfig:m, input:b, props:f, contexts:n});
            n = e ? await e.call(r, ...n) : p;
          } else {
            if (e) {
              n = await e.call(r, ...n);
            } else {
              throw Error("Nothing was tested.");
            }
          }
        }
      }
      if (void 0 !== g) {
        if (p = l(n), "string" != typeof g) {
          Oa(p, g);
        } else {
          if ("string" != (typeof p).toLowerCase()) {
            throw Error('The actual result is not an a string. Use "mapActual" function to map to a string result, or add "expected" to "jsonProps".');
          }
          try {
            la(p, g);
          } catch (x) {
            throw r = K(g, p), console.log(r), x.property = "expected", x;
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
  const [d, g] = b.split(/: +/);
  return [new RegExp(d), g];
}), Xa = async(a, b) => {
  await La({...a, message:b});
};
function ab(a, b, d = null) {
  let g;
  const f = a.startsWith("!");
  let h = f ? a.replace(/^!/, "") : a;
  try {
    g = L(h);
  } catch (e) {
    if ("ENOENT" != e.code) {
      throw e;
    }
    h = bb(h, d);
    g = L(h);
  }
  let c;
  if (g.isFile()) {
    c = cb(h, b);
  } else {
    if (g.isDirectory()) {
      const e = N(h);
      c = e.reduce((k, l) => {
        const q = O(h, l);
        l = l.replace(/\.\w+?$/, "");
        return {...k, [l]:ab(q, b, e)};
      }, {});
    }
  }
  return f ? {[a]:c} : c;
}
const bb = (a, b) => {
  const d = ja(a);
  b = (b || N(d)).filter(g => g.startsWith(`${ha(a)}.`));
  if (1 < b.length) {
    throw Error(`Could not resolve the result path ${a}, possible files: ${b.join(", ")}.`);
  }
  if (b.length) {
    a = O(d, b[0]);
  } else {
    throw Error(`Could not resolve the result path ${a}.`);
  }
  return a;
}, cb = (a, b) => {
  if (!b) {
    throw Error('No configuration is given. A config should at least contain either a "getThrowsConfig", "getResults", "getTransform" or "getReadable" functions.');
  }
  const {context:d, persistentContext:g, getResults:f, getTransform:h, getReadable:c, getThrowsConfig:e, mapActual:k = t => t, assertResults:l, jsonProps:q = [], jsProps:m = [], splitRe:n, fork:r, propEndRe:p, propStartRe:x} = b;
  return za({path:a, splitRe:n, propEndRe:p, propStartRe:x}).reduce((t, {name:y, input:A, error:v, m:z, ...u}) => {
    let w, C, F;
    y in t && (w = `Repeated use of the test name "${y}".`);
    try {
      ({expected:F, ...C} = wa(u, q, m));
    } catch ({message:G}) {
      w = G;
    }
    let E;
    w ? E = () => {
      throw Error(w);
    } : E = $a({input:A, error:v, getThrowsConfig:e, getTransform:h, getReadable:c, getResults:f, expected:F, assertResults:l, props:C, mapActual:k, fork:r});
    t[y] = async(...G) => {
      try {
        await E(...G);
      } catch (ia) {
        process.env.DEBUG && console.log(I(ia.stack, "red")), await z(ia);
      }
    };
    return t;
  }, {...d ? {context:d} : {}, ...g ? {persistentContext:g} : {}});
};
module.exports = ab;

