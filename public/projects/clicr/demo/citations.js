// DOM-free citation helpers for the CliCR demo: [n] parsing (port of parse_citations in
// src/clicr/answer/citations.py), numbered editor pins, and recorded-answer pin mapping.
import { esc } from "./html.js";

const FENCED = /```[\s\S]*?(?:```|$)/g;
const INLINE = /`[^`\n]*`/g;
const LINK = /\[[^\]]*\]\([^)]*\)/g;
const CITE = /\[(\d+(?:\s*[,\-–]\s*\d+)*)\]/g;
const MAX_RANGE = 100;

function expand(body) {
  const nums = [];
  for (const part of body.split(",")) {
    const bounds = part.trim().split(/\s*[-–]\s*/).map(Number);
    if (bounds.length === 2 && bounds[0] <= bounds[1] && bounds[1] <= bounds[0] + MAX_RANGE) {
      for (let n = bounds[0]; n <= bounds[1]; n++) nums.push(n);
    } else {
      nums.push(...bounds);
    }
  }
  return nums;
}

/** Cited source numbers in order of first appearance (code and links ignored). */
export function citedNumbers(text) {
  const clean = text.replace(FENCED, " ").replace(INLINE, " ").replace(LINK, " ");
  const seen = [];
  for (const m of clean.matchAll(CITE)) {
    for (const n of expand(m[1])) if (!seen.includes(n)) seen.push(n);
  }
  return seen;
}

/** sources: [{chunk, i, members}] -> numbered pins (n = position + 1). */
export function pinsFromSources(sources) {
  return sources.map((s, k) => ({
    n: k + 1,
    path: s.chunk.path,
    start: s.chunk.start,
    end: s.chunk.end,
    members: s.members,
  }));
}

/** Pin number holding chunk index i, or null. */
export function pinOfChunk(pins, i) {
  const p = pins.find((x) => x.members.includes(i));
  return p ? p.n : null;
}

/**
 * Map the answer's cited numbers onto pins. The k-th distinct cited number pairs with
 * recSources[k]; it takes the lowest-numbered pin on the same path with overlapping lines,
 * else a new extra pin. Numbers past recSources.length are left out.
 */
export function recordedPins(answer, recSources, pins) {
  const cite = new Map();
  const extra = [];
  citedNumbers(answer).forEach((num, k) => {
    const r = recSources[k];
    if (!r) return;
    const hit = [...pins, ...extra].find((p) => p.path === r.path && r.start <= p.end && p.start <= r.end);
    if (hit) {
      cite.set(num, hit.n);
    } else {
      const pin = { n: pins.length + extra.length + 1, path: r.path, start: r.start, end: r.end, members: [] };
      extra.push(pin);
      cite.set(num, pin.n);
    }
  });
  return { cite, extra };
}

export function identityCite(n) {
  return new Map(Array.from({ length: n }, (_, k) => [k + 1, k + 1]));
}

const PROTECTED = /(`[^`\n]*`|\[[^\]]*\]\([^)]*\))/;

/** Answer text -> HTML: fenced code becomes <pre>; a mapped [n] links to its pin. */
export function answerHtml(text, cite) {
  return text
    .split("```")
    .map((part, k) => {
      if (k % 2 === 1) return `<pre><code>${esc(part.replace(/^[\w+-]*\n/, ""))}</code></pre>`;
      if (!part.trim()) return "";
      const linked = part
        .trim()
        .split(PROTECTED)
        .map((seg, j) => {
          if (j % 2 === 1) return esc(seg); // inline code or link: never linked
          return esc(seg).replace(/\[(\d+)\]/g, (m, n) => {
            const p = cite ? cite.get(Number(n)) : undefined;
            return p ? `<a class="cite" href="#pin-${p}" data-pin="${p}">[${p}]</a>` : m;
          });
        })
        .join("");
      return `<p>${linked}</p>`;
    })
    .join("");
}
