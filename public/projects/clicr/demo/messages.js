// DOM-free user-facing messages and guards for the CliCR demo (Node imports this).

export const MODEL_LOAD_TEXT =
  "Could not download the search model from huggingface.co (blocked or offline). The demo needs it once; check your connection and try again.";

/** Thrown by the demo when loading the embedding model fails (fetch/network error or a Transformers.js load error). */
export class ModelLoadError extends Error {
  constructor(cause) {
    super(MODEL_LOAD_TEXT, { cause });
    this.name = "ModelLoadError";
  }
}

/** Status line for a failed search: the model-download advice, else the raw message. */
export function searchErrorText(err) {
  if (err && err.name === "ModelLoadError") return MODEL_LOAD_TEXT;
  return `Search failed: ${err?.message ?? err}`;
}

/** Status while waiting for the first generated token; `secs` is the elapsed seconds. */
export function waitingText(secs) {
  const n = Math.max(0, Math.floor(secs));
  return `Writing the answer… the first answer also prepares the model for your GPU, which can take a minute. (${n} s)`;
}

/** How long a block message ("Still writing...", "Still searching...") keeps the status before the wait counter may take it back. */
export const BLOCK_HOLD_MS = 3000;

/** When a block message shown at `now` (ms) stops being held. */
export function holdUntil(now) {
  return now + BLOCK_HOLD_MS;
}

/** True while the wait counter must leave the status alone. */
export function isHeld(now, until) {
  return now < until;
}

const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

/**
 * True when an input event is the user scrolling: a wheel turn, a touch drag, a press on a
 * scroller's own box (its scrollbar), or a scroll key while focus is not on a control that uses it.
 */
export function isUserScroll({ type, key, inControl = false, onScroller = false }) {
  if (type === "wheel" || type === "touchmove") return true;
  if (type === "pointerdown") return onScroller;
  return type === "keydown" && !inControl && SCROLL_KEYS.has(key);
}

/** Whether the user navigated (cite, Explorer, tab, step replay, manual scroll) since a generation started. */
export function createNavWatch() {
  let moved = false;
  return {
    start() {
      moved = false;
    },
    note() {
      moved = true;
    },
    /** True when the generation's answer scrolls (first token, stream end) may run: nothing moved since start(). */
    mayScroll() {
      return !moved;
    },
  };
}

/** Right-hand status-bar label: what the answer area will hold for this question. */
export function answerModeText(webgpu, hasRecorded) {
  if (webgpu) return "WebGPU: answer on-device";
  return hasRecorded ? "recorded answer" : "sources only";
}

/**
 * Why Ask must not start a run now (null when it may). `busy` is the running phase (null, "search",
 * "generate" or "selftest"; a new question interrupts "generate" before this is asked), `load` the data state ("loading", "failed" or "ready"). A null `text`
 * means ignore the submit without a message (the self-test keeps the page to itself).
 */
export function askBlock({ question, busy, load }) {
  if (busy === "selftest") return { text: null, err: false, focus: false };
  if (load === "failed") return { text: "The demo data did not load; reload the page to try again.", err: true, focus: false };
  if (load !== "ready") return { text: "Still loading the demo data; ask again in a moment.", err: false, focus: false };
  if (!String(question ?? "").trim()) return { text: "Type a question first.", err: false, focus: true };
  if (busy) return { text: "Still searching; ask again when it finishes.", err: false, focus: false };
  return null;
}

/**
 * What the answer area and status line show while the background models load (C12b).
 * questionKind: "suggested" (recorded answer, instant), "typed" (the visitor's own question), "manual"
 * (the visitor pressed "Write a fresh answer on your device"), or null (no question). engineState: "idle",
 * "loading", "ready" or "failed". Returns {answer, status}:
 *  - answer: "none" | "recorded" | "embed-wait" | "sources-button" | "engine-wait" | "live"
 *  - status: "none" | "embed" (embedding download text) | "engine" (on-device model text)
 * Model download text appears only when the visitor is waiting on that model.
 */
export function waitingView({ embedReady, engineState, capable, questionKind }) {
  if (questionKind === "suggested") return { answer: "recorded", status: "none" };
  if (questionKind !== "typed" && questionKind !== "manual") return { answer: "none", status: "none" };
  if (questionKind === "typed" && !embedReady) return { answer: "embed-wait", status: "embed" };
  if (questionKind === "typed" && !capable) return { answer: "sources-button", status: "none" };
  if (engineState === "ready" || engineState === "failed") return { answer: "live", status: "none" }; // failed: the generation retries and reports
  return { answer: "engine-wait", status: "engine" };
}

/** The visitor's waiting text while the on-device model loads; `frac` is 0..1 (unknown counts as 0). */
export function engineWaitText(frac) {
  const n = Math.round(Math.max(0, Math.min(1, Number.isFinite(frac) ? frac : 0)) * 100);
  return `Getting the on-device model ready… ${n}%`;
}

/** Accessible name of the one bottom progress bar. */
export const BAR_LABEL = "Preparing models";

/**
 * The one bottom progress bar over both background loads. Each part is null (not expected) or
 * {loaded, total, done, failed}. The value is (all loaded bytes) / (all totals), never below `prev`; while an
 * expected load has not reported its total yet the bar holds at `prev`. A part stays "not done" through engine
 * init and warm-up, so the bar stays full until then. Failed parts drop out; the bar hides once nothing is left loading.
 * A cancelled load is passed as null. Returns {hidden, value, llmActive}.
 */
export function nextBar({ embed = null, llm = null }, prev = 0) {
  const live = [embed, llm].filter((p) => p && !p.failed);
  if (!live.some((p) => !p.done)) return { hidden: true, value: 0, llmActive: false };
  const llmActive = Boolean(llm && !llm.failed && !llm.done); // the WebLLM load is running: the Cancel line shows
  let loaded = 0;
  let total = 0;
  let unknown = false;
  for (const p of live) {
    if (p.done) {
      if (p.total > 0) {
        loaded += p.total;
        total += p.total;
      }
    } else if (p.total > 0) {
      loaded += Math.min(p.loaded, p.total);
      total += p.total;
    } else {
      unknown = true;
    }
  }
  if (unknown || total === 0) return { hidden: false, value: prev, llmActive };
  return { hidden: false, value: Math.max(prev, Math.min(1, loaded / total)), llmActive };
}

/** The one line beside the bar while the WebLLM preload runs (the embedding preload has no line). `mb` is the model size from the pinned config. */
export function preloadLineText(mb) {
  return `Getting the on-device AI ready (${mb} MB)`;
}
