import { desktop, reducedMotion, scrollBehavior } from "./env";
import { setPlaying } from "./media";
import { isOpen, setOpen } from "./details";

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

/** An experience or project card: one with a "details" list or a showcase to open. */
const CARD = ".plate:is([data-opens], :has(.exprow details), :has(.card-details))";

/** Open or close every "details" list on a card. */
function setDetails(card: HTMLElement, open: boolean) {
  card.querySelectorAll<HTMLDetailsElement>(".exprow details, .card-details").forEach((d) => {
    if (isOpen(d) !== open) setOpen(d, open);
  });
}

/**
 * Opens one showcase card (Showcase.astro) at a time. On desktop the card
 * moves into the left column under the folded profile; on phones it opens
 * right under its entry. The address carries #id while a card is open, so
 * Back closes it and a shared link opens straight to it. Switching cards
 * replaces that history entry instead of stacking new ones.
 *
 * It also keeps one experience or project card active at a time. A click on a
 * card opens its details and its showcase (if it has one). A second click on
 * the same card closes both, and a click on another card closes the first.
 */
export class ShowcaseController {
  private readonly items = new Map<string, Item>();
  private current: Item | null = null;
  /** The experience or project card whose details are open. */
  private active: HTMLElement | null = null;
  /** The scroll position to keep while closing the showcase for another card. */
  private stay: number | null = null;

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

  /** A click on a card: make it the active one, or close it if it already is. */
  clickCard(card: HTMLElement) {
    if (this.active === card) {
      this.setActive(null);
      if (this.current?.entry === card) this.close();
      return;
    }
    this.setActive(card);
    const item = this.itemFor(card.dataset.opens);
    if (item) this.open(item);
    else {
      // Switching to a card with no showcase: close the open one without
      // scrolling back to its entry, so the page stays on the card just clicked.
      // close() may finish later, on popstate, so render() clears the flag.
      if (this.current) {
        this.stay = window.scrollY;
        this.close();
      }
    }
  }

  private setActive(card: HTMLElement | null) {
    if (this.active === card) return;
    if (this.active) setDetails(this.active, false);
    this.active = card;
    if (card) setDetails(card, true);
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
    const stay = this.stay;
    this.stay = null;
    // Closing through history.back() lets the browser restore an old scroll
    // position, so put the page back where the click happened.
    if (stay !== null) requestAnimationFrame(() => window.scrollTo({ top: stay, behavior: "instant" }));
    else if (prev && !next) this.returnFrom(prev);
    // Keep the active card in step when the panel opens or closes another way
    // (its close button, Escape, Back, or a shared link).
    if (next?.entry) this.setActive(next.entry);
    else if (!next && prev?.entry && this.active === prev.entry) this.setActive(null);
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
      // Wait for the entry's details to finish sliding open (details.ts, 250 ms)
      // so the card's place on the page is final before scrolling to it.
      setTimeout(() => {
        if (this.current === item) window.scrollTo({ top: pageTop(item.card) - 16, behavior: scrollBehavior() });
      }, 280);
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
      item.card.querySelector("[data-showcase-close]")?.addEventListener("click", () => this.close());
    });
    // A click anywhere on a card, including its opener link and its "details"
    // toggle, works the same way. Other links and buttons keep their own job.
    // A double-click on bullet text selects a word, so a click there waits a
    // moment and is dropped if a double-click follows.
    let pending: ReturnType<typeof setTimeout> | undefined;
    document.addEventListener("click", (e) => {
      const t = e.target as Element;
      const card = t.closest?.<HTMLElement>(CARD);
      if (!card) return;
      if (t.closest("a:not(.opener), button")) return;
      if (t.closest("a.opener, summary")) e.preventDefault();
      clearTimeout(pending);
      if (e.detail > 1 || window.getSelection()?.toString()) return;
      if (t.closest(".exprow details > ul, .card-details > ul")) pending = setTimeout(() => this.clickCard(card), 300);
      else this.clickCard(card);
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
