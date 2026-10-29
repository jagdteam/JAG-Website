import assert from "node:assert/strict";
import test from "node:test";

import { answerHtml, answerStepPins, citedNumbers, classifyPaths, recordedSourcePins, firstCitedPin, identityCite, pinOfChunk, pinsFromSources, recordedPins } from "../../../../../public/projects/clicr/demo/citations.js";
import { codeSpans, esc } from "../../../../../public/projects/clicr/demo/html.js";

const pins = pinsFromSources([
  { chunk: { path: "b.py", start: 1, end: 6 }, i: 3, members: [3, 4] },
  { chunk: { path: "a.py", start: 15, end: 40 }, i: 7, members: [7] },
]);

test("citedNumbers", () => {
  assert.deepEqual(citedNumbers("See [2] and [1][2], also [3, 4] and [5-7]. ```\n[9]\n``` `[8]` [x](y) [10]"), [2, 1, 3, 4, 5, 6, 7, 10]);
  assert.deepEqual(citedNumbers("[1-200]"), [1, 200]);
});

test("pins", () => {
  assert.deepEqual(pins[1], { n: 2, path: "a.py", start: 15, end: 40, members: [7] });
  assert.equal(pinOfChunk(pins, 4), 1);
  assert.equal(pinOfChunk(pins, 9), null);
});

test("answerStepPins: recorded cites and extra pins without WebGPU, none with it or without a recorded answer", () => {
  const recorded = { answer: "A [1]. B [2].", sources: [{ path: "a.py", start: 20, end: 22 }, { path: "c.py", start: 1, end: 3 }] };
  const shown = answerStepPins({ webgpu: false, recorded, pins });
  assert.deepEqual([...shown.cite], [[1, 2], [2, 3]]);
  assert.deepEqual(shown.extra, [{ n: 3, path: "c.py", start: 1, end: 3, members: [] }]);
  assert.deepEqual(answerStepPins({ webgpu: true, recorded, pins }), { cite: null, extra: [] });
  assert.deepEqual(answerStepPins({ webgpu: false, recorded: { question: "q" }, pins }), { cite: null, extra: [] });
  assert.deepEqual(answerStepPins({ webgpu: false, recorded: null, pins }), { cite: null, extra: [] });
});

test("recordedPins", () => {
  const rec = recordedPins("A [6]. B [2][6]. C [4].", [{ path: "a.py", start: 10, end: 20 }, { path: "b.py", start: 5, end: 9 }, { path: "c.py", start: 1, end: 3 }], pins);
  assert.deepEqual([...rec.cite], [[6, 2], [2, 1], [4, 3]]);
  assert.deepEqual(rec.extra, [{ n: 3, path: "c.py", start: 1, end: 3, members: [] }]);
  const over = recordedPins("[1] [2] [3]", [{ path: "a.py", start: 15, end: 16 }, { path: "b.py", start: 2, end: 2 }], pins);
  assert.deepEqual([...over.cite], [[1, 2], [2, 1]]);
  assert.ok(answerHtml("[1] [2] [3]", over.cite).includes("</a> [3]</p>"));
  const two = [{ n: 1, path: "a.py", start: 1, end: 12, members: [] }, { n: 2, path: "a.py", start: 18, end: 30, members: [] }];
  assert.equal(recordedPins("[5]", [{ path: "a.py", start: 10, end: 20 }], two).cite.get(5), 1);
});

test("answerHtml", () => {
  const html = answerHtml("Uses `x` [6].\n```py\nx = [6]\n```", new Map([[6, 2]]));
  assert.ok(html.includes('<a class="cite" href="#pin-2" data-pin="2">[2]</a>'));
  assert.ok(html.includes("<pre><code>x = [6]\n</code></pre>"));
  assert.equal(answerHtml("[9]", new Map()), "<p>[9]</p>");
  assert.deepEqual([...identityCite(2)], [[1, 1], [2, 2]]);
});

test("answerHtml skips [n] inside inline code and links (ruling P12)", () => {
  const cite = identityCite(5);
  const html = answerHtml("Use `a[1]` and [x](u[2]) then [3].", cite);
  assert.ok(html.includes("`a[1]`"));
  assert.ok(html.includes("[x](u[2])"));
  assert.ok(html.includes('data-pin="3"'));
  assert.ok(!html.includes('data-pin="1"') && !html.includes('data-pin="2"'));
});

test("html helpers", () => {
  assert.equal(esc(`<a&"'>`), "&lt;a&amp;&quot;&#39;&gt;");
  assert.equal(codeSpans("call `url_for` <b>"), "call <code>url_for</code> &lt;b&gt;");
});

test("answerHtml links every number in [3, 4] and [5-7] groups", () => {
  const a = (n) => `<a class="cite" href="#pin-${n}" data-pin="${n}">${n}</a>`;
  const idHtml = answerHtml("See [3, 4] [5-7].", identityCite(7));
  assert.equal(idHtml, `<p>See [${a(3)}, ${a(4)}] [${a(5)}, ${a(6)}, ${a(7)}].</p>`);
  const re = answerHtml("See [3, 4] [5-7] [9, 3].", new Map([[3, 1], [4, 2], [5, 3], [7, 4]]));
  assert.ok(re.includes(`[${a(1)}, ${a(2)}]`));
  assert.ok(re.includes(`[${a(3)}, 6, ${a(4)}]`));
  assert.ok(re.includes(`[9, ${a(1)}]`));
});

test("answerHtml and citedNumbers agree when a backtick pair spans a link", () => {
  const text = "`a [x](c) b` [1] `q [2](c) r` [3]";
  const cited = citedNumbers(text);
  const html = answerHtml(text, identityCite(5));
  const linked = [...html.matchAll(/data-pin="(\d+)"/g)].map((m) => Number(m[1]));
  assert.deepEqual(linked, cited);
  assert.deepEqual(cited, [1, 3]);
});

test("firstCitedPin: the first citation in answer order that maps to a pin", () => {
  const cite = new Map([[1, 4], [2, 2]]);
  assert.equal(firstCitedPin("It is set in [2] and also [1].", cite), 2);
  assert.equal(firstCitedPin("See [1][2].", cite), 4);
  assert.equal(firstCitedPin("Only [9] here, then [1].", cite), 4, "unmapped numbers are skipped");
  assert.equal(firstCitedPin("No citations at all.", cite), null);
  assert.equal(firstCitedPin("Cited [1] but no map.", null), null);
  assert.equal(firstCitedPin(["```py", "x[1]", "``` then [2]"].join(String.fromCharCode(10)), cite), 2, "code is ignored");
  assert.equal(firstCitedPin("See [3-4].", new Map([[3, 7], [4, 8]])), 7);
});

// ---- classifyPaths (C14)
const FILES = { "src/flask/app.py": "a\nb\nc\nd\n", "src/flask/cli.py": "x\ny\n", "src/flask/json/__init__.py": "j\n", "src/flask/sansio/app.py": "s\n", "src/flask/sansio/README.md": "r\n" };
const SRC = [{ n: 1, path: "src/flask/app.py", start: 2, end: 3 }, { n: 2, path: "src/flask/cli.py", start: 1, end: 2 }];
const ctx = { sources: SRC, files: FILES };
const kinds = (t, c = ctx) => classifyPaths(t, c).map((f) => [t.slice(f.start, f.end), f.kind, f.pin]);

test("classifyPaths: the three classes", () => {
  assert.deepEqual(kinds("See src/flask/app.py:2-3 now."), [["src/flask/app.py:2-3", "source", 1]]);
  assert.deepEqual(kinds("See src/flask/json/__init__.py."), [["src/flask/json/__init__.py", "unsent", undefined]]);
  assert.deepEqual(kinds("See src/flask/reranker.py:45."), [["src/flask/reranker.py:45", "missing", undefined]]);
});

test("classifyPaths: line ranges", () => {
  assert.equal(kinds("src/flask/app.py")[0][1], "source"); // no lines: same file
  assert.equal(kinds("src/flask/app.py:3")[0][1], "source");
  assert.equal(kinds("src/flask/app.py:4")[0][1], "unsent"); // same file, lines not sent
  assert.equal(kinds("src/flask/app.py:4-9")[0][1], "unsent");
  assert.equal(kinds("src/flask/app.py:9")[0][1], "nolines"); // file has 4 lines
  assert.equal(kinds("src/flask/app.py:2-3")[0][1], "source");
  assert.equal(kinds("src/flask/app.py:3\u20135")[0][1], "source"); // en dash
});

test("classifyPaths: normalisation", () => {
  assert.deepEqual(kinds("./src/flask/app.py"), [["./src/flask/app.py", "source", 1]]);
  assert.deepEqual(kinds("flask/cli.py:1"), [["flask/cli.py:1", "source", 2]]);
  assert.equal(kinds("flask/json/__init__.py")[0][1], "unsent");
  assert.equal(kinds("cli.py:2")[0][1], "source"); // a bare name needs :N
  assert.deepEqual(kinds("cli.py is used"), []); // bare name, no lines: prose
  assert.deepEqual(kinds("see app.py:2"), []); // ambiguous (app.py and sansio/app.py): say nothing
  assert.equal(kinds("sansio/app.py")[0][1], "unsent");
  assert.equal(kinds("sansio/README.md")[0][1], "unsent");
  assert.equal(kinds("nothere.py:3")[0][1], "missing");
});

test("classifyPaths: code spans, fences, links, cites, urls", () => {
  assert.equal(kinds("see `src/flask/reranker.py:45` here")[0][1], "missing");
  assert.deepEqual(kinds("```\nsrc/flask/reranker.py\n```"), []);
  assert.deepEqual(kinds("[x](src/flask/reranker.py)"), []);
  assert.deepEqual(kinds("https://github.com/pallets/flask/blob/main/src/flask/reranker.py"), []);
  assert.deepEqual(kinds("version 1.2 and e.g. foo/bar and a.b"), []);
  assert.deepEqual(kinds("a [1] cite and src/flask/cli.py."), [["src/flask/cli.py", "source", 2]]);
});

test("classifyPaths: no files data", () => {
  assert.deepEqual(kinds("src/flask/reranker.py", { sources: SRC }), []); // nothing known: never flag
  assert.equal(kinds("src/flask/app.py", { sources: SRC })[0][1], "source");
  const chunkOnly = { sources: SRC, chunkPaths: Object.keys(FILES) };
  assert.equal(kinds("src/flask/reranker.py", chunkOnly)[0][1], "missing");
  assert.equal(kinds("src/flask/json/__init__.py", chunkOnly)[0][1], "unsent");
  assert.equal(kinds("src/flask/app.py:900", chunkOnly)[0][1], "unsent"); // line counts need the files
});

test("answerHtml: path links, labels and summary", () => {
  const html = answerHtml("Use src/flask/app.py:2 and src/flask/reranker.py:45 and src/flask/json/__init__.py, see [1].", new Map([[1, 1]]), ctx);
  assert.ok(html.includes('<a class="cite path-ref" href="#pin-1" data-pin="1">src/flask/app.py:2</a>'));
  assert.ok(html.includes("(no such file in Flask)"));
  assert.ok(html.includes("(not in the sources)"));
  assert.ok(html.includes('<a class="cite" href="#pin-1" data-pin="1">[1]</a>'));
  assert.ok(html.includes("mentioned 2 file references that weren't in its sources."));
  const clean = answerHtml("Only src/flask/cli.py [2].", new Map([[2, 2]]), ctx);
  assert.ok(!clean.includes("path-label") && !clean.includes("path-note"));
  assert.ok(answerHtml("src/flask/app.py:9", null, ctx).includes("(no such lines)"));
  assert.ok(answerHtml("one src/flask/x.py", null, ctx).includes("mentioned 1 file reference that"));
  assert.equal(answerHtml("src/flask/x.py [1]", new Map([[1, 1]])), '<p>src/flask/x.py <a class="cite" href="#pin-1" data-pin="1">[1]</a></p>'); // no paths arg: unchanged
});

test("recordedSourcePins", () => {
  const got = recordedSourcePins([{ path: "src/flask/app.py", start: 3, end: 8 }, { path: "z.py", start: 1, end: 2 }], [{ n: 4, path: "src/flask/app.py", start: 1, end: 3 }]);
  assert.deepEqual(got, [{ path: "src/flask/app.py", start: 3, end: 8, n: 4 }, { path: "z.py", start: 1, end: 2 }]);
});
