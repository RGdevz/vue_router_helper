import * as x from "path";
import h from "path";
import * as u from "fs-extra";
import * as k from "fs";
import * as E from "fast-glob";
import * as N from "prettier";
function S(t) {
  return !["name", "meta", "path", "component"].includes(t);
}
function b(t) {
  return `,children: [${t.map($).join(",")}]`;
}
function $(t) {
  var i;
  const e = t.children ? b(t.children) : "", r = t.route ?? {}, o = t.children && t.children.some((a) => a.path === "") ? "" : `name: '${r.name ?? t.name}',`, c = t.routeMeta ? ",meta: " + JSON.stringify(t.routeMeta, null, 2) : (i = t.route) != null && i.meta ? ",meta: " + JSON.stringify(r.meta, null, 2) : "", n = Object.keys(r).filter(S).map((a) => `,${a}: ${JSON.stringify(r[a])}`).join(",");
  return `
  {
    ${o}
    path: '${t.path}',
    component: ${t.specifier}${c}${n}${e}
  }`;
}
function v(t, e, r) {
  const o = e ? `function ${t.specifier}() { return import(/* webpackChunkName: "${r}${t.chunkName}" */ '${t.component}') }` : `import ${t.specifier} from '${t.component}'`;
  return t.children ? [o].concat(
    t.children.map(
      (c) => v(c, e, r)
    )
  ).join(`
`) : o;
}
function O(t, e, r) {
  const o = t.map((n) => v(n, e, r)).join(`
`), c = t.map($).join(",");
  return N.format(`${o}

export default [${c}]`, {
    parser: "babel",
    semi: !1,
    singleQuote: !0
  });
}
function R(t, e, r) {
  const o = e.reduce((c, n) => {
    c.children || (c.children = /* @__PURE__ */ new Map());
    let i = c.children.get(n);
    return i || (i = {}, c.children.set(n, i)), i;
  }, t);
  o.value = r;
}
function C(t) {
  try {
    const e = require("vue-template-compiler").parseComponent;
    return e(t, {
      pad: "space"
    });
  } catch {
    try {
      const e = require("@vue/compiler-sfc").parse;
      return e(
        t,
        {
          pad: "space"
        }
      ).descriptor;
    } catch {
      throw new Error(
        '[vue-route-generator] Either "vue-template-compiler" or "@vue/compiler-sfc" is required.'
      );
    }
  }
}
const T = "route-meta", B = "route";
function A(t, e, r, o) {
  const c = {};
  return t.map((i) => i.split("/")).forEach((i) => {
    R(c, P(i), i);
  }), j(c, e, r, o);
}
function j(t, e, r, o, c = 0) {
  if (t.value) {
    const n = t.value, i = {
      name: F(n),
      chunkName: J(n),
      specifier: q(n),
      path: I(n, c, r),
      pathSegments: M(n),
      component: e + n.join("/")
    }, a = o(n.join("/")), l = C(a), f = l.customBlocks.find(
      (p) => p.type === T
    ), d = l.customBlocks.find(
      (p) => p.type === B
    );
    return f && (console.warn(
      "<route-meta> custom block is deprecated. Use <route> block instead. Found in " + n.join("/")
    ), i.routeMeta = w(
      f.content,
      n,
      "route-meta"
    )), d && (i.route = w(d.content, n, "route")), t.children && (i.children = m(
      t.children,
      e,
      r,
      o,
      i.pathSegments.length
    )), [i];
  }
  return t.children ? m(
    t.children,
    e,
    r,
    o,
    c
  ) : [];
}
function g(t, e) {
  const r = t[0], o = e[0];
  if (!r || !o)
    return t.length - e.length;
  const c = _(r) ? 1 : 0, n = _(o) ? 1 : 0, i = c - n;
  return i !== 0 ? i : g(t.slice(1), e.slice(1));
}
function m(t, e, r, o, c) {
  return Array.from(t.values()).reduce((n, i) => n.concat(
    j(i, e, r, o, c)
  ), []).sort((n, i) => g(n.pathSegments, i.pathSegments));
}
function w(t, e, r) {
  try {
    return JSON.parse(t);
  } catch (o) {
    const c = e.join("/"), n = new Error(
      `Invalid json format of <${r}> content in ${c}
` + o.message
    );
    throw n.file = c, n;
  }
}
function _(t) {
  return t[0] === ":";
}
function y(t) {
  return t === "index";
}
function M(t) {
  const e = t.length - 1, r = s(t[e]);
  return t = t.slice(0, -1).concat(r), t.map((o, c) => {
    if (o[0] === "_") {
      const n = e === c ? "?" : "";
      return ":" + o.slice(1) + n;
    } else
      return o;
  }).filter((o) => !y(o));
}
function P(t) {
  const e = t[t.length - 1];
  return t.slice(0, -1).concat(s(e));
}
function F(t) {
  const e = t[t.length - 1];
  return t = t.slice(0, -1).concat(s(e)).filter((r) => !y(r)), t.length === 0 ? "index" : t.map((r) => r[0] === "_" ? r.slice(1) : r).join("-");
}
function J(t) {
  const e = t[t.length - 1];
  return t = t.slice(0, -1).concat(s(e)), t.map((r) => r[0] === "_" ? r.slice(1) : r).join("-");
}
function q(t) {
  const e = t[t.length - 1], r = t.slice(0, -1).concat(s(e)).join("_").replace(/[^a-zA-Z0-9]/g, "_");
  return /^\d/.test(r) ? "_" + r : r;
}
function I(t, e, r) {
  return (r || e > 0 ? "" : "/") + M(t).slice(e).join("/");
}
function s(t) {
  return t.replace(/\.[^.]+$/g, "");
}
function V({
  pages: t,
  importPrefix: e = "@/pages/",
  dynamicImport: r = !0,
  chunkNamePrefix: o = "",
  nested: c = !1
}) {
  const n = ["**/*.vue", "!**/__*__.vue", "!**/__*__/**"], i = E.sync(
    n,
    {
      cwd: t,
      onlyFiles: !0
    }
  ), a = A(
    i,
    e,
    c,
    (l) => k.readFileSync(x.join(t, l), "utf8")
  );
  return O(a, r, o);
}
async function z() {
  const t = h.resolve("vue_routes.txt");
  if (!await u.pathExists(t))
    throw new Error("please create vue_routes.txt file with the path");
  const e = await u.readFile(t, "utf8").then((r) => r.trim());
  if (!e)
    throw new Error("vue_routes.txt is empty");
  if (!await u.pathExists(e))
    throw new Error(`path ${e} not exits, please enter a relative path`);
  if (!(await u.stat(e)).isDirectory())
    throw new Error("path must be a dir");
  if (h.isAbsolute(e))
    throw new Error("please enter  relative path");
  return e;
}
async function L() {
  const t = await z(), e = V(
    {
      importPrefix: `${t}/`,
      pages: t
      // Vue page component directory
    }
  );
  await u.writeFile(h.resolve("generated_routes.ts"), e, { flag: "w+" }), console.log("Routes Generated...");
}
export {
  L as generate
};
