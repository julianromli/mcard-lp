import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/motion";
import { ArrowRight, Pause, Play } from "lucide-react";

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

/* The monogram chip is filled with the brand's own hue, which runs from
   #cfcfd6 to #2ca01c. A single hardcoded ink colour cannot clear 4.5:1 across
   that range, so each chip picks the end of the scale that does. */
function inkOn(hex: string) {
  const c = hex.replace("#", "");
  const chan = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(chan[0]) + 0.7152 * lin(chan[1]) + 0.0722 * lin(chan[2]);
  const onDark = (L + 0.05) / 0.05;
  const onWhite = 1.05 / (L + 0.05);
  return onDark >= onWhite ? "#0d0d13" : "#ffffff";
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */
function BrandCard({ b }: { b: Brand }) {
  return (
    /* An anchor, not a div: it carried cursor-pointer and a full hover
       treatment while being unfocusable and unclickable. The right-margin is
       the row gap — see MarqueeRow for why it can't live on the container. */
    <a
      href="#"
      className="group relative mr-5 block h-[220px] w-[330px] shrink-0 overflow-hidden rounded-[24px] border border-black/[0.08] transition-colors duration-500 hover:border-[#5a58e8]/50"
    >
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
        aria-hidden
        className="pointer-events-none absolute -right-4 -top-10 select-none text-[190px] font-extrabold leading-none tracking-tighter transition-transform duration-700 ease-out group-hover:-translate-y-2"
        style={{ color: `${b.hue}1f` }}
      >
        {b.mono}
      </span>

      {/* Badge top-left. The label used to be set in the brand hue on a 17%
          tint of that same hue — around 1.2:1 for the paler brands. The hue
          stays in the fill and the border; the text is ink. */}
      <span
        className="absolute left-4 top-4 whitespace-nowrap rounded-full px-3 py-1.5 text-caption font-semibold text-slate-800"
        style={{ background: `${b.hue}2b`, border: `1px solid ${b.hue}55` }}
      >
        {b.badge}
      </span>

      {/* floating info pill */}
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl border border-black/[0.07] bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-body font-bold"
          style={{ background: b.hue, color: inkOn(b.hue) }}
        >
          {b.mono}
        </span>
        <div className="min-w-0">
          <p className="truncate text-body-sm font-semibold text-slate-900" title={b.name}>{b.name}</p>
          <p className="truncate text-caption text-slate-500" title={b.cat}>{b.cat}</p>
        </div>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Marquee row                                                        */
/* ------------------------------------------------------------------ */
function MarqueeRow({
  items,
  reverse = false,
  dur = 46,
  running,
}: {
  items: Brand[];
  reverse?: boolean;
  dur?: number;
  running: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="group/row relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      {/* The loop translates by -50%, which is only seamless if the two halves
          are exactly equal. A `gap` on this container puts one fewer gap in
          the first half than the second, so -50% landed 10px short and the row
          snapped once per cycle. The spacing is a margin on the card instead.

          animationPlayState is left undefined while running so the hover and
          focus-within rules below still govern; an inline "running" would
          outrank them. */}
      <div
        className="flex w-max group-hover/row:[animation-play-state:paused] group-focus-within/row:[animation-play-state:paused]"
        style={{
          animation: `brand-marquee ${dur}s linear infinite ${reverse ? "reverse" : "normal"}`,
          animationPlayState: running ? undefined : "paused",
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
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);

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

  /* Two rows of fourteen gradient-and-mask cards translating forever is not
     something to keep compositing while the section is three screens away. */
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => setInView(self.isActive),
    });
    return () => st.kill();
  }, []);

  const running = !paused && inView;

  return (
    <section ref={root} id="integrasi" className="relative overflow-hidden bg-[#fafafc] py-[13vh]">
      <style>{`@keyframes brand-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* header */}
      <div className="br-head mx-auto max-w-[820px] px-6 text-center">
        <h2 className="br-reveal text-balance text-display-lg font-extrabold text-slate-900">
          Terhubung dengan tools yang kamu pakai tiap hari
        </h2>
        <div className="br-reveal mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#5a58e8] px-6 py-3 text-body-sm font-semibold text-white transition-colors hover:bg-[#6a68f2]"
          >
            Lihat semua integrasi
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
          {/* Hover was the only way to stop the rows, which left keyboard and
              touch with no way to hold a card still long enough to read it. */}
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
            className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-black/15 px-5 text-body-sm font-semibold text-slate-700 transition-colors hover:bg-black/5"
          >
            {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
            {paused ? "Jalankan" : "Hentikan"} animasi
          </button>
        </div>
      </div>

      {/* marquee rows */}
      <div className="br-rows mt-[8vh] space-y-5">
        <div className="br-row">
          <MarqueeRow items={ROW_A} dur={48} running={running} />
        </div>
        <div className="br-row">
          <MarqueeRow items={ROW_B} reverse dur={54} running={running} />
        </div>
      </div>
    </section>
  );
}
