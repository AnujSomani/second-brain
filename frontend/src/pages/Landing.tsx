import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { DemoSection } from "../components/landing/DemoSection";
import { HowItWorks } from "../components/landing/HowItWorks";
import { UseCases } from "../components/landing/UseCases";
import { Features } from "../components/landing/Features";
import { Pricing } from "../components/landing/Pricing";
import { CTA } from "../components/landing/CTA";
import { Footer } from "../components/landing/Footer";

export function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DemoSection />
        <HowItWorks />
        <UseCases />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}