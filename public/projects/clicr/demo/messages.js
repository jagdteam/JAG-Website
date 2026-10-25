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
    /** True when the end-of-stream answer scroll may run: nothing moved since start(). */
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
 * "generate" or "selftest"), `load` the data state ("loading", "failed" or "ready"). A null `text`
 * means ignore the submit without a message (the self-test keeps the page to itself).
 */
export function askBlock({ question, busy, load }) {
  if (busy === "selftest") return { text: null, err: false, focus: false };
  if (load === "failed") return { text: "The demo data did not load; reload the page to try again.", err: true, focus: false };
  if (load !== "ready") return { text: "Still loading the demo data; ask again in a moment.", err: false, focus: false };
  if (!String(question ?? "").trim()) return { text: "Type a question first.", err: false, focus: true };
  if (busy === "generate") return { text: "Still writing the previous answer; ask again when it finishes.", err: false, focus: false };
  if (busy) return { text: "Still searching; ask again when it finishes.", err: false, focus: false };
  return null;
}
