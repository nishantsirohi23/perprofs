"use client";

export default function Marquee({
  items,
  seconds = 34,
  reverse = false,
  className = "",
  separator = "·",
}: {
  items: string[];
  seconds?: number;
  reverse?: boolean;
  className?: string;
  separator?: string;
}) {
  // Rendered twice so the -50% translate loops seamlessly.
  const track = [...items, ...items];

  return (
    <div className={`group relative flex overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="flex w-max shrink-0 animate-marquee items-center gap-10 group-hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${seconds}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
            <span>{item}</span>
            <span className="text-ink/25">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
