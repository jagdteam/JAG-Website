import assert from "node:assert/strict";
import test from "node:test";

import { breadcrumb, coveringGlow, fileLines, highlight } from "../../../../../public/projects/clicr/demo/editor.js";

test("highlight: python tokens per line, markdown as escaped plain text", () => {
  assert.deepEqual(highlight("def f():\n  return 1", "python"),
    ['<span class="tk-k">def</span> <span class="tk-f">f</span>():', '  <span class="tk-k">return</span> <span class="tk-n">1</span>']);
  assert.deepEqual(highlight("# T\n<b>", "markdown"), ["# T", "&lt;b&gt;"]);
});

test("fileLines from files.json", () => {
  assert.deepEqual(fileLines("a.py", { "a.py": "x\ny\n" }, []), ["x", "y", ""]);
});

test("fileLines without files.json", () => {
  assert.deepEqual(fileLines("a.py", null, [{ path: "a.py", start: 2, end: 3, text: "b\nc" }, { path: "a.py", start: 5, end: 5, text: "e" }, { path: "z.py", start: 1, end: 1, text: "q" }]),
    ["", "b", "c", "", "e"]);
});

test("breadcrumb", () => {
  assert.deepEqual(breadcrumb("src/flask/app.py", "Flask.route"), ["src", "flask", "app.py", "Flask.route"]);
  assert.deepEqual(breadcrumb("src/flask/app.py", null), ["src", "flask", "app.py"]);
});

test("coveringGlow skips transient flash nodes that have no glow (two reveals in a row)", () => {
  const nodes = [{ _glow: { start: 5, end: 9 } }, {}, { _glow: { start: 1, end: 3 } }];
  assert.doesNotThrow(() => coveringGlow(nodes, 2));
  assert.equal(coveringGlow(nodes, 2), nodes[2]);
  assert.equal(coveringGlow(nodes, 4), undefined);
});

test("coveringGlow prefers a glow whose range matches the pin exactly", () => {
  const nodes = [
    { _glow: { start: 1, end: 10 } },
    { _glow: { start: 5, end: 30 } },
  ];
  assert.equal(coveringGlow(nodes, 5, { start: 5, end: 30 }), nodes[1]);
  assert.equal(coveringGlow(nodes, 5, { start: 5, end: 99 }), undefined);
  assert.equal(coveringGlow(nodes, 5), nodes[0]);
});
