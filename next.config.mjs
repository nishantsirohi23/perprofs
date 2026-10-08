/** @type {import('next').NextConfig} */
const nextConfig = {
  // GSAP ScrollTrigger + R3F canvases are imperative and mount-sensitive.
  // Strict mode's double-invoke is survivable (every effect reverts its
  // gsap.context) but it doubles WebGL context creation in dev, so we opt out.
  reactStrictMode: false,
  transpilePackages: ["three"],
};

export default nextConfig;
