import { reducedMotion } from "./env";

// play() rejects when a later pause() interrupts it or the browser blocks
// autoplay. Both are expected here; anything else is worth a warning.
const EXPECTED = new Set(["AbortError", "NotAllowedError"]);

/** Play a clip like a GIF: silent. Never under reduced motion. Resolves to whether it started. */
export function playMuted(video: HTMLVideoElement): Promise<boolean> {
  if (reducedMotion.matches) return Promise.resolve(false);
  video.muted = true;
  return video.play().then(
    () => true,
    (err: unknown) => {
      if (!(err instanceof DOMException && EXPECTED.has(err.name))) {
        console.warn("Video failed to play:", video.currentSrc, err);
      }
      return false;
    },
  );
}

/** Play every shown clip under `root` (the gallery's current item and its strip), or pause them all. */
export function setPlaying(root: ParentNode, play: boolean) {
  root.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    if (play && !video.hidden) playMuted(video);
    else video.pause();
  });
}
