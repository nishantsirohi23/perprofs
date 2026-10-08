"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { site, nav } from "@/lib/site-data";
import Marquee from "./Marquee";

const promises = [
  "every number cited",
  "dual control by default",
  "reversible by design",
  "SOC 2 Type II",
  "your tenant, your data",
  "escalates before it guesses",
];

const columns = [
  { title: "Product", links: nav },
  {
    title: "Company",
    links: [
      { label: "Careers", href: "#final" },
      { label: "Security", href: "#faq" },
      { label: "Trust centre", href: "#faq" },
      { label: "Changelog", href: "#deck" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "#faq" },
      { label: "Privacy", href: "#faq" },
      { label: "DPA", href: "#faq" },
      { label: "Sub-processors", href: "#faq" },
    ],
  },
];

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-foot]", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 88%" },
      });

      gsap.from("[data-wordmark]", {
        yPercent: 40,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-wordmark]", start: "top 96%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-ink/10 bg-paper3/60">
      <Marquee
        items={promises}
        seconds={42}
        className="eyebrow border-b border-ink/10 py-3.5 text-ink/40"
      />

      <div className="mx-auto max-w-[1400px] px-5 pt-20 sm:px-8 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <div data-foot className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-forest">
                <span className="h-2.5 w-[3px] bg-citrus" />
                <span className="ml-[3px] h-4 w-[3px] bg-citrus" />
              </span>
              <span className="text-[1.02rem] font-medium tracking-tight">{site.name}</span>
            </div>
            <p data-foot className="mt-6 max-w-[32ch] text-[0.9rem] leading-relaxed text-ink/55">
              {site.tagline}. Built for the businesses that were told they were too small to have
              one.
            </p>
            <a
              data-foot
              href={`mailto:${site.email}`}
              className="group mt-6 inline-flex items-center gap-2 text-sm text-forest"
            >
              {site.email}
              <span className="transition-transform duration-500 ease-expo group-hover:translate-x-1.5">
                →
              </span>
            </a>
            <div data-foot className="eyebrow mt-8 flex items-center gap-2 text-ink/40">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-moss" />
              all systems nominal · 99.99% uptime
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div data-foot key={col.title}>
                <div className="eyebrow text-ink/35">{col.title}</div>
                <ul className="mt-5 flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={`${col.title}-${l.label}`}>
                      <a
                        href={l.href}
                        className="text-[0.88rem] text-ink/65 transition-colors duration-300 hover:text-ink"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          data-foot
          className="mt-16 flex flex-col gap-3 border-t border-ink/10 py-7 text-[0.76rem] text-ink/40 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>© 2026 {site.name} Finance, Inc. All numbers cited, all actions logged.</span>
          <span className="eyebrow">SOC 2 Type II · dual control · reversible by design</span>
        </div>
      </div>

      <div className="mask pointer-events-none select-none px-5 sm:px-8" aria-hidden="true">
        <div
          data-wordmark
          className="text-[16vw] font-medium leading-[0.78] tracking-tightest text-ink/8"
        >
          {site.name}
        </div>
      </div>
    </footer>
  );
}
