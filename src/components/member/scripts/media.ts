import { reducedMotion } from "./env";

// play() rejects when a later pause() interrupts it or the browser blocks
// autoplay. Both are expected here; anything else is worth a warning.
const EXPECTED = new Set(["AbortError", "NotAllowedError"]);

/** Play a clip like a GIF: silent and looping. Never under reduced motion. */
export function playMuted(video: HTMLVideoElement) {
  if (reducedMotion.matches) return;
  video.muted = true;
  video.play().catch((err: unknown) => {
    if (err instanceof DOMException && EXPECTED.has(err.name)) return;
    console.warn("Video failed to play:", video.currentSrc, err);
  });
}

/** Play every shown clip under `root` (the gallery's current item and its strip), or pause them all. */
export function setPlaying(root: ParentNode, play: boolean) {
  root.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    if (play && !video.hidden) playMuted(video);
    else video.pause();
  });
}
