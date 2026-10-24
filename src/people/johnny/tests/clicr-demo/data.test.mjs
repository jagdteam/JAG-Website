import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const dataUrl = (name) =>
  new URL(`../../../../../public/projects/clicr/demo/data/${name}`, import.meta.url);
const readJson = (name) => JSON.parse(fs.readFileSync(dataUrl(name), "utf8"));

test("demo data bundle: files.json matches chunks and manifest", () => {
  const chunks = readJson("chunks.json");
  const files = readJson("files.json");
  const manifest = readJson("manifest.json");
  const filesUrl = dataUrl("files.json");
  const manifestUrl = dataUrl("manifest.json");

  assert.equal(Object.keys(files).length, 25);
  assert.deepEqual(new Set(Object.keys(files)), new Set(chunks.map((c) => c.path)));
  for (const c of chunks) {
    assert.equal(files[c.path].split("\n").slice(c.start - 1, c.end).join("\n"), c.text, c.path);
  }
  assert.equal(manifest.files["files.json"], fs.statSync(filesUrl).size);
  const total =
    Object.values(manifest.files).reduce((a, b) => a + b, 0) + fs.statSync(manifestUrl).size;
  assert.ok(total < 3 * 1024 * 1024, `bundle ${total} bytes`);
});
