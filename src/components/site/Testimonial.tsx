"use client";

import { useRef, useState } from "react";

/**
 * The customer clip, click to play.
 *
 * Deliberately not autoplaying. People are talking, so it would either play
 * silently — which wastes the only thing a testimonial has — or play aloud at
 * someone reading on a train. It also means the six megabytes are fetched
 * only by people who asked for them: the poster is 67 KB, and `preload`
 * fetches nothing until the first tap.
 */
export function Testimonial({ poster, src }: { poster: string; src: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-card bg-bark">
      <video
        ref={video}
        src={src}
        poster={poster}
        controls={playing}
        playsInline
        preload="none"
        className="aspect-square w-full object-cover"
        onPlay={() => setPlaying(true)}
      />

      {!playing && (
        <button
          type="button"
          onClick={() => void video.current?.play()}
          className="absolute inset-0 flex items-center justify-center bg-bark/25 transition-colors hover:bg-bark/15"
        >
          <span className="sr-only">Play the customer clip, one minute</span>
          <span
            aria-hidden
            className="flex h-20 w-20 items-center justify-center rounded-full bg-cream/95 text-bark shadow-[0_10px_40px_-12px_rgba(36,26,18,0.8)]"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
