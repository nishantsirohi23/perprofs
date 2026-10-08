import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Every 1% step, so `text-ink/62` and friends always resolve.
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)]),
      ),
      colors: {
        paper: "#F6F4EF",
        paper2: "#EFEBE2",
        paper3: "#E6E1D6",
        ink: "#101311",
        ink2: "#3A403B",
        forest: "#123D2B",
        moss: "#2E6B4F",
        sage: "#9CB8A6",
        citrus: "#D9FF57",
        clay: "#DB5C36",
        sky: "#C3D9FF",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "10xl": ["9.5rem", { lineHeight: "0.85", letterSpacing: "-0.04em" }],
        "11xl": ["13rem", { lineHeight: "0.82", letterSpacing: "-0.045em" }],
      },
      letterSpacing: {
        tightest: "-0.05em",
        wide2: "0.16em",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        slide:
          "0 1px 1px rgba(16,19,17,0.04), 0 8px 20px -6px rgba(16,19,17,0.10), 0 40px 80px -30px rgba(16,19,17,0.22)",
        lift: "0 20px 60px -24px rgba(18,61,43,0.28)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.7)",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.15" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        marquee: "marquee 34s linear infinite",
        spinSlow: "spinSlow 26s linear infinite",
        blink: "blink 1.6s ease-in-out infinite",
        floaty: "floaty 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
