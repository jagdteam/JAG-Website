import { reducedMotion } from "./env";
import { playMuted } from "./media";

const SHIFT = 28; // px the items travel while switching
const SWIPE_MIN = 40; // px a swipe has to travel sideways
const WHEEL_STEP = 50; // px of sideways scrolling that moves one item
const GESTURE_END = 200; // ms without wheel events that ends a trackpad gesture

type Dir = 1 | -1;

/**
 * One media gallery (Gallery.astro): a main view, a thumbnail strip and
 * prev/next arrows. Items change with the thumbs, the arrows, the arrow keys,
 * a swipe or a sideways trackpad scroll, and slide in from the direction of travel.
 */
export class Gallery {
  private readonly items: HTMLElement[];
  private readonly thumbs: HTMLButtonElement[];
  private index = 0;
  private leaving: { el: HTMLElement; anim: Animation } | null = null;

  static mountAll() {
    document.querySelectorAll<HTMLElement>(".gal").forEach((root) => new Gallery(root));
  }

  constructor(private readonly root: HTMLElement) {
    this.items = Array.from(root.querySelectorAll<HTMLElement>(".gal-main > *"));
    this.thumbs = Array.from(root.querySelectorAll<HTMLButtonElement>(".gal-strip button"));
    if (reducedMotion.matches) {
      this.items.forEach((it) => {
        if (it instanceof HTMLVideoElement) it.controls = true;
      });
    }
    if (this.items.length < 2) return;
    this.thumbs.forEach((b, i) => b.addEventListener("click", () => this.show(i)));
    root.querySelector(".gal-arrow.prev")?.addEventListener("click", () => this.step(-1));
    root.querySelector(".gal-arrow.next")?.addEventListener("click", () => this.step(1));
    root.addEventListener("keydown", (e) => this.onKey(e));
    const main = root.querySelector<HTMLElement>(".gal-main");
    if (main) {
      this.bindSwipe(main);
      this.bindWheel(main);
    }
  }

  step(dir: Dir) {
    this.show(this.index + dir, dir);
  }

  /** Show item `next`; `dir` says which way to slide (forward unless going to an earlier item). */
  show(next: number, dir?: Dir) {
    const n = (next + this.items.length) % this.items.length;
    if (n === this.index) return;
    this.settle();
    const d = dir ?? (n > this.index ? 1 : -1);
    const from = this.items[this.index];
    const to = this.items[n];
    this.index = n;
    if (from instanceof HTMLVideoElement) from.pause();
    to.hidden = false;
    if (!reducedMotion.matches && this.visible()) this.slide(from, to, d);
    else from.hidden = true;
    this.thumbs.forEach((b, i) => b.setAttribute("aria-pressed", String(i === n)));
    if (to instanceof HTMLVideoElement && this.visible()) playMuted(to);
  }

  // The outgoing item fades out on top of the incoming one, then hides.
  private slide(from: HTMLElement, to: HTMLElement, d: Dir) {
    from.classList.add("leaving");
    const anim = from.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: `translateX(${-d * SHIFT}px)` },
      ],
      { duration: 240, easing: "ease-in" },
    );
    this.leaving = { el: from, anim };
    anim.onfinish = () => this.settle();
    to.animate(
      [
        { opacity: 0, transform: `translateX(${d * SHIFT}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: 320, easing: "cubic-bezier(.2, .8, .2, 1)" },
    );
  }

  // End a running switch at once, so a quick next one starts clean.
  private settle() {
    if (!this.leaving) return;
    const { el, anim } = this.leaving;
    this.leaving = null;
    anim.onfinish = null;
    anim.cancel();
    el.classList.remove("leaving");
    el.hidden = true;
  }

  private visible() {
    return typeof this.root.checkVisibility === "function"
      ? this.root.checkVisibility()
      : this.root.offsetParent !== null;
  }

  private onKey(e: KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    this.step(e.key === "ArrowRight" ? 1 : -1);
  }

  // Touch or pen: swipe left for next, right for previous.
  private bindSwipe(main: HTMLElement) {
    let start: { x: number; y: number } | null = null;
    main.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") start = { x: e.clientX, y: e.clientY };
    });
    main.addEventListener("pointerup", (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      start = null;
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      this.step(dx < 0 ? 1 : -1);
    });
    main.addEventListener("pointercancel", () => {
      start = null;
    });
  }

  // Sideways trackpad scroll: one item per gesture, momentum included.
  private bindWheel(main: HTMLElement) {
    let acc = 0;
    let used = false;
    let idle: ReturnType<typeof setTimeout> | undefined;
    main.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        e.preventDefault(); // keep the browser's swipe-to-go-back out of it
        clearTimeout(idle);
        idle = setTimeout(() => {
          acc = 0;
          used = false;
        }, GESTURE_END);
        if (used) return;
        acc += e.deltaX;
        if (Math.abs(acc) < WHEEL_STEP) return;
        used = true;
        this.step(acc > 0 ? 1 : -1);
      },
      { passive: false },
    );
  }
}
