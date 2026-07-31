import Nav from "../sections/Nav";
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import { Everyday } from "../sections/Everyday";
import Protection from "../sections/Protection";
import { Brands } from "../sections/Brands";
import { Pricing } from "../sections/Pricing";
import Cta from "../sections/Cta";
import Footer from "../sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-[Inter,system-ui,sans-serif] text-slate-900 antialiased">
      <Nav />
      <Hero />
      <Features />
      <Everyday />
      <Protection />
      <Brands />
      <Pricing />
      <Cta />
      <Footer />
    </div>
  );
}
