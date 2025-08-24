import Header from "@/components/layout/Header";
import Hero from "@/components/pages/Hero";
import About from "@/components/pages/About";
import Experience from "@/components/pages/Experience";
import Skills from "@/components/pages/Skills";
import Projects from "@/components/pages/Projects";
import Contact from "@/components/pages/Contact";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import MatrixRain from "@/components/theme/MatrixRain";
import StarField from "@/components/theme/StarField";

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
