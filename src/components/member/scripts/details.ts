import { reducedMotion } from "./env";

const running = new WeakMap<HTMLDetailsElement, Animation>();
const closing = new WeakSet<HTMLDetailsElement>();

/** Whether a <details> is open, counting one that is sliding shut as closed. */
export const isOpen = (d: HTMLDetailsElement) => d.open && !closing.has(d);

/** Open or close a <details> with its body sliding, instead of the browser's instant toggle. */
export function setOpen(d: HTMLDetailsElement, open: boolean) {
  const body = d.querySelector<HTMLElement>(":scope > :not(summary)");
  stop(d, body);
  if (reducedMotion.matches || !body) {
    d.open = open;
    return;
  }
  if (d.open === open) return;
  d.open = true;
  const cs = getComputedStyle(body);
  const full = {
    height: cs.height,
    marginTop: cs.marginTop,
    paddingTop: cs.paddingTop,
    borderTopWidth: cs.borderTopWidth,
  };
  const zero = { height: "0px", marginTop: "0px", paddingTop: "0px", borderTopWidth: "0px" };
  body.style.overflow = "hidden";
  const anim = body.animate(open ? [zero, full] : [full, zero], { duration: 250, easing: "ease-out" });
  running.set(d, anim);
  if (!open) closing.add(d);
  anim.onfinish = () => {
    stop(d, body);
    if (!open) d.open = false;
  };
}

// End a running slide where it is, so the next one starts from a known state.
function stop(d: HTMLDetailsElement, body: HTMLElement | null) {
  const anim = running.get(d);
  if (!anim) return;
  running.delete(d);
  closing.delete(d);
  anim.onfinish = null;
  anim.cancel();
  if (body) body.style.overflow = "";
}
