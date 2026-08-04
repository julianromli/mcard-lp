import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { ScrollTrigger } from "@/lib/motion";

/* These were buttons carrying a chevron and no menu behind them — an
   affordance that opened nothing, and one that only existed above 1024px.
   They are now real links to the sections they name, reachable at every
   width through the disclosure panel below. */
const MENU = [
  { label: "Fitur", href: "#fitur" },
  { label: "Keamanan", href: "#keamanan" },
  { label: "Integrasi", href: "#integrasi" },
  { label: "Harga", href: "#harga" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const solidRef = useRef(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

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

  /* Disclosure, not a modal: the page behind stays operable, so Escape and a
     focus return are all the panel owes the keyboard. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        solid || open ? "bg-white/90 backdrop-blur-md border-b border-black/[0.06]" : "bg-transparent"
      }`}
    >
      <a
        href="#konten"
        className="sr-only rounded-full bg-white px-5 py-3 text-body-sm font-semibold text-slate-900 shadow-md focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-10"
      >
        Lewati ke konten
      </a>

      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <a href="#hero" className="flex items-center gap-2.5 py-3 text-slate-900">
          {/* Decorative: the MCARD span beside it already names the link, so a
              second label would have a screen reader read the lockup twice. The
              explicit box keeps the 72px header from reflowing on decode. */}
          <img src="/mayar-icon-96.png" alt="" width={28} height={28} className="h-7 w-7" />
          {/* Wordmark, not a label — the 0.32em lockup is deliberate and stays
              an override rather than joining the scale's eyebrow tracking. */}
          <span className="text-label font-semibold tracking-[0.32em]">MCARD</span>
        </a>

        {/* The header is transparent until 80px of scroll, which puts these over
            the hero photo's darkest band — slate-600 measured 2.05:1 there, the
            worst contrast on the page. slate-800 clears AA against the scrim
            behind it. Hover then had to leave the greyscale ramp: slate-800 to
            slate-900 is a step nobody can see over a photograph. */}
        <nav aria-label="Utama" className="hidden items-center gap-8 lg:flex">
          {MENU.map((m) => (
            <a
              key={m.href}
              href={m.href}
              className="whitespace-nowrap py-3 text-body-sm font-medium text-slate-800 transition-colors hover:text-brand"
            >
              {m.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 lg:gap-6">
          <a
            href="#"
            className="hidden py-3 text-body-sm font-medium text-slate-800 transition-colors hover:text-brand sm:block"
          >
            Masuk
          </a>
          <a
            href="#"
            className="whitespace-nowrap rounded-full bg-brand px-5 py-3 text-body-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Daftar Gratis
          </a>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="nav-mobile"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-black/5 lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id="nav-mobile"
        hidden={!open}
        className="border-t border-black/[0.06] bg-white/95 backdrop-blur-md lg:hidden"
      >
        <nav aria-label="Utama (seluler)" className="mx-auto max-w-[1440px] px-6 py-2">
          <ul>
            {MENU.map((m) => (
              <li key={m.href}>
                <a
                  href={m.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-black/[0.05] py-4 text-body font-medium text-slate-700 transition-colors hover:text-slate-900"
                >
                  {m.label}
                </a>
              </li>
            ))}
            <li className="sm:hidden">
              {/* An in-page action, not a destination: as an <a href="#"> it was
                  unreachable by keyboard activation and jumped to the top on
                  click. A button carries the same styling and real semantics. */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="block w-full py-4 text-left text-body font-medium text-slate-700 transition-colors hover:text-slate-900"
              >
                Masuk
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
