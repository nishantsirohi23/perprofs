"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { faqs } from "@/lib/content";
import { site } from "@/lib/site-data";

export default function Faq() {
  const section = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-faq]", {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-faq-list]", start: "top 80%" },
      });

      gsap.from("[data-fhead]", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section.current, start: "top 78%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={section} className="relative border-t border-ink/10 bg-paper2/40">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span data-fhead className="eyebrow text-ink/40">
            The obvious questions
          </span>
          <h2
            data-fhead
            className="mt-6 text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.02] tracking-tightest"
          >
            Asked by every <span className="display italic text-moss">sceptical</span> finance lead.
          </h2>
          <p data-fhead className="mt-6 max-w-[32ch] text-[0.93rem] leading-relaxed text-ink/55">
            Still unconvinced? Send it the messiest month you have and watch what comes back.
          </p>
          <a
            data-fhead
            href={`mailto:${site.email}`}
            className="group mt-7 inline-flex items-center gap-2 text-sm text-forest"
          >
            {site.email}
            <span className="transition-transform duration-500 ease-expo group-hover:translate-x-1.5">
              →
            </span>
          </a>
        </div>

        <div data-faq-list className="flex flex-col">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div data-faq key={f.q} className="border-b border-ink/12 first:border-t">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left"
                >
                  <span className="flex items-start gap-5">
                    <span className="eyebrow tabular pt-1.5 text-clay">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="max-w-[36ch] text-[1rem] font-medium leading-snug sm:text-[1.08rem]">
                      {f.q}
                    </span>
                  </span>
                  <span className="relative mt-1.5 h-3.5 w-3.5 shrink-0" aria-hidden="true">
                    <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-ink/55" />
                    <span
                      className={`absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-ink/55 transition-transform duration-500 ease-expo ${
                        isOpen ? "rotate-0" : "rotate-90"
                      }`}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[64ch] pb-7 text-[0.92rem] leading-relaxed text-ink/60 sm:pl-14">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
