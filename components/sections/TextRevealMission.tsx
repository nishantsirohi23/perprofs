"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";

const SEGMENTS: { t: string; em?: boolean }[] = [
  { t: "A CFO is not software." },
  { t: "It is judgement", em: true },
  {
    t: "— about which invoice to chase, which hire to delay, which number your board will question first.",
  },
  { t: "Perporfs makes the call, shows its working, and" },
  { t: "asks you before anything is irreversible.", em: true },
];

export default function TextRevealMission() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-fade]",
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.6,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
        },
      );

      gsap.fromTo(
        "[data-rule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-paper" style={{ height: "300vh" }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
          <div className="mb-10 flex items-center gap-4">
            <span className="eyebrow shrink-0 text-ink/40">The premise</span>
            <span data-rule className="h-[1px] flex-1 bg-ink/20" />
          </div>

          <p className="text-[clamp(1.5rem,4.1vw,3.5rem)] font-medium leading-[1.14] tracking-tight">
            {SEGMENTS.map((seg, si) => (
              <span key={si} className={seg.em ? "display italic text-moss" : ""}>
                {seg.t.split(" ").map((word, wi) => (
                  <span data-fade key={`${si}-${wi}`} className="inline-block">
                    {word}
                    <span className="inline-block">&nbsp;</span>
                  </span>
                ))}
              </span>
            ))}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="eyebrow text-ink/35">Policy engine · dual control · reversible by design</span>
            <a href="#how" className="group inline-flex items-center gap-2 text-sm text-forest">
              See how it decides
              <span className="transition-transform duration-500 ease-expo group-hover:translate-x-1.5">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
