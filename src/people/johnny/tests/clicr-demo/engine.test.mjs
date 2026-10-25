import test from "node:test";
import assert from "node:assert/strict";
import { LOAD_CANCELLED, loadEngine } from "../../../../../public/projects/clicr/demo/engine.js";

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
};

/** A simulated WebLLM load: every phase waits until the test lets it go; unload() makes a pending reload fail like WebLLM does. */
function simulated() {
  const created = deferred();
  const reloaded = deferred();
  const warmed = deferred();
  const eng = {
    reloadedWith: null,
    reload(id) {
      eng.reloadedWith = id;
      return reloaded.promise;
    },
    unload() {
      reloaded.reject(new Error("Object has already been disposed."));
    },
  };
  const calls = [];
  const ld = { cancelled: false, eng: null };
  const run = loadEngine(ld, "model-id", {
    create: () => created.promise.then(() => eng),
    onWeights: () => calls.push("weights"),
    warmUp: (e) => {
      calls.push("warm-up");
      assert.equal(e, eng);
      return warmed.promise;
    },
  });
  const tick = () => new Promise((r) => setTimeout(r, 0));
  return { eng, ld, run, calls, created, reloaded, warmed, tick };
}

test("loadEngine: create, reload, weights, warm-up, then the warmed-up engine", async () => {
  const s = simulated();
  s.created.resolve();
  await s.tick();
  assert.equal(s.ld.eng, s.eng, "held from creation so Cancel can unload it");
  assert.equal(s.eng.reloadedWith, "model-id");
  s.reloaded.resolve();
  await s.tick();
  assert.deepEqual(s.calls, ["weights", "warm-up"]);
  s.warmed.resolve();
  assert.equal(await s.run, s.eng);
});

test("loadEngine: Cancel during the WebLLM download never hands out an engine", async () => {
  const s = simulated();
  s.ld.cancelled = true;
  s.created.resolve();
  await assert.rejects(s.run, { message: LOAD_CANCELLED });
  assert.equal(s.ld.eng, null);
  assert.equal(s.eng.reloadedWith, null);
});

test("loadEngine: Cancel during weights download and init (the engine unloaded under it) is a cancel, not a load error", async () => {
  const s = simulated();
  s.created.resolve();
  await s.tick();
  s.ld.cancelled = true;
  s.ld.eng.unload();
  await assert.rejects(s.run, { message: LOAD_CANCELLED });
  assert.deepEqual(s.calls, [], "no weights-done bar, no warm-up");
});

test("loadEngine: Cancel during the warm-up never hands out the engine, even when the warm-up finishes", async () => {
  const s = simulated();
  s.created.resolve();
  s.reloaded.resolve();
  await s.tick();
  assert.deepEqual(s.calls, ["weights", "warm-up"]);
  s.ld.cancelled = true;
  s.warmed.resolve();
  await assert.rejects(s.run, { message: LOAD_CANCELLED });
});

test("loadEngine: Cancel after the load is done does not take the engine back", async () => {
  const s = simulated();
  s.created.resolve();
  s.reloaded.resolve();
  s.warmed.resolve();
  const eng = await s.run;
  s.ld.cancelled = true;
  assert.equal(eng, s.eng);
});

test("loadEngine: a real load failure is reported as itself", async () => {
  const s = simulated();
  s.created.resolve();
  await s.tick();
  s.reloaded.reject(new Error("out of GPU memory"));
  await assert.rejects(s.run, { message: "out of GPU memory" });
});
