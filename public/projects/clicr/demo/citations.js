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

/**
 * [n] / [n, m] / [n-m] matches outside inline code and links. Inline code is masked first,
 * then links, exactly as parse_citations strips them; the mask keeps string length so
 * match indices apply to the original text.
 */
function citeMatches(text) {
  const blank = (m) => "\uE000".repeat(m.length);
  const masked = text.replace(INLINE, blank).replace(LINK, blank);
  return [...masked.matchAll(CITE)];
}

/** Cited source numbers in order of first appearance (code and links ignored). */
export function citedNumbers(text) {
  const seen = [];
  for (const m of citeMatches(text.replace(FENCED, " "))) {
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

/** Answer text -> HTML: fenced code becomes <pre>; a mapped [n] links to its pin. */
export function answerHtml(text, cite) {
  return text
    .split("```")
    .map((part, k) => {
      if (k % 2 === 1) return `<pre><code>${esc(part.replace(/^[\w+-]*\n/, ""))}</code></pre>`;
      if (!part.trim()) return "";
      const body = part.trim();
      let linked = "";
      let at = 0;
      for (const m of citeMatches(body)) {
        linked += esc(body.slice(at, m.index));
        at = m.index + m[0].length;
        const nums = expand(m[1]);
        const pinOf = (n) => (cite ? cite.get(n) : undefined);
        if (!nums.some(pinOf)) {
          linked += esc(m[0]);
          continue;
        }
        if (nums.length === 1) {
          const p = pinOf(nums[0]);
          linked += `<a class="cite" href="#pin-${p}" data-pin="${p}">[${p}]</a>`;
          continue;
        }
        const items = nums.map((n) => {
          const p = pinOf(n);
          return p ? `<a class="cite" href="#pin-${p}" data-pin="${p}">${p}</a>` : String(n);
        });
        linked += `[${items.join(", ")}]`;
      }
      linked += esc(body.slice(at));
      return `<p>${linked}</p>`;
    })
    .join("");
}
