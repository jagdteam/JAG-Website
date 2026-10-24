import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { buildTree } from "../../../../../public/projects/clicr/demo/explorer.js";

const chunks = JSON.parse(readFileSync(new URL("../../../../../public/projects/clicr/demo/data/chunks.json", import.meta.url), "utf8"));

function countLeaves(node) {
  return node.children ? node.children.reduce((n, c) => n + countLeaves(c), 0) : 1;
}

test("buildTree: one root named after include, folders first, code-unit order", () => {
  const tree = buildTree([...new Set(chunks.map((c) => c.path))], "src/flask");
  assert.equal(tree.name, "src/flask");
  assert.deepEqual(tree.children.slice(0, 4).map((n) => n.name), ["json", "sansio", "__init__.py", "__main__.py"]);
  assert.deepEqual(tree.children[0].children.map((n) => n.name), ["__init__.py", "provider.py", "tag.py"]);
  assert.equal(countLeaves(tree), 25);
});
