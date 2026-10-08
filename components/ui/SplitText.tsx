"use client";

/**
 * Tiny split-text primitives. GSAP targets the `data-word` / `data-char` /
 * `data-line` children from a parent gsap.context, so no plugin is needed and
 * the accessible text stays a single readable string.
 */

const MASK =
  "mask inline-block align-top pt-[0.3em] -mt-[0.3em] pb-[0.16em] -mb-[0.16em]";
export function SplitWords({
  text,
  className = "",
  wordClassName = "",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className={MASK}>
            <span data-word className={`inline-block will-change-transform ${wordClassName}`}>
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

export function SplitChars({
  text,
  className = "",
  charClassName = "",
}: {
  text: string;
  className?: string;
  charClassName?: string;
}) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, wi) => (
          <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => (
              <span key={`${ch}-${ci}`} className={MASK}>
                <span data-char className={`inline-block will-change-transform ${charClassName}`}>
                  {ch}
                </span>
              </span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </span>
    </span>
  );
}

export function MaskLine({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="mask block pb-[0.1em] -mb-[0.1em]">
      <span data-line className={`block will-change-transform ${className}`}>
        {children}
      </span>
    </span>
  );
}
