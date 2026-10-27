"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

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
 * The first out-of-state plate, on a loop.
 *
 * This footage is silent, which is what lets it simply run — unlike the
 * testimonial clip there is no speech to either waste on a muted autoplay or
 * blurt out at someone reading on a train. It still costs a megabyte, so the
 * file is attached only once the section comes into view: the poster holds the
 * frame until then, and a visitor who never scrolls this far pays nothing.
 *
 * Anyone who has asked their system to stop animation gets the poster and a
 * set of controls instead, and nothing moves until they press play.
 */
export function ShippedClip({ poster, src }: { poster: string; src: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const still = usePrefersStillness();
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el || still) return;

    // A margin so the fetch starts just before the clip is on screen, which
    // is usually enough for it to be running by the time it is looked at.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [still]);

  useEffect(() => {
    if (near) void video.current?.play();
  }, [near]);

  return (
    <div className="relative mx-auto w-full max-w-[19rem] overflow-hidden rounded-card bg-bark shadow-[0_24px_60px_-30px_rgba(36,26,18,0.8)]">
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
      {/* The customer sped the recording up herself. Saying so costs one
          line and keeps the clip honest about what it is. */}
      <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-bark/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream/90 backdrop-blur-sm">
        Sped up
      </span>
    </div>
  );
}
