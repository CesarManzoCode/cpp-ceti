import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { Why } from "@/components/landing/why";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LessonTypes } from "@/components/landing/lesson-types";
import { Curriculum } from "@/components/landing/curriculum";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/cta";
import { LandingFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <Hero />
        <StatsBar />
        <Why />
        <HowItWorks />
        <LessonTypes />
        <Curriculum />
        <Faq />
        <FinalCta />
      </main>
      <LandingFooter />
    </>
  );
}
