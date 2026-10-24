// DOM-free HTML helpers for the CliCR demo.

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

/** Escape, then turn `x` into <code>x</code>. */
export function codeSpans(s) {
  return esc(s).replace(/`([^`\n]*)`/g, "<code>$1</code>");
}
