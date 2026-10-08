export const integrations = [
  "NetSuite",
  "QuickBooks",
  "Xero",
  "Sage Intacct",
  "Stripe",
  "Adyen",
  "Brex",
  "Ramp",
  "Mercury",
  "J.P. Morgan",
  "Rippling",
  "Gusto",
  "Deel",
  "Salesforce",
  "HubSpot",
  "Snowflake",
  "Chargebee",
  "Avalara",
];

export const logos = [
  "Halden Robotics",
  "Fieldnote",
  "Tessellate",
  "Northbay Foods",
  "Onward Health",
  "Kirn & Co.",
  "Vantablue",
  "Meridian Freight",
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  metric: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "We went from a nine-day close to same-week, and I stopped being the person who assembles numbers. I'm the person who decides things again.",
    name: "Priya Raghunathan",
    role: "VP Finance, Halden Robotics",
    metric: "9 days → 41 minutes",
  },
  {
    quote:
      "It found $312k of duplicated vendor spend in the first fortnight. It had already drafted the cancellation emails.",
    name: "Marcus Adeyemi",
    role: "Founder, Northbay Foods",
    metric: "$312k recovered",
  },
  {
    quote:
      "Our auditors asked for support on 40 samples. It returned all 40 with citations in under a minute. That was the moment.",
    name: "Elena Vasquez",
    role: "Controller, Onward Health",
    metric: "40/40 samples, instant",
  },
  {
    quote:
      "I run a 22-person agency. I could never afford a real CFO. Now I get board-grade reporting for less than my accounting software.",
    name: "Tom Bramwell",
    role: "Managing Director, Fieldnote",
    metric: "First forecast in 90 min",
  },
];

export interface Tier {
  name: string;
  price: string;
  unit: string;
  blurb: string;
  features: string[];
  featured?: boolean;
}

export const tiers: Tier[] = [
  {
    name: "Operator",
    price: "$490",
    unit: "/ month",
    blurb: "For founder-led businesses under $5M revenue that have a bookkeeper and no CFO.",
    features: [
      "Continuous close and reconciliation",
      "13-week cash forecast",
      "Monthly investor update, drafted",
      "Up to 4 connected systems",
      "Single entity",
    ],
  },
  {
    name: "Chief",
    price: "$1,900",
    unit: "/ month",
    blurb: "The full finance function. Most companies between $5M and $80M land here.",
    features: [
      "Everything in Operator",
      "Full agent crew: FP&A, treasury, tax, audit",
      "Board deck generation and variance defence",
      "Collections and payables sequencing",
      "Unlimited systems, up to 5 entities",
      "Policy engine with approval routing",
    ],
    featured: true,
  },
  {
    name: "Consolidated",
    price: "Custom",
    unit: "",
    blurb: "Multi-entity groups, private equity portfolios and regulated balance sheets.",
    features: [
      "Everything in Chief",
      "Unlimited entities and currencies",
      "Consolidation and intercompany elimination",
      "Transfer pricing and statutory filings",
      "Private deployment, SSO, custom retention",
      "Named finance engineer",
    ],
  },
];

export const faqs = [
  {
    q: "Does it actually move money?",
    a: "Only inside a policy you write. Payments, journals above a threshold, contract commitments and anything novel are proposed with reasoning and wait for your approval. Dual control is on by default, and every action is reversible and logged.",
  },
  {
    q: "What happens to my accountant or bookkeeper?",
    a: "They stop doing data entry and start reviewing exceptions. Most teams keep their accountant for judgement and relationships, and hand the mechanical work to Perporfs. Your external auditors get a cleaner binder either way.",
  },
  {
    q: "How does it handle something it has never seen?",
    a: "It escalates. Novel transaction types, related-party questions, unusual revenue arrangements and anything material outside policy come to you with the options, precedent from your own history and a recommendation.",
  },
  {
    q: "Can I audit its reasoning?",
    a: "Every number on every report is a link. Click it and you get the entries, the source documents, the policy applied and the full reasoning trace with timestamps. Nothing is a black box you have to defend blind.",
  },
  {
    q: "How long until it is useful?",
    a: "Ninety minutes to connect, roughly a day to ingest and reconcile history, and your first cash forecast the same afternoon. Full autonomy inside policy typically switches on in week two, once you have reviewed how it thinks.",
  },
  {
    q: "Where does my data live?",
    a: "Your own isolated tenant, encrypted at rest and in transit, SOC 2 Type II with annual penetration testing. Nothing is used to train shared models. Consolidated customers can run in a private cloud in a region they choose.",
  },
];

export const beforeAfter = {
  before: [
    "Close takes nine days and one person's weekend",
    "The forecast lives in a spreadsheet nobody trusts",
    "Collections happen when someone remembers",
    "Board questions take three days to answer",
    "Tax is an annual emergency",
    "A real CFO costs $340k plus equity",
  ],
  after: [
    "Books are closed continuously, audit-ready",
    "A live model reforecast every four hours",
    "Dunning runs itself, DSO drops by eleven days",
    "Board answers arrive with citations in seconds",
    "Provisioning happens monthly, filings on time",
    "Board-grade finance from $490 a month",
  ],
};
