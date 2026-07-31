import Nav from "../sections/Nav";
import Hero from "../sections/Hero";
import { Everyday } from "../sections/Everyday";
import Protection from "../sections/Protection";
import { Brands } from "../sections/Brands";
import { Pricing } from "../sections/Pricing";
import Cta from "../sections/Cta";
import Footer from "../sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Nav />
      <Hero />
      <Everyday />
      <Protection />
      <Brands />
      <Pricing />
      <Cta />
      <Footer />
    </div>
  );
}
