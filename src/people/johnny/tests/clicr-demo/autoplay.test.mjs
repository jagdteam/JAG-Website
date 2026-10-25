import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { AUTOPLAY_STATUS, autoplayEligible, parseQvecs, storedVector } from "../../../../../public/projects/clicr/demo/autoplay.js";

const D = new URL("../../../../../public/projects/clicr/demo/data/", import.meta.url);

function bufOf(values) {
  const buf = new ArrayBuffer(values.length * 4);
  const v = new DataView(buf);
  values.forEach((x, k) => v.setFloat32(k * 4, x, true));
  return buf;
}

test("AUTOPLAY_STATUS text", () => {
  assert.equal(AUTOPLAY_STATUS, "Playing an example question — ask your own any time.");
});

test("parseQvecs reads little-endian float32 rows and rejects a wrong size", () => {
  const q = parseQvecs(bufOf([1, 2, 3, 4, 5, 6]), 2, 3);
  assert.deepEqual([...q], [1, 2, 3, 4, 5, 6]);
  assert.equal(parseQvecs(bufOf([1, 2, 3, 4, 5]), 2, 3), null);
  assert.equal(parseQvecs(bufOf([1, 2, 3, 4, 5, 6, 7]), 2, 3), null);
  assert.equal(parseQvecs(null, 2, 3), null);
});

test("storedVector returns the row of the matching question, else null", () => {
  const questions = [{ question: "a" }, { question: "b" }];
  const q = parseQvecs(bufOf([1, 2, 3, 4, 5, 6]), 2, 3);
  assert.deepEqual([...storedVector(q, questions, "b", 3)], [4, 5, 6]);
  assert.deepEqual([...storedVector(q, questions, "a", 3)], [1, 2, 3]);
  assert.equal(storedVector(q, questions, "c", 3), null);
  assert.equal(storedVector(null, questions, "a", 3), null);
  assert.equal(storedVector(q, questions, "b", 4), null, "row past the end");
});

test("autoplayEligible: not in the self-test, needs question 1 and its vector", () => {
  const questions = [{ question: "a" }, { question: "b" }];
  const qvecs = parseQvecs(bufOf([1, 2, 3, 4, 5, 6]), 2, 3);
  assert.equal(autoplayEligible({ selftest: false, questions, qvecs, dim: 3 }), true);
  assert.equal(autoplayEligible({ selftest: true, questions, qvecs, dim: 3 }), false);
  assert.equal(autoplayEligible({ selftest: false, questions: [], qvecs, dim: 3 }), false);
  assert.equal(autoplayEligible({ selftest: false, questions, qvecs: null, dim: 3 }), false);
});

test("the shipped qvecs.bin parses against the shipped questions and manifest", () => {
  const manifest = JSON.parse(readFileSync(new URL("manifest.json", D), "utf8"));
  const questions = JSON.parse(readFileSync(new URL("questions.json", D), "utf8"));
  const raw = readFileSync(new URL("qvecs.bin", D));
  const buf = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
  const dim = manifest.embed.dim;
  const q = parseQvecs(buf, questions.length, dim);
  assert.ok(q, "size matches");
  assert.equal(autoplayEligible({ selftest: false, questions, qvecs: q, dim }), true);
  for (const item of questions) {
    const v = storedVector(q, questions, item.question, dim);
    let n = 0;
    for (const x of v) n += x * x;
    assert.ok(Math.abs(Math.sqrt(n) - 1) < 1e-3, "unit length");
  }
});
