"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { tiers, type Tier } from "@/lib/content";
import { Cta } from "@/components/ui/Button";

function TierCard({ tier }: { tier: Tier }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const glow = useSpring(0, { stiffness: 140, damping: 20 });
  const featured = Boolean(tier.featured);

  const background = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, ${
    featured ? "rgba(217,255,87,0.22)" : "rgba(46,107,79,0.16)"
  }, transparent 70%)`;

  const track = (e: ReactPointerEvent<HTMLElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - box.left);
    my.set(e.clientY - box.top);
  };

  return (
    <div data-tier className={featured ? "lg:-mt-6 lg:mb-6" : ""}>
      <article
        onPointerMove={track}
        onPointerEnter={() => glow.set(1)}
        onPointerLeave={() => glow.set(0)}
        className={`relative flex h-full flex-col overflow-hidden rounded-[26px] border p-7 sm:p-9 ${
          featured
            ? "border-forest bg-forest text-paper shadow-[0_40px_90px_-50px_rgba(18,61,43,0.85)]"
            : "border-ink/12 bg-white shadow-[0_24px_60px_-50px_rgba(16,19,17,0.5)]"
        }`}
      >
        <motion.span
          aria-hidden="true"
          style={{ background, opacity: glow }}
          className="pointer-events-none absolute inset-0 z-0"
        />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            <span className={`eyebrow ${featured ? "text-citrus" : "text-ink/45"}`}>
              {tier.name}
            </span>
            {featured && (
              <span className="eyebrow rounded-full bg-citrus px-2.5 py-1 text-ink">
                most chosen
              </span>
            )}
          </div>

          <div className="mt-7 flex items-end gap-1.5">
            <span className="tabular text-[clamp(2.1rem,3.4vw,2.9rem)] font-medium leading-none tracking-tightest">
              {tier.price}
            </span>
            {tier.unit && (
              <span className={`text-[0.85rem] ${featured ? "text-paper/60" : "text-ink/45"}`}>
                {tier.unit}
              </span>
            )}
          </div>

          <p
            className={`mt-5 max-w-[34ch] text-[0.88rem] leading-relaxed ${
              featured ? "text-paper/70" : "text-ink/60"
            }`}
          >
            {tier.blurb}
          </p>

          <ul className="mt-8 flex flex-1 flex-col gap-3">
            {tier.features.map((f) => (
              <li
                key={f}
                className={`flex items-start gap-3 text-[0.86rem] leading-snug ${
                  featured ? "text-paper/85" : "text-ink/70"
                }`}
              >
                <span
                  className={`mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full ${
                    featured ? "bg-citrus" : "bg-moss"
                  }`}
                />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <Cta
              href="#final"
              variant={featured ? "citrus" : "outline"}
              magnetic={false}
              className={featured ? "" : "w-full justify-center"}
            >
              {tier.price === "Custom" ? "Talk to us" : `Start with ${tier.name}`}
            </Cta>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function Pricing() {
  const section = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-tier]", {
        y: 90,
        rotateX: -12,
        opacity: 0,
        duration: 1.1,
        stagger: 0.11,
        ease: "power3.out",
        transformOrigin: "50% 100%",
        scrollTrigger: { trigger: section.current, start: "top 72%" },
      });

      gsap.from("[data-phead]", {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section.current, start: "top 82%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" ref={section} className="relative border-t border-ink/10 bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            data-phead
            className="max-w-[22ch] text-[clamp(1.9rem,4vw,3.4rem)] font-medium leading-[1] tracking-tightest"
          >
            A CFO costs $340k. <span className="display italic text-moss">This is the other option.</span>
          </h2>
          <p data-phead className="max-w-[34ch] text-[0.95rem] leading-relaxed text-ink/55">
            One flat fee, every agent included. No per-transaction pricing, no implementation
            invoice, cancel in one click.
          </p>
        </div>

        <div className="stage-perspective mt-16 grid gap-6 lg:grid-cols-3 lg:gap-7">
          {tiers.map((t) => (
            <TierCard key={t.name} tier={t} />
          ))}
        </div>

        <p data-phead className="eyebrow mt-10 text-ink/35">
          annual billing saves two months · SOC 2 Type II · your data stays yours
        </p>
      </div>
    </section>
  );
}
