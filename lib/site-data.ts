export const site = {
  name: "Perporfs",
  tagline: "The agentic AI CFO for every business",
  claim:
    "Perporfs runs your finance function end to end — closing books, forecasting cash, chasing invoices, filing tax and defending every number in front of your board.",
  email: "hello@Perporfs.finance",
};

export const nav = [
  { label: "The deck", href: "#deck" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "The crew", href: "#crew" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
];

export interface Capability {
  no: string;
  title: string;
  body: string;
  bullets: string[];
  stat: { value: string; label: string };
}

/** Horizontal-scroll panels. */
export const capabilities: Capability[] = [
  {
    no: "01",
    title: "Closes the books before you ask",
    body: "Continuous close instead of a monthly scramble. Every transaction is categorised, matched and journalled the hour it lands.",
    bullets: [
      "Auto-reconciles banks, cards, PSPs and wallets",
      "Drafts accruals, prepaids and revenue schedules",
      "Leaves a citation on every single entry",
    ],
    stat: { value: "41 min", label: "median close time" },
  },
  {
    no: "02",
    title: "Forecasts cash like it owns the runway",
    body: "A live model of your business, rebuilt every four hours from the actual ledger — not a spreadsheet somebody forgot to update.",
    bullets: [
      "13-week direct cash forecast, revised daily",
      "Scenario branching on hiring, pricing and churn",
      "Flags the week you breach covenant, months early",
    ],
    stat: { value: "±2.1%", label: "90-day forecast error" },
  },
  {
    no: "03",
    title: "Collects what you are owed",
    body: "Politely relentless. It reads the contract, sequences the reminders, negotiates the plan and escalates only when a human matters.",
    bullets: [
      "Per-customer dunning tuned to payment behaviour",
      "Drafts and sends dunning in your voice",
      "Times payables to protect the cash balance",
    ],
    stat: { value: "−11 days", label: "average DSO reduction" },
  },
  {
    no: "04",
    title: "Files tax without the fire drill",
    body: "Multi-entity, multi-jurisdiction provisioning that keeps a defensible position for every number it puts on a return.",
    bullets: [
      "Sales tax, VAT and GST nexus monitoring",
      "Transfer pricing memos and intercompany entries",
      "Assembles the audit binder as it works",
    ],
    stat: { value: "0", label: "missed filings in 2026" },
  },
  {
    no: "05",
    title: "Presents to your board",
    body: "It writes the deck, defends the variance and answers the follow-up question at 11pm on a Sunday — with the working shown.",
    bullets: [
      "Board pack generated from the live ledger",
      "Variance narratives with a drill-down on every claim",
      "Investor updates, data room and diligence answers",
    ],
    stat: { value: "3 hrs", label: "saved per board cycle, per exec" },
  },
  {
    no: "06",
    title: "Never moves money on its own",
    body: "Every consequential action sits behind a policy you write in plain English. It proposes, you approve, it executes and logs.",
    bullets: [
      "Spend, payment and journal approval thresholds",
      "Immutable action log with full reasoning trace",
      "SOC 2 Type II, dual control, least privilege",
    ],
    stat: { value: "100%", label: "actions attributable and reversible" },
  },
];

export interface CrewMember {
  id: string;
  role: string;
  name: string;
  body: string;
  tasks: string[];
  tint: string;
}

/** Sticky stacking cards — the agents that make up the CFO. */
export const crew: CrewMember[] = [
  {
    id: "controller",
    role: "Controller",
    name: "Keeps the ledger honest",
    body: "Categorises, matches and journals every transaction the hour it lands, then reconciles the balance sheet against source documents.",
    tasks: ["Continuous close", "Bank & card recs", "Accruals and schedules", "Anomaly review"],
    tint: "#E8EFE9",
  },
  {
    id: "fpna",
    role: "FP&A",
    name: "Argues with the plan",
    body: "Rebuilds the operating model from actuals, decomposes every variance and tells you which assumption just broke.",
    tasks: ["Driver-based model", "Variance narrative", "Scenario branching", "Headcount plan"],
    tint: "#EDEEE4",
  },
  {
    id: "treasury",
    role: "Treasury",
    name: "Guards the cash balance",
    body: "Sequences collections and payables to protect liquidity, sweeps idle cash and watches counterparty exposure.",
    tasks: ["13-week cash", "Dunning ladder", "Payment timing", "Yield sweeps"],
    tint: "#E7EDF3",
  },
  {
    id: "tax",
    role: "Tax",
    name: "Holds a defensible position",
    body: "Tracks nexus across jurisdictions, provisions monthly and prepares filings with a memo behind every judgement call.",
    tasks: ["Nexus monitoring", "Provisioning", "Filings & returns", "Transfer pricing"],
    tint: "#F1EAE4",
  },
  {
    id: "audit",
    role: "Audit & controls",
    name: "Writes everything down",
    body: "Enforces the policies you set, keeps an immutable action log and assembles the audit binder while the work happens.",
    tasks: ["Policy engine", "Approval routing", "Immutable log", "Evidence binder"],
    tint: "#EAEAE5",
  },
];

export interface Metric {
  value: number;
  label: string;
  sub: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const metrics: Metric[] = [
  { value: 41, suffix: " min", label: "Median month-end close", sub: "vs. 8.2 days industry median" },
  { value: 99.98, suffix: "%", label: "Reconciliation accuracy", sub: "across 4.1M journal entries", decimals: 2 },
  { value: 1.4, prefix: "$", suffix: "M", label: "Working capital released", sub: "average, first two quarters", decimals: 1 },
  { value: 14, suffix: " systems", label: "Connected on day one", sub: "ERP, banks, payroll, billing, CRM" },
];

export const workflow = [
  { no: "01", title: "Connect", body: "Read-only keys into your ERP, banks, payroll, billing and CRM. Ninety minutes, no migration." },
  { no: "02", title: "Learn", body: "It ingests two years of history, your chart of accounts, contracts and past board decks to learn how you account." },
  { no: "03", title: "Model", body: "A driver-based model of your business is built, then reconciled against actuals until it predicts you correctly." },
  { no: "04", title: "Act", body: "Inside your written policy it categorises, reconciles, chases, schedules, provisions and drafts — continuously." },
  { no: "05", title: "Escalate", body: "Anything ambiguous, material or outside policy comes to you with a recommendation and the reasoning attached." },
  { no: "06", title: "Report", body: "Board packs, investor updates, filings and audit binders assemble themselves from the same single source of truth." },
];

