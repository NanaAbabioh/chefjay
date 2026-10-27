"use client";

import { useEffect, useRef, useState } from "react";
import { claimSound, onSoundClaimed } from "@/lib/sound";

/**
 * The quote above it, in her own voice.
 *
 * Sound only. The words are already set in type a few lines up, so a second
 * video box would add a face and a play button without adding anything to
 * read — and the quote on screen does the work a caption would. A hundred and
 * seventy kilobytes, fetched on the first press.
 */
export function QuoteAudio({ src, children }: { src: string; children: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(
    () =>
      onSoundClaimed(src, () => {
        audio.current?.pause();
        setPlaying(false);
      }),
    [src],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => {
          const el = audio.current;
          if (!el) return;
          if (playing) {
            el.pause();
            el.currentTime = 0;
            setPlaying(false);
          } else {
            claimSound(src);
            void el.play();
            setPlaying(true);
          }
        }}
        className="group inline-flex items-center gap-2.5 text-sm font-semibold text-clay transition-colors hover:text-bark"
      >
        <span
          aria-hidden
          className="flex size-8 items-center justify-center rounded-full border border-clay/40 transition-colors group-hover:border-bark/40"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
            {playing ? (
              <path d="M8 6h3v12H8zm5 0h3v12h-3z" />
            ) : (
              <path d="M9 5.5v13l10-6.5z" />
            )}
          </svg>
        </span>
        {playing ? "Stop" : children}
      </button>
      <audio
        ref={audio}
        src={src}
        preload="none"
        onEnded={() => setPlaying(false)}
      />
    </>
  );
}
