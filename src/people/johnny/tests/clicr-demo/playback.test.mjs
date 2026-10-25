import assert from "node:assert/strict";
import test from "node:test";

import { STEP_MS, badgesFor, buildSteps, createPlayer, refocus, strongest, tabsFor } from "../../../../../public/projects/clicr/demo/playback.js";

const chunks = [
  { path: "a.py", start: 1, end: 10 },
  { path: "b.py", start: 1, end: 10 },
  { path: "a.py", start: 11, end: 30 },
  { path: "b.py", start: 20, end: 30 },
  { path: "a.py", start: 40, end: 50 },
  { path: "c.py", start: 1, end: 5 },
];
const fused = [
  { i: 2, vrank: 3, krank: 1, frank: 1 },
  { i: 0, vrank: 1, krank: null, frank: 2 },
  { i: 1, vrank: 2, krank: null, frank: 3 },
  { i: 3, vrank: null, krank: 2, frank: 4 },
];
const top = fused.slice(0, 3);
const added = [{ i: 4, graph: { via: "url_for", from: 0 } }];
const run = { vector: [[0, 0.9], [1, 0.8], [2, 0.7]], keyword: [[2, 10], [3, 5]], fused, top, added, results: [...top, ...added] };
const pins = [{ n: 1, path: "a.py", start: 1, end: 30, members: [0, 2] }];
const o = { chunks, nChunks: 327, useGraph: true };

test("buildSteps texts and glows", () => {
  const s = buildSteps(run, pins, o);
  assert.deepEqual(s.map((x) => x.id), ["meaning", "keyword", "merge", "graph", "pack", "answer"]);
  assert.deepEqual(s.map((x) => x.title), ["Meaning search", "Keyword search", "Merge (RRF)", "Follow calls (1 hop)", "Pack the context", "Answer"]);
  assert.equal(s[0].text, "Turned your question into numbers and compared it with all 327 chunks; 3 closest by meaning.");
  assert.deepEqual(s[0].glows.map((g) => [g.i, g.kind, g.rank]), [[0, "M", 1], [1, "M", 2], [2, "M", 3]]);
  assert.equal(s[0].glows[0].path, "a.py");
  assert.equal(s[1].text, "Looked for your words (BM25); 2 best keyword matches.");
  assert.deepEqual(s[1].glows.map((g) => [g.i, g.kind, g.rank]), [[2, "K", 1], [3, "K", 2]]);
  assert.equal(s[2].text, "Combined both lists: a chunk ranked high in either list rises; found by both rises most.");
  assert.equal(s[2].glows.find((g) => g.i === 2).kind, "MK");
  assert.equal(s[2].glows.find((g) => g.i === 0).kind, "M");
  assert.equal(s[2].glows.find((g) => g.i === 3).kind, "K");
  assert.equal(s[2].glows.find((g) => g.i === 3).rank, 4);
  assert.equal(s[3].text, "Top chunks call `url_for`; pulled in where `url_for` is defined.");
  assert.deepEqual(s[3].glows.map((g) => [g.i, g.kind]), [[4, "G"]]);
  assert.equal(s[4].text, "Kept the 3 best + graph additions, merged neighbours, fit the budget: 1 source for the model to read.");
  assert.deepEqual(s[4].glows.map((g) => g.kind), ["P", "cut", "cut"]);
  assert.equal(s[4].glows[0].pin, 1);
  assert.equal(s[4].glows[0].i, null);
  assert.equal(s[5].text, "");
});

test("graph off, no additions, no keyword hits", () => {
  const off = buildSteps(run, pins, { ...o, useGraph: false })[3];
  assert.equal(off.text, "Skipped: Follow calls is off.");
  assert.equal(off.skipped, true);
  const none = buildSteps({ ...run, added: [], results: run.top }, pins, o)[3];
  assert.equal(none.text, "No call led to a new definition, so nothing was added.");
  assert.ok(!none.skipped);
  const nk = buildSteps({ ...run, keyword: [] }, pins, o);
  assert.equal(nk[1].text, "Looked for your words (BM25); none of them appear in the code.");
  assert.deepEqual(nk[1].glows, []);
});

test("extra pins take their own path and lines (P10)", () => {
  const extra = { n: 2, path: "c.py", start: 7, end: 9, members: [] };
  const a = buildSteps(run, pins, { ...o, extraPins: [extra] })[5];
  const ps = a.glows.filter((g) => g.kind === "P");
  assert.equal(ps.length, 2);
  assert.deepEqual([ps[1].path, ps[1].start, ps[1].end, ps[1].pin, ps[1].i], ["c.py", 7, 9, 2, null]);
  assert.deepEqual([ps[0].path, ps[0].start, ps[0].end], ["a.py", 1, 30]);
});

test("strongest honours the step's focus pin, else the first non-cut glow", () => {
  const glows = [
    { kind: "cut", path: "a.py", start: 1, end: 2 },
    { kind: "P", pin: 1, path: "a.py", start: 5, end: 9 },
    { kind: "P", pin: 3, path: "b.py", start: 40, end: 50 },
  ];
  assert.equal(strongest({ glows }).pin, 1);
  assert.equal(strongest({ glows, focus: 3 }).path, "b.py");
  assert.equal(strongest({ glows, focus: 9 }).pin, 1, "an unknown focus falls back");
  assert.equal(strongest({ glows: [glows[0]], focus: 1 }), null);
});

test("refocus reports a change only when the glow the editor opens on moves", () => {
  const glows = [
    { kind: "cut", path: "a.py", start: 1, end: 2 },
    { kind: "P", pin: 1, path: "a.py", start: 5, end: 9 },
    { kind: "P", pin: 3, path: "b.py", start: 40, end: 50 },
  ];
  const step = { glows };
  assert.equal(refocus(step, 1), false, "pin 1 is already what an unfocused step shows");
  assert.equal(step.focus, 1);
  assert.equal(refocus(step, 3), true);
  assert.equal(strongest(step).pin, 3);
  assert.equal(refocus(step, 3), false);
  assert.equal(refocus(step, null), false);
  assert.equal(step.focus, 3, "no citation keeps the focus");
  assert.equal(refocus(step, 9), true, "an unknown pin falls back to pin 1");
});

test("tabsFor, badgesFor, strongest", () => {
  const s = buildSteps(run, pins, o);
  assert.deepEqual(tabsFor(s[0]), ["a.py", "b.py"]);
  assert.deepEqual(tabsFor(s[0], 1), ["a.py"]);
  // P8 (ruling): badge = chunks touched; the 2-chunk pin counts 2 (brief said 1)
  assert.deepEqual([...badgesFor(s[4])], [["a.py", 2]]);
  assert.deepEqual([...badgesFor(s[0])], [["a.py", 2], ["b.py", 1]]);
  assert.equal(strongest(s[0]).i, 0);
  assert.equal(strongest(s[1]).i, 2);
  assert.equal(strongest(s[4]).kind, "P");
  assert.equal(strongest({ glows: [{ kind: "cut" }] }), null);
  assert.deepEqual([...badgesFor({ glows: [{ path: "a.py", kind: "M" }, { path: "a.py", kind: "K" }, { path: "b.py", kind: "cut" }] })], [["a.py", 2]]);
  // tie: first glow earlier wins
  assert.deepEqual(tabsFor({ glows: [{ path: "x", kind: "M" }, { path: "y", kind: "M" }, { path: "y", kind: "K" }, { path: "x", kind: "K" }] }), ["x", "y"]);
});

function harness(steps, extra = {}) {
  const timers = [];
  const shows = [];
  const done = { n: 0 };
  const p = createPlayer({
    steps,
    show: (k) => shows.push(k),
    onDone: () => done.n++,
    setTimer: (fn, ms) => timers.push({ fn, ms, dead: false, ran: false }) - 1,
    clearTimer: (id) => { if (timers[id]) timers[id].dead = true; },
    ...extra,
  });
  const live = () => timers.filter((t) => !t.dead && !t.ran);
  const tick = () => { const t = live()[0]; if (t) { t.ran = true; t.fn(); } };
  return { p, shows, done, timers, live, tick };
}
const six = (skipAt = 3) => Array.from({ length: 6 }, (_, k) => ({ id: String(k), skipped: k === skipAt }));

test("autoplay with a skipped step", () => {
  const h = harness(six());
  assert.equal(STEP_MS, 1800);
  h.p.start();
  while (h.live().length) h.tick();
  assert.deepEqual(h.shows, [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(h.timers.map((t) => t.ms), [1800, 1800, 1800, 0, 1800]);
  assert.equal(h.p.done, true);
  assert.equal(h.p.current, 5);
  assert.equal(h.done.n, 1);
});

test("skip", () => {
  const h = harness(six());
  h.p.start();
  h.p.skip();
  assert.equal(h.shows.at(-1), 5);
  assert.equal(h.p.done, true);
  assert.equal(h.live().length, 0);
  assert.equal(h.done.n, 1);
  h.p.skip();
  assert.equal(h.done.n, 1);
});

test("skip at the last step calls onDone once", () => {
  const h = harness(six());
  h.p.start();
  while (h.live().length) h.tick();
  h.p.skip();
  assert.equal(h.done.n, 1);
});

test("reduced motion still steps through (the option no longer jumps to the end)", () => {
  const h = harness(six(-1), { reducedMotion: true });
  h.p.start();
  assert.deepEqual(h.shows, [0]);
  assert.equal(h.p.done, false);
  for (let k = 1; k <= 5; k++) {
    assert.equal(h.live()[0].ms, STEP_MS);
    h.tick();
    assert.equal(h.shows.at(-1), k);
  }
  assert.equal(h.p.done, true);
  assert.equal(h.done.n, 1);
});

test("replay only when done", () => {
  const h = harness(six());
  h.p.start();
  h.p.replay(2);
  assert.deepEqual(h.shows, [0]);
  h.p.skip();
  h.p.replay(2);
  assert.equal(h.shows.at(-1), 2);
  assert.equal(h.p.current, 2);
  assert.equal(h.done.n, 1);
});

test("stop cancels pending steps and never calls onDone", () => {
  const h = harness(six());
  h.p.start();
  h.p.stop();
  h.tick();
  assert.deepEqual(h.shows, [0]);
  assert.equal(h.done.n, 0);
  h.p.skip();
  assert.deepEqual(h.shows, [0]);
});

test("default timers work with node mock timers", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const shows = [];
  let n = 0;
  const p = createPlayer({ steps: six(), show: (k) => shows.push(k), onDone: () => n++ });
  p.start();
  for (let k = 0; k < 5; k++) t.mock.timers.tick(STEP_MS);
  assert.deepEqual(shows, [0, 1, 2, 3, 4, 5]);
  assert.equal(n, 1);
});

test("step 5 copy mentions graph additions only when the run has some", () => {
  const withAdds = buildSteps(run, pins, o)[4].text;
  assert.match(withAdds, /Kept the 3 best \+ graph additions,/);
  const off = { ...run, added: [], results: run.top };
  const text = buildSteps(off, pins, { ...o, useGraph: false })[4].text;
  assert.ok(!text.includes("graph additions"), text);
  assert.match(text, /^Kept the 3 best, merged neighbours/);
});
