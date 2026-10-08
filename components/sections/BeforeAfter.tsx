"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { beforeAfter } from "@/lib/content";

const ROW = "flex h-[4.6rem] items-center gap-4 px-5 sm:h-[4.9rem] sm:px-8";

export default function BeforeAfter() {
  const section = useRef<HTMLElement>(null);
  const after = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const proxy = { p: 0 };

      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
        },
        onUpdate: () => {
          const pct = proxy.p * 100;
          if (after.current) after.current.style.clipPath = `inset(0 0 0 ${100 - pct}%)`;
          if (handle.current) handle.current.style.left = `${pct}%`;
        },
      });

      gsap.from("[data-ba]", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section.current, start: "top 60%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative border-t border-ink/10 bg-paper"
      style={{ height: "260vh" }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <h2
              data-ba
              className="max-w-[22ch] text-[clamp(1.8rem,3.8vw,3.1rem)] font-medium leading-[1.02] tracking-tightest"
            >
              The same company, <span className="display italic text-moss">two months apart.</span>
            </h2>
            <div data-ba className="eyebrow flex items-center gap-3 text-ink/40">
              <span className="text-ink/35">before</span>
              <span className="h-[1px] w-10 bg-ink/20" />
              <span className="text-forest">with Perporfs</span>
            </div>
          </div>

          <div
            data-ba
            className="relative mt-9 overflow-hidden rounded-3xl border border-ink/10 shadow-[0_30px_70px_-50px_rgba(16,19,17,0.5)]"
          >
            {/* base layer: life before */}
            <div className="bg-paper3/70">
              {beforeAfter.before.map((b, i) => (
                <div
                  key={b}
                  className={`${ROW} ${i > 0 ? "border-t border-ink/8" : ""}`}
                >
                  <span className="eyebrow tabular w-6 shrink-0 text-ink/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-clay/60" />
                  <span className="text-[0.84rem] leading-snug text-ink/45 sm:text-[0.92rem]">
                    {b}
                  </span>
                </div>
              ))}
            </div>

            {/* wiped layer: life after */}
            <div
              ref={after}
              className="absolute inset-0 bg-white"
              style={{ clipPath: "inset(0 0 0 100%)" }}
            >
              {beforeAfter.after.map((a, i) => (
                <div
                  key={a}
                  className={`${ROW} ${i > 0 ? "border-t border-ink/8" : ""}`}
                >
                  <span className="eyebrow tabular w-6 shrink-0 text-clay">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                  <span className="text-[0.84rem] font-medium leading-snug text-ink sm:text-[0.92rem]">
                    {a}
                  </span>
                </div>
              ))}
            </div>

            {/* the seam */}
            <span
              ref={handle}
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 z-10 -ml-px w-[2px] bg-forest"
              style={{ left: "0%" }}
            >
              <span className="absolute left-1/2 top-1/2 -ml-4 -mt-4 flex h-8 w-8 items-center justify-center rounded-full border border-forest/30 bg-white text-[0.6rem] text-forest shadow-lift">
                ⟷
              </span>
            </span>
          </div>

          <p data-ba className="eyebrow mt-6 text-ink/35">
            keep scrolling — the wipe is your scroll position
          </p>
        </div>
      </div>
    </section>
  );
}
