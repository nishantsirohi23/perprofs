# Perporfs — the agentic AI CFO

A scroll-driven marketing site for a company that gives every business its own agentic AI CFO.
Built with **Next.js 15 (App Router) · React 19 · Three.js (React Three Fiber) · GSAP ScrollTrigger ·
Framer Motion · Lenis**, in a light, paper-toned palette (no dark mode anywhere).

The centrepiece is the **deck section**: a real board deck whose pages turn in 3D as you scroll,
driven by a single scrubbed GSAP timeline.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000. Also available: `npm run build`, `npm run start`, `npm run lint`,
`npm run typecheck`.

> **Not verified in this environment.** `npm install`, `next build` and `tsc --noEmit` could not be
> executed here — Node segfaults in this sandbox (`SecItemCopyMatching failed -67674`, a macOS
> keychain denial), so no command that shells out to npm or node can run. The source is
> hand-checked, not compile-checked. Run `npm install && npm run typecheck && npm run build`
> locally first; anything that surfaces will be small and local.

`next/font/google` fetches Inter, Instrument Serif and JetBrains Mono at build time, so the first
build needs network access. Nothing else fetches remote assets — the 3D scenes use in-scene
`<Lightformer>` lighting rather than a downloaded HDR environment map.

## How the scroll works

One clock, so nothing drifts:

- **Lenis** owns the scroll position (`components/providers/SmoothScroll.tsx`).
- **GSAP's ticker drives Lenis** (`gsap.ticker.add(t => lenis.raf(t * 1000))`, `lagSmoothing(0)`).
- Every Lenis scroll event calls `ScrollTrigger.update()`.
- Sections pin with **CSS `position: sticky`** on a tall parent rather than ScrollTrigger's `pin`,
  which avoids pin-spacer/Lenis interaction bugs. Triggers then use `start: "top top"` /
  `end: "bottom bottom"` on that parent.
- **`lib/scroll-store.ts`** is a plain mutable module object (`scrollState`). ScrollTrigger
  `onUpdate` writes to it; R3F `useFrame` loops read from it. No React state per frame, so no
  re-renders while scrolling.
- `prefers-reduced-motion: reduce` disables smooth scrolling entirely and CSS kills the ambient
  animations.

## Animation map — a different mechanic per section

| # | Section | File | Scroll mechanic |
|---|---|---|---|
| 1 | Hero | `components/sections/Hero.tsx` | Char-split headline timeline on load; 3D transmission lens + floating cards tracking pointer and scroll; content parallaxes out |
| 2 | Logo strip | `components/sections/LogoStrip.tsx` | Two marquee rows whose `xPercent` is driven in opposite directions by scroll velocity |
| 3 | Premise | `components/sections/TextRevealMission.tsx` | Sticky panel, word-by-word opacity reveal scrubbed 1:1 with scroll |
| 4 | **The deck** | `components/sections/DeckScroll.tsx` | Sticky 3D stage; each page rotates `-104°` over its own top edge, sheen sweeps across it, the page beneath rises, then its content/bars/chart lines animate in. Slide-sorter rail jumps via Lenis |
| 5 | Capabilities | `components/sections/HorizontalCapabilities.tsx` | Vertical scroll becomes horizontal travel; per-panel triggers use GSAP `containerAnimation` so cards scale and stagger against the horizontal tween |
| 6 | Agent network | `components/sections/AgentNetwork.tsx` | Camera dollies through a 30-node Fibonacci-sphere graph as nodes light up progressively; action log lines stagger in on scrub |
| 7 | The crew | `components/sections/StackingCards.tsx` | Sticky stacking cards — each agent settles on top of the last, which scales down behind a paper veil |
| 8 | Metrics | `components/sections/MetricsCounter.tsx` | Scrubbed number count-up written to `textContent` + radial SVG arcs drawn with `pathLength`/`strokeDashoffset` |
| 9 | How it works | `components/sections/Workflow.tsx` | Serpentine SVG path drawn by `strokeDashoffset` down the section, milestone dots popping with `back.out` |
| 10 | Before / after | `components/sections/BeforeAfter.tsx` | Scroll position *is* the wipe: `clip-path: inset()` reveals the "after" layer, seam handle tracks it |
| 11 | Testimonials | `components/sections/Testimonials.tsx` | Framer Motion draggable track with inertia; per-card pointer-tracked 3D tilt on springs |
| 12 | Pricing | `components/sections/Pricing.tsx` | Cards rise out of a perspective container (`rotateX`); Framer `useMotionTemplate` cursor spotlight per card |
| 13 | FAQ | `components/sections/Faq.tsx` | Framer `AnimatePresence` height accordion + staggered row reveal |
| 14 | Final CTA | `components/sections/FinalCTA.tsx` | Giant type scales and de-rotates in 3D across the whole section while chars rise on scrub |
| 15 | Footer | `components/ui/Footer.tsx` | Oversized wordmark rises out of a mask |

## Structure

```
app/          layout (fonts, metadata, providers) + page (section order) + globals.css
components/
  providers/  SmoothScroll — Lenis ↔ GSAP wiring, pointer + anchor handling
  sections/   one file per section, one scroll mechanic each
  deck/       Slide (sheet chrome) + SlideBody (8 slide kinds: title, agenda, kpi, bars, line, table, quote, close)
  three/      HeroScene, AgentNetwork3D
  ui/         Nav, Footer, Button, SplitText, Magnetic, Marquee, ScrollProgress, Grain
hooks/        useIsoLayoutEffect, useInView (parks off-screen R3F frameloops)
lib/          gsap (plugin registration), scroll-store, deck-data, site-data, content
```

Copy lives in `lib/site-data.ts`, `lib/content.ts` and `lib/deck-data.ts` — edit those, not the
components. Adding a deck slide means adding one entry to `deck` (the timeline length, page counter
and slide sorter all derive from `deck.length`).

## Design tokens

Paper tones (`paper`, `paper2`, `paper3`) on ink text, with `forest`/`moss` green as the primary,
`citrus` and `clay` as accents. Type pairs Inter (UI) with Instrument Serif italic for the
`.display` phrases and JetBrains Mono for `.eyebrow` / `.tabular` Perporfsls. Tailwind config
generates a full 0–100 opacity scale so any `/8`, `/12`, `/62` modifier resolves.

In `app/globals.css`, `@tailwind utilities` is emitted **after** the helper classes (`.mask`,
`.eyebrow`, `.glass`, `.slide`…) rather than at the top. Those helpers are single-class, so at equal
specificity source order decides the winner — keeping utilities last is what lets
`className="mask inline-block"` stay inline in `SplitText` and `eyebrow text-[0.5rem]` keep its
smaller size. Moving the directive back up silently breaks both.

## One open question

You mentioned the layout should look "like in the image" — no image came through on my side. What I
built reads the brief as *the site itself behaves like a presentation*: a stacked deck of white
16:9 sheets on a perspective stage, pages flipping over their top edge as you scroll, with a page
counter, slide sorter and presenter laser dot. Send the image and I'll retune the stage framing,
sheet proportions and palette to match.
