// DOM-free explain-card text for the CliCR demo: why a glowing block was picked at each step.

/** "app.py:450-470": path relative to the include folder ("." keeps the full path). */
export function shortLabel(chunk, include) {
  let path = chunk.path;
  const prefix = include && include !== "." ? include.replace(/\/+$/, "") + "/" : "";
  if (prefix && path.startsWith(prefix)) path = path.slice(prefix.length);
  return `${path}:${chunk.start}-${chunk.end}`;
}

/** n is the size of the vector list in this run. */
export function meaningLine(row, n) {
  if (row.vrank == null) return null;
  return `Rank ${row.vrank} of the ${n} closest by meaning (cosine ${row.vscore.toFixed(3)})`;
}

/** n is the size of the keyword list in this run. */
export function keywordLine(row, n, terms) {
  if (row.krank == null) return null;
  const base = `Rank ${row.krank} of the ${n} best keyword matches (BM25 ${row.kscore.toFixed(1)})`;
  return terms.length ? `${base}; matched: ${terms.map((t) => `\`${t}\``).join(", ")}` : base;
}

export function mergeLine(row, rrfK) {
  const parts = [];
  if (row.vrank != null) parts.push(`1/(${rrfK}+${row.vrank})`);
  if (row.krank != null) parts.push(`1/(${rrfK}+${row.krank})`);
  return `Merged rank ${row.frank}: ${parts.join(" + ")}`;
}

export function graphLine(row, fromLabel, fromPin) {
  const who = fromPin != null ? `source [${fromPin}]` : `\`${fromLabel}\``;
  return `Added because ${who} calls \`${row.graph.via}\``;
}

export function finalLine(pin, nPacked) {
  return pin == null ? "Found, but cut when packing" : `Source [${pin}] of ${nPacked} sent to the model`;
}

/**
 * ctx = { rowsById (fused + added rows), nVector, nKeyword (list sizes from the run), rrfK,
 *         nPacked, termsFor(i), labelFor(i), pinOf(i) }
 */
export function explainGlow(step, glow, ctx) {
  const title = step.title;
  if (glow.kind === "P" && glow.pin > ctx.nPacked) {
    return { title, text: "Cited by the recorded CLI answer; not among the packed sources." };
  }
  if (glow.kind === "cut") return { title, text: finalLine(null, ctx.nPacked) };
  const row = ctx.rowsById?.get(glow.i);
  let text = null;
  switch (step.id) {
    case "meaning":
      if (row) text = meaningLine(row, ctx.nVector);
      break;
    case "keyword":
      if (row) text = keywordLine(row, ctx.nKeyword, ctx.termsFor(glow.i));
      break;
    case "merge":
      if (row) text = mergeLine(row, ctx.rrfK);
      break;
    case "graph":
      if (row?.graph) text = graphLine(row, ctx.labelFor(row.graph.from), ctx.pinOf(row.graph.from));
      break;
    case "pack":
    case "answer":
      // a pin glow has no chunk index (i is null); it carries its own number
      text = finalLine(glow.kind === "P" ? glow.pin : ctx.pinOf(glow.i), ctx.nPacked);
      break;
  }
  return { title, text: text ?? "" };
}
