"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { crew } from "@/lib/site-data";
import { MaskLine } from "@/components/ui/SplitText";

/** Sticky stacking cards: each agent settles on top of the last, dimming it. */
export default function StackingCards() {
  const section = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const wraps = gsap.utils.toArray<HTMLElement>("[data-wrap]");

      wraps.forEach((wrap, i) => {
        const card = wrap.querySelector("[data-card]");
        const veil = wrap.querySelector("[data-veil]");

        // content rises as the card arrives
        gsap.from(wrap.querySelectorAll("[data-cc]"), {
          y: 34,
          opacity: 0,
          duration: 0.9,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: wrap, start: "top 88%" },
        });

        // the card recedes as the next one covers it
        const next = wraps[i + 1];
        if (!next || !card) return;

        gsap.to(card, {
          scale: 0.93,
          y: -18,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top 82%", end: "top 22%", scrub: true },
        });

        if (veil) {
          gsap.to(veil, {
            opacity: 0.62,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top 82%", end: "top 30%", scrub: true },
          });
        }
      });

      gsap.from("[data-line]", {
        yPercent: 115,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-crew-intro]", start: "top 80%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="crew" ref={section} className="relative border-t border-ink/10 bg-paper2/40">
      <div
        data-crew-intro
        className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 pb-16 pt-24 sm:px-8 sm:pt-32 lg:flex-row lg:items-end lg:justify-between"
      >
        <h2 className="max-w-[20ch] text-[clamp(2.1rem,5vw,4.4rem)] font-medium leading-[0.96] tracking-tightest">
          <MaskLine>Five specialists</MaskLine>
          <MaskLine>
            in <span className="display italic text-moss">one seat.</span>
          </MaskLine>
        </h2>
        <p className="max-w-[38ch] text-[0.98rem] leading-relaxed text-ink/60">
          You hire a CFO. Underneath, a controller, an FP&amp;A lead, a treasurer, a tax specialist
          and an audit function work the same ledger — and never disagree in front of your board.
        </p>
      </div>

      <div className="relative mx-auto max-w-[1120px] px-5 pb-[26vh] sm:px-8">
        {crew.map((c, i) => (
          <div
            data-wrap
            key={c.id}
            className="sticky"
            style={{
              top: `calc(8vh + ${i * 2.4}rem)`,
              marginBottom: i === crew.length - 1 ? undefined : "32vh",
              zIndex: i + 1,
            }}
          >
            <article
              data-card
              className="relative overflow-hidden rounded-[26px] border border-ink/10 p-6 shadow-[0_30px_70px_-45px_rgba(16,19,17,0.5)] sm:p-10 lg:p-12"
              style={{ backgroundColor: c.tint }}
            >
              <div className="relative z-10 flex flex-col gap-9 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
                <div className="max-w-[30rem]">
                  <div data-cc className="flex items-center gap-3">
                    <span className="eyebrow tabular text-clay">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-[1px] w-8 bg-ink/20" />
                    <span className="eyebrow text-ink/45">{c.role}</span>
                  </div>

                  <h3
                    data-cc
                    className="mt-6 text-[clamp(1.6rem,3.4vw,2.8rem)] font-medium leading-[1.02] tracking-tight"
                  >
                    {c.name}
                  </h3>
                  <p data-cc className="mt-5 max-w-[44ch] text-[0.95rem] leading-relaxed text-ink/65">
                    {c.body}
                  </p>
                  <div data-cc className="eyebrow mt-8 flex items-center gap-2 text-ink/35">
                    <span className="h-1.5 w-1.5 animate-blink rounded-full bg-moss" />
                    agent · {c.id}@Perporfs
                  </div>
                </div>

                <ul className="grid w-full shrink-0 grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 lg:w-[22rem]">
                  {c.tasks.map((t) => (
                    <li
                      data-cc
                      key={t}
                      className="flex min-h-[5.6rem] flex-col justify-end bg-white/80 p-4 text-[0.82rem] leading-snug text-ink/75"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <span
                data-veil
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 bg-paper opacity-0"
              />
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
