// DOM-free helpers for the CliCR demo autoplay: stored question vectors and the "may it autoplay" rule.

/** Status line while the example question plays by itself. */
export const AUTOPLAY_STATUS = "Playing an example question — ask your own any time.";

/**
 * qvecs.bin -> Float32Array of n rows x dim (float32, little-endian, one row per entry of questions.json).
 * Null when the byte length does not match, so a bad file means "no stored vectors", never a wrong vector.
 */
export function parseQvecs(buf, n, dim) {
  if (!buf || buf.byteLength !== n * dim * 4) return null;
  const view = new DataView(buf);
  const out = new Float32Array(n * dim);
  for (let k = 0; k < out.length; k++) out[k] = view.getFloat32(k * 4, true);
  return out;
}

/** The stored vector (a view of one row) for `question`, or null when there is none. */
export function storedVector(qvecs, questions, question, dim) {
  if (!qvecs || !Array.isArray(questions)) return null;
  const k = questions.findIndex((q) => q.question === question);
  if (k < 0 || (k + 1) * dim > qvecs.length) return null;
  return qvecs.subarray(k * dim, (k + 1) * dim);
}

/** Question 1 autoplays unless this is the self-test or it has no stored vector. */
export function autoplayEligible({ selftest, questions, qvecs, dim }) {
  if (selftest || !questions?.length) return false;
  return storedVector(qvecs, questions, questions[0].question, dim) !== null;
}
