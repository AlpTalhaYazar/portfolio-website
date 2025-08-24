import { Header, Footer, ScrollToTop } from "@/components/layout";
import {
  Hero,
  About,
  Experience,
  Skills,
  Projects,
  Contact,
} from "@/components/pages";
import { lazy, Suspense } from "react";

// Lazy load heavy theme components
const MatrixRain = lazy(() => import("@/components/theme/MatrixRain"));
const StarField = lazy(() => import("@/components/theme/StarField"));

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Lazy-loaded theme components with fallbacks */}
      <Suspense fallback={null}>
        <MatrixRain />
      </Suspense>
      <Suspense fallback={null}>
        <StarField />
      </Suspense>

      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
}
