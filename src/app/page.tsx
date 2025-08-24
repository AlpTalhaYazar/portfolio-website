import { Header, Footer, ScrollToTop } from "@/components/layout";
import {
  Hero,
  About,
  Experience,
  Skills,
  Projects,
  Contact,
} from "@/components/pages";
import { MatrixRain, StarField } from "@/components/theme";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <MatrixRain />
      <StarField />
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
