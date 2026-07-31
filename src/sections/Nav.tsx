import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollTrigger } from "@/lib/motion";

function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeWidth="1.1" strokeDasharray="3 2.2" />
      <circle cx="16" cy="16" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
    </svg>
  );
}

const MENU = ["Fitur", "Kartu Virtual", "Cara Kerja"];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const solidRef = useRef(false);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      /* onUpdate runs on every scroll frame, so compare against a ref and only
         reach for setState on the two frames where the threshold is crossed. */
      onUpdate: (self) => {
        const next = self.scroll() > 80;
        if (next === solidRef.current) return;
        solidRef.current = next;
        setSolid(next);
      },
    });
    return () => st.kill();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-white/90 backdrop-blur-md border-b border-black/[0.06]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <a href="#" className="flex items-center gap-2.5 text-slate-900">
          <LogoMark />
          <span className="text-[13px] font-semibold tracking-[0.32em]">MCARD</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {MENU.map((m) => (
            <button
              key={m}
              className="flex items-center gap-1.5 text-[14px] font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {m}
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>
          ))}
          <a href="#" className="text-[14px] font-medium text-slate-600 transition-colors hover:text-slate-900">
            Harga
          </a>
        </nav>

        <div className="flex items-center gap-6">
          <a href="#" className="hidden text-[14px] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:block">
            Masuk
          </a>
          <a
            href="#"
            className="rounded-full bg-[#5a58e8] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#6c6af4]"
          >
            Daftar Gratis
          </a>
        </div>
      </div>
    </header>
  );
}
