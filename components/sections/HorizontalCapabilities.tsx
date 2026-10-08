"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { capabilities } from "@/lib/site-data";

const SCROLL_VH = (capabilities.length + 1) * 78;

export default function HorizontalCapabilities() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const el = track.current;
      if (!el) return;

      // The master tween: vertical scroll becomes horizontal travel.
      const horizontal = gsap.to(el, {
        x: () => -(el.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`;
            const index = Math.min(
              capabilities.length,
              Math.max(1, Math.round(self.progress * capabilities.length)),
            );
            if (counter.current) counter.current.textContent = String(index).padStart(2, "0");
          },
        },
      });

      // Each panel animates against the horizontal tween, not the page scroll.
      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
        gsap.from(panel.querySelectorAll("[data-hp]"), {
          y: 46,
          opacity: 0,
          duration: 1,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: horizontal,
            start: "left 90%",
            end: "left 45%",
            scrub: true,
          },
        });

        gsap.fromTo(
          panel,
          { scale: 0.93, rotate: 0.6 },
          {
            scale: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontal,
              start: "left right",
              end: "left center",
              scrub: true,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);
  return (
    <section
      id="capabilities"
      ref={section}
      className="relative border-t border-ink/10 bg-paper2/50"
      style={{ height: `${SCROLL_VH}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div ref={track} className="flex w-max items-center gap-5 px-5 sm:gap-7 sm:px-8">
          <div
            data-panel
            className="flex h-[70vh] w-[84vw] shrink-0 flex-col justify-center pr-4 sm:w-[48vw] lg:w-[34vw]"
          >
            <span data-hp className="eyebrow text-ink/40">
              Capabilities
            </span>
            <h2
              data-hp
              className="mt-6 text-[clamp(2.2rem,4.6vw,4.2rem)] font-medium leading-[0.96] tracking-tightest"
            >
              Six jobs.
              <br />
              <span className="display italic text-moss">One hire.</span>
            </h2>
            <p data-hp className="mt-6 max-w-[34ch] text-[0.98rem] leading-relaxed text-ink/60">
              Everything a finance function does, run continuously instead of monthly. Keep
              scrolling — this row moves sideways.
            </p>
            <div data-hp className="eyebrow mt-9 flex items-center gap-3 text-ink/35">
              <span>scroll</span>
              <span className="h-[1px] w-16 bg-ink/25" />
              <span>→</span>
            </div>
          </div>

          {capabilities.map((c) => (
            <article
              data-panel
              key={c.no}
              className="flex h-[70vh] w-[84vw] shrink-0 flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(16,19,17,0.4)] sm:w-[56vw] sm:p-9 lg:w-[40vw]"
            >
              <div data-hp className="flex items-center justify-between">
                <span className="eyebrow tabular text-clay">{c.no}</span>
                <span className="eyebrow text-ink/30">capability</span>
              </div>

              <h3
                data-hp
                className="mt-7 max-w-[19ch] text-[clamp(1.4rem,2.5vw,2.3rem)] font-medium leading-[1.04] tracking-tight"
              >
                {c.title}
              </h3>
              <p data-hp className="mt-4 max-w-[42ch] text-[0.92rem] leading-relaxed text-ink/60">
                {c.body}
              </p>

              <ul className="mt-7 flex flex-col gap-2.5">
                {c.bullets.map((b) => (
                  <li data-hp key={b} className="flex items-start gap-3 text-[0.86rem] text-ink/70">
                    <span className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                    {b}
                  </li>
                ))}
              </ul>

              <div
                data-hp
                className="mt-auto flex items-end justify-between border-t border-ink/10 pt-5"
              >
                <div>
                  <div className="tabular text-[clamp(1.5rem,2.3vw,2.2rem)] font-medium leading-none">
                    {c.stat.value}
                  </div>
                  <div className="eyebrow mt-2 text-ink/40">{c.stat.label}</div>
                </div>
                <span className="display text-6xl leading-none text-ink/8">{c.no}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-5 bottom-7 flex items-center gap-4 sm:inset-x-8">
          <span className="eyebrow tabular text-ink/45">
            <span ref={counter}>01</span> / {String(capabilities.length).padStart(2, "0")}
          </span>
          <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10">
            <span
              ref={fill}
              className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 rounded-full bg-forest"
            />
          </span>
        </div>
      </div>
    </section>
  );
}
