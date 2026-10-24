// DOM-free play-by-play for the CliCR demo: turns one hybridSearch run plus the packed pins
// into six steps with their glows, and a timer-driven player over those steps.

export const STEP_MS = 1800;

const TITLES = {
  meaning: "Meaning search",
  keyword: "Keyword search",
  merge: "Merge (RRF)",
  graph: "Follow calls (1 hop)",
  pack: "Pack the context",
  answer: "Answer",
};

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** Glow for chunk i; `count` is how many chunks it stands for (badge weight). */
function chunkGlow(chunks, i, kind, rank) {
  const c = chunks[i];
  return { i, kind, rank, pin: null, path: c.path, start: c.start, end: c.end, count: 1 };
}

/** A pin glow takes the pin's own path and lines (not opts.chunks). */
export function pinGlow(pin) {
  return {
    i: null, kind: "P", rank: pin.n, pin: pin.n,
    path: pin.path, start: pin.start, end: pin.end, count: Math.max(1, pin.members.length),
  };
}

function mergeKind(row) {
  if (row.vrank !== null && row.krank !== null) return "MK";
  return row.vrank !== null ? "M" : "K";
}

/** Six steps, always in the order meaning, keyword, merge, graph, pack, answer. */
export function buildSteps(run, pins, { chunks, nChunks, useGraph, extraPins = [] }) {
  const meaning = run.vector.map(([i], r) => chunkGlow(chunks, i, "M", r + 1));
  const keyword = run.keyword.map(([i], r) => chunkGlow(chunks, i, "K", r + 1));
  const merge = run.fused.map((row) => chunkGlow(chunks, row.i, mergeKind(row), row.frank));
  const graph = run.added.map((row, r) => chunkGlow(chunks, row.i, "G", r + 1));
  const packed = new Set(pins.flatMap((p) => p.members));
  const pack = [
    ...pins.map(pinGlow),
    ...run.results.filter((row) => !packed.has(row.i)).map((row, r) => chunkGlow(chunks, row.i, "cut", r + 1)),
  ];
  const answer = [...pack, ...extraPins.map(pinGlow)];

  const vias = [...new Set(run.added.map((r) => r.graph.via))];
  const names = vias.map((n) => `\`${n}\``).join(", ");
  let graphText;
  if (!useGraph) graphText = "Skipped: Follow calls is off.";
  else if (!run.added.length) graphText = "No call led to a new definition, so nothing was added.";
  else graphText = `Top chunks call ${names}; pulled in where ${vias.length > 1 ? "they are" : `${names} is`} defined.`;

  const step = (id, text, glows, extra = {}) => ({ id, title: TITLES[id], text, glows, ...extra });
  return [
    step("meaning", `Turned your question into numbers and compared it with all ${nChunks} chunks; ${run.vector.length} closest by meaning.`, meaning),
    step("keyword", run.keyword.length
      ? `Looked for your words (BM25); ${run.keyword.length} best keyword matches.`
      : "Looked for your words (BM25); none of them appear in the code.", keyword),
    step("merge", "Combined both lists: a chunk ranked high in either list rises; found by both rises most.", merge),
    step("graph", graphText, graph, useGraph ? {} : { skipped: true }),
    step("pack", `Kept the ${run.top.length} best${run.added.length ? " + graph additions" : ""}, merged neighbours, fit the budget: ${plural(pins.length, "source")} for the model to read.`, pack),
    step("answer", "", answer),
  ];
}

const shown = (step) => step.glows.filter((g) => g.kind !== "cut");

/** Paths by number of non-cut glows, descending; ties go to the path glowing first. */
export function tabsFor(step, max = 4) {
  const stats = new Map();
  shown(step).forEach((g, k) => {
    const s = stats.get(g.path) ?? { n: 0, first: k };
    s.n++;
    stats.set(g.path, s);
  });
  return [...stats.entries()]
    .sort((a, b) => b[1].n - a[1].n || a[1].first - b[1].first)
    .slice(0, max)
    .map(([path]) => path);
}

/** Chunks the step touched per path (a pin counts its member chunks). */
export function badgesFor(step) {
  const out = new Map();
  for (const g of shown(step)) out.set(g.path, (out.get(g.path) ?? 0) + (g.count ?? 1));
  return out;
}

/** The glow the editor opens on: the step's focus pin when it has one (the answer's first citation), else the first non-cut glow. */
export function strongest(step) {
  const list = shown(step);
  if (step.focus != null) {
    const f = list.find((g) => g.kind === "P" && g.pin === step.focus);
    if (f) return f;
  }
  return list[0] ?? null;
}

/**
 * Timer-driven player. onDone fires exactly once per run on every path to done (natural end,
 * skip, reducedMotion); stop() never fires it.
 */
export function createPlayer({
  steps, show, onDone = () => {}, reducedMotion = false,
  setTimer = (fn, ms) => globalThis.setTimeout(fn, ms),
  clearTimer = (id) => globalThis.clearTimeout(id),
}) {
  const last = steps.length - 1;
  let current = 0;
  let done = false;
  let stopped = false;
  let timer = null;

  const cancel = () => {
    if (timer !== null) clearTimer(timer);
    timer = null;
  };
  const finish = () => {
    cancel();
    if (done) return;
    done = true;
    onDone();
  };
  const go = (k) => {
    current = k;
    show(k);
    if (k >= last) {
      finish();
      return;
    }
    timer = setTimer(() => {
      timer = null;
      if (!stopped) go(k + 1);
    }, steps[k].skipped ? 0 : STEP_MS);
  };

  return {
    start() {
      cancel();
      stopped = false;
      done = false;
      if (reducedMotion) {
        current = last;
        show(last);
        finish();
      } else {
        go(0);
      }
    },
    skip() {
      if (stopped || done) return;
      cancel();
      current = last;
      show(last);
      finish();
    },
    replay(k) {
      if (!done || stopped) return;
      current = k;
      show(k);
    },
    stop() {
      stopped = true;
      cancel();
    },
    get current() { return current; },
    get done() { return done; },
  };
}
