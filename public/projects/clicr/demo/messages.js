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

/** Right-hand status-bar label: what the answer area will hold for this question. */
export function answerModeText(webgpu, hasRecorded) {
  if (webgpu) return "WebGPU: answer on-device";
  return hasRecorded ? "recorded answer" : "sources only";
}

/** Why Ask must not start a run now (null when it may). */
export function askBlock({ question, busy, ready }) {
  if (!ready) return { text: "The demo data did not load; reload the page to try again.", err: true, focus: false };
  if (!String(question ?? "").trim()) return { text: "Type a question first.", err: false, focus: true };
  if (busy) return { text: "Still writing the previous answer; ask again when it finishes.", err: false, focus: false };
  return null;
}
