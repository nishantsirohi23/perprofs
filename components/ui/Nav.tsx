"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { nav, site } from "@/lib/site-data";
import { Cta } from "./Button";

function Mark() {
  return (
    <span className="relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-forest">
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M3 15.5V9M8 15.5V4.5M13 15.5v-4M18 15.5V7" stroke="#D9FF57" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setHidden(!open && y > prev && y > 320);
  });

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5 ${
            solid ? "glass shadow-[0_10px_40px_-24px_rgba(16,19,17,0.35)]" : "border border-transparent"
          }`}
        >
          <a href="#top" className="flex items-center gap-3">
            <Mark />
            <span className="flex flex-col leading-none">
              <span className="text-[0.95rem] font-semibold tracking-tight">{site.name}</span>
              <span className="eyebrow mt-1 text-[0.5rem] text-ink/45">Agentic CFO</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative rounded-full px-3.5 py-2 text-[0.85rem] text-ink/70 transition-colors hover:text-ink"
              >
                {item.label}
                <span className="absolute inset-x-3.5 bottom-1.5 h-[1px] origin-left scale-x-0 bg-ink/60 transition-transform duration-500 ease-expo group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="eyebrow mr-1 hidden items-center gap-2 text-ink/45 xl:flex">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-moss" />
              Books closed 41m ago
            </span>
            <div className="hidden sm:block">
              <Cta href="#pricing" magnetic={false} className="px-5 py-2.5 text-[0.85rem]">
                Hire your CFO
              </Cta>
            </div>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 h-[1.5px] w-full bg-ink transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-full bg-ink transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-24 z-40 rounded-3xl glass p-6 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.08, duration: 0.4 }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="display block py-2 text-3xl tracking-tight"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-5 border-t border-ink/10 pt-5">
              <Cta href="#pricing" magnetic={false}>
                Hire your CFO
              </Cta>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
