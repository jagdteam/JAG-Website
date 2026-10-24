import assert from "node:assert/strict";
import test from "node:test";

import { answerHtml, citedNumbers, identityCite, pinOfChunk, pinsFromSources, recordedPins } from "../../../../../public/projects/clicr/demo/citations.js";
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
