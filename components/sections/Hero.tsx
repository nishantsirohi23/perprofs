"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { scrollState } from "@/lib/scroll-store";
import { SplitChars, SplitWords } from "@/components/ui/SplitText";
import { Cta, Tag } from "@/components/ui/Button";
import { InfiniteImageCollage } from "@/components/hero/InfiniteImageCollage";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const facts = [
  { k: "41 min", v: "median close" },
  { k: "±2.1%", v: "forecast error" },
  { k: "$490", v: "a month, not $340k a year" },
  { k: "14", v: "systems, day one" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const collageWrap = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.2 });
      tl.from("[data-hero-tag]", { y: 18, opacity: 0, duration: 0.75 })
        .from(
          "[data-char]",
          { yPercent: 110, duration: 1.2, stagger: { each: 0.018 } },
          "-=0.3",
        )
        .from(
          collageWrap.current,
          { opacity: 0, y: 16, duration: 1, ease: "power2.out" },
          "-=0.6",
        )
        .from(
          "[data-word]",
          { yPercent: 110, opacity: 0, duration: 0.85, stagger: 0.014 },
          "-=0.85",
        )
        .from("[data-hero-cta]", { y: 22, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.6")
        .from("[data-hero-foot] > *", { y: 26, opacity: 0, duration: 0.9, stagger: 0.06 }, "-=0.7")
        .from(canvasWrap.current, { opacity: 0, scale: 1.1, duration: 1.8, ease: "power2.out" }, 0);

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scrollState.hero = self.progress;
        },
      });

      gsap.to("[data-hero-content]", {
        yPercent: -14,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);
  return (
    <section
      id="top"
      ref={root}
      className="relative min-h-[720px] w-full overflow-hidden bg-paper h-[100svh]"
    >
      <div className="absolute inset-0 grid-bg" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-paper to-transparent"
        aria-hidden="true"
      />
      <div ref={canvasWrap} className="absolute inset-0 z-0" aria-hidden="true">
        <HeroScene />
      </div>

      <div
        data-hero-content
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-between px-5 pb-8 pt-28 sm:px-8 sm:pt-32"
      >
        <div data-hero-tag className="flex flex-wrap items-center gap-3">
          <Tag>Live · ledger synced 4h ago</Tag>
          <span className="eyebrow text-ink/45">SOC 2 Type II · dual control · full audit trail</span>
        </div>

        <div className="max-w-[62rem]">
          <h1 className="text-[clamp(2.7rem,7.6vw,7.4rem)] font-medium leading-[0.92] tracking-tightest">
            <SplitChars text="Every business" />
            <br />
            <SplitChars text="deserves a CFO." />
          </h1>

          

          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-[46ch] text-[1.02rem] leading-relaxed text-ink/65">
              <SplitWords text="An agentic AI CFO that closes your books, forecasts your cash, collects your invoices, files your tax and defends every number in front of your board. It works inside policies you write." />
            </p>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <span data-hero-cta className="inline-block">
                <Cta href="#pricing" variant="solid">
                  Hire your AI CFO
                </Cta>
              </span>
              <span data-hero-cta className="inline-block">
                <Cta href="#deck" variant="outline">
                  See it present
                </Cta>
              </span>
            </div>
          </div>
        </div>

        <div
          data-hero-foot
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:grid-cols-4"
        >
          {facts.map((f) => (
            <div key={f.k} className="bg-paper/80 px-4 py-4 backdrop-blur-sm sm:px-5 sm:py-5">
              <div className="tabular text-2xl font-medium tracking-tight sm:text-[1.7rem]">{f.k}</div>
              <div className="eyebrow mt-1.5 text-ink/45">{f.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="eyebrow text-ink/35">Scroll to present</span>
        <span className="relative h-10 w-[1px] overflow-hidden bg-ink/15">
          <span className="absolute inset-x-0 top-0 h-4 scroll-cue bg-forest" />
        </span>
      </div>
    </section>
  );
}