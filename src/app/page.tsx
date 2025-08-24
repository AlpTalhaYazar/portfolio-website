import { Header, Footer, ScrollToTop } from "@/components/layout";
import {
  Hero,
  About,
  Experience,
  Skills,
  Projects,
  Contact,
} from "@/components/pages";
import { SectionErrorBoundary, ThemeErrorBoundary } from "@/components/utils";
import { lazy, Suspense } from "react";

// Lazy load heavy theme components
const MatrixRain = lazy(() => import("@/components/theme/MatrixRain"));
const StarField = lazy(() => import("@/components/theme/StarField"));

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Lazy-loaded theme components with error boundaries */}
      <ThemeErrorBoundary componentName="MatrixRain">
        <Suspense fallback={null}>
          <MatrixRain />
        </Suspense>
      </ThemeErrorBoundary>
      <ThemeErrorBoundary componentName="StarField">
        <Suspense fallback={null}>
          <StarField />
        </Suspense>
      </ThemeErrorBoundary>

      <div className="relative z-10">
        <SectionErrorBoundary sectionName="Header">
          <Header />
        </SectionErrorBoundary>

        <main id="main-content" tabIndex={-1}>
          <SectionErrorBoundary sectionName="Hero">
            <Hero />
          </SectionErrorBoundary>

          <SectionErrorBoundary sectionName="About">
            <About />
          </SectionErrorBoundary>

          <SectionErrorBoundary sectionName="Experience">
            <Experience />
          </SectionErrorBoundary>

          <SectionErrorBoundary sectionName="Skills">
            <Skills />
          </SectionErrorBoundary>

          <SectionErrorBoundary sectionName="Projects">
            <Projects />
          </SectionErrorBoundary>

          <SectionErrorBoundary sectionName="Contact">
            <Contact />
          </SectionErrorBoundary>
        </main>

        <SectionErrorBoundary sectionName="Footer">
          <Footer />
        </SectionErrorBoundary>

        <SectionErrorBoundary sectionName="ScrollToTop">
          <ScrollToTop />
        </SectionErrorBoundary>
      </div>
    </div>
  );
}
