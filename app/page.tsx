import Hero from "@/components/sections/Hero";
import LogoStrip from "@/components/sections/LogoStrip";
import TextRevealMission from "@/components/sections/TextRevealMission";
import DeckScroll from "@/components/sections/DeckScroll";
import HorizontalCapabilities from "@/components/sections/HorizontalCapabilities";
import AgentNetwork from "@/components/sections/AgentNetwork";
import StackingCards from "@/components/sections/StackingCards";
import MetricsCounter from "@/components/sections/MetricsCounter";
import Workflow from "@/components/sections/Workflow";
import BeforeAfter from "@/components/sections/BeforeAfter";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import Faq from "@/components/sections/Faq";
import FinalCTA from "@/components/sections/FinalCTA";

/**
 * Section order is the argument the site makes, and every section owns a
 * different scroll mechanic — see the animation map in README.md.
 */
export default function Page() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <TextRevealMission />
      <DeckScroll />
      <HorizontalCapabilities />
      <AgentNetwork />
      <StackingCards />
      <MetricsCounter />
      <Workflow />
      <BeforeAfter />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCTA />
    </>
  );
}
