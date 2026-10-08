"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { scrollState } from "@/lib/scroll-store";
import { MaskLine } from "@/components/ui/SplitText";

const AgentNetwork3D = dynamic(() => import("@/components/three/AgentNetwork3D"), { ssr: false });

const log = [
  { t: "03:14", m: "Matched 1,204 Stripe payouts against 1,204 journal entries" },
  { t: "03:16", m: "Duplicate vendor invoice flagged · Kestrel Design · $8,400" },
  { t: "03:19", m: "Accrued 14 unbilled contractor timesheets, EU entity" },
  { t: "03:24", m: "Reforecast 13-week cash · runway 27.1 months (+0.2)" },
  { t: "03:31", m: "Dunning sequence advanced for 22 accounts, tone matched" },
  { t: "03:38", m: "Sales tax nexus threshold approaching in Texas — memo drafted" },
  { t: "03:44", m: "Escalated: related-party lease, needs your judgement" },
  { t: "03:45", m: "Board pack regenerated · 8 slides · every figure cited" },
];

export default function AgentNetwork() {
  const section = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          scrollState.network = self.progress;
        },
      });

      gsap.fromTo(
        "[data-log]",
        { opacity: 0, x: 26 },
        {
          opacity: 1,
          x: 0,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        },
      );

      gsap.from("[data-line]", {
        yPercent: 115,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: section.current, start: "top 65%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="crew-network"
      ref={section}
      className="relative border-t border-ink/10 bg-paper"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <AgentNetwork3D />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-paper via-paper/40 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-center gap-10 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[34rem]">
            <span className="eyebrow text-ink/40">One mind, many hands</span>
            <h2 className="mt-6 text-[clamp(2.1rem,4.4vw,4rem)] font-medium leading-[0.98] tracking-tightest">
              <MaskLine>Thirty agents.</MaskLine>
              <MaskLine>
                <span className="display italic text-moss">One chair.</span>
              </MaskLine>
            </h2>
            <p className="mt-6 max-w-[40ch] text-[0.98rem] leading-relaxed text-ink/60">
              Specialists for reconciliation, forecasting, collections, tax and controls, all
              reading the same ledger and arguing to a single conclusion before it reaches you.
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <div className="tabular text-3xl font-medium">4h</div>
                <div className="eyebrow mt-1.5 text-ink/40">restated cadence</div>
              </div>
              <div>
                <div className="tabular text-3xl font-medium">1</div>
                <div className="eyebrow mt-1.5 text-ink/40">version of truth</div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[30rem] lg:max-w-[27rem]">
            <div className="eyebrow mb-3 flex items-center gap-2 text-ink/40">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-moss" />
              live action log · last night
            </div>
            <ul className="flex flex-col gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/8 backdrop-blur-sm">
              {log.map((l) => (
                <li data-log key={l.t} className="flex items-start gap-3 bg-white/85 px-4 py-3">
                  <span className="eyebrow tabular shrink-0 pt-0.5 text-clay">{l.t}</span>
                  <span className="text-[0.82rem] leading-snug text-ink/75">{l.m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
