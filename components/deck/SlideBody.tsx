import type { Slide } from "@/lib/deck-data";

const CHART_W = 620;
const CHART_H = 210;

function linePath(points: number[], max: number) {
  const step = CHART_W / (points.length - 1);
  return points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(CHART_H - (p / max) * CHART_H).toFixed(1)}`,
    )
    .join(" ");
}

function TitleBody({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <h3
          data-sl
          className="display max-w-[26ch] text-[clamp(1.9rem,3.6vw,3.6rem)] leading-[1.02] tracking-tight"
        >
          {slide.title}
        </h3>
        <p data-sl className="mt-6 max-w-[52ch] text-[0.95rem] leading-relaxed text-ink/60">
          {slide.lede}
        </p>
      </div>
      <div data-sl className="flex flex-wrap items-end justify-between gap-4">
        <span className="eyebrow text-ink/40">{slide.meta}</span>
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="block h-8 w-8 rounded-full border border-forest/30"
              style={{ background: i === 2 ? "#123D2B" : "transparent" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AgendaBody({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col">
      <h3 data-sl className="display text-[clamp(1.5rem,2.6vw,2.5rem)] tracking-tight">
        {slide.title}
      </h3>
      <ul className="mt-6 grid flex-1 content-start gap-0 sm:grid-cols-2 sm:gap-x-10">
        {slide.bullets?.map((b) => (
          <li
            data-sl
            key={b.k}
            className="flex items-baseline gap-4 border-b border-ink/10 py-3.5 last:border-b-0"
          >
            <span className="eyebrow tabular text-clay">{b.k}</span>
            <span className="text-[0.95rem] text-ink/75">{b.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
function KpiBody({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col">
      <h3 data-sl className="display text-[clamp(1.5rem,2.6vw,2.5rem)] tracking-tight">
        {slide.title}
      </h3>
      <p data-sl className="mt-3 max-w-[54ch] text-sm text-ink/55">
        {slide.lede}
      </p>
      <div className="mt-auto grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-ink/10 lg:grid-cols-4">
        {slide.kpis?.map((k) => (
          <div data-sl key={k.label} className="bg-white px-4 py-5">
            <div className="tabular text-[clamp(1.5rem,2.4vw,2.3rem)] font-medium leading-none tracking-tight">
              {k.value}
            </div>
            <div className="mt-3 text-[0.7rem] leading-tight text-ink/50">{k.label}</div>
            <div
              className={`eyebrow mt-3 inline-block rounded-full px-2 py-1 ${
                k.up ? "bg-forest/10 text-forest" : "bg-clay/10 text-clay"
              }`}
            >
              {k.delta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarsBody({ slide }: { slide: Slide }) {
  const max = Math.max(...(slide.bars?.map((b) => b.value) ?? [1]));
  return (
    <div className="flex h-full flex-col">
      <h3 data-sl className="display text-[clamp(1.5rem,2.6vw,2.5rem)] tracking-tight">
        {slide.title}
      </h3>
      <p data-sl className="mt-3 max-w-[54ch] text-sm text-ink/55">
        {slide.lede}
      </p>
      <div className="mt-auto flex flex-col gap-3.5">
        {slide.bars?.map((b) => (
          <div data-sl key={b.label} className="flex items-center gap-4">
            <span className="w-28 shrink-0 text-[0.78rem] text-ink/70 sm:w-40">{b.label}</span>
            <span className="relative h-8 flex-1 overflow-hidden rounded-md bg-paper2">
              <span
                data-bar
                className={`absolute inset-y-0 left-0 origin-left rounded-md ${
                  b.accent ? "bg-forest" : "bg-sage"
                }`}
                style={{ width: `${(b.value / max) * 100}%` }}
              />
            </span>
            <span className="tabular w-24 shrink-0 text-right text-[0.8rem] font-medium">
              {b.value} mo
            </span>
            <span className="hidden w-44 shrink-0 text-[0.7rem] text-ink/45 lg:block">{b.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function LineBody({ slide }: { slide: Slide }) {
  const max = Math.max(...(slide.series?.flatMap((s) => s.points) ?? [1])) * 1.12;
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h3 data-sl className="display max-w-[22ch] text-[clamp(1.4rem,2.4vw,2.3rem)] tracking-tight">
          {slide.title}
        </h3>
        <div data-sl className="flex flex-col gap-2">
          {slide.series?.map((s) => (
            <span key={s.label} className="eyebrow flex items-center gap-2 text-ink/55">
              <span className="h-[3px] w-6 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-auto">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H + 6}`} className="w-full overflow-visible">
          {[0, 0.25, 0.5, 0.75, 1].map((g) => (
            <line
              key={g}
              x1="0"
              x2={CHART_W}
              y1={CHART_H * g}
              y2={CHART_H * g}
              stroke="#101311"
              strokeOpacity="0.08"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {slide.series?.map((s) => (
            <path
              key={s.label}
              data-draw
              d={linePath(s.points, max)}
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          ))}
        </svg>
        <div className="mt-3 flex justify-between">
          {slide.months?.map((m) => (
            <span key={m} className="eyebrow text-[0.55rem] text-ink/35">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
function TableBody({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col">
      <h3 data-sl className="display text-[clamp(1.4rem,2.4vw,2.3rem)] tracking-tight">
        {slide.title}
      </h3>
      <p data-sl className="mt-2 text-sm text-ink/55">
        {slide.lede}
      </p>
      <table className="mt-5 w-full border-collapse text-left">
        <thead>
          <tr data-sl className="eyebrow text-ink/35">
            <th className="pb-2 font-normal">Line item</th>
            <th className="pb-2 text-right font-normal">Q3</th>
            <th className="pb-2 text-right font-normal">Q2</th>
            <th className="pb-2 text-right font-normal">Δ</th>
          </tr>
        </thead>
        <tbody>
          {slide.rows?.map((r) => (
            <tr data-sl key={r.label} className="border-t border-ink/10">
              <td className="py-2.5 text-[0.85rem] text-ink/80">{r.label}</td>
              <td className="tabular py-2.5 text-right text-[0.85rem] font-medium">{r.now}</td>
              <td className="tabular py-2.5 text-right text-[0.85rem] text-ink/45">{r.prev}</td>
              <td
                className={`tabular py-2.5 text-right text-[0.85rem] ${r.up ? "text-forest" : "text-clay"}`}
              >
                {r.delta}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuoteBody({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <span data-sl className="display text-6xl leading-none text-citrus">
        &ldquo;
      </span>
      <blockquote
        data-sl
        className="display mt-2 max-w-[34ch] text-[clamp(1.5rem,3.2vw,3rem)] leading-[1.1] tracking-tight"
      >
        {slide.quote}
      </blockquote>
      <cite data-sl className="eyebrow mt-8 not-italic text-ink/45">
        {slide.attrib}
      </cite>
    </div>
  );
}
function CloseBody({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <h3 data-sl className="display text-[clamp(1.7rem,3.2vw,3.2rem)] tracking-tight">
          {slide.title}
        </h3>
        <p data-sl className="mt-4 max-w-[50ch] text-[0.95rem] text-ink/60">
          {slide.lede}
        </p>
      </div>
      <ol className="flex flex-col gap-px overflow-hidden rounded-xl bg-ink/10">
        {slide.asks?.map((ask, i) => (
          <li data-sl key={ask} className="flex items-center gap-4 bg-white px-5 py-4">
            <span className="eyebrow tabular text-clay">0{i + 1}</span>
            <span className="text-[0.9rem] text-ink/80">{ask}</span>
            <span className="eyebrow ml-auto hidden rounded-full bg-forest/10 px-2.5 py-1 text-forest sm:block">
              drafted
            </span>
          </li>
        ))}
      </ol>
      <span data-sl className="eyebrow text-ink/35">
        {slide.meta}
      </span>
    </div>
  );
}

export default function SlideBody({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "title":
      return <TitleBody slide={slide} />;
    case "agenda":
      return <AgendaBody slide={slide} />;
    case "kpi":
      return <KpiBody slide={slide} />;
    case "bars":
      return <BarsBody slide={slide} />;
    case "line":
      return <LineBody slide={slide} />;
    case "table":
      return <TableBody slide={slide} />;
    case "quote":
      return <QuoteBody slide={slide} />;
    case "close":
      return <CloseBody slide={slide} />;
    default:
      return null;
  }
}
