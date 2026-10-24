// CliCR browser demo: loads the exported bundle, embeds the question with Transformers.js,
// ranks with search.js (the port of the Python hybrid path) and renders sources, the
// per-stage explanation, answers and the parity self-test.
import * as S from "./search.js";
import { esc } from "./html.js";
import { answerHtml, identityCite } from "./citations.js";

// Pinned CDN builds (see the C7b report for why these versions).
const TRANSFORMERS_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/dist/transformers.min.js";
const WEBLLM_URL = "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.86/lib/index.min.js";

// fastembed model -> the Transformers.js port of the same weights. fastembed pools the
// [CLS] token and L2-normalises (OnnxTextEmbedding._post_process_onnx_output); so do we.
const EMBED_PORTS = {
  "BAAI/bge-small-en-v1.5": { id: "Xenova/bge-small-en-v1.5", dtype: "fp16", mb: 67 },
};

// WebLLM prebuilt ids (web-llm 0.2.86 prebuiltAppConfig); f16 needs the shader-f16 feature.
const LLM = {
  f16: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
  f32: "Qwen2.5-0.5B-Instruct-q4f32_1-MLC",
  mb: 290,
};
// The prebuilt Qwen 0.5B runs with a 4096-token window, so the sources get a smaller budget
// than the CLI's 5000 (same packing rules, src/clicr/answer/context.py).
const CONTEXT_TOKENS = 2000;
const MAX_ANSWER_TOKENS = 512;
const MERGE_GAP = 2;

// src/clicr/answer/prompt.py, verbatim
const NOT_FOUND = "I couldn't find this in the indexed code.";
const SYSTEM_PROMPT =
  "You answer questions about a codebase using ONLY the numbered sources provided.\n" +
  "- Cite every claim with its source number in square brackets, like [1] or [2][3].\n" +
  `- If the sources do not contain the answer, reply exactly "${NOT_FOUND}" and nothing else.\n` +
  "- Be concise.\n" +
  "- Quote code in fenced code blocks.";

const $ = (id) => document.getElementById(id);
const el = {
  form: $("ask"),
  q: $("q"),
  go: $("go"),
  note: $("model-note"),
  embedSize: $("embed-size"),
  explainOpt: $("opt-explain"),
  graphOpt: $("opt-graph"),
  suggest: $("suggest"),
  status: $("status"),
  progress: $("progress"),
  answer: $("answer"),
  answerBody: $("answer-body"),
  explain: $("explain"),
  explainTable: $("explain-table"),
  results: $("results"),
};

let bundle = null; // {manifest, chunks, vectors, bm25, graph, questions}
let port = null;
let extractorPromise = null;
let embedderReady = false;
let engine = null;
let engineId = null;
let last = null; // {question, qvec, run, recorded}
let busy = false;

// ---------------------------------------------------------------- small helpers
function setStatus(text, err = false) {
  el.status.textContent = text;
  el.status.classList.toggle("err", err);
}
function setProgress(frac) {
  if (frac === null) {
    el.progress.hidden = true;
    return;
  }
  el.progress.hidden = false;
  el.progress.value = Math.max(0, Math.min(1, frac));
}
function setBusy(on) {
  busy = on;
  el.go.disabled = on;
  for (const b of el.suggest.querySelectorAll("button")) b.disabled = on;
}
const mb = (bytes) => (bytes / 1e6).toFixed(0);

// ---------------------------------------------------------------- bundle
async function fetchOk(name) {
  const res = await fetch(`data/${name}`);
  if (!res.ok) throw new Error(`data/${name}: HTTP ${res.status}`);
  return res;
}
async function loadBundle() {
  const [manifest, chunks, bm25, graph, vbuf] = await Promise.all([
    fetchOk("manifest.json").then((r) => r.json()),
    fetchOk("chunks.json").then((r) => r.json()),
    fetchOk("bm25.json").then((r) => r.json()),
    fetchOk("graph.json").then((r) => r.json()),
    fetchOk("vectors.bin").then((r) => r.arrayBuffer()),
  ]);
  const questions = await fetchOk("questions.json")
    .then((r) => r.json())
    .catch(() => []);
  if (manifest.format !== 1) throw new Error(`Unknown bundle format ${manifest.format}`);
  const vectors = new Int8Array(vbuf);
  if (vectors.length !== manifest.n_chunks * manifest.embed.dim || chunks.length !== manifest.n_chunks) {
    throw new Error("The bundle is inconsistent (vector count does not match the chunks).");
  }
  return { manifest, chunks, vectors, bm25, graph, questions };
}

// ---------------------------------------------------------------- embedding
function getExtractor() {
  if (!extractorPromise) {
    const files = new Map();
    extractorPromise = (async () => {
      const T = await import(TRANSFORMERS_URL);
      return T.pipeline("feature-extraction", port.id, {
        dtype: port.dtype,
        device: "wasm",
        progress_callback: (p) => {
          if (p.status === "progress" && p.total) {
            files.set(p.file, [p.loaded, p.total]);
            let loaded = 0;
            let total = 0;
            for (const [l, t] of files.values()) {
              loaded += l;
              total += t;
            }
            setStatus(`Downloading the embedding model: ${mb(loaded)} / ${mb(total)} MB`);
            setProgress(loaded / total);
          }
        },
      });
    })();
    extractorPromise.catch(() => (extractorPromise = null));
  }
  return extractorPromise;
}
async function embedQuery(text) {
  if (!embedderReady) {
    setStatus(`Loading the embedding model from huggingface.co (about ${port.mb} MB the first time)…`);
    setProgress(0);
  }
  const extractor = await getExtractor();
  if (!embedderReady) {
    embedderReady = true;
    el.note.textContent = `Embedding model ${port.id} is loaded.`;
  }
  setProgress(null);
  const out = await extractor(bundle.manifest.embed.query_prefix + text, { pooling: "cls", normalize: true });
  return Float32Array.from(out.data);
}

// ---------------------------------------------------------------- Python highlighter
const KEYWORDS = new Set(
  ("False None True and as assert async await break class continue def del elif else except finally for from " +
    "global if import in is lambda nonlocal not or pass raise return try while with yield match case type").split(" "),
);
const BUILTINS = new Set("self cls super print len isinstance dict list tuple set str int bool object".split(" "));
const PY_TOKEN =
  /(#[^\n]*)|((?:[rRbBuUfF]{1,2})?(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|(@[\w.]+)|(\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?j?\b)|([A-Za-z_]\w*)/g;

function highlight(text, lang) {
  const segs = [];
  let at = 0;
  let prev = "";
  if (lang === "python") {
    for (const m of text.matchAll(PY_TOKEN)) {
      if (m.index > at) segs.push(["", text.slice(at, m.index)]);
      let cls = "";
      if (m[1]) cls = "c";
      else if (m[2]) cls = "s";
      else if (m[3]) cls = "d";
      else if (m[4]) cls = "n";
      else if (KEYWORDS.has(m[5])) cls = "k";
      else if (prev === "def" || prev === "class") cls = "f";
      else if (BUILTINS.has(m[5])) cls = "b";
      segs.push([cls, m[0]]);
      prev = m[5] ?? "";
      at = m.index + m[0].length;
    }
  }
  if (at < text.length) segs.push(["", text.slice(at)]);
  // split into lines, closing and reopening spans at line breaks
  const lines = [""];
  for (const [cls, t] of segs) {
    t.split("\n").forEach((part, j) => {
      if (j > 0) lines.push("");
      if (part) lines[lines.length - 1] += cls ? `<span class="tk-${cls}">${esc(part)}</span>` : esc(part);
    });
  }
  return lines;
}
function codeBlock(chunk) {
  const lines = highlight(chunk.text, chunk.lang);
  return (
    '<pre class="code" tabindex="0"><code>' +
    lines.map((l, j) => `<span class="row"><span class="ln">${chunk.start + j}</span>${l}</span>`).join("") +
    "</code></pre>"
  );
}

// ---------------------------------------------------------------- rendering
function renderResults(run) {
  const { chunks } = bundle;
  el.results.innerHTML = run.results
    .map((row, k) => {
      const c = chunks[row.i];
      const pills = [];
      if (row.graph) pills.push(`<span class="pill g">graph: calls ${esc(row.graph.via)}</span>`);
      if (row.vrank) pills.push(`<span class="pill">vector #${row.vrank}</span>`);
      if (row.krank) pills.push(`<span class="pill">keyword #${row.krank}</span>`);
      return `<div class="plate"><details class="pl src" id="src-${row.i}"${k < 3 ? " open" : ""}>
        <summary><span class="rank">${row.graph ? "+" : k + 1}</span>
        <span class="loc">${esc(S.chunkLabel(c))}</span>${c.symbol ? `<span class="sym">${esc(c.symbol)}</span>` : ""}
        ${pills.join(" ")}</summary>${codeBlock(c)}</details></div>`;
    })
    .join("");
}

function renderExplain(run) {
  const { chunks } = bundle;
  const top = new Set(run.top.map((r) => r.i));
  const added = new Map(run.added.map((r) => [r.i, r]));
  const rows = [...run.fused, ...run.added.filter((r) => !run.fused.some((f) => f.i === r.i))];
  const cell = (rank, score, digits) => (rank ? `#${rank} <small>(${score.toFixed(digits)})</small>` : "–");
  el.explainTable.innerHTML =
    "<thead><tr><th>fused</th><th>chunk</th><th>symbol</th><th>vector rank (cosine)</th><th>keyword rank (BM25)</th><th>fused score</th><th>shown</th></tr></thead><tbody>" +
    rows
      .map((r) => {
        const c = chunks[r.i];
        const g = added.get(r.i);
        const shown = top.has(r.i) ? "top" : g ? `graph via ${esc(g.graph.via)}` : "";
        return `<tr class="${shown ? "shown" : ""}"><td>${r.frank ? "#" + r.frank : "–"}</td><td>${esc(S.chunkLabel(c))}</td><td>${esc(c.symbol ?? "")}</td><td>${cell(r.vrank, r.vscore, 3)}</td><td>${cell(r.krank, r.kscore, 2)}</td><td>${r.fused ? r.fused.toFixed(4) : "–"}</td><td>${shown || "–"}</td></tr>`;
      })
      .join("") +
    "</tbody>";
}

function renderAll() {
  if (!last) return;
  renderResults(last.run);
  renderExplain(last.run);
  el.explain.hidden = !el.explainOpt.checked;
}

// ---------------------------------------------------------------- answers
/** pack() from src/clicr/answer/context.py (without re-reading files: merged text = joined chunks). */
function pack(rows, budget) {
  const cands = rows.map((row, rank) => ({ rank, row, c: bundle.chunks[row.i] }));
  const kept = [];
  for (const x of cands) {
    if (!kept.some((o) => o.c.path === x.c.path && x.c.start <= o.c.end && o.c.start <= x.c.end)) kept.push(x);
  }
  const byFile = new Map();
  for (const x of kept) {
    if (!byFile.has(x.c.path)) byFile.set(x.c.path, []);
    byFile.get(x.c.path).push(x);
  }
  const groups = [];
  for (const items of byFile.values()) {
    items.sort((a, b) => a.c.start - b.c.start);
    let cur = { rank: items[0].rank, members: [items[0]] };
    const end = (g) => Math.max(...g.members.map((m) => m.c.end));
    for (const x of items.slice(1)) {
      if (x.c.start - end(cur) - 1 <= MERGE_GAP) {
        cur.members.push(x);
        cur.rank = Math.min(cur.rank, x.rank);
      } else {
        groups.push(cur);
        cur = { rank: x.rank, members: [x] };
      }
    }
    groups.push(cur);
  }
  const sources = groups
    .map((g) => {
      const best = g.members.reduce((a, b) => (b.rank < a.rank ? b : a));
      const chunk =
        g.members.length === 1
          ? best.c
          : {
              ...best.c,
              start: g.members[0].c.start,
              end: Math.max(...g.members.map((m) => m.c.end)),
              text: g.members.map((m) => m.c.text).join("\n"),
            };
      return { rank: g.rank, chunk, i: best.row.i, members: g.members.map((m) => m.row.i) };
    })
    .sort((a, b) => a.rank - b.rank);
  const out = [];
  let used = 0;
  for (const s of sources) {
    const cost = Math.ceil(s.chunk.text.length / 4);
    if (out.length && used + cost > budget) break;
    out.push(s);
    used += cost;
  }
  const fileRank = new Map();
  for (const s of out) if (!fileRank.has(s.chunk.path)) fileRank.set(s.chunk.path, s.rank);
  return out.sort((a, b) => fileRank.get(a.chunk.path) - fileRank.get(b.chunk.path) || a.chunk.start - b.chunk.start);
}

/** build_messages() from src/clicr/answer/prompt.py, no history. */
function buildMessages(question, sources) {
  const fmt = (n, c) =>
    `[${n}] ${c.path}:${c.start}-${c.end}${c.symbol ? ` (${c.symbol})` : ""}\n\`\`\`${c.lang ?? ""}\n${c.text}\n\`\`\``;
  const body = sources.map((s, k) => fmt(k + 1, s.chunk)).join("\n\n");
  const user =
    `Sources:\n\n${body}\n\nQuestion: ${question}` +
    "\n\nAnswer using ONLY the sources above. Put the source number in square brackets " +
    "after every claim, like [1]. " +
    `If the sources do not contain the answer, reply exactly "${NOT_FOUND}".`;
  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: user },
  ];
}

function sourceList(sources) {
  return (
    '<ol class="answer-src">' +
    sources
      .map((s, k) => `<li><a class="cite" href="#src-${s.i}">[${k + 1}]</a> ${esc(S.chunkLabel(s.chunk))}</li>`)
      .join("") +
    "</ol>"
  );
}

function renderAnswerArea() {
  el.answer.hidden = false;
  const hasGpu = typeof navigator !== "undefined" && "gpu" in navigator && navigator.gpu;
  if (hasGpu) {
    el.answerBody.innerHTML = `<p class="note">Writes an answer on your device with <code>Qwen2.5-0.5B-Instruct</code>
      through WebLLM. First use downloads WebLLM from <strong>cdn.jsdelivr.net</strong>, the model weights (about
      <strong>${LLM.mb} MB</strong>) from <strong>huggingface.co</strong> (large files come from its CDN, cdn.hf.co) and
      the model's WebGPU library (about 6 MB) from <strong>raw.githubusercontent.com</strong>. Once only; your browser
      keeps them. Your question never leaves the page.</p>
      <button id="gen" type="button">Generate answer in your browser</button>`;
    $("gen").addEventListener("click", generate);
    return;
  }
  renderFallback(false);
}

/** Recorded answer if there is one, else the sources-only note (no WebGPU, or generation failed). */
function renderFallback(failed) {
  const rec = last.recorded;
  if (rec && rec.answer) {
    const date = rec.recorded_at ? rec.recorded_at.slice(0, 10) : "unknown date";
    const cited = (rec.sources ?? []).map((s) => `<li>${esc(`${s.path}:${s.start}-${s.end}`)}</li>`).join("");
    el.answerBody.innerHTML =
      `<p class="label">Recorded from the CLI (${esc(rec.model ?? "unknown model")}, ${esc(date)})</p>` +
      answerHtml(rec.answer, null) +
      (cited ? `<p class="label">Sources it cited:</p><ul class="answer-src">${cited}</ul>` : "");
  } else if (failed) {
    el.answerBody.innerHTML =
      '<p class="note">The answer could not be written in this browser, so the page shows the sources only.</p>';
  } else if (rec) {
    el.answerBody.innerHTML =
      '<p class="note">No recorded answer for this question yet, and this browser has no WebGPU to write one here, so the page shows the sources only.</p>';
  } else {
    el.answerBody.innerHTML =
      '<p class="note">Your browser has no WebGPU, so the page shows the sources only (in-browser answers need WebGPU).</p>';
  }
}

async function generate() {
  if (busy || !last) return;
  const btn = $("gen");
  setBusy(true);
  if (btn) btn.disabled = true;
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("WebGPU is present but no GPU adapter is available.");
    const id = adapter.features.has("shader-f16") ? LLM.f16 : LLM.f32;
    if (!engine || engineId !== id) {
      setStatus(
        `Loading WebLLM (cdn.jsdelivr.net) and ${id} (huggingface.co, raw.githubusercontent.com; about ${LLM.mb} MB the first time)…`,
      );
      setProgress(0);
      const webllm = await import(WEBLLM_URL);
      engine = await webllm.CreateMLCEngine(id, {
        initProgressCallback: (p) => {
          setStatus(p.text);
          setProgress(p.progress);
        },
      });
      engineId = id;
    }
    setProgress(null);
    const sources = pack(last.run.results, CONTEXT_TOKENS);
    const messages = buildMessages(last.question, sources);
    setStatus("Writing the answer…");
    const out = document.createElement("div");
    el.answerBody.innerHTML = `<p class="label">Generated in your browser (${esc(id)})</p>`;
    el.answerBody.append(out);
    const stream = await engine.chat.completions.create({
      messages,
      stream: true,
      temperature: 0.2, // the CLI's Ollama default
      max_tokens: MAX_ANSWER_TOKENS,
    });
    let text = "";
    for await (const chunk of stream) {
      text += chunk.choices[0]?.delta?.content ?? "";
      out.innerHTML = answerHtml(text, identityCite(sources.length));
    }
    out.insertAdjacentHTML("beforeend", '<p class="label">Sources in the prompt:</p>' + sourceList(sources));
    setStatus("Answer written on your device.");
  } catch (err) {
    setProgress(null);
    setStatus(`Could not generate an answer: ${err.message ?? err}`, true);
    renderFallback(true);
  } finally {
    setBusy(false);
  }
}

// ---------------------------------------------------------------- search flow
function recordedFor(question) {
  return bundle.questions.find((q) => q.question === question) ?? null;
}
function rerun() {
  if (!last) return;
  last.run = S.hybridSearch(bundle, last.qvec, last.question, { useGraph: el.graphOpt.checked });
  renderAll();
}
async function ask(question) {
  question = question.trim();
  if (!question || busy) return;
  setBusy(true);
  try {
    const qvec = await embedQuery(question);
    setStatus("Searching…");
    const t0 = performance.now();
    const run = S.hybridSearch(bundle, qvec, question, { useGraph: el.graphOpt.checked });
    const ms = performance.now() - t0;
    last = { question, qvec, run, recorded: recordedFor(question) };
    renderAll();
    renderAnswerArea();
    const extra = run.added.length ? ` + ${run.added.length} from the code graph` : "";
    setStatus(`Top ${run.top.length} sources${extra} from ${bundle.manifest.n_chunks} chunks, ranked in ${ms.toFixed(0)} ms on your device.`);
  } catch (err) {
    setProgress(null);
    setStatus(`Search failed: ${err.message ?? err}`, true);
  } finally {
    setBusy(false);
  }
}

// ---------------------------------------------------------------- self-test
async function selftest() {
  const box = $("selftest");
  const result = $("selftest-result");
  box.hidden = false;
  const parity = await fetchOk("parity.json").then((r) => r.json());
  const items = parity.items;
  const refs = parity.query_vectors ?? [];
  const n = items.length;
  const files5 = (labels) => [...new Set(labels.slice(0, 5).map((l) => l.slice(0, l.lastIndexOf(":"))))].sort().join("\n");
  let filesOk = 0;
  let termsOk = 0;
  let exactOk = 0;
  let vecMin = Infinity;
  const rows = [];
  for (const [k, it] of items.entries()) {
    result.textContent = `running ${k + 1}/${n}…`;
    const termsMatch = S.searchTerms(it.question) === it.terms;
    const qvec = await embedQuery(it.question);
    if (k < refs.length) {
      const a = S.normalize(qvec);
      const b = S.normalize(Float32Array.from(refs[k]));
      let d = 0;
      for (let j = 0; j < a.length; j++) d += a[j] * b[j];
      vecMin = Math.min(vecMin, d);
    }
    const run = S.hybridSearch(bundle, qvec, it.question);
    const labels = run.top.map((r) => S.chunkLabel(bundle.chunks[r.i]));
    const fMatch = files5(labels) === files5(it.python_top);
    const exact = labels.join("|") === it.python_top.join("|");
    filesOk += fMatch;
    termsOk += termsMatch;
    exactOk += exact;
    rows.push({ k, q: it.question, termsMatch, fMatch, exact, labels, python: it.python_top });
  }
  const vecText = Number.isFinite(vecMin) ? vecMin.toFixed(4) : "n/a";
  const line = `PARITY files@5 ${filesOk}/${n}, terms ${termsOk}/${n}, vec min ${vecText}`;
  result.textContent = line;
  const yes = (b) => `<td class="${b ? "ok" : "bad"}">${b ? "yes" : "no"}</td>`;
  $("selftest-table").innerHTML =
    `<caption class="note">files@5 = same set of files in the top 5 as Python; exact = same top ${bundle.manifest.top_k} chunks in the same order (${exactOk}/${n}).</caption>` +
    "<thead><tr><th>#</th><th>question</th><th>terms</th><th>files@5</th><th>exact</th><th>browser top</th><th>python top</th></tr></thead><tbody>" +
    rows
      .map(
        (r) =>
          `<tr><td>${r.k + 1}</td><td>${esc(r.q.slice(0, 70))}</td>${yes(r.termsMatch)}${yes(r.fMatch)}${yes(r.exact)}<td>${esc(r.labels.join(", "))}</td><td>${esc(r.python.join(", "))}</td></tr>`,
      )
      .join("") +
    "</tbody>";
  window.clicrSelftest = { line, filesOk, termsOk, exactOk, vecMin, n, rows };
  setStatus("Self-test finished.");
}

// ---------------------------------------------------------------- start
async function main() {
  setStatus("Loading the search index…");
  bundle = await loadBundle();
  const m = bundle.manifest;
  port = EMBED_PORTS[m.embed.fastembed_model];
  if (!port) throw new Error(`No browser port of the embedding model ${m.embed.fastembed_model}.`);
  el.embedSize.textContent = `${port.mb} MB`;

  const src = m.source;
  if (src.repo && src.commit) {
    $("src-link").href = `${src.repo}/tree/${src.commit}/${src.include === "." ? "" : src.include}`;
  }
  $("src-commit").textContent = (src.commit ?? "unknown").slice(0, 12);
  $("src-commit").title = src.commit ?? "";
  $("src-include").textContent = src.include;
  $("src-license").textContent = src.license ?? "see repository";

  for (const q of bundle.questions) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ghost";
    b.textContent = q.question;
    b.addEventListener("click", () => {
      el.q.value = q.question;
      ask(q.question);
    });
    el.suggest.append(b);
  }
  el.form.addEventListener("submit", (e) => {
    e.preventDefault();
    ask(el.q.value);
  });
  el.explainOpt.addEventListener("change", () => {
    if (last) el.explain.hidden = !el.explainOpt.checked;
  });
  el.graphOpt.addEventListener("change", rerun);
  // citation [n] -> open that source card and scroll to it; a card that is not shown
  // (e.g. a graph source after unticking the graph option) leaves the click a no-op
  el.answer.addEventListener("click", (e) => {
    const a = e.target.closest("a.cite");
    if (!a) return;
    e.preventDefault();
    const card = document.getElementById(a.getAttribute("href").slice(1));
    if (!card) return;
    card.open = true;
    for (const c of el.results.querySelectorAll(".src.hit")) c.classList.remove("hit");
    card.classList.add("hit");
    card.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  setStatus(`Ready: ${m.n_chunks} chunks of ${src.name} indexed. Pick a question or type your own.`);

  if (new URLSearchParams(location.search).get("selftest") === "1") {
    setBusy(true);
    try {
      await selftest();
    } catch (err) {
      $("selftest-result").textContent = `PARITY failed to run: ${err.message ?? err}`;
      setStatus(`Self-test failed: ${err.message ?? err}`, true);
    } finally {
      setBusy(false);
    }
  }
}

main().catch((err) => {
  setProgress(null);
  setStatus(`Could not start the demo: ${err.message ?? err}`, true);
});
