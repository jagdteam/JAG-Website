// DOM-free steps of one WebLLM engine load for the CliCR demo, so Cancel at every phase can be checked with a simulated engine.

export const LOAD_CANCELLED = "The on-device model load was cancelled.";

/**
 * Load one engine for the load handle `ld` ({cancelled, eng}): `create()` makes it (WebLLM import + MLCEngine) and
 * `ld.eng` holds it from then on so Cancel can unload it; `eng.reload(id)` downloads and initialises the weights;
 * `onWeights()` runs once they are in; then `warmUp(eng)`. Resolves to the warmed-up engine. Once `ld.cancelled` is
 * set, at any phase before that, it rejects with LOAD_CANCELLED instead, so a cancelled load never hands out its engine.
 */
export async function loadEngine(ld, id, { create, onWeights = () => {}, warmUp }) {
  const check = () => {
    if (ld.cancelled) throw new Error(LOAD_CANCELLED);
  };
  const eng = await create();
  check();
  ld.eng = eng;
  try {
    await eng.reload(id);
  } catch (err) {
    check();
    throw err;
  }
  check();
  onWeights();
  await warmUp(eng);
  check();
  return eng;
}
