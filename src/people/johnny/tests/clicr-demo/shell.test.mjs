import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

const D = new URL("../../../../../public/projects/clicr/demo/", import.meta.url);
const html = readFileSync(new URL("index.html", D), "utf8");
const css = readFileSync(new URL("demo.css", D), "utf8");
const demoJs = readFileSync(new URL("demo.js", D), "utf8");
const layout = readFileSync(new URL("../../Layout.astro", import.meta.url), "utf8");

/** The markup of <div class="ide"> ... its matching </div>. */
function ideMarkup() {
  const start = html.indexOf('<div class="ide">');
  assert.ok(start >= 0, '<div class="ide">');
  let depth = 0;
  for (const m of html.slice(start).matchAll(/<div\b|<\/div>/g)) {
    depth += m[0] === "</div>" ? -1 : 1;
    if (depth === 0) return html.slice(start, start + m.index + m[0].length);
  }
  assert.fail(".ide is not closed");
}

test("every literal element id used by the scripts exists in index.html", () => {
  const ids = new Set();
  for (const f of readdirSync(D).filter((n) => n.endsWith(".js"))) {
    const src = readFileSync(new URL(f, D), "utf8");
    for (const m of src.matchAll(/(?:\$|getElementById)\("([^"]+)"\)/g)) ids.add(m[1]);
  }
  ids.delete("gen"); // created by renderAnswerArea
  assert.ok(ids.size > 10, "found the ids");
  for (const id of ids) assert.ok(html.includes(`id="${id}"`), `missing id="${id}"`);
});

test("self-test ids and the shell strings", () => {
  for (const id of ["selftest", "selftest-result", "selftest-table"]) assert.ok(html.includes(`id="${id}"`), id);
  for (const s of ['id="tree" role="tree"', 'id="tabs" role="tablist"', 'id="steps" aria-live="polite"', 'id="theme-toggle"', 'localStorage.getItem("theme")'])
    assert.ok(html.includes(s), s);
  assert.ok(!html.includes('id="opt-explain"'));
  assert.ok(!html.includes('class="wrap"'), ".wrap removed");
  assert.ok(!html.includes('<header class="top"'), "header.top removed");
});

test("DOM contract: markup and order inside one .ide; self-test and footer outside", () => {
  assert.equal(html.split('class="ide"').length, 2, "exactly one .ide");
  const ide = ideMarkup();
  const ordered = [
    '<header class="titlebar">',
    'href="/johnny"',
    "flask - CliCR",
    '<button id="theme-toggle" type="button" aria-pressed="false" aria-label="Switch to dark mode">',
    '<nav class="activity"',
    '<button id="act-explorer" type="button" aria-controls="explorer" aria-expanded="true">',
    '<aside id="explorer"',
    '<ul id="tree" role="tree" aria-label="Files">',
    '<div id="tabs" role="tablist" aria-label="Open files">',
    '<nav id="crumb" aria-label="Breadcrumb">',
    '<div id="editor" role="tabpanel" tabindex="0">',
    'id="results"',
    '<div id="explain-card" role="tooltip" hidden>',
    '<button id="panel-toggle" type="button" aria-expanded="false" aria-controls="explain">RETRIEVAL</button>',
    '<section id="explain"',
    'id="explain-table"',
    'id="ask"',
    'id="q"',
    'id="go"',
    'id="opt-graph"',
    'id="suggest"',
    'id="model-note"',
    'id="embed-size"',
    '<ol id="steps" aria-live="polite">',
    '<button id="skip" type="button" hidden>Skip</button>',
    'id="answer"',
    'id="answer-body"',
    '<footer class="statusbar">',
    'id="status" class="status" role="status" aria-live="polite"',
    'id="progress"',
    '<span id="answer-mode">',
    "runs on your device",
  ];
  let at = -1;
  for (const s of ordered) {
    const i = ide.indexOf(s, at + 1);
    assert.ok(i > at, `"${s}" missing or out of order inside .ide`);
    at = i;
  }
  assert.match(html, /<section id="explain"[^>]*\shidden[\s>]/, "#explain starts hidden");
  assert.match(ide, /<button id="go" type="submit">Ask<\/button>/, "#go is labelled Ask");
  for (const id of ["selftest", "selftest-result", "selftest-table", "src-link", "src-include", "src-commit", "src-license"]) {
    assert.ok(html.includes(`id="${id}"`) && !ide.includes(`id="${id}"`), `#${id} stays outside .ide`);
  }
});

test("head: the site's theme loader runs as a classic inline script before the stylesheet", () => {
  const from = layout.indexOf("try {");
  const to = layout.indexOf("document.documentElement.dataset.theme = t;") + "document.documentElement.dataset.theme = t;".length;
  const lines = layout.slice(from, to).split("\n").map((l) => l.trim());
  assert.equal(lines.length, 6, "Layout.astro theme lines");
  const head = html.slice(0, html.indexOf("</head>"));
  const script = head.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(script, "a classic <script> without type or src");
  let at = -1;
  for (const l of lines) {
    const i = script[1].indexOf(l, at + 1);
    assert.ok(i > at, `theme line "${l}"`);
    at = i;
  }
  assert.ok(head.indexOf(script[0]) < head.indexOf('href="demo.css"'), "before the stylesheet");
});

test("Explorer toggle: aria-expanded is the single open state", () => {
  // markup: no hidden attribute, so only the button's aria-expanded decides (via demo.css)
  assert.match(html, /<aside id="explorer"(?![^>]*\shidden)[^>]*>/, "#explorer has no hidden attribute");
  assert.match(
    css,
    /\.ide:has\(#act-explorer\[aria-expanded="false"\]\) #explorer \{\s*display: none;\s*\}/,
    "demo.css hides #explorer exactly when the toggle says collapsed",
  );
  // demo.js: initial state from the 1024 px breakpoint, reset on breakpoint change, click flips
  assert.ok(demoJs.includes('matchMedia("(min-width: 1024px)")'), "breakpoint query");
  assert.ok(demoJs.includes('$("act-explorer")'), "button looked up");
  assert.match(demoJs, /function setExplorer\(open\) \{\s*el\.actExplorer\.setAttribute\("aria-expanded", String\(open\)\);\s*\}/);
  assert.match(demoJs, /setExplorer\(wide\.matches\);/, "initial: true at >= 1024 px, false below");
  assert.match(demoJs, /wide\.addEventListener\("change", \(\) => setExplorer\(wide\.matches\)\);/);
  assert.match(
    demoJs,
    /el\.actExplorer\.addEventListener\("click", \(\) => setExplorer\(el\.actExplorer\.getAttribute\("aria-expanded"\) !== "true"\)\);/,
  );
});

test("layout and motion rules", () => {
  assert.ok(css.includes('"activity explorer editor chat"') && css.includes('"activity explorer panel chat"'), "desktop grid areas");
  assert.ok(css.includes("@media (max-width: 1023px)"), "middle widths");
  assert.ok(css.includes("@media (max-width: 719px)"), "phone");
  assert.ok(css.includes("@media (prefers-reduced-motion: reduce)"), "reduced motion");
  assert.ok(css.includes("@keyframes flash"), "flash animation");
});
