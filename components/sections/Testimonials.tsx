"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useSpring } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/hooks/useIsoLayoutEffect";
import { testimonials, type Testimonial } from "@/lib/content";

function Card({ t, index }: { t: Testimonial; index: number }) {
  const rx = useSpring(0, { stiffness: 170, damping: 18 });
  const ry = useSpring(0, { stiffness: 170, damping: 18 });

  const move = (e: ReactPointerEvent<HTMLElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - box.left) / box.width - 0.5;
    const py = (e.clientY - box.top) / box.height - 0.5;
    ry.set(px * 13);
    rx.set(-py * 10);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div data-tcard className="w-[80vw] shrink-0 sm:w-[26rem]">
      <motion.blockquote
        onPointerMove={move}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        className="flex h-full flex-col justify-between rounded-3xl border border-ink/10 bg-white p-7 shadow-[0_24px_60px_-45px_rgba(16,19,17,0.5)] sm:p-9"
      >
        <div>
          <span className="eyebrow tabular text-clay">{String(index + 1).padStart(2, "0")}</span>
          <span className="display mt-4 block text-4xl leading-none text-ink/12">&ldquo;</span>
          <p className="mt-3 text-[1rem] leading-relaxed text-ink/80 sm:text-[1.06rem]">{t.quote}</p>
        </div>
        <footer className="mt-8 border-t border-ink/10 pt-5">
          <div className="text-[0.9rem] font-medium">{t.name}</div>
          <div className="mt-1 text-[0.8rem] text-ink/50">{t.role}</div>
          <div className="eyebrow tabular mt-4 inline-flex rounded-full bg-forest/8 px-3 py-1.5 text-forest">
            {t.metric}
          </div>
        </footer>
      </motion.blockquote>
    </div>
  );
}

export default function Testimonials() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(0);

  useEffect(() => {
    const measure = () => {
      const t = track.current;
      const v = viewport.current;
      if (!t || !v) return;
      setMax(Math.max(0, t.scrollWidth - v.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-tcard]", {
        y: 70,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section.current, start: "top 68%" },
      });

      gsap.from("[data-thead]", {
        y: 36,
        opacity: 0,
        duration: 0.95,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: section.current, start: "top 78%" },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden border-t border-ink/10 bg-paper2/50">
      <div className="mx-auto max-w-[1400px] px-5 pt-24 sm:px-8 sm:pt-32">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2
            data-thead
            className="max-w-[20ch] text-[clamp(1.8rem,3.8vw,3.1rem)] font-medium leading-[1.02] tracking-tightest"
          >
            Finance teams that stopped <span className="display italic text-moss">assembling.</span>
          </h2>
          <div data-thead className="eyebrow flex items-center gap-3 text-ink/40">
            <span>drag</span>
            <span className="h-[1px] w-12 bg-ink/25" />
            <span>↔</span>
          </div>
        </div>
      </div>

      <div ref={viewport} className="mt-12 overflow-hidden pb-24 sm:pb-32">
        <motion.div
          ref={track}
          drag="x"
          dragConstraints={{ left: -max, right: 0 }}
          dragElastic={0.06}
          dragTransition={{ power: 0.28, timeConstant: 340 }}
          whileTap={{ cursor: "grabbing" }}
          className="flex w-max cursor-grab items-stretch gap-5 px-5 sm:gap-7 sm:px-8"
        >
          {testimonials.map((t, i) => (
            <Card key={t.name} t={t} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
