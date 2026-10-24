// Read-only editor for the CliCR demo: tabs, breadcrumb, line numbers, Python highlighting,
// glowing line ranges with gutter markers, and the explain card.
import { codeSpans, esc } from "./html.js";
import { strongest, tabsFor } from "./playback.js";

const KEYWORDS = new Set(
  ("False None True and as assert async await break class continue def del elif else except finally for from " +
    "global if import in is lambda nonlocal not or pass raise return try while with yield match case type").split(" "),
);
const BUILTINS = new Set("self cls super print len isinstance dict list tuple set str int bool object".split(" "));
const PY_TOKEN =
  /(#[^\n]*)|((?:[rRbBuUfF]{1,2})?(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|(@[\w.]+)|(\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?j?\b)|([A-Za-z_]\w*)/g;

/** One HTML string per line; spans are closed and reopened at line breaks. */
export function highlight(text, lang) {
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
  const lines = [""];
  for (const [cls, t] of segs) {
    t.split("\n").forEach((part, j) => {
      if (j > 0) lines.push("");
      if (part) lines[lines.length - 1] += cls ? `<span class="tk-${cls}">${esc(part)}</span>` : esc(part);
    });
  }
  return lines;
}

/** The whole file when files.json has it, else the matched chunks at their real line numbers. */
export function fileLines(path, files, chunks) {
  if (files?.[path]) return files[path].split("\n");
  const mine = chunks.filter((c) => c.path === path);
  const lines = new Array(Math.max(0, ...mine.map((c) => c.end))).fill("");
  for (const c of mine) c.text.split("\n").forEach((line, j) => (lines[c.start - 1 + j] = line));
  return lines;
}

export function breadcrumb(path, symbol) {
  return symbol ? [...path.split("/"), symbol] : path.split("/");
}

const MARK_TEXT = { M: "M", K: "K", MK: "MK", G: "G", cut: "×" };
const where = (g) => `${g.path}:${g.start}-${g.end}`;
const tabId = (path) => "tab-" + path.replace(/[^\w-]/g, "_");

export function createEditor(els, { chunks, getFiles, explain }) {
  const langOf = (path) => chunks.find((c) => c.path === path)?.lang ?? null;
  const htmlCache = new Map(); // path -> highlighted lines (per files.json state)
  let tabs = [];
  let active = null;
  let step = null;
  let token = 0;
  let cardFor = null;

  function symbolOf(g) {
    if (!g) return null;
    const c = g.i != null ? chunks[g.i] : chunks.find((x) => x.path === g.path && x.start <= g.start && g.start <= x.end);
    return c?.symbol ?? null;
  }
  const glowsHere = () => (step ? step.glows.filter((g) => g.path === active) : []);

  // ------------------------------------------------------------ tabs and breadcrumb
  function drawTabs() {
    els.tabs.replaceChildren(
      ...tabs.map((path) => {
        const b = document.createElement("button");
        b.type = "button";
        b.id = tabId(path);
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", String(path === active));
        b.tabIndex = path === active ? 0 : -1;
        b.dataset.path = path;
        b.title = path;
        b.textContent = path.slice(path.lastIndexOf("/") + 1);
        return b;
      }),
    );
    if (active) els.view.setAttribute("aria-labelledby", tabId(active));
  }
  function drawCrumb(symbol) {
    els.crumb.replaceChildren(
      ...breadcrumb(active, symbol).flatMap((part, k) => {
        const s = document.createElement("span");
        s.textContent = part;
        if (k === 0) return [s];
        const sep = document.createElement("span");
        sep.className = "sep";
        sep.setAttribute("aria-hidden", "true");
        sep.textContent = "›";
        return [sep, s];
      }),
    );
  }
  function announce() {
    els.tabs.dispatchEvent(new CustomEvent("tabchange", { bubbles: true, detail: { path: active } }));
  }

  // ------------------------------------------------------------ the code view
  async function linesHtml(path) {
    if (htmlCache.has(path)) return htmlCache.get(path);
    const files = await getFiles();
    const html = highlight(fileLines(path, files, chunks).join("\n"), langOf(path));
    if (files?.[path]) htmlCache.set(path, html); // chunk-only fallback is not cached
    return html;
  }

  function markFor(g) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "mark";
    b.dataset.kind = g.kind;
    let text = g.kind === "P" ? `[${g.pin}]` : MARK_TEXT[g.kind];
    if (step.id === "merge") text += ` #${g.rank}`;
    b.textContent = text;
    b.setAttribute("aria-label", g.kind === "cut" ? `Cut when packing, ${where(g)}` : `${step.title}, ${where(g)}`);
    return b;
  }

  function drawGlows(host, glows) {
    for (const g of glows) {
      const d = document.createElement("div");
      d.className = "glow";
      d.dataset.kind = g.kind;
      d.style.top = `calc(${g.start - 1} * var(--lh))`;
      d.style.height = `calc(${g.end - g.start + 1} * var(--lh))`;
      const b = markFor(g);
      d._glow = g;
      b._glow = g;
      d.append(b);
      host.append(d);
    }
  }

  async function render(scrollTo) {
    const mine = ++token;
    const lines = await linesHtml(active);
    if (mine !== token) return;
    closeCard();
    const host = document.createElement("div");
    host.className = "code";
    host.innerHTML = lines
      .map((l, k) => `<div class="row" data-line="${k + 1}"><span class="ln">${k + 1}</span><span class="tx">${l}</span></div>`)
      .join("");
    drawGlows(host, glowsHere());
    els.view.replaceChildren(host);
    if (scrollTo) scrollToLine(scrollTo);
    else els.view.scrollTop = 0;
  }

  function scrollToLine(n) {
    const row = els.view.querySelector(`.row[data-line="${n}"]`);
    if (!row) return;
    const delta = row.getBoundingClientRect().top - els.view.getBoundingClientRect().top;
    els.view.scrollTop += delta - 40;
  }

  // ------------------------------------------------------------ explain card
  function openCard(g, anchor) {
    if (!step) return;
    const { title, text } = explain(step, g);
    els.card.innerHTML = `<strong>${esc(title)}</strong><p>${codeSpans(text)}</p>`;
    els.card.hidden = false;
    const group = els.card.offsetParent ?? els.card.parentElement;
    const a = anchor.getBoundingClientRect();
    const r = group.getBoundingClientRect();
    els.card.style.top = `${Math.max(0, a.bottom - r.top + 4)}px`;
    els.card.style.left = `${Math.max(0, Math.min(a.left - r.left + 8, r.width - els.card.offsetWidth - 8))}px`;
    cardFor?.removeAttribute("aria-describedby");
    cardFor = anchor.closest?.(".mark") ?? null;
    cardFor?.setAttribute("aria-describedby", els.card.id || "explain-card");
  }
  function closeCard() {
    els.card.hidden = true;
    cardFor?.removeAttribute("aria-describedby");
    cardFor = null;
  }
  const glowAt = (line) => glowsHere().find((g) => g.start <= line && line <= g.end);

  els.view.addEventListener("click", (e) => {
    const mark = e.target.closest(".mark");
    if (mark) return openCard(mark._glow, mark);
    const row = e.target.closest(".row");
    const g = row && glowAt(Number(row.dataset.line));
    if (g) openCard(g, row);
    else closeCard();
  });
  els.view.addEventListener("pointerover", (e) => {
    if (e.pointerType === "touch") return;
    const mark = e.target.closest(".mark");
    if (mark) return openCard(mark._glow, mark);
    const row = e.target.closest(".row");
    const g = row && glowAt(Number(row.dataset.line));
    if (g) openCard(g, row);
  });
  els.view.addEventListener("pointerleave", () => {
    if (!cardFor || cardFor !== document.activeElement) closeCard();
  });
  els.view.addEventListener("focusout", () => closeCard());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !els.card.hidden) closeCard();
  });

  // ------------------------------------------------------------ tabs interaction
  els.tabs.addEventListener("click", (e) => {
    const t = e.target.closest('[role="tab"]');
    if (t) open(t.dataset.path);
  });
  els.tabs.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const k = tabs.indexOf(active) + (e.key === "ArrowRight" ? 1 : -1);
    const path = tabs[(k + tabs.length) % tabs.length];
    if (!path) return;
    e.preventDefault();
    open(path).then(() => document.getElementById(tabId(path))?.focus());
  });

  // ------------------------------------------------------------ public API
  async function open(path) {
    if (!tabs.includes(path)) tabs.push(path);
    active = path;
    drawTabs();
    drawCrumb(null);
    announce();
    await render(0);
  }

  async function showStep(next) {
    step = next;
    const want = tabsFor(next);
    const top = strongest(next);
    if (want.length) {
      tabs = want;
      if (top && !tabs.includes(top.path)) tabs[tabs.length - 1] = top.path;
    }
    if (top) active = top.path;
    else if (!active && tabs.length) active = tabs[0];
    if (!active) return;
    drawTabs();
    drawCrumb(top?.path === active ? symbolOf(top) : null);
    announce();
    await render(top?.path === active ? top.start : 0);
  }

  async function reveal(range, { flash = false } = {}) {
    if (active !== range.path || !els.view.querySelector(".code")) {
      if (!tabs.includes(range.path)) tabs.push(range.path);
      active = range.path;
      drawTabs();
      announce();
      await render(range.start);
    } else {
      scrollToLine(range.start);
    }
    const sym = chunks.find((c) => c.path === range.path && c.start <= range.start && range.start <= c.end)?.symbol ?? null;
    drawCrumb(sym);
    if (!flash) return;
    let target = [...els.view.querySelectorAll(".glow")].find((d) => d._glow.start <= range.start && range.start <= d._glow.end);
    if (!target) {
      target = document.createElement("div");
      target.className = "glow";
      target.dataset.kind = "reveal";
      target.style.top = `calc(${range.start - 1} * var(--lh))`;
      target.style.height = `calc(${range.end - range.start + 1} * var(--lh))`;
      els.view.querySelector(".code")?.append(target);
    }
    target.classList.remove("flash");
    void target.offsetWidth; // restart the animation
    target.classList.add("flash");
    const t = target;
    setTimeout(() => (t.dataset.kind === "reveal" ? t.remove() : t.classList.remove("flash")), 1000);
  }

  return { showStep, open, reveal };
}
