export type SlideKind =
  | "title"
  | "agenda"
  | "kpi"
  | "bars"
  | "line"
  | "table"
  | "quote"
  | "close";

export interface Slide {
  id: string;
  kind: SlideKind;
  eyebrow: string;
  title: string;
  lede?: string;
  meta?: string;
  bullets?: { k: string; v: string }[];
  kpis?: { label: string; value: string; delta: string; up: boolean }[];
  bars?: { label: string; value: number; note: string; accent?: boolean }[];
  months?: string[];
  series?: { label: string; color: string; points: number[] }[];
  rows?: { label: string; now: string; prev: string; delta: string; up: boolean }[];
  quote?: string;
  attrib?: string;
  asks?: string[];
}

/** The scroll-driven board deck. Each entry is one "page" of the presentation. */
export const deck: Slide[] = [
  {
    id: "cover",
    kind: "title",
    eyebrow: "Board deck / Q3 FY26",
    title: "Autonomous finance, on the record.",
    lede: "Twelve weeks of ledger activity, reconciled, explained and forecast — assembled without a human touching a spreadsheet.",
    meta: "Prepared by Perporfs · Agentic CFO · 06 Sep 2026",
  },
  {
    id: "agenda",
    kind: "agenda",
    eyebrow: "01 — Agenda",
    title: "What your CFO handled this quarter.",
    bullets: [
      { k: "01", v: "Close, reconciliation & audit trail" },
      { k: "02", v: "Runway and scenario planning" },
      { k: "03", v: "Revenue quality & margin decomposition" },
      { k: "04", v: "Collections, payables and working capital" },
      { k: "05", v: "Tax provisioning and multi-entity filings" },
      { k: "06", v: "Board asks and capital strategy" },
    ],
  },
  {
    id: "kpi",
    kind: "kpi",
    eyebrow: "02 — Position",
    title: "The numbers, restated every four hours.",
    lede: "Live from 14 connected systems. No stale exports, no month-old truth.",
    kpis: [
      { label: "Runway", value: "27 mo", delta: "+6 mo QoQ", up: true },
      { label: "Gross margin", value: "78.4%", delta: "+3.1 pts", up: true },
      { label: "Burn multiple", value: "0.9×", delta: "−0.4×", up: true },
      { label: "Days sales outstanding", value: "24 d", delta: "−11 d", up: true },
    ],
  },
  {
    id: "runway",
    kind: "bars",
    eyebrow: "03 — Scenarios",
    title: "Four futures, priced by Friday.",
    lede: "Each scenario is a live model, not a slide. Change a hiring plan and the bars move.",
    bars: [
      { label: "Conservative", value: 34, note: "Hiring frozen, 4% churn" },
      { label: "Base case", value: 27, note: "Plan of record", accent: true },
      { label: "Aggressive", value: 18, note: "22 hires, 2 new markets" },
      { label: "Base + Series B", value: 41, note: "$18M at current terms" },
    ],
  },
  {
    id: "trend",
    kind: "line",
    eyebrow: "04 — Trajectory",
    title: "Revenue crossed burn in month nine.",
    lede: "Net new ARR compounding at 11.4% MoM while operating burn flattened.",
    months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    series: [
      { label: "Revenue", color: "#123D2B", points: [18, 21, 24, 29, 33, 38, 44, 52, 61, 72, 84, 97] },
      { label: "Operating burn", color: "#DB5C36", points: [46, 48, 51, 53, 55, 56, 58, 57, 59, 58, 60, 61] },
    ],
  },
  {
    id: "pnl",
    kind: "table",
    eyebrow: "05 — Statement",
    title: "P&L snapshot, tied to the penny.",
    lede: "2,481 journal entries. 19 flagged for review. 3 escalated to you.",
    rows: [
      { label: "Revenue", now: "$1.164M", prev: "$0.902M", delta: "+29.0%", up: true },
      { label: "Cost of revenue", now: "$0.251M", prev: "$0.221M", delta: "+13.6%", up: false },
      { label: "Gross profit", now: "$0.913M", prev: "$0.681M", delta: "+34.1%", up: true },
      { label: "Sales & marketing", now: "$0.402M", prev: "$0.377M", delta: "+6.6%", up: false },
      { label: "R&D", now: "$0.488M", prev: "$0.455M", delta: "+7.3%", up: false },
      { label: "Operating income", now: "−$0.061M", prev: "−$0.203M", delta: "+70.0%", up: true },
    ],
  },
  {
    id: "quote",
    kind: "quote",
    eyebrow: "06 — In practice",
    title: "Field note",
    quote:
      "It closed the books in 41 minutes, then argued with me about a vendor contract. It was right.",
    attrib: "Priya Raghunathan · VP Finance, Halden Robotics · 340 employees",
  },
  {
    id: "close",
    kind: "close",
    eyebrow: "07 — Motion",
    title: "Three asks, one signature.",
    lede: "Your CFO has already drafted the resolutions, the data room index and the diligence answers.",
    asks: [
      "Approve the FY27 operating plan at 27-month runway",
      "Authorise the $18M Series B process, Q1 open",
      "Ratify the multi-entity tax structure for EU expansion",
    ],
    meta: "End of deck · Perporfs regenerates this every Monday at 06:00",
  },
];
