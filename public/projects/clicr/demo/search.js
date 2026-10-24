// CliCR hybrid search, ported from the Python CLI (jagdteam/clicr) so the browser ranks
// exactly like `clicr ask` with the default hybrid settings. No DOM here: the page and the
// self-test both import it.
//
// Sources of truth in the clicr repo:
//   search_terms        src/clicr/index/textsplit.py
//   fts_tokens, BM25    src/clicr/export_web.py (module docstring + bm25_scores)
//   vector search       src/clicr/index/store.py  IndexStore.vector_search
//   rrf_fuse            src/clicr/retrieve/search.py
//   graph expansion     src/clicr/retrieve/graph.py + pipeline.py _graph

// Python's `\w` on str is letters, numbers and `_`; its `\d` is any decimal digit.
const TOKEN = /[\p{L}\p{N}_]+/gu;
const PART = /[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\p{Nd}+/gu;

// graph.py MAX_DEFINITIONS and SearchConfig.graph_budget
export const MAX_DEFINITIONS = 3;
export const GRAPH_BUDGET = 3;
const IDF_FLOOR = 1e-6;

/** Original lowercase tokens plus their identifier parts, space separated. */
export function searchTerms(text) {
  const out = [];
  for (const token of text.match(TOKEN) ?? []) {
    out.push(token.toLowerCase());
    const parts = (token.match(PART) ?? []).map((p) => p.toLowerCase());
    if (parts.length > 1) out.push(...parts);
  }
  return out.join(" ");
}

/** What SQLite's unicode61 tokenizer yields (export_web.py docstring, JS form verbatim). */
export function ftsTokens(text) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

function unique(list) {
  return [...new Set(list)];
}

/** Every chunk holding a query key as [i, score], best first (export_web.bm25_scores). */
export function bm25Scores(query, bm25, k1 = 1.2, b = 0.75) {
  const docLen = bm25.doc_len;
  const nDocs = docLen.length;
  if (nDocs === 0) return [];
  let total = 0;
  for (const n of docLen) total += n;
  const avgLen = total / nDocs;
  const scores = new Map();
  for (const term of unique(searchTerms(query).split(" ").filter(Boolean))) {
    const key = ftsTokens(term).join(" ");
    // own keys only: a query word like "constructor" must not hit Object.prototype
    const hits = Object.hasOwn(bm25.postings, key) ? bm25.postings[key] : null;
    if (!hits || hits.length === 0) continue;
    let idf = Math.log((nDocs - hits.length + 0.5) / (hits.length + 0.5));
    if (idf <= 0) idf = IDF_FLOOR;
    for (const [i, tf] of hits) {
      const norm = tf + k1 * (1 - b + (b * docLen[i]) / avgLen);
      scores.set(i, (scores.get(i) ?? 0) + (idf * (tf * (k1 + 1))) / norm);
    }
  }
  return [...scores.entries()].sort((x, y) => y[1] - x[1] || x[0] - y[0]);
}

/** L2-normalised copy of a vector (store.vector_search normalises the query). */
export function normalize(vec) {
  let s = 0;
  for (let j = 0; j < vec.length; j++) s += vec[j] * vec[j];
  const n = Math.sqrt(s);
  const out = new Float32Array(vec.length);
  for (let j = 0; j < vec.length; j++) out[j] = n > 0 ? vec[j] / n : vec[j];
  return out;
}

/** Top `k` chunks by cosine against the int8/127 vectors, as [i, score]. */
export function vectorSearch(qvec, vectors, dim, k) {
  const n = vectors.length / dim;
  const scores = new Array(n);
  for (let i = 0; i < n; i++) {
    let d = 0;
    const off = i * dim;
    for (let j = 0; j < dim; j++) d += qvec[j] * vectors[off + j];
    scores[i] = [i, d / 127];
  }
  scores.sort((x, y) => y[1] - x[1] || x[0] - y[0]);
  return scores.slice(0, k);
}

/**
 * Reciprocal-rank fusion. Rows {i, fused, vrank, vscore, krank, kscore}, best first.
 * Ties break on the higher vector score (missing = last), then the lower i.
 */
export function rrfFuse(vectorHits, keywordHits, rrfK) {
  const vec = new Map(vectorHits.map(([i, s], r) => [i, [r + 1, s]]));
  const kw = new Map(keywordHits.map(([i, s], r) => [i, [r + 1, s]]));
  const ids = unique([...vec.keys(), ...kw.keys()]);
  const rows = ids.map((i) => {
    const [vrank, vscore] = vec.get(i) ?? [null, null];
    const [krank, kscore] = kw.get(i) ?? [null, null];
    let fused = 0;
    for (const r of [vrank, krank]) if (r !== null) fused += 1 / (rrfK + r);
    return { i, fused, vrank, vscore, krank, kscore };
  });
  const v = (row) => (row.vscore === null ? -Infinity : row.vscore);
  rows.sort((x, y) => y.fused - x.fused || v(y) - v(x) || x.i - y.i);
  return rows;
}

/**
 * 1-hop code-graph expansion (graph.py expand): walk the selected rows in rank order and
 * their refs in call order; add each name's definitions unless it has more than
 * MAX_DEFINITIONS of them, at most `budget` additions. Returns rows with a `graph` trace.
 */
export function graphExpand(selected, graph, fusedRows, budget = GRAPH_BUDGET) {
  const chosen = new Set(selected.map((r) => r.i));
  const byId = new Map(fusedRows.map((r) => [r.i, r]));
  const seen = new Set();
  const added = [];
  for (const source of selected) {
    for (const name of graph.refs[String(source.i)] ?? []) {
      if (added.length >= budget) return added;
      if (seen.has(name)) continue;
      seen.add(name);
      const ids = Object.hasOwn(graph.defs, name) ? graph.defs[name] : [];
      if (ids.length > MAX_DEFINITIONS) continue;
      for (const i of ids) {
        if (chosen.has(i) || added.length >= budget) continue;
        const base = byId.get(i) ?? { i, fused: 0, vrank: null, vscore: null, krank: null, kscore: null };
        chosen.add(i);
        added.push({ ...base, graph: { via: name, from: source.i } });
      }
    }
  }
  return added;
}

/**
 * The full hybrid path for one query. `qvec` is the (already prefixed + embedded) query
 * vector; `bundle` = {manifest, vectors: Int8Array, bm25, graph}.
 */
export function hybridSearch(bundle, qvec, query, { useGraph = false } = {}) {
  const m = bundle.manifest;
  const vector = vectorSearch(normalize(qvec), bundle.vectors, m.embed.dim, m.k_candidates);
  const keyword = bm25Scores(query, bundle.bm25, m.bm25.k1, m.bm25.b).slice(0, m.k_candidates);
  const fused = rrfFuse(vector, keyword, m.rrf_k);
  fused.forEach((row, r) => (row.frank = r + 1));
  const top = fused.slice(0, m.top_k);
  const added = useGraph ? graphExpand(top, bundle.graph, fused) : [];
  return { vector, keyword, fused, top, added, results: [...top, ...added] };
}

/** `path:start-end` label, the format of parity.json python_top. */
export function chunkLabel(chunk) {
  return `${chunk.path}:${chunk.start}-${chunk.end}`;
}

/** Query words that matched chunk i in keyword search, highest idf x tf first. */
export function matchedTerms(query, bm25, i) {
  const nDocs = bm25.doc_len.length;
  const weight = (term) => {
    const key = ftsTokens(term).join(" ");
    if (!Object.hasOwn(bm25.postings, key)) return 0;
    const hits = bm25.postings[key];
    const hit = hits.find(([j]) => j === i);
    if (!hit) return 0;
    const idf = Math.log((nDocs - hits.length + 0.5) / (hits.length + 0.5));
    return idf <= 0 ? 0 : idf * hit[1];
  };
  const found = new Map();
  const keep = (term, w) => {
    if (!found.has(term)) found.set(term, w);
  };
  for (const token of query.match(TOKEN) ?? []) {
    const whole = token.toLowerCase();
    const wholeWeight = weight(whole);
    if (wholeWeight > 0) {
      keep(whole, wholeWeight);
      continue;
    }
    const parts = (token.match(PART) ?? []).map((p) => p.toLowerCase());
    if (parts.length > 1) {
      for (const part of parts) {
        const w = weight(part);
        if (w > 0) keep(part, w);
      }
    }
  }
  return [...found.entries()].sort((a, b) => b[1] - a[1]).map(([term]) => term);
}
