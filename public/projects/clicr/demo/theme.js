// Theme for the CliCR demo, mirroring the site loader (src/people/johnny/Layout.astro) and its
// toggle (ThemeToggle.astro): localStorage "theme" when it is exactly "light" or "dark", else
// prefers-color-scheme; the result goes on <html data-theme>. Pure until initTheme is called.

/** @returns {"light"|"dark"} */
export function resolveTheme(stored, prefersDark) {
  if (stored === "light" || stored === "dark") return stored;
  return prefersDark ? "dark" : "light";
}

export function initTheme(doc = document, win = window) {
  const root = doc.documentElement;
  const stored = () => {
    try {
      return win.localStorage.getItem("theme");
    } catch {
      return null;
    }
  };
  const prefersDark = () => Boolean(win.matchMedia?.("(prefers-color-scheme: dark)").matches);
  const apply = (theme) => {
    root.dataset.theme = theme;
    const btn = doc.getElementById("theme-toggle");
    if (btn) {
      const dark = theme === "dark";
      btn.setAttribute("aria-pressed", String(dark));
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
    return theme;
  };
  const resolve = () => apply(resolveTheme(stored(), prefersDark()));

  resolve();
  // fires only in other tabs; key null means the storage was cleared
  win.addEventListener("storage", (e) => {
    if (e.key === "theme" || e.key === null) resolve();
  });
  return {
    toggle() {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        win.localStorage.setItem("theme", next);
      } catch {}
      return apply(next);
    },
  };
}
