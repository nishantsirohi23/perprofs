/**
 * A plain mutable object shared between GSAP ScrollTriggers (writers) and R3F
 * useFrame loops (readers). Deliberately not React state: scroll-linked values
 * update every frame and must never trigger a re-render.
 */
export const scrollState = {
  /** 0 -> 1 across the hero section */
  hero: 0,
  /** 0 -> 1 across the pinned deck section */
  deck: 0,
  /** 0 -> 1 across the agent-network section */
  network: 0,
  /** normalised scroll velocity, roughly -1 .. 1 */
  velocity: 0,
  /** pointer in -1..1 normalised device coords */
  pointer: { x: 0, y: 0 },
};

export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

export const mapRange = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => outMin + ((clamp(v, inMin, inMax) - inMin) / (inMax - inMin)) * (outMax - outMin);
