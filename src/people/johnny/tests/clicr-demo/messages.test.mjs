import assert from "node:assert/strict";
import test from "node:test";

import {
  MODEL_LOAD_TEXT,
  ModelLoadError,
  answerModeText,
  BLOCK_HOLD_MS,
  askBlock,
  BAR_LABEL,
  createNavWatch,
  engineWaitText,
  holdUntil,
  isHeld,
  isUserScroll,
  nextBar,
  preloadLineText,
  searchErrorText,
  waitingText,
  waitingView,
} from "../../../../../public/projects/clicr/demo/messages.js";
import { STOPWORDS, matchedTerms } from "../../../../../public/projects/clicr/demo/search.js";
import { pickGlow } from "../../../../../public/projects/clicr/demo/editor.js";

test("waitingText: the GPU hint followed by a whole-second counter", () => {
  assert.equal(
    waitingText(0),
    "Writing the answer… the first answer also prepares the model for your GPU, which can take a minute. (0 s)",
  );
  assert.ok(waitingText(12.9).endsWith("(12 s)"));
  assert.ok(waitingText(-1).endsWith("(0 s)"));
});

test("block message hold: stays at least 3 s, then the wait counter may take the status back", () => {
  assert.ok(BLOCK_HOLD_MS >= 3000);
  const until = holdUntil(10_000);
  assert.equal(until, 10_000 + BLOCK_HOLD_MS);
  assert.equal(isHeld(10_000, until), true);
  assert.equal(isHeld(12_500, until), true); // 2.5 s after the block message: still showing
  assert.equal(isHeld(until - 1, until), true);
  assert.equal(isHeld(until, until), false);
  assert.equal(isHeld(5, 0), false); // never held before any block message
});

test("createNavWatch: the first-token and end-of-stream scrolls run only when nothing moved since the generation started", () => {
  const nav = createNavWatch();
  nav.start();
  assert.equal(nav.mayScroll(), true);
  nav.note(); // a cite click, Explorer open, tab switch, step replay or manual scroll
  assert.equal(nav.mayScroll(), false);
  nav.note();
  assert.equal(nav.mayScroll(), false);
  nav.start(); // the next generation forgets the previous one's navigation
  assert.equal(nav.mayScroll(), true);
});

test("isUserScroll: wheel, touch drag, scrollbar press and scroll keys outside controls", () => {
  assert.equal(isUserScroll({ type: "wheel" }), true);
  assert.equal(isUserScroll({ type: "touchmove" }), true);
  assert.equal(isUserScroll({ type: "pointerdown", onScroller: true }), true);
  assert.equal(isUserScroll({ type: "pointerdown", onScroller: false }), false);
  for (const key of ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]) {
    assert.equal(isUserScroll({ type: "keydown", key }), true, key);
    assert.equal(isUserScroll({ type: "keydown", key, inControl: true }), false, key);
  }
  assert.equal(isUserScroll({ type: "keydown", key: "Enter" }), false);
  assert.equal(isUserScroll({ type: "keydown", key: "a" }), false);
  assert.equal(isUserScroll({ type: "scroll" }), false); // programmatic scrolls fire scroll, never input events
});

test("searchErrorText: model load errors get the huggingface.co advice, others keep their message", () => {
  const cause = new TypeError("Failed to fetch");
  const wrapped = new ModelLoadError(cause);
  assert.equal(wrapped.cause, cause);
  assert.equal(searchErrorText(wrapped), MODEL_LOAD_TEXT);
  assert.ok(MODEL_LOAD_TEXT.startsWith("Could not download the search model from huggingface.co (blocked or offline)."));
  assert.equal(searchErrorText(new Error("boom")), "Search failed: boom");
  assert.equal(searchErrorText(cause), "Search failed: Failed to fetch");
});

test("answerModeText: recorded answer only when one is shown", () => {
  assert.equal(answerModeText(false, true), "recorded answer");
  assert.equal(answerModeText(false, false), "sources only");
  assert.equal(answerModeText(true, false), "WebGPU: answer on-device");
});

test("askBlock: load state, blank question and each busy phase say why; the self-test ignores it silently", () => {
  const ok = { question: "hi", busy: null, load: "ready" };
  assert.deepEqual(askBlock({ ...ok, load: "failed" }), {
    text: "The demo data did not load; reload the page to try again.",
    err: true,
    focus: false,
  });
  assert.deepEqual(askBlock({ ...ok, load: "loading" }), {
    text: "Still loading the demo data; ask again in a moment.",
    err: false,
    focus: false,
  });
  assert.deepEqual(askBlock({ ...ok, question: "   " }), { text: "Type a question first.", err: false, focus: true });
  assert.deepEqual(askBlock({ ...ok, busy: "search" }), {
    text: "Still searching; ask again when it finishes.",
    err: false,
    focus: false,
  });
  assert.deepEqual(askBlock({ ...ok, busy: "selftest" }), { text: null, err: false, focus: false });
  assert.deepEqual(askBlock({ ...ok, question: "", busy: "selftest" }), { text: null, err: false, focus: false });
  assert.equal(askBlock({ ...ok, question: " hi " }), null);
});

test("matchedTerms drops stopwords but keeps content words (STOPWORDS is the ruled list)", () => {
  assert.equal(STOPWORDS.size, 35);
  const bm = {
    doc_len: Array(20).fill(10),
    postings: { session: [[0, 2]], which: [[0, 1]], when: [[0, 1]], writes: [[0, 1]], and: [[0, 1]], it: [[0, 1]] },
  };
  assert.deepEqual(matchedTerms("which session writes when and it", bm, 0), ["session", "writes"]);
});

test("pickGlow: a pin wins over a cut glow on the same line, else the first covering glow", () => {
  const cut = { kind: "cut", start: 10, end: 20 };
  const pin = { kind: "P", pin: 4, start: 10, end: 30 };
  const m = { kind: "M", start: 40, end: 50 };
  assert.equal(pickGlow([cut, pin, m], 12), pin);
  assert.equal(pickGlow([pin, cut], 12), pin);
  assert.equal(pickGlow([cut, m], 12), cut);
  assert.equal(pickGlow([cut, m], 45), m);
  assert.equal(pickGlow([cut, m], 99), undefined);
});

test("waitingView: suggested questions never wait on a model, typed ones wait on the model they need", () => {
  const base = { embedReady: false, engineState: "loading", capable: true };
  assert.deepEqual(waitingView({ ...base, questionKind: "suggested" }), { answer: "recorded", status: "none" });
  assert.deepEqual(waitingView({ ...base, questionKind: null }), { answer: "none", status: "none" });
  // typed, embedding model still downloading: its progress is what the visitor waits on
  assert.deepEqual(waitingView({ ...base, questionKind: "typed" }), { answer: "embed-wait", status: "embed" });
  // typed, capable, engine not ready: sources first, then the "getting ready" text
  const t = { ...base, embedReady: true, questionKind: "typed" };
  assert.deepEqual(waitingView({ ...t, engineState: "loading" }), { answer: "engine-wait", status: "engine" });
  assert.deepEqual(waitingView({ ...t, engineState: "idle" }), { answer: "engine-wait", status: "engine" });
  assert.deepEqual(waitingView({ ...t, engineState: "ready" }), { answer: "live", status: "none" });
  assert.deepEqual(waitingView({ ...t, engineState: "failed" }), { answer: "live", status: "none" });
  // typed, not capable: sources plus the manual button, no model text
  assert.deepEqual(waitingView({ ...t, capable: false }), { answer: "sources-button", status: "none" });
  // the manual button waits on the engine whatever the device
  assert.deepEqual(waitingView({ ...t, capable: false, questionKind: "manual" }), { answer: "engine-wait", status: "engine" });
  assert.deepEqual(waitingView({ ...t, capable: false, questionKind: "manual", engineState: "ready" }), { answer: "live", status: "none" });
});

test("engineWaitText: a whole percent, clamped", () => {
  assert.equal(engineWaitText(0.426), "Getting the on-device model ready… 43%");
  assert.equal(engineWaitText(null), "Getting the on-device model ready… 0%");
  assert.equal(engineWaitText(7), "Getting the on-device model ready… 100%");
});

test("preloadLineText and BAR_LABEL: the one line beside the bar and the bar's accessible name", () => {
  assert.equal(preloadLineText(290), "Getting the on-device AI ready (290 MB)");
  assert.equal(BAR_LABEL, "Preparing models");
});

test("nextBar: two overlapping downloads share one bar by bytes and it never goes backwards", () => {
  const part = (loaded, total, extra = {}) => ({ loaded, total, done: false, failed: false, ...extra });
  let b = nextBar({ embed: part(0, 0) }, 0); // embedding started, no total yet
  assert.deepEqual(b, { hidden: false, value: 0, llmActive: false });
  b = nextBar({ embed: part(30, 100) }, b.value);
  assert.equal(b.value, 0.3);
  // the second download appears but has not reported its total: hold
  b = nextBar({ embed: part(60, 100), llm: part(0, 0) }, b.value);
  assert.deepEqual(b, { hidden: false, value: 0.3, llmActive: true });
  // the late total arrives: (60 + 0) / (100 + 300) = 0.15 is below the held value, so the bar holds at 0.3
  b = nextBar({ embed: part(60, 100), llm: part(0, 300) }, b.value);
  assert.equal(b.value, 0.3);
  b = nextBar({ embed: part(100, 100, { done: true }), llm: part(150, 300) }, b.value);
  assert.equal(b.value, 0.625);
  b = nextBar({ embed: part(100, 100, { done: true }), llm: part(100, 300) }, b.value); // a smaller reading never lowers it
  assert.equal(b.value, 0.625);
});

test("nextBar: full weights keep the bar full (and the line up) until engine init and warm-up are done", () => {
  const embed = { loaded: 100, total: 100, done: true, failed: false };
  const b = nextBar({ embed, llm: { loaded: 300, total: 300, done: false, failed: false } }, 0.9);
  assert.deepEqual(b, { hidden: false, value: 1, llmActive: true });
  assert.deepEqual(nextBar({ embed, llm: { loaded: 300, total: 300, done: true, failed: false } }, 1), { hidden: true, value: 0, llmActive: false });
});

test("nextBar: embedding only (not capable) shows the bar without the WebLLM line", () => {
  const b = nextBar({ embed: { loaded: 10, total: 100, done: false, failed: false }, llm: null }, 0);
  assert.deepEqual(b, { hidden: false, value: 0.1, llmActive: false });
});

test("nextBar: cancel (llm null) drops the line and the bar hides once the embedding is done", () => {
  const running = { loaded: 50, total: 100, done: false, failed: false };
  assert.equal(nextBar({ embed: running, llm: null }, 0.4).llmActive, false);
  assert.equal(nextBar({ embed: running, llm: null }, 0.4).hidden, false);
  assert.equal(nextBar({ embed: { ...running, loaded: 100, done: true }, llm: null }, 0.9).hidden, true);
});

test("nextBar: a failed preload drops out quietly; both failed, or nothing expected, hides the bar", () => {
  const fail = { loaded: 5, total: 100, done: false, failed: true };
  const run = { loaded: 40, total: 100, done: false, failed: false };
  assert.deepEqual(nextBar({ embed: run, llm: fail }, 0), { hidden: false, value: 0.4, llmActive: false });
  assert.equal(nextBar({ embed: fail, llm: fail }, 0.5).hidden, true);
  assert.equal(nextBar({}, 0.5).hidden, true);
});

test("nextBar: an embedding model that was already cached (done, no total) leaves the bar to the other download", () => {
  const b = nextBar({ embed: { loaded: 0, total: 0, done: true, failed: false }, llm: { loaded: 100, total: 400, done: false, failed: false } }, 0);
  assert.equal(b.value, 0.25);
});
