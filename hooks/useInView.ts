"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True while the element is on (or near) screen. Used to park R3F frameloops
 * for scenes that have scrolled far away — two live WebGL contexts rendering
 * transmission materials forever is the one real cost on this page.
 */
export function useInView<T extends HTMLElement>(rootMargin = "300px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    });
    io.observe(el);

    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
