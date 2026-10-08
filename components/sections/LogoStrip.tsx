"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { logos, integrations } from "@/lib/content";

/**
 * Scroll-linked two-row ticker: row one drifts left as you scroll down, row
 * two drifts right. Nothing loops on a timer — the wheel is the motor.
 */
export default function LogoStrip() {
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const st = {
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      };
      gsap.fromTo("[data-row='a']", { xPercent: 4 }, { xPercent: -18, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-row='b']", { xPercent: -14 }, { xPercent: 8, ease: "none", scrollTrigger: st });
      gsap.from("[data-strip-line]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative overflow-hidden border-y border-ink/10 bg-paper2/60 py-10">
      <div className="mx-auto mb-8 flex max-w-[1400px] flex-wrap items-baseline justify-between gap-4 px-5 sm:px-8">
        <p className="eyebrow text-ink/45">Running finance at 1,400 companies</p>
        <p className="max-w-[38ch] text-sm text-ink/55">
          From 4-person studios to 900-person manufacturers — the same CFO, scaled to the ledger it is given.
        </p>
      </div>

      <div data-strip-line className="mx-5 mb-8 h-[1px] bg-ink/15 sm:mx-8" />

      <div data-row="a" className="flex w-[130%] items-center gap-12 whitespace-nowrap pl-5 sm:pl-8">
        {[...logos, ...logos].map((name, i) => (
          <span key={`${name}-${i}`} className="display text-2xl tracking-tight text-ink/70 sm:text-[1.85rem]">
            {name}
            <span className="ml-12 align-middle text-ink/20">◦</span>
          </span>
        ))}
      </div>

      <div data-row="b" className="mt-6 flex w-[130%] items-center gap-8 whitespace-nowrap pl-5 sm:pl-8">
        {[...integrations, ...integrations].map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="eyebrow rounded-full border border-ink/12 bg-white/70 px-3.5 py-2 text-ink/55"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
