"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { claimSound, onSoundClaimed } from "@/lib/sound";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Subscribed rather than read in an effect, so the first paint is already right. */
function usePrefersStillness() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * The first out-of-state plate, on a loop, with the music on request.
 *
 * The footage is silent, which is what lets it simply run — unlike the
 * testimonial clip there is no speech to either waste on a muted autoplay or
 * blurt out at someone reading on a train. The music is a separate file for
 * the same reason: a page may not start making noise on its own, so it waits
 * behind a button, and the quarter-megabyte is only fetched by the people who
 * press it. Keeping it out of the video also frees the loop to run at its own
 * length — eight bars, cut on the bar line so it comes round without a seam.
 *
 * Both are attached only once the section comes into view, and both stop when
 * it leaves: nothing should be playing in a part of the page nobody is
 * looking at, least of all the music.
 *
 * Anyone who has asked their system to stop animation gets the poster and a
 * set of controls instead, and nothing moves until they press play.
 */
export function ShippedClip({
  poster,
  src,
  music,
}: {
  poster: string;
  src: string;
  music: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const still = usePrefersStillness();

  // `near` is sticky: once a file has been attached there is no sense in
  // detaching it. `onscreen` follows the section both ways.
  const [near, setNear] = useState(false);
  const [onscreen, setOnscreen] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;

    // A margin so the fetch starts just before the clip is on screen, which
    // is usually enough for it to be running by the time it is looked at.
    const io = new IntersectionObserver(
      ([entry]) => {
        setOnscreen(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = video.current;
    if (!el || still) return;
    if (near && onscreen) void el.play();
    else el.pause();
  }, [near, onscreen, still]);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    if (sound && onscreen) {
      claimSound(music);
      void el.play();
    } else {
      el.pause();
    }
  }, [sound, onscreen, music]);

  useEffect(() => onSoundClaimed(music, () => setSound(false)), [music]);

  return (
    <div className="relative w-full overflow-hidden rounded-card bg-bark shadow-[0_24px_60px_-30px_rgba(36,26,18,0.8)]">
      <video
        ref={video}
        src={near || still ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        controls={still}
        preload="none"
        className="aspect-[9/16] w-full object-cover"
      />

      {/* Nothing is downloaded until the first press. */}
      <audio ref={audio} src={sound ? music : undefined} loop preload="none" />

      {/* Icon only. The frame is narrow enough on a phone that a word beside
          the speaker would take a third of its width. */}
      <button
        type="button"
        aria-pressed={sound}
        onClick={() => setSound((on) => !on)}
        className={`absolute bottom-2.5 right-2.5 inline-flex size-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
          sound
            ? "bg-clay text-cream"
            : "bg-bark/70 text-cream/90 hover:bg-bark/85"
        }`}
      >
        <span className="sr-only">
          {sound ? "Turn the music off" : "Turn the music on"}
        </span>
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="currentColor">
          <path d="M11 4.5 6.5 8.5H3.5v7h3L11 19.5z" />
          {sound ? (
            <path
              d="M15 9a4 4 0 0 1 0 6M17.8 6.5a8 8 0 0 1 0 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="m15.5 9.5 5 5m0-5-5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>
    </div>
  );
}
