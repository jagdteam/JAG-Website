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

/** Run the page's inline classic scripts (head loader, then the one after #act-explorer) against fakes. */
function bootInline(wide) {
  const root = { dataset: {} };
  const button = { attrs: { "aria-expanded": "true" }, setAttribute(k, v) { this.attrs[k] = String(v); } };
  const document = { documentElement: root, getElementById: (id) => (id === "act-explorer" ? button : null) };
  const matchMedia = (q) => ({ matches: q === "(min-width: 1024px)" ? wide : false });
  const localStorage = { getItem: () => null };
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.equal(scripts.length, 2, "head loader + Explorer state script");
  for (const code of scripts) new Function("document", "matchMedia", "localStorage", code)(document, matchMedia, localStorage);
  return { explorer: root.dataset.explorer, expanded: button.attrs["aria-expanded"] };
}

test("Explorer toggle: closed below 1024 px before first paint, aria-expanded mirrors it, no :has()", () => {
  assert.deepEqual(bootInline(true), { explorer: "open", expanded: "true" });
  assert.deepEqual(bootInline(false), { explorer: "closed", expanded: "false" });
  const ide = ideMarkup();
  const fix = ide.indexOf("<script>");
  assert.ok(fix > ide.indexOf('id="act-explorer"') && fix < ide.indexOf('<aside id="explorer"'), "state script runs before the Explorer is parsed");
  // markup: no hidden attribute; demo.css hides #explorer only from <html data-explorer>
  assert.match(html, /<aside id="explorer"(?![^>]*\shidden)[^>]*>/, "#explorer has no hidden attribute");
  assert.match(css, /:root\[data-explorer="closed"\] #explorer \{\s*display: none;\s*\}/, "hide rule without :has()");
  assert.ok(!css.includes(":has("), "no :has() dependency");
  // demo.js: initial state from the 1024 px breakpoint, reset on breakpoint change, click flips; both states move together
  assert.ok(demoJs.includes('matchMedia("(min-width: 1024px)")'), "breakpoint query");
  assert.ok(demoJs.includes('$("act-explorer")'), "button looked up");
  assert.match(
    demoJs,
    /function setExplorer\(open\) \{\s*document\.documentElement\.dataset\.explorer = open \? "open" : "closed";\s*el\.actExplorer\.setAttribute\("aria-expanded", String\(open\)\);\s*\}/,
  );
  assert.match(demoJs, /setExplorer\(wide\.matches\);/, "initial: true at >= 1024 px, false below");
  assert.match(demoJs, /wide\.addEventListener\("change", \(\) => setExplorer\(wide\.matches\)\);/);
  assert.match(
    demoJs,
    /el\.actExplorer\.addEventListener\("click", \(\) => setExplorer\(el\.actExplorer\.getAttribute\("aria-expanded"\) !== "true"\)\);/,
  );
});

test("chat panel welcome text: the old intro, above the suggested questions", () => {
  const start = html.indexOf('<aside class="chat"');
  assert.ok(start >= 0, "CliCR panel");
  const chat = html.slice(start, html.indexOf("</aside>", start));
  const w = chat.indexOf('<p id="welcome"');
  assert.ok(w >= 0, "#welcome inside the CliCR panel");
  assert.ok(w < chat.indexOf('id="suggest"'), "above the suggested questions");
  const text = chat.slice(w, chat.indexOf("</p>", w)).replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
  for (const s of [
    "Ask a question about Flask's source code.",
    "the same hybrid search as the CliCR command-line tool",
    "a meaning search (embeddings), a keyword search (BM25) and a merge of the two (reciprocal-rank fusion).",
    "Everything runs on your device; nothing you type is sent anywhere.",
  ])
    assert.ok(text.includes(s), s);
  assert.match(demoJs, /el\.welcome\.hidden = true;/, "hidden once a question is asked");
});

test("layout and motion rules", () => {
  assert.ok(css.includes('"activity explorer editor chat"') && css.includes('"activity explorer panel chat"'), "desktop grid areas");
  assert.ok(css.includes("@media (max-width: 1023px)"), "middle widths");
  assert.ok(css.includes("@media (max-width: 719px)"), "phone");
  assert.ok(css.includes("@media (prefers-reduced-motion: reduce)"), "reduced motion");
  assert.ok(css.includes("@keyframes flash"), "flash animation");
});

test("play-by-play wiring in demo.js", () => {
  assert.match(demoJs, /import \{[^}]*createPlayer[^}]*\} from "\.\/playback\.js"/, "createPlayer imported");
  assert.match(demoJs, /import \{[^}]*codeSpans[^}]*\} from "\.\/html\.js"/, "codeSpans imported");
  assert.ok(demoJs.includes('$("steps")') && demoJs.includes('$("skip")'), "#steps and #skip looked up");
  assert.ok(demoJs.includes('matchMedia("(prefers-reduced-motion: reduce)")'), "reduced motion query");
  assert.ok(demoJs.includes('class="step"') && demoJs.includes('data-step="'), "step buttons");
  assert.ok(demoJs.includes("aria-current"), "current step marked");
  assert.match(demoJs, /function prepareAnswer\(/, "one shared answer hook for Task 10");
  assert.equal(demoJs.match(/renderAnswerArea\(\)/g).length, 2, "defined once, called only from prepareAnswer");
  assert.match(demoJs, /runId/, "run token against stale work");
  assert.match(demoJs, /\.stop\(\)/, "old player stopped");
  assert.match(demoJs, /\.skip\(\)/, "skip wired");
  assert.match(demoJs, /\.replay\(/, "replay wired");
  const rerun = demoJs.slice(demoJs.indexOf("function rerun("), demoJs.indexOf("async function ask("));
  const search = demoJs.slice(demoJs.indexOf("function search("), demoJs.indexOf("function rerun("));
  assert.ok(search.includes("buildSteps(") && search.includes("hybridSearch"), "search recomputes the steps");
  assert.ok(rerun.includes("search(last.qvec") && rerun.includes("beginRun(false)"), "rerun searches again and lands on the final state");
  assert.ok(!rerun.includes(".start()"), "rerun never auto-plays");
  const selftestBranch = demoJs.slice(demoJs.indexOf('get("selftest") === "1"'));
  assert.ok(!selftestBranch.includes("createPlayer") && !selftestBranch.includes("beginRun"), "selftest never plays");
});

test("play-by-play styling and announcements", () => {
  assert.match(css, /button\.step \{/, "step buttons styled");
  assert.match(css, /button\.step\[aria-current="step"\] \{[^}]*border-left-color[^}]*font-weight: 600/, "current step: bar and bold, not colour alone");
  assert.match(css, /button\.step:disabled \{[^}]*var\(--muted\)/, "disabled steps muted");
  assert.match(css, /button\.step:hover:not\(:disabled\)/, "hover");
  assert.match(css, /#skip \{[^}]*border: 1px solid var\(--ln\)/, "Skip is the secondary button");
  assert.match(demoJs, /setAttribute\("aria-live", "off"\)/, "bulk fills keep the live list quiet");
  assert.match(demoJs, /answer cleared/, "graph toggle says the answer was cleared");
  assert.match(demoJs, /added !== 1\) setStatus\(`Step /, "replay and bulk fills update the status");
});

test("citations jump to pins: one prepareAnswer sets pins, cite and extra; links are handled by data-pin", () => {
  assert.match(demoJs, /function prepareAnswer\(\)[\s\S]*?last\.cite =[\s\S]*?last\.extra =[\s\S]*?renderAnswerArea\(\)/, "hook sets cite and extra first");
  assert.ok(!/answerHtml\([^)]*undefined\)/.test(demoJs) && !/answerHtml\(rec\.answer, null\)/.test(demoJs), "recorded answer always has a cite map");
  assert.match(demoJs, /answerHtml\(rec\.answer, last\.cite\)/, "fallback renders with last.cite");
  assert.match(demoJs, /extraPins/, "extra pins reach buildSteps");
  assert.ok(demoJs.includes('href="#pin-${k + 1}" data-pin="${k + 1}"'), "sourceList links pins");
  assert.ok(!demoJs.includes("#src-"), "old #src- targets gone");
  assert.match(demoJs, /dataset\.pin/, "click handler reads data-pin");
  assert.match(demoJs, /\[\.\.\.last\.pins, \.\.\.last\.extra\]/, "looks in packed and extra pins");
  assert.match(demoJs, /editor\.reveal\(pin, \{ flash: true \}\)/, "reveal with flash");
  assert.ok(demoJs.includes('matchMedia("(max-width: 719px)")'), "phone query");
  assert.match(demoJs, /\$\("editor"\)\.scrollIntoView\(/, "phone scrolls to the editor");
});

test("recorded extra pins only with the recorded answer on screen; a repeated pin is numbered once", () => {
  assert.match(demoJs, /function addExtraPins\(\)/, "fallback adds the extra pins to the answer step");
  assert.match(demoJs, /listed\.has\(p\)/, "repeat pin skipped in the cited list");
});
