import { desktop, reducedMotion, scrollBehavior } from "./env";
import { setPlaying } from "./media";

/** The profile card at the top of the left column. It folds to a slim header while a showcase is open beside it. */
class ProfileCard {
  private readonly fold: HTMLElement | null;
  private readonly moving: HTMLElement[];

  constructor(private readonly plate: HTMLElement) {
    this.fold = plate.querySelector(".fold");
    this.moving = Array.from(plate.querySelectorAll<HTMLElement>(".photo, .idn-text"));
  }

  setCompact(on: boolean) {
    if (this.plate.classList.contains("compact") === on) return;
    const before = this.moving.map((el) => el.getBoundingClientRect());
    this.plate.classList.toggle("compact", on);
    if (this.fold) this.fold.inert = on;
    if (reducedMotion.matches) return;
    // Animate the photo and name from where they were to where they land.
    this.moving.forEach((el, i) => {
      const a = before[i];
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return;
      el.animate(
        [
          {
            transformOrigin: "top left",
            transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`,
          },
          { transformOrigin: "top left", transform: "none" },
        ],
        { duration: 420, easing: "cubic-bezier(.2, .8, .2, 1)" },
      );
    });
  }
}

interface Item {
  id: string;
  card: HTMLElement;
  /** Marks the card's own place in the page, right under its entry. */
  home: Comment;
  openers: HTMLAnchorElement[];
  /** The project or experience card it opens from. */
  entry: HTMLElement | null;
}

const plainUrl = () => location.pathname + location.search;

/**
 * Opens one showcase card (Showcase.astro) at a time. On desktop the card
 * moves into the left column under the folded profile; on phones it opens
 * right under its entry. The address carries #id while a card is open, so
 * Back closes it and a shared link opens straight to it. Switching cards
 * replaces that history entry instead of stacking new ones.
 */
export class ShowcaseController {
  private readonly items = new Map<string, Item>();
  private current: Item | null = null;

  static mount() {
    const plate = document.querySelector<HTMLElement>(".left > .plate");
    const slot = document.querySelector<HTMLElement>("[data-showcase-slot]");
    new ShowcaseController(slot, plate ? new ProfileCard(plate) : null);
  }

  constructor(
    private readonly slot: HTMLElement | null,
    private readonly profile: ProfileCard | null,
  ) {
    document.querySelectorAll<HTMLElement>("[data-showcase]").forEach((card) => {
      const openers = Array.from(document.querySelectorAll<HTMLAnchorElement>(`[data-showcase-open="${card.id}"]`));
      const home = document.createComment(` showcase ${card.id} `);
      card.before(home);
      this.items.set(card.id, {
        id: card.id,
        card,
        home,
        openers,
        entry: openers[0]?.closest<HTMLElement>(".plate") ?? null,
      });
    });
    this.bind();
    this.openFromAddress();
  }

  toggle(item: Item) {
    if (this.current === item) this.close();
    else this.open(item);
  }

  open(item: Item) {
    if (this.current === item) return;
    const state = { showcase: item.id };
    if (this.fromHistory()) history.replaceState(state, "", `#${item.id}`);
    else history.pushState(state, "", `#${item.id}`);
    this.render(item);
  }

  close() {
    if (!this.current) return;
    if (this.fromHistory()) {
      history.back(); // popstate renders the close
      return;
    }
    this.render(null);
    if (this.fromHash()) history.replaceState(history.state, "", plainUrl());
  }

  private fromHistory() {
    return (history.state?.showcase as string | undefined) ?? null;
  }

  private fromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    return this.items.has(id) ? id : null;
  }

  private itemFor(id: string | null | undefined) {
    return (id && this.items.get(id)) || null;
  }

  private render(next: Item | null) {
    if (next === this.current) return;
    const prev = this.current;
    this.current = next;
    if (prev) this.show(prev, false);
    if (next) this.show(next, true);
    this.profile?.setCompact(!!next && desktop.matches);
    if (prev && !next) this.returnFrom(prev);
  }

  private show(item: Item, open: boolean) {
    if (open) {
      if (desktop.matches && this.slot) {
        if (item.card.parentElement !== this.slot) this.slot.appendChild(item.card);
      } else if (item.card.previousSibling !== item.home) {
        item.home.after(item.card);
      }
    }
    item.card.classList.toggle("open", open);
    item.entry?.classList.toggle("showing", open && desktop.matches);
    item.openers.forEach((a) => a.setAttribute("aria-expanded", String(open)));
    setPlaying(item.card, open);
    if (!open) return;
    item.card.focus({ preventScroll: true });
    if (!desktop.matches) {
      window.scrollTo({ top: pageTop(item.card) - 16, behavior: scrollBehavior() });
    }
  }

  // After a close: on phones the card collapses under its entry, so bring the
  // entry back; keyboard focus goes back to the opener.
  private returnFrom(item: Item) {
    if (!desktop.matches) item.entry?.scrollIntoView({ block: "nearest", behavior: scrollBehavior() });
    if (item.card.contains(document.activeElement)) item.openers[0]?.focus({ preventScroll: true });
  }

  private bind() {
    this.items.forEach((item) => {
      item.openers.forEach((a) =>
        a.addEventListener("click", (e) => {
          e.preventDefault();
          this.toggle(item);
        }),
      );
      item.card.querySelector("[data-showcase-close]")?.addEventListener("click", () => this.close());
    });
    // A click anywhere else on a project card works like its opener.
    document.addEventListener("click", (e) => {
      const t = e.target as Element;
      const entry = t.closest?.<HTMLElement>("[data-opens]");
      if (!entry || t.closest("a, button") || window.getSelection()?.toString()) return;
      const item = this.itemFor(entry.dataset.opens);
      if (item) this.toggle(item);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });
    // Back/Forward, or #id typed into the address bar.
    window.addEventListener("popstate", () => this.render(this.itemFor(this.fromHistory() ?? this.fromHash())));
    // Crossing the desktop/phone line: move the open card to its new place.
    desktop.addEventListener("change", () => {
      const item = this.current;
      if (!item) return;
      this.current = null;
      this.render(item);
    });
  }

  // Opened from a shared link: make Back close the card rather than leave the page.
  private openFromAddress() {
    const item = this.itemFor(this.fromHash());
    if (!item) return;
    history.replaceState(null, "", plainUrl());
    history.pushState({ showcase: item.id }, "", `#${item.id}`);
    this.render(item);
    // Once the page has loaded and the browser has made its own jump to #id:
    // on desktop bring the entry into view beside the panel, on phones the card.
    const go = () =>
      requestAnimationFrame(() => {
        if (desktop.matches) item.entry?.scrollIntoView({ block: "center", behavior: "instant" });
        else window.scrollTo({ top: pageTop(item.card) - 16, behavior: "instant" });
      });
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  }
}

function pageTop(el: HTMLElement) {
  let top = 0;
  for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) top += e.offsetTop;
  return top;
}
