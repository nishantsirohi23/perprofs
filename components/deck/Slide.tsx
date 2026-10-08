import type { Slide as SlideType } from "@/lib/deck-data";
import SlideBody from "./SlideBody";

/** One page of the deck: chrome + body, rendered on an opaque white sheet. */
export default function Slide({
  slide,
  index,
  total,
}: {
  slide: SlideType;
  index: number;
  total: number;
}) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[14px] bg-white">
      <header className="flex shrink-0 items-center justify-between border-b border-ink/10 px-5 py-3 sm:px-8 sm:py-4">
        <span className="eyebrow text-ink/40">{slide.eyebrow}</span>
        <span className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-clay/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          </span>
          <span className="eyebrow tabular text-ink/40">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </span>
      </header>

      <div className="min-h-0 flex-1 px-5 py-5 sm:px-8 sm:py-7 lg:px-12 lg:py-9">
        <SlideBody slide={slide} />
      </div>

      <footer className="flex shrink-0 items-center justify-between border-t border-ink/10 px-5 py-2.5 sm:px-8">
        <span className="eyebrow text-ink/25">Perporfs · assembled from the live ledger</span>
        <span className="eyebrow hidden text-ink/25 sm:block">{slide.id}.slide</span>
      </footer>

      {/* light sweeps across the sheet as it turns */}
      <span
        data-sheen
        className="slide-sheen pointer-events-none absolute inset-0 opacity-0"
        aria-hidden="true"
      />
    </div>
  );
}
