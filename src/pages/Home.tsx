import Nav from "../sections/Nav";
import Hero from "../sections/Hero";
import { Everyday } from "../sections/Everyday";
import Protection from "../sections/Protection";
import { Brands } from "../sections/Brands";
import { Pricing } from "../sections/Pricing";
import Cta from "../sections/Cta";
import Footer from "../sections/Footer";
import { useScrollRestoration } from "../lib/scrollRestoration";

export default function Home() {
  /* Runs here rather than inside Hero: the pin belongs to the hero, but the
     scroll position it distorts belongs to the whole page. */
  useScrollRestoration();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Nav />
      <main id="konten">
        <Hero />
        <Everyday />
        <Protection />
        <Brands />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
