/**
 * One sound at a time.
 *
 * The Massachusetts section can make noise three ways — the music under the
 * looping clip, the fourteen-second quote, and the review itself — and any
 * two of them at once sounds like a fault rather than a choice. Rather than
 * thread state between three components that have no reason to know about
 * each other, whichever one starts says so on the document and the others
 * stop themselves.
 */
const EVENT = "chefjays:sound";

/** Say that `id` has started playing. Everything else should stop. */
export function claimSound(id: string) {
  document.dispatchEvent(new CustomEvent(EVENT, { detail: id }));
}

/** Run `stop` whenever something other than `id` claims the sound. */
export function onSoundClaimed(id: string, stop: () => void) {
  const handle = (event: Event) => {
    if ((event as CustomEvent<string>).detail !== id) stop();
  };
  document.addEventListener(EVENT, handle);
  return () => document.removeEventListener(EVENT, handle);
}
