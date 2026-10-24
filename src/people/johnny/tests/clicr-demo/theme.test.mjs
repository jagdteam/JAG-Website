import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { initTheme, resolveTheme } from "../../../../../public/projects/clicr/demo/theme.js";

const CSS = readFileSync(new URL("../../../../../public/projects/clicr/demo/demo.css", import.meta.url), "utf8");

/** Fake document + window. `store.value` is what localStorage.getItem returns; `store.throws` makes it throw. */
function fakes({ dark = true, value = null, throws = false, setThrows = false } = {}) {
  const store = { value, throws, setThrows, sets: [] };
  const listeners = {};
  const attrs = {};
  const button = { setAttribute: (k, v) => (attrs[k] = v) };
  const win = {
    localStorage: {
      getItem(key) {
        if (store.throws) throw new Error("SecurityError");
        return key === "theme" ? store.value : null;
      },
      setItem(key, v) {
        if (store.setThrows) throw new Error("QuotaExceededError");
        store.sets.push([key, v]);
      },
    },
    matchMedia: () => ({ matches: dark }),
    addEventListener(type, f) {
      (listeners[type] ??= []).push(f);
    },
  };
  const doc = { documentElement: { dataset: {} }, getElementById: (id) => (id === "theme-toggle" ? button : null) };
  const fire = (type, e) => (listeners[type] ?? []).forEach((f) => f(e));
  return { doc, win, store, fire, attrs };
}

test("resolveTheme: stored value only when exactly light or dark", () => {
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("blue", true), "dark");
  assert.equal(resolveTheme(null, false), "light");
  assert.equal(resolveTheme("Dark", false), "light");
});

test("initTheme applies data-theme and listens for storage", () => {
  const f = fakes({ dark: true, value: null });
  initTheme(f.doc, f.win);
  assert.equal(f.doc.documentElement.dataset.theme, "dark");
  f.store.value = "light";
  f.fire("storage", { key: "theme", newValue: "light" });
  assert.equal(f.doc.documentElement.dataset.theme, "light");
  f.store.value = "dark";
  f.fire("storage", { key: "other", newValue: "x" });
  assert.equal(f.doc.documentElement.dataset.theme, "light", "other keys are ignored");
  f.fire("storage", { key: null });
  assert.equal(f.doc.documentElement.dataset.theme, "dark", "key null (storage cleared) re-resolves");
});

test("toggle flips, writes the key and syncs the button", () => {
  const f = fakes({ dark: true, value: "light" });
  const t = initTheme(f.doc, f.win);
  assert.equal(f.doc.documentElement.dataset.theme, "light");
  assert.deepEqual(f.attrs, { "aria-pressed": "false", "aria-label": "Switch to dark mode" });
  assert.equal(t.toggle(), "dark");
  assert.equal(f.doc.documentElement.dataset.theme, "dark");
  assert.deepEqual(f.store.sets, [["theme", "dark"]]);
  assert.deepEqual(f.attrs, { "aria-pressed": "true", "aria-label": "Switch to light mode" });
  assert.equal(t.toggle(), "light");
  assert.deepEqual(f.store.sets, [["theme", "dark"], ["theme", "light"]]);
});

test("localStorage that throws: follow prefers-color-scheme, toggle still works", () => {
  for (const dark of [true, false]) {
    const f = fakes({ dark, throws: true, setThrows: true });
    const t = initTheme(f.doc, f.win);
    assert.equal(f.doc.documentElement.dataset.theme, dark ? "dark" : "light");
    assert.equal(t.toggle(), dark ? "light" : "dark");
    assert.equal(f.doc.documentElement.dataset.theme, dark ? "light" : "dark");
  }
});

// ---------------------------------------------------------------- contrast (WCAG 2.x)
const TOKENS = "bg side bar fg muted ln accent focus status-bg status-fg tk-k tk-s tk-c tk-n tk-f tk-d tk-b glow-m glow-k glow-g mark-fg pin-bg pin-fg".split(" ");
const TK = ["tk-k", "tk-s", "tk-c", "tk-n", "tk-f", "tk-d", "tk-b"];

function block(selector) {
  const at = CSS.indexOf(`${selector} {`);
  assert.ok(at >= 0, `missing block ${selector}`);
  const body = CSS.slice(at, CSS.indexOf("}", at));
  return Object.fromEntries([...body.matchAll(/--([a-z-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}
const THEMES = { light: block(":root"), dark: block(':root[data-theme="dark"]') };

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
/** color-mix(in srgb, x p%, bg) */
const mix = (x, bg, pct) => x.map((v, i) => (v * pct + bg[i] * (100 - pct)) / 100);

// every glow fill in demo.css: color-mix(in srgb, var(--glow-x) N%, var(--bg))
const MIXES = [...CSS.matchAll(/color-mix\(in srgb, var\(--glow-([mkg])\) (\d+(?:\.\d+)?)%, var\(--bg\)\)/g)].map((m) => ({
  x: m[1],
  pct: Number(m[2]),
}));

test("tokens: the same 6-digit hex set in both blocks; no prefers-color-scheme block", () => {
  for (const [name, t] of Object.entries(THEMES)) {
    for (const k of TOKENS) assert.match(t[k] ?? "", /^#[0-9a-f]{6}$/, `${name} --${k}`);
  }
  assert.ok(!CSS.includes("prefers-color-scheme"), "the media query is replaced by :root[data-theme=\"dark\"]");
});

test("glow fills: every color-mix is a glow on --bg, at most 16%, each kind has a 3px bar", () => {
  assert.equal(MIXES.length, (CSS.match(/color-mix\(/g) ?? []).length, "only glow fills use color-mix");
  for (const x of ["m", "k", "g"]) {
    assert.ok(MIXES.some((m) => m.x === x), `fill for --glow-${x}`);
    assert.ok(CSS.includes(`inset 3px 0 var(--glow-${x})`), `3px left bar for --glow-${x}`);
  }
  for (const m of MIXES) assert.ok(m.pct > 0 && m.pct <= 16, `${m.pct}%`);
});

test("contrast AA in both themes", () => {
  for (const [name, t] of Object.entries(THEMES)) {
    const c = (k) => rgb(t[k]);
    const at = (fg, bg, min, label) => {
      const r = ratio(fg, bg);
      assert.ok(r >= min, `${name}: ${label} = ${r.toFixed(3)} < ${min}`);
    };
    for (const k of ["fg", "muted", "ln", "accent", ...TK]) at(c(k), c("bg"), 4.5, `${k} on bg`);
    for (const k of ["fg", "muted", "accent"]) at(c(k), c("side"), 4.5, `${k} on side`);
    at(c("fg"), c("bar"), 4.5, "fg on bar");
    at(c("status-fg"), c("status-bg"), 4.5, "status-fg on status-bg");
    at(c("pin-fg"), c("pin-bg"), 4.5, "pin-fg on pin-bg");
    for (const g of ["glow-m", "glow-k", "glow-g"]) at(c("mark-fg"), c(g), 4.5, `mark-fg on ${g}`);
    for (const { x, pct } of MIXES) {
      const fill = mix(c(`glow-${x}`), c("bg"), pct);
      for (const k of ["fg", ...TK]) at(c(k), fill, 4.5, `${k} on glow-${x} ${pct}%`);
    }
    for (const k of ["focus", "glow-m", "glow-k", "glow-g"]) {
      for (const b of ["bg", "side"]) at(c(k), c(b), 3, `${k} on ${b}`);
    }
  }
});
