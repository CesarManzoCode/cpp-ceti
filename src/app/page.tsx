import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Why } from "@/components/landing/why";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Curriculum } from "@/components/landing/curriculum";
import { FinalCta } from "@/components/landing/cta";
import { LandingFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <Hero />
        <Why />
        <HowItWorks />
        <Curriculum />
        <FinalCta />
      </main>
      <LandingFooter />
    </>
  );
}
