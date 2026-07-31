import { useLayoutEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data — adapted to Mercury's integration ecosystem                  */
/* ------------------------------------------------------------------ */
type Brand = { name: string; cat: string; badge: string; hue: string; mono: string };

const ROW_A: Brand[] = [
  { name: "Stripe", cat: "Pembayaran", badge: "Payout instan", hue: "#635bff", mono: "S" },
  { name: "Shopify", cat: "Belanja", badge: "Sinkron otomatis", hue: "#95bf47", mono: "S" },
  { name: "Gusto", cat: "Payroll", badge: "Sekali klik", hue: "#f45d48", mono: "G" },
  { name: "QuickBooks", cat: "Akuntansi", badge: "Rekonsiliasi otomatis", hue: "#2ca01c", mono: "Q" },
  { name: "Slack", cat: "Notifikasi", badge: "Real-time", hue: "#e01e5a", mono: "S" },
  { name: "Linear", cat: "Tiket", badge: "Sinkron dua arah", hue: "#5e6ad2", mono: "L" },
  { name: "Vercel", cat: "Deploy", badge: "Sinkron instan", hue: "#9c9cff", mono: "V" },
];

const ROW_B: Brand[] = [
  { name: "Notion", cat: "Dokumen", badge: "Ekspor otomatis", hue: "#cfcfd6", mono: "N" },
  { name: "Figma", cat: "Desain", badge: "Tagihan mulus", hue: "#a259ff", mono: "F" },
  { name: "AWS", cat: "Cloud", badge: "Bayar tagihan", hue: "#ff9900", mono: "A" },
  { name: "Plaid", cat: "Koneksi", badge: "Koneksi aman", hue: "#12b5a5", mono: "P" },
  { name: "Xero", cat: "Akuntansi", badge: "Rekonsiliasi otomatis", hue: "#13b5ea", mono: "X" },
  { name: "Wise", cat: "Valas", badge: "Kurs tengah", hue: "#9fe870", mono: "W" },
  { name: "GitHub", cat: "Kode", badge: "Sinkron instan", hue: "#8b949e", mono: "G" },
];

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */
function BrandCard({ b }: { b: Brand }) {
  return (
    <div className="group relative h-[220px] w-[330px] shrink-0 cursor-pointer overflow-hidden rounded-[24px] border border-black/[0.08] transition-all duration-500 hover:border-[#5a58e8]/50">
      {/* tinted backdrop */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        style={{
          background: `radial-gradient(120% 130% at 20% 0%, ${b.hue}1c 0%, #f7f7fb 55%, #f2f2f8 100%)`,
        }}
      />
      {/* Giant monogram watermark. Deliberately off the scale: it is decoration
          sized against a fixed 330x220 card, so a fluid display token would
          rescale it independently of the card and break the crop. */}
      <span
        className="pointer-events-none absolute -right-4 -top-10 select-none text-[190px] font-extrabold leading-none tracking-tighter transition-transform duration-700 ease-out group-hover:-translate-y-2"
        style={{ color: `${b.hue}1f` }}
      >
        {b.mono}
      </span>

      {/* badge top-left */}
      <span
        className="absolute left-4 top-4 whitespace-nowrap rounded-full px-3 py-1.5 text-caption font-semibold"
        style={{ background: `${b.hue}2b`, color: b.hue, border: `1px solid ${b.hue}55` }}
      >
        {b.badge}
      </span>

      {/* floating info pill */}
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl border border-black/[0.07] bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-body font-bold text-[#0d0d13]"
          style={{ background: b.hue }}
        >
          {b.mono}
        </span>
        <div className="min-w-0">
          <p className="truncate text-body-sm font-semibold text-slate-900" title={b.name}>{b.name}</p>
          <p className="truncate text-caption text-slate-400" title={b.cat}>{b.cat}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Marquee row                                                        */
/* ------------------------------------------------------------------ */
function MarqueeRow({ items, reverse = false, dur = 46 }: { items: Brand[]; reverse?: boolean; dur?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="group/row relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        className="flex w-max gap-5 group-hover/row:[animation-play-state:paused]"
        style={{
          animation: `brand-marquee ${dur}s linear infinite ${reverse ? "reverse" : "normal"}`,
        }}
      >
        {doubled.map((b, i) => (
          <BrandCard key={`${b.name}-${i}`} b={b} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export function Brands() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        ".br-reveal",
        { autoAlpha: 0, y: 44 },
        {
          autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".br-head", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".br-row",
        { autoAlpha: 0, y: 60 },
        {
          autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.18, ease: "power3.out",
          scrollTrigger: { trigger: ".br-rows", start: "top 85%" },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-[#fafafc] py-[13vh]">
      <style>{`@keyframes brand-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* header */}
      <div className="br-head mx-auto max-w-[820px] px-6 text-center">
        <h2 className="br-reveal text-balance text-display-lg font-extrabold text-slate-900">
          Terhubung dengan tools yang kamu pakai tiap hari
        </h2>
        <div className="br-reveal mt-8">
          <a
            href="#"
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#5a58e8] px-6 py-3 text-body-sm font-semibold text-white transition-colors hover:bg-[#6a68f2]"
          >
            Lihat semua integrasi
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* marquee rows */}
      <div className="br-rows mt-[8vh] space-y-5">
        <div className="br-row">
          <MarqueeRow items={ROW_A} dur={48} />
        </div>
        <div className="br-row">
          <MarqueeRow items={ROW_B} reverse dur={54} />
        </div>
      </div>
    </section>
  );
}
