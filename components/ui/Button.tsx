"use client";

import Magnetic from "./Magnetic";

const base =
  "group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3.5 text-[0.9rem] font-medium transition-colors duration-300";

export function Cta({
  children,
  href = "#pricing",
  variant = "solid",
  magnetic = true,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "solid" | "outline" | "citrus";
  magnetic?: boolean;
  className?: string;
}) {
  const skin =
    variant === "solid"
      ? "bg-forest text-paper"
      : variant === "citrus"
        ? "bg-citrus text-ink"
        : "border border-ink/20 text-ink hover:border-ink/40";

  const button = (
    <a href={href} className={`${base} ${skin} ${className}`}>
      {/* wipe that rises on hover */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 translate-y-full transition-transform duration-500 ease-expo group-hover/btn:translate-y-0 ${
          variant === "solid" ? "bg-moss" : variant === "citrus" ? "bg-ink" : "bg-ink"
        }`}
      />
      <span
        className={`relative z-10 transition-colors duration-300 ${
          variant === "solid"
            ? ""
            : variant === "citrus"
              ? "group-hover/btn:text-citrus"
              : "group-hover/btn:text-paper"
        }`}
      >
        {children}
      </span>
      <span className="relative z-10 overflow-hidden">
        <span
          className={`block transition-transform duration-500 ease-expo group-hover/btn:translate-x-5 ${
            variant === "solid"
              ? ""
              : variant === "citrus"
                ? "group-hover/btn:text-citrus"
                : "group-hover/btn:text-paper"
          }`}
        >
          →
        </span>
      </span>
    </a>
  );

  return magnetic ? <Magnetic strength={0.22}>{button}</Magnetic> : button;
}

export function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`eyebrow inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/60 px-3 py-1.5 text-ink/70 ${className}`}
    >
      <span className="h-1.5 w-1.5 animate-blink rounded-full bg-clay" />
      {children}
    </span>
  );
}
