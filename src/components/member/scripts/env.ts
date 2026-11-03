// Media queries the member page scripts share. 900px is the two-column
// breakpoint in styles/base.css.
export const desktop = window.matchMedia("(min-width: 900px)");
export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export const scrollBehavior = (): ScrollBehavior => (reducedMotion.matches ? "auto" : "smooth");
