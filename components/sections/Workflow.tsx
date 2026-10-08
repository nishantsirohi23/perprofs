"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { workflow } from "@/lib/site-data";
import { MaskLine } from "@/components/ui/SplitText";

/** How far the snake swings from the centre line, in viewBox units. */
const BULGE = 24;

/**
 * Build a smooth path that passes through (50, y) for every measured dot
 * position, bulging left/right between consecutive dots so it still reads as
 * a snake rather than a straight line — while *guaranteeing* every dot sits
 * exactly on the path, regardless of how tall each step's copy makes it.
 */
function buildSnake(ys: number[]) {
  if (ys.length === 0) return "";
  if (ys.length === 1) return `M50,${ys[0]} L50,${ys[0]}`;
  let d = `M50,${ys[0]}`;
  for (let i = 0; i < ys.length - 1; i++) {
    const y0 = ys[i];
    const y1 = ys[i + 1];
    const mid = (y0 + y1) / 2;
    const bulgeX = i % 2 === 0 ? 50 + BULGE : 50 - BULGE;
    d += ` C${bulgeX},${y0 + (mid - y0) * 0.6} ${bulgeX},${y1 - (y1 - mid) * 0.6} 50,${y1}`;
  }
  return d;
}

export default function Workflow() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [snake, setSnake] = useState<{ d: string; height: number; localYs: number[] } | null>(
    null,
  );

  // The path used to be a hardcoded string assuming every step was the same
  // height, so its y-coordinates and the dots' real (flow-laid-out) y
  // positions only matched by coincidence and drifted apart as soon as a
  // step's body copy wrapped to more or fewer lines.
  //
  // We measure the vertical centre of each step's label row (the "step 0X"
  // line), but we need it in TWO different coordinate spaces:
  //  - globalY, relative to the rail — this is what the SVG path is drawn
  //    in, since the <svg> spans the whole rail.
  //  - localY, relative to that step's own box — this is what the dot's
  //    inline `top` actually resolves against, because the dot's CSS
  //    positioning ancestor is its own `data-step` row (`position: relative`
  //    there), not the rail. Using globalY for the dot's `top` was the bug:
  //    every dot got pushed down by its cumulative position in the whole
  //    list instead of its position within its own row.
  useIsoLayoutEffect(() => {
    const measure = () => {
      const railEl = rail.current;
      if (!railEl) return;
      const railTop = railEl.getBoundingClientRect().top;
      const globalYs: number[] = [];
      const localYs: number[] = [];
      labelRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        globalYs.push(centerY - railTop);
        const stepEl = el.closest("[data-step]") as HTMLElement | null;
        const stepTop = stepEl ? stepEl.getBoundingClientRect().top : rect.top;
        localYs.push(centerY - stepTop);
      });
      if (globalYs.length) {
        setSnake({ d: buildSnake(globalYs), height: railEl.offsetHeight, localYs });
        ScrollTrigger.refresh();
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (rail.current) ro.observe(rail.current);
    window.addEventListener("resize", measure);
    if (document.fonts) void document.fonts.ready.then(measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useIsoLayoutEffect(() => {
    if (!snake) return;
    const ctx = gsap.context(() => {
      const drawTrigger = {
        trigger: rail.current,
        start: "top 72%",
        end: "bottom 78%",
        scrub: 0.5,
      } as const;

      gsap.fromTo(
        "[data-draw]",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: "none", scrollTrigger: drawTrigger },
      );

      gsap.fromTo(
        "[data-vrule]",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: drawTrigger,
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
        gsap.from(step.querySelectorAll("[data-sc]"), {
          y: 40,
          opacity: 0,
          duration: 0.95,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: step, start: "top 82%" },
        });

        gsap.from(step.querySelectorAll("[data-dot]"), {
          scale: 0,
          duration: 0.7,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: step, start: "top 78%" },
        });
      });

      gsap.from("[data-line]", {
        yPercent: 115,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-how-intro]", start: "top 82%" },
      });
    }, section);

    return () => ctx.revert();
  }, [snake]);

  return (
    <section id="how" ref={section} className="relative border-t border-ink/10 bg-paper2/50">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <div
          data-how-intro
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <h2 className="max-w-[18ch] text-[clamp(2.1rem,5vw,4.4rem)] font-medium leading-[0.96] tracking-tightest">
            <MaskLine>Ninety minutes</MaskLine>
            <MaskLine>
              to <span className="display italic text-moss">handover.</span>
            </MaskLine>
          </h2>
          <p className="max-w-[38ch] text-[0.98rem] leading-relaxed text-ink/60">
            No migration, no implementation partner, no six-week discovery. Read-only keys, two years
            of history, and it starts closing.
          </p>
        </div>

        <div ref={rail} className="relative mt-20">
          {snake && (
            <svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
              viewBox={`0 0 100 ${snake.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d={snake.d}
                fill="none"
                stroke="rgba(16,19,17,0.28)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <path
                data-draw
                d={snake.d}
                fill="none"
                stroke="#2E6B4F"
                strokeWidth="1.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
              />
            </svg>
          )}

          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[7px] w-[1px] bg-ink/10 lg:hidden"
          />
          <span
            data-vrule
            aria-hidden="true"
            className="absolute inset-y-0 left-[7px] w-[1px] bg-moss lg:hidden"
          />

          <div className="flex flex-col gap-16 sm:gap-20">
            {workflow.map((s, i) => (
              <div
                data-step
                key={s.no}
                className="relative grid items-start pl-10 lg:grid-cols-2 lg:gap-x-20 lg:pl-0"
              >
                <span
                  data-dot
                  aria-hidden="true"
                  // Centred on both axes with translate(-50%, -50%) rather
                  // than a fixed top offset + half-width margin. `top` uses
                  // localYs (relative to THIS step's own box, its actual
                  // positioning ancestor) — not the rail-relative value the
                  // path uses — since those are two different coordinate
                  // spaces. Falls back to the CSS top-1.5 default only for
                  // the very first paint, before measurement has run.
                  style={snake ? { top: snake.localYs[i] } : undefined}
                  className="absolute left-0 top-1.5 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-moss bg-paper lg:left-1/2 lg:-translate-x-1/2"
                />

                <div
                  className={
                    i % 2 === 0
                      ? "lg:pr-16 lg:text-right"
                      : "lg:col-start-2 lg:row-start-1 lg:pl-16"
                  }
                >
                  <div
                    data-sc
                    ref={(el) => {
                      labelRefs.current[i] = el;
                    }}
                    className={`eyebrow tabular flex items-center gap-3 text-clay ${
                      i % 2 === 0 ? "lg:justify-end" : ""
                    }`}
                  >
                    <span>step {s.no}</span>
                  </div>
                  <h3
                    data-sc
                    className="mt-4 text-[clamp(1.5rem,2.8vw,2.4rem)] font-medium leading-[1.04] tracking-tight"
                  >
                    {s.title}
                  </h3>
                  <p
                    data-sc
                    className={`mt-4 max-w-[42ch] text-[0.93rem] leading-relaxed text-ink/60 ${
                      i % 2 === 0 ? "lg:ml-auto" : ""
                    }`}
                  >
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}