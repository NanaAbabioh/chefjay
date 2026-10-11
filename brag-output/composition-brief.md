# Hyperframes Composition Brief: Chef Jay's

## Objective
Create a short launch-style brag video for Chef Jay's, a drinks-and-catering storefront
opening with a grand opening offer.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 21.8 seconds

## Source Material
- Project root: `/Users/ababioh_family/Developer/vincents`
- Primary files read: `src/lib/site.ts`, `src/lib/catalog.ts`, `src/lib/promo.ts`,
  `src/app/globals.css`, `src/app/(site)/page.tsx`, `src/app/(site)/shop/page.tsx`,
  `src/app/(site)/kpataashie/page.tsx`, `src/components/cart/CartClient.tsx`
- Product name: Chef Jay's
- Tagline / strongest claim: "Piña colada, by Chef Jay"
- Key UI moment to recreate: the cart totals block the moment the grand opening discount
  applies itself — subtotal $22.96, `Grand opening — 4th bottle free  −$4.99`, total $23.97
- Copy that must appear verbatim (all of it is live on the site):
  - "Piña colada," / "by Chef Jay"
  - "Eight coladas, one corn shake"
  - "Classic Piña Colada" $4.99 · "Mango Piña Colada" $5.99 · "Tigernut Piña Colada" $6.99 ·
    "Gold Coast Corn Shake" $6.99
  - "Grand opening — 4th bottle free" / "−$4.99" / "Total" "$23.97"
  - "Taken off automatically at checkout. No code needed."
  - "Kpataashie" / "Ga for kitchen" / "Jollof, fried rice and goat soups, cooked to order."
  - "Grand opening · 3 – 18 October" / "chefjayskp.com"

## Creative Direction
- Tone preset: `polished`
- Creative direction: a quiet grand-opening film for a neighbourhood drinks brand
- Interpretation: four scenes, long holds, soft crossfades, sentence case, no exclamation.
  The photography carries the energy; the type stays still.
- Angle: this is not a joke product, so the video does not wink. The brag is that a one-man
  operation has a storefront that behaves like a proper one — the discount is computed, not
  advertised.
- Hook: the real hero photograph and the line the site actually opens with.
- Outro: wordmark, dates, address. No punchline; the shop is simply open.
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign

## Visual Identity
- Background: `#fdf8ef` cream; `#ecdcc4` sand for the offer scene
- Text: `#241a12` bark; secondary `#574636`; faint `#8a7660`
- Accent: `#b4472c` clay (the site's single accent)
- Display font: Fraunces (variable TTF shipped in `assets/fonts/`)
- Body font: Plus Jakarta Sans (variable TTF shipped in `assets/fonts/`)
- Visual references from the project: `hero.jpg`, four product shots, `kpataashie.jpg` —
  all real photography already on the live site

## Storyboard
`brag-output/brag-plan.md` is the creative contract.

Scene summary:
1. Hook — 4.39s — hero photograph, "Piña colada, / by Chef Jay"
2. The lineup — 5.44s — four real product cards arriving one at a time with names and prices
3. The offer lands — 6.55s — cart totals; the discount row writes itself in; total counts down
4. Kitchen + sign-off — 5.46s — Kpataashie still, then wordmark, dates, address

## Audio
- Audio role: warm bed with two sparse motion-matched accents
- Audio arc: low bed from first frame; soft ticks under the arriving bottles; one warm
  confirmation as the discount lands; fade to silence over the last second
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: from 0:00, volume ~0.3, fade-in on the first beat, fade out across the
  final 1.2s. No ducking, no build.
- Music cue guidance: bundled preset
  `assets/music/cues/happy-beats-business-moves-vol-12-...music-cues.json` (110 BPM).
  Strong cues 8.74s, 17.47s, 18.56s, 22.93s. Beat grid every ~0.55s.
  Lock the fourth product card to **8.74s** and the sign-off wordmark to **18.56s**.
  Sequential card reveals snap to every other beat (~1.1s) so each stays readable.
- Audio-reactive treatment: **none, deliberately.** The tone is stillness; breathing glow
  would read as cheap against editorial food photography. Documented as a creative choice,
  not an extraction failure.
- Audio-coupled moments:
  - Scene 2 — four product cards arriving one by one (`ui/click2.ogg`, quiet)
  - Scene 3 — discount row landing (`interface/bong_001.ogg`, one warm confirmation)
- SFX selection guidance: sparse and motion-matched. Nothing on the hook, nothing on the
  sign-off. Both chosen files are low high-frequency risk per `sfx-analysis.md`.
- SFX analysis guidance: `<skill-dir>/assets/sfx/sfx-analysis.md` — low-HF-risk picks only,
  since the ticks repeat four times.
- Exact SFX choice: made after the animation existed, per the two moments above.
- Audio files: copied into `brag-output/composition/assets/`

## Hyperframes Instructions
Built on the current Hyperframes contract (`hyperframes-core` for structure and `data-*`
timing, `hyperframes-cli` for lint/check/render). Standalone root, one paused GSAP timeline
registered at `window.__timelines["main"]`, local fonts via `@font-face`, no CSS/GSAP
transform conflicts, every `<audio>` carries an id, no `crossorigin`.

Requirements met:
- Real product photography and real site copy throughout.
- 21.8s, inside the 15–25s window.
- Music plus two restrained SFX.
- Two strong-cue locks (8.74s, 18.56s) and a beat-grid card sequence.
- All assets local and relative.
- `hyperframes check` is the gate before render; render stays local.
