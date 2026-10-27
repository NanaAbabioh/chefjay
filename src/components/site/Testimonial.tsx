"use client";

import { useEffect, useRef, useState } from "react";
import { claimSound, onSoundClaimed } from "@/lib/sound";

/**
 * The customer clip, click to play.
 *
 * Deliberately not autoplaying. People are talking, so it would either play
 * silently — which wastes the only thing a testimonial has — or play aloud at
 * someone reading on a train. It also means the six megabytes are fetched
 * only by people who asked for them: the poster is 67 KB, and `preload`
 * fetches nothing until the first tap.
 */
export function Testimonial({
  poster,
  src,
  label,
  aspect = "aspect-square",
}: {
  poster: string;
  src: string;
  /** What the first tap starts, and roughly how long it runs. */
  label: string;
  aspect?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => onSoundClaimed(src, () => video.current?.pause()), [src]);

  return (
    <div className="relative overflow-hidden rounded-card bg-bark">
      <video
        ref={video}
        src={src}
        poster={poster}
        controls={playing}
        playsInline
        preload="none"
        className={`${aspect} w-full object-cover`}
        onPlay={() => {
          claimSound(src);
          setPlaying(true);
        }}
      />

      {!playing && (
        <button
          type="button"
          onClick={() => void video.current?.play()}
          className="absolute inset-0 flex items-center justify-center bg-bark/25 transition-colors hover:bg-bark/15"
        >
          <span className="sr-only">{label}</span>
          <span
            aria-hidden
            className="flex size-14 items-center justify-center rounded-full bg-cream/95 text-bark shadow-[0_10px_40px_-12px_rgba(36,26,18,0.8)] sm:size-20"
          >
            <svg viewBox="0 0 24 24" className="ml-1 size-5 sm:size-7" fill="currentColor">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
