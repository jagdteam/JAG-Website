import assert from "node:assert/strict";
import test from "node:test";

import {
  MODEL_LOAD_TEXT,
  ModelLoadError,
  answerModeText,
  BLOCK_HOLD_MS,
  askBlock,
  createNavWatch,
  holdUntil,
  isHeld,
  isUserScroll,
  searchErrorText,
  waitingText,
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

test("createNavWatch: the end-of-stream scroll runs only when nothing moved since the generation started", () => {
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
  assert.deepEqual(askBlock({ ...ok, busy: "generate" }), {
    text: "Still writing the previous answer; ask again when it finishes.",
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
