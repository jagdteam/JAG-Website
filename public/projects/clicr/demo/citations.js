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

/**
 * Recorded answer -> its cite map and extra pins (cited ranges no packed source overlaps). With
 * `webgpu` the page writes its own answer instead, so the recorded one adds no cites or pins.
 */
export function answerStepPins({ webgpu, recorded, pins }) {
  if (webgpu || !recorded?.answer) return { cite: null, extra: [] };
  return recordedPins(recorded.answer, recorded.sources ?? [], pins);
}

/** Pin of the first citation in answer order that maps onto a pin, or null (no citations: caller keeps pin 1). */
export function firstCitedPin(answer, cite) {
  if (!cite) return null;
  for (const n of citedNumbers(answer)) {
    const p = cite.get(n);
    if (p) return p;
  }
  return null;
}

export function identityCite(n) {
  return new Map(Array.from({ length: n }, (_, k) => [k + 1, k + 1]));
}


const PATH_RE = /(?<![\w@:/.-])((?:(?<=^|[\s`(])\/|\.{1,2}\/)?[\w.-]+(?:\/[\w.-]+)*\.(?:py|md))(?![\w-])(?::(\d+)(?:[-–](\d+))?(?!\d))?/g;
const lineCounts = new WeakMap();

function lineCount(text) {
  const n = text.split("\n").length;
  return text.endsWith("\n") ? n - 1 : n;
}

function linesOf(files, path) {
  if (!files || typeof files[path] !== "string") return null;
  let m = lineCounts.get(files);
  if (!m) lineCounts.set(files, (m = new Map()));
  if (!m.has(path)) m.set(path, lineCount(files[path]));
  return m.get(path);
}

/**
 * File-path mentions in an answer, each classified (the C14 rulings). A mention is a path with a "/" (or a bare
 * file name followed by :N) ending in .py or .md, optionally with :N or :N-M. A leading / or ./ or a missing
 * prefix is matched against the known files when that gives exactly one file. Fenced code and markdown links are
 * skipped; inline code is checked.
 *   kind "source":  a sent source (same file, overlapping lines or no lines); `pin` is its pin number when known
 *   kind "unsent":  the file exists but was not sent ("not in the sources")
 *   kind "missing": no such file in the bundle; "nolines": the file is shorter than the lines named
 * sources: [{n?, path, start, end}]; files: files.json object (path -> text) or null; chunkPaths: fallback list of
 * existing paths. With neither files nor chunkPaths nothing is flagged.
 * Returns [{ start, end, path, lines, kind, pin? }], start/end being string offsets of the whole mention.
 */
export function classifyPaths(text, { sources = [], files = null, chunkPaths = null } = {}) {
  const known = new Set([...Object.keys(files ?? {}), ...(chunkPaths ?? [])]);
  const allPaths = new Set([...known, ...sources.map((s) => s.path)]);
  const blank = (m) => "".repeat(m.length);
  const masked = text.replace(FENCED, blank).replace(LINK, blank);
  const out = [];
  for (const m of masked.matchAll(PATH_RE)) {
    const raw = m[1];
    const lines = m[2] ? [Number(m[2]), Number(m[3] ?? m[2])] : null;
    if (!raw.includes("/") && !lines) continue; // a bare file name without :N is ordinary prose
    const start = m.index;
    const end = start + m[0].length;
    const norm = raw.replace(/^(?:\.{0,2}\/)+/, "");
    let path = allPaths.has(norm) ? norm : null;
    if (!path) {
      const hits = [...allPaths].filter((k) => k.endsWith("/" + norm));
      if (hits.length > 1) continue; // ambiguous: say nothing
      path = hits[0] ?? null;
    }
    if (!path) {
      if (known.size) out.push({ start, end, path: norm, lines, kind: "missing" });
      continue;
    }
    const total = linesOf(files, path);
    if (lines && total !== null && (lines[0] > total || lines[1] > total || lines[0] > lines[1])) {
      out.push({ start, end, path, lines, kind: "nolines" });
      continue;
    }
    const hit = sources.find((s) => s.path === path && (!lines || (lines[0] <= s.end && s.start <= lines[1])));
    if (hit) out.push({ start, end, path, lines, kind: "source", ...(hit.n ? { pin: hit.n } : {}) });
    else if (known.has(path)) out.push({ start, end, path, lines, kind: "unsent" });
  }
  return out;
}

/** Recorded sources -> path-check sources, each carrying the lowest pin on the same path with overlapping lines (n unset when none). */
export function recordedSourcePins(recSources, pins) {
  return recSources.map((r) => {
    const hit = pins.find((p) => p.path === r.path && r.start <= p.end && p.start <= r.end);
    return { path: r.path, start: r.start, end: r.end, ...(hit ? { n: hit.n } : {}) };
  });
}

const PATH_LABEL = { unsent: "(not in the sources)", missing: "(not found in src/flask)", nolines: "(no such lines)" };

/** Answer text -> HTML: fenced code becomes <pre>; a mapped [n] links to its pin. */
export function answerHtml(text, cite, paths = null) {
  let flagged = 0;
  const html = text
    .split("```")
    .map((part, k) => {
      if (k % 2 === 1) return `<pre><code>${esc(part.replace(/^[\w+-]*\n/, ""))}</code></pre>`;
      if (!part.trim()) return "";
      const body = part.trim();
      const items = [];
      for (const m of citeMatches(body)) items.push({ at: m.index, end: m.index + m[0].length, cite: m });
      for (const f of paths ? classifyPaths(body, paths) : []) {
        items.push({ at: f.start, end: f.end, path: f });
        if (f.kind !== "source") flagged++;
      }
      items.sort((a, b) => a.at - b.at);
      let linked = "";
      let at = 0;
      for (const it of items) {
        linked += esc(body.slice(at, it.at));
        at = it.end;
        if (it.path) {
          linked += pathHtml(body.slice(it.at, it.end), it.path);
          continue;
        }
        const m = it.cite;
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
        const list = nums.map((n) => {
          const p = pinOf(n);
          return p ? `<a class="cite" href="#pin-${p}" data-pin="${p}">${p}</a>` : String(n);
        });
        linked += `[${list.join(", ")}]`;
      }
      linked += esc(body.slice(at));
      return `<p>${linked}</p>`;
    })
    .join("");
  const note = flagged
    ? `<p class="path-note">This answer mentions ${flagged} file reference${flagged === 1 ? " that wasn't" : "s that weren't"} in its sources.</p>`
    : "";
  return html + note;
}

function pathHtml(raw, f) {
  if (f.kind === "source") {
    return f.pin ? `<a class="cite path-ref" href="#pin-${f.pin}" data-pin="${f.pin}">${esc(raw)}</a>` : esc(raw);
  }
  const warn = f.kind !== "unsent";
  return `<span class="path-ref">${esc(raw)}</span> <span class="path-label${warn ? " path-warn" : ""}">${warn ? "⚠ " : ""}${PATH_LABEL[f.kind]}</span>`;
}
