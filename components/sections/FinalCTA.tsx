"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { SplitChars } from "@/components/ui/SplitText";
import { Cta } from "@/components/ui/Button";

/** What actually lands in the first week, in the order it lands. */
const firstWeek = [
  "Connected in 90 minutes",
  "Two years of history reconciled",
  "First 13-week cash forecast",
  "Duplicate spend report",
  "Chart of accounts cleaned",
  "Dunning ladder running",
  "Policy engine live",
  "Board pack drafted",
  "Audit binder started",
];

export default function FinalCTA() {
  const section = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-chip]", {
        y: 20,
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
        ease: "power3.out",
        stagger: { each: 0.022, from: "random" },
        scrollTrigger: { trigger: section.current, start: "top 88%" },
      });

      gsap.from("[data-char]", {
        yPercent: 118,
        ease: "none",
        stagger: 0.02,
        scrollTrigger: {
          trigger: section.current,
          start: "top 80%",
          end: "top 8%",
          scrub: 0.4,
        },
      });

      gsap.fromTo(
        "[data-final-type]",
        { scale: 0.84, rotateX: 18, y: 40 },
        {
          scale: 1.02,
          rotateX: 0,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        },
      );

      gsap.from("[data-fcta]", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section.current, start: "45% center" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="final"
      ref={section}
      className="relative border-t border-ink/10 bg-paper"
      style={{ height: "240vh" }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden">
        <div className="dot-bg absolute inset-0 opacity-50" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-[1400px] px-5 pt-24 sm:px-8 sm:pt-28">
          <div className="eyebrow mb-4 text-ink/35">what lands in week one</div>
          <div className="flex flex-wrap gap-2">
            {firstWeek.map((n) => (
              <span
                data-chip
                key={n}
                className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-white/70 px-3.5 py-1.5 text-[0.76rem] text-ink/60"
              >
                <span className="text-moss">✓</span>
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="stage-perspective relative mx-auto w-full max-w-[1400px] px-5 sm:px-8">
          <h2
            data-final-type
            className="text-center text-[clamp(2.6rem,10vw,9rem)] font-medium leading-[0.9] tracking-tightest"
          >
            <SplitChars text="Hire it" className="block" />
            <SplitChars text="tonight." className="display block italic text-moss" />
          </h2>
        </div>

        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-20">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <p data-fcta className="max-w-[34ch] text-[0.95rem] leading-relaxed text-ink/60">
              Ninety minutes to connect. First forecast the same afternoon. Cancel whenever it stops
              earning its fee.
            </p>
            <div data-fcta className="flex flex-wrap items-center gap-3">
              <Cta href="#pricing" variant="solid">
                Start the handover
              </Cta>
              <Cta href="#deck" variant="outline">
                See a board pack
              </Cta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
