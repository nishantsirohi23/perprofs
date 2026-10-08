"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { scrollState } from "@/lib/scroll-store";
import { deck } from "@/lib/deck-data";
import Slide from "@/components/deck/Slide";
import { MaskLine } from "@/components/ui/SplitText";
import { getLenis } from "@/components/providers/SmoothScroll";

/** timeline units: 1.0 turning the page + 0.6 dwelling on it */
const STEP = 1.6;
const TURN = 1;
const TAIL = 0.6;
const DURATION = (deck.length - 2) * STEP + TURN + TAIL;
const SCROLL_VH = Math.round(DURATION * 74);

export default function DeckScroll() {
  const section = useRef<HTMLElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sheets = gsap.utils.toArray<HTMLElement>("[data-slide]");
      const total = sheets.length;

      sheets.forEach((sheet, i) => {
        gsap.set(sheet, {
          zIndex: total - i,
          transformOrigin: "50% 0%",
          rotateX: 0,
          z: -i * 6,
          yPercent: i === 0 ? 0 : Math.min(i, 3) * 1.1,
          scale: i === 0 ? 1 : 0.955 - Math.min(i - 1, 2) * 0.012,
          opacity: 1,
          // Promote each sheet to its own compositor layer up front so the
          // rotateX flip doesn't trigger a layout/paint recalculation mid-scrub —
          // this was the source of the stutter on the outgoing slide.
          force3D: true,
          backfaceVisibility: "hidden",
          willChange: "transform, opacity",
        });
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scroller.current,
          start: "top top",
          end: "bottom bottom",
          // Lenis already smooths the raw scroll input (lerp: 0.085 in
          // SmoothScroll). Adding a second smoothing pass here via a numeric
          // scrub value double-lags the timeline — it chases a value that's
          // already chasing the real scroll position. `true` ties the
          // timeline directly to Lenis's (already-smoothed) progress instead
          // of re-smoothing it, which is what was making the page-turn feel
          // rubbery/uneven rather than smooth.
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollState.deck = self.progress;
            const index = Math.min(
              total - 1,
              Math.max(0, Math.round((self.progress * DURATION) / STEP)),
            );
            if (counter.current) counter.current.textContent = String(index + 1).padStart(2, "0");
            if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`;
            thumbs.current.forEach((el, i) => {
              if (!el) return;
              el.dataset.active = i === index ? "true" : "false";
            });
          },
        },
      });
      sheets.forEach((out, i) => {
        if (i === total - 1) return;
        const next = sheets[i + 1];
        const at = i * STEP;

        // the page lifts and flips over its own top edge.
        // rotateX passes -90deg partway through this tween, at which point
        // we're looking at the sheet's back face. backface-visibility:hidden
        // (set above) stops that face from rendering, but the opacity fade
        // must ALSO finish before that crossing point — otherwise there's a
        // window where the sheet is rotating past vertical while still
        // partially opaque, which is what made the outgoing slide seem to
        // "still show" after the turn. So the fade now runs early and fully
        // completes well before the rotation reaches -90deg, then we flip
        // visibility off as a hard backstop so it can never repaint.
        tl.to(out, { rotateX: -104, yPercent: -6, duration: TURN, ease: "power2.inOut" }, at)
          .to(
            out,
            { opacity: 0, duration: TURN * 0.35, ease: "power1.in" },
            at + TURN * 0.15,
          )
          .set(out, { visibility: "hidden" }, at + TURN * 0.5)
          .set(out, { visibility: "visible" }, at)
          .fromTo(
            out.querySelector("[data-sheen]"),
            { opacity: 0, xPercent: -25 },
            { opacity: 0.9, xPercent: 10, duration: TURN * 0.5, ease: "power1.out" },
            at,
          )
          .to(
            out.querySelector("[data-sheen]"),
            { opacity: 0, xPercent: 40, duration: TURN * 0.45 },
            at + TURN * 0.5,
          )
          // the page underneath rises into place
          .to(
            next,
            { scale: 1, yPercent: 0, duration: TURN * 0.9, ease: "power2.out" },
            at + TURN * 0.1,
          );

        const inner = next.querySelectorAll("[data-sl]");
        if (inner.length) {
          tl.fromTo(
            inner,
            { y: 26, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, stagger: 0.045, ease: "power2.out" },
            at + TURN * 0.42,
          );
        }

        const bars = next.querySelectorAll("[data-bar]");
        if (bars.length) {
          tl.fromTo(
            bars,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.75, stagger: 0.07, ease: "power3.out" },
            at + TURN * 0.55,
          );
        }

        const draws = next.querySelectorAll("[data-draw]");
        if (draws.length) {
          tl.fromTo(
            draws,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.95, stagger: 0.14 },
            at + TURN * 0.5,
          );
        }
      });

      // one last beat so the closing page is readable
      tl.to({}, { duration: TAIL });

      // slide one animates in when the stage arrives
      gsap.from(sheets[0].querySelectorAll("[data-sl]"), {
        y: 26,
        opacity: 0,
        duration: 0.85,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: scroller.current, start: "top 78%" },
      });

      gsap.from("[data-line]", {
        yPercent: 115,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-deck-intro]", start: "top 82%" },
      });
    }, section);

    // Presenter laser dot. Kept outside the gsap context so the DOM listeners
    // are torn down by React's own cleanup.
    const dotEl = dot.current;
    const stageEl = stage.current;
    let onMove: ((e: PointerEvent) => void) | null = null;
    let onLeave: (() => void) | null = null;

    if (dotEl && stageEl) {
      const xTo = gsap.quickTo(dotEl, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(dotEl, "y", { duration: 0.5, ease: "power3" });
      onMove = (e: PointerEvent) => {
        const box = stageEl.getBoundingClientRect();
        xTo(e.clientX - box.left);
        yTo(e.clientY - box.top);
        gsap.to(dotEl, { opacity: 1, duration: 0.2, overwrite: "auto" });
      };
      onLeave = () => gsap.to(dotEl, { opacity: 0, duration: 0.4, overwrite: "auto" });
      stageEl.addEventListener("pointermove", onMove);
      stageEl.addEventListener("pointerleave", onLeave);
    }

    return () => {
      if (stageEl && onMove) stageEl.removeEventListener("pointermove", onMove);
      if (stageEl && onLeave) stageEl.removeEventListener("pointerleave", onLeave);
      ctx.revert();
    };
  }, []);

  const jumpTo = (index: number) => {
    const el = scroller.current;
    if (!el) return;
    const trigger = ScrollTrigger.getAll().find((t) => t.trigger === el);
    if (!trigger) return;
    const target = trigger.start + (trigger.end - trigger.start) * ((index * STEP) / DURATION);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.1 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };
  return (
    <section id="deck" ref={section} className="relative border-t border-ink/10 bg-paper2/40">
      <div data-deck-intro className="mx-auto max-w-[1400px] px-5 pb-14 pt-24 sm:px-8 sm:pt-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[18ch] text-[clamp(2.1rem,5vw,4.6rem)] font-medium leading-[0.96] tracking-tightest">
            <MaskLine>It doesn&rsquo;t send you</MaskLine>
            <MaskLine>
              <span className="display italic text-moss">a spreadsheet.</span>
            </MaskLine>
            <MaskLine>It presents.</MaskLine>
          </h2>
          <p className="max-w-[40ch] text-[0.98rem] leading-relaxed text-ink/60">
            Scroll to turn the pages. This is a real board deck — assembled from a live ledger, in
            the order a CFO would actually walk you through it.
          </p>
        </div>
      </div>

      <div ref={scroller} style={{ height: `${SCROLL_VH}vh` }} className="relative">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="absolute inset-0 dot-bg opacity-60" aria-hidden="true" />
          <div className="relative mx-auto flex w-full max-w-[1400px] items-center gap-8 px-4 sm:px-8">
            <aside className="hidden w-48 shrink-0 flex-col gap-1.5 xl:flex">
              <span className="eyebrow mb-2 text-ink/35">Slide sorter</span>
              {deck.map((slide, i) => (
                <button
                  key={slide.id}
                  ref={(el) => {
                    thumbs.current[i] = el;
                  }}
                  onClick={() => jumpTo(i)}
                  data-active={i === 0 ? "true" : "false"}
                  className="group flex items-center gap-2.5 rounded-lg border border-ink/10 bg-white/60 p-2 text-left transition-all duration-300 hover:border-ink/25 data-[active=true]:border-forest/40 data-[active=true]:bg-white data-[active=true]:shadow-lift"
                >
                  <span className="eyebrow tabular w-4 shrink-0 text-ink/35 group-data-[active=true]:text-clay">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-7 w-10 shrink-0 flex-col justify-center gap-[3px] rounded border border-ink/10 bg-paper px-1.5">
                    <span className="h-[2px] w-full bg-ink/25" />
                    <span className="h-[2px] w-2/3 bg-ink/15" />
                    <span className="h-[2px] w-1/2 bg-ink/15" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[0.6rem] leading-tight text-ink/45">
                    {slide.eyebrow}
                  </span>
                </button>
              ))}
            </aside>
            <div className="min-w-0 flex-1">
              <div className="eyebrow mb-4 flex items-center justify-between text-ink/40">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-blink rounded-full bg-clay" />
                  presenting · Q3 FY26 board deck
                </span>
                <span className="tabular">
                  page <span ref={counter}>01</span> / {String(deck.length).padStart(2, "0")}
                </span>
              </div>

              <div ref={stage} className="stage-perspective relative">
                <span
                  className="pointer-events-none absolute -bottom-7 left-1/2 h-10 w-4/5 -translate-x-1/2 rounded-[100%] bg-ink/15 blur-2xl"
                  aria-hidden="true"
                />
                <div className="preserve3d relative aspect-[16/10] w-full lg:aspect-[16/9]">
                  {deck.map((slide, i) => (
                    <article
                      key={slide.id}
                      data-slide
                      className="slide absolute inset-0 rounded-[14px] shadow-slide"
                    >
                      <Slide slide={slide} index={i} total={deck.length} />
                    </article>
                  ))}
                </div>
                <span
                  ref={dot}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 z-30 -ml-1.5 -mt-1.5 hidden h-3 w-3 rounded-full bg-clay opacity-0 shadow-[0_0_18px_6px_rgba(219,92,54,0.35)] lg:block"
                />
              </div>

              <div className="mt-6 flex items-center gap-4">
                <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10">
                  <span
                    ref={fill}
                    className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 rounded-full bg-forest"
                  />
                </span>
                <span className="eyebrow hidden text-ink/35 sm:block">scroll to advance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}