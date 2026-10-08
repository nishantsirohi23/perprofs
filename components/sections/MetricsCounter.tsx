"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { metrics, type Metric } from "@/lib/site-data";

/** How full each dial reads, 0–1. Editorial, not derived from the value. */
const ARC = [0.74, 0.9998, 0.61, 0.87];

const fmt = (v: number, m: Metric) =>
  `${m.prefix ?? ""}${v.toLocaleString("en-US", {
    minimumFractionDigits: m.decimals ?? 0,
    maximumFractionDigits: m.decimals ?? 0,
  })}${m.suffix ?? ""}`;

export default function MetricsCounter() {
  const section = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-metric]").forEach((card, i) => {
        const m = metrics[i];
        const out = card.querySelector<HTMLElement>("[data-num]");
        const arc = card.querySelector<SVGCircleElement>("[data-arc]");
        const trigger = { trigger: card, start: "top 88%", end: "top 42%", scrub: 0.6 } as const;

        if (out) {
          const proxy = { v: 0 };
          gsap.to(proxy, {
            v: m.value,
            ease: "none",
            scrollTrigger: trigger,
            onUpdate: () => {
              out.textContent = fmt(proxy.v, m);
            },
          });
        }

        if (arc) {
          gsap.fromTo(
            arc,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 1 - (ARC[i] ?? 0.7), ease: "none", scrollTrigger: trigger },
          );
        }

        gsap.from(card.querySelectorAll("[data-mc]"), {
          y: 22,
          opacity: 0,
          duration: 0.8,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });

      gsap.fromTo(
        "[data-mrule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top 90%", end: "bottom 70%", scrub: true },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative border-t border-ink/10 bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-[24ch] text-[clamp(1.8rem,3.6vw,3rem)] font-medium leading-[1.02] tracking-tightest">
            What it looks like <span className="display italic text-moss">two quarters in.</span>
          </h2>
          <span className="eyebrow text-ink/35">Median across 380 deployments · FY26</span>
        </div>

        <div data-mrule className="mt-10 h-[1px] w-full bg-ink/15" />

        <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div data-metric key={m.label} className="flex flex-col items-start">
              <div className="relative h-[9.5rem] w-[9.5rem]">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="rgba(16,19,17,0.09)"
                    strokeWidth="5"
                  />
                  <circle
                    data-arc
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#123D2B"
                    strokeWidth="5"
                    strokeLinecap="round"
                    pathLength={1}
                    style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    data-num
                    className="tabular text-[clamp(1.15rem,2vw,1.55rem)] font-medium tracking-tight"
                  >
                    {fmt(0, m)}
                  </span>
                </span>
              </div>

              <div data-mc className="mt-6 text-[0.95rem] font-medium leading-snug">
                {m.label}
              </div>
              <div data-mc className="mt-2 max-w-[24ch] text-[0.82rem] leading-relaxed text-ink/50">
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
