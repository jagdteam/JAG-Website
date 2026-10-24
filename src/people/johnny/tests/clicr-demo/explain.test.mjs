import assert from "node:assert/strict";
import test from "node:test";

import { explainGlow, finalLine, graphLine, keywordLine, meaningLine, mergeLine, shortLabel } from "../../../../../public/projects/clicr/demo/explain.js";

test("meaning and keyword lines", () => {
  assert.equal(meaningLine({ vrank: 3, vscore: 0.7123 }, 20), "Rank 3 of the 20 closest by meaning (cosine 0.712)");
  assert.equal(meaningLine({ vrank: null }, 20), null);
  assert.equal(keywordLine({ krank: 1, kscore: 14.234 }, 20, ["route", "decorator"]), "Rank 1 of the 20 best keyword matches (BM25 14.2); matched: `route`, `decorator`");
  assert.equal(keywordLine({ krank: 1, kscore: 14.234 }, 20, []), "Rank 1 of the 20 best keyword matches (BM25 14.2)");
  assert.equal(keywordLine({ krank: 2, kscore: 3 }, 2, []), "Rank 2 of the 2 best keyword matches (BM25 3.0)");
  assert.equal(keywordLine({ krank: null }, 2, []), null);
});

test("merge, graph, final, label", () => {
  assert.equal(mergeLine({ frank: 2, vrank: 3, krank: 1 }, 60), "Merged rank 2: 1/(60+3) + 1/(60+1)");
  assert.equal(mergeLine({ frank: 5, vrank: null, krank: 4 }, 60), "Merged rank 5: 1/(60+4)");
  assert.equal(graphLine({ graph: { via: "url_for", from: 12 } }, "app.py:450-470", null), "Added because `app.py:450-470` calls `url_for`");
  assert.equal(graphLine({ graph: { via: "url_for", from: 12 } }, "app.py:450-470", 2), "Added because source [2] calls `url_for`");
  assert.equal(finalLine(4, 6), "Source [4] of 6 sent to the model");
  assert.equal(finalLine(null, 6), "Found, but cut when packing");
  assert.equal(shortLabel({ path: "src/flask/app.py", start: 450, end: 470 }, "src/flask"), "app.py:450-470");
  assert.equal(shortLabel({ path: "src/flask/app.py", start: 1, end: 2 }, "."), "src/flask/app.py:1-2");
});

test("explainGlow dispatch", () => {
  assert.equal(explainGlow({ id: "pack", title: "Pack the context" }, { kind: "P", pin: 7, i: null }, { nPacked: 6 }).text,
    "Cited by the recorded CLI answer; not among the packed sources.");
  assert.deepEqual(explainGlow({ id: "keyword", title: "Keyword search" }, { kind: "K", i: 7 },
    { rowsById: new Map([[7, { krank: 1, kscore: 14.2 }]]), nKeyword: 20, termsFor: () => ["route"] }),
  { title: "Keyword search", text: "Rank 1 of the 20 best keyword matches (BM25 14.2); matched: `route`" });
  // N comes from the run, not a constant
  assert.equal(explainGlow({ id: "keyword", title: "k" }, { kind: "K", i: 7 },
    { rowsById: new Map([[7, { krank: 2, kscore: 3 }]]), nKeyword: 2, termsFor: () => [] }).text,
  "Rank 2 of the 2 best keyword matches (BM25 3.0)");
  const rowsById = new Map([[1, { vrank: 1, vscore: 0.5, frank: 1, krank: null }], [9, { graph: { via: "f", from: 1 } }]]);
  const ctx = { rowsById, nVector: 5, rrfK: 60, nPacked: 3, labelFor: () => "a.py:1-2", pinOf: (i) => (i === 1 ? 2 : null) };
  assert.equal(explainGlow({ id: "meaning", title: "m" }, { kind: "M", i: 1 }, ctx).text, "Rank 1 of the 5 closest by meaning (cosine 0.500)");
  assert.equal(explainGlow({ id: "merge", title: "m" }, { kind: "M", i: 1 }, ctx).text, "Merged rank 1: 1/(60+1)");
  assert.equal(explainGlow({ id: "graph", title: "g" }, { kind: "G", i: 9 }, ctx).text, "Added because source [2] calls `f`");
  assert.equal(explainGlow({ id: "pack", title: "p" }, { kind: "P", i: 1, pin: 2 }, ctx).text, "Source [2] of 3 sent to the model");
  assert.equal(explainGlow({ id: "pack", title: "p" }, { kind: "cut", i: 9 }, ctx).text, "Found, but cut when packing");
});

test("explainGlow: a pin glow (i null) reports its own pin number, not 'cut'", () => {
  const ctx = { nPacked: 3, pinOf: (i) => (i == null ? null : 1) };
  for (const id of ["pack", "answer"]) {
    assert.equal(explainGlow({ id, title: "T" }, { kind: "P", pin: 2, i: null }, ctx).text, "Source [2] of 3 sent to the model");
  }
});
