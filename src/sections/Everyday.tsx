import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, MOTION_OK, MOTION_REDUCED } from "@/lib/motion";
import { Check, Headphones, TrendingUp } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data — adapted copy for the MCard recreation                       */
/* ------------------------------------------------------------------ */
const ITEMS = [
  {
    title: "Semua saldo dalam satu tampilan",
    desc: "Pantau saldo operasional dan cadangan, kirim dana, dan terbitkan kartu dari dashboard yang sama.",
    bg: "linear-gradient(150deg,#f6f6fb 0%,#eeeef6 55%,#f3f2fa 100%)",
  },
  {
    title: "Diterima di mana-mana",
    desc: "Kartu virtual yang jalan di jutaan merchant, online maupun contactless.",
    bg: "linear-gradient(150deg,#eef0f8 0%,#e9eaf3 55%,#efeaf6 100%)",
  },
  {
    title: "Limit yang ikut tumbuh",
    desc: "Limit kartu naik seiring pendapatan bisnismu berkembang, tanpa pengajuan ulang tiap bulan.",
    bg: "linear-gradient(150deg,#f1edf8 0%,#eae6f2 55%,#f3edf5 100%)",
  },
  {
    title: "Jelas dan simpel",
    desc: "Saldo real-time, transaksi mudah dicari, dan laporan yang siap diekspor.",
    bg: "linear-gradient(150deg,#ecf3f4 0%,#e8edf1 55%,#ecf1f2 100%)",
  },
  {
    title: "Selalu ada yang bantu",
    desc: "Jawaban instan di aplikasi, plus tim support manusia kapan pun kamu butuh.",
    bg: "linear-gradient(150deg,#f3eff2 0%,#ece8ec 55%,#f1ecee 100%)",
  },
];

/* ------------------------------------------------------------------ */
/*  Media cards — DOM recreations, one per item                        */
/* ------------------------------------------------------------------ */
function CardChrome({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[28px] border border-black/[0.07] shadow-[0_40px_90px_-20px_rgba(15,15,20,0.18)]"
      style={{ background: bg }}
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[130%] -translate-x-1/2 rounded-full bg-[#5a58e8]/10 blur-[90px]" />
      {children}
    </div>
  );
}

function MediaCard({ i }: { i: number }) {
  const bg = ITEMS[i].bg;
  if (i === 0)
    return (
      <CardChrome bg={bg}>
        <div className="flex h-full flex-col justify-center gap-4 p-9">
          <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm">
            <p className="text-eyebrow uppercase text-slate-500">Saldo total</p>
            <p className="mt-1 text-title font-bold tabular-nums text-slate-900">Rp 74,7 M</p>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-[#5a58e8] px-4 py-2 text-caption font-semibold text-white">Kirim</span>
              <span className="rounded-full border border-black/10 px-4 py-2 text-caption font-medium text-slate-600">Minta</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Operasional", "Rp 43,7 M"],
              ["Deposito", "Rp 31 M"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-black/[0.06] bg-white/80 p-4">
                <p className="text-eyebrow uppercase text-slate-500">{k}</p>
                <p className="mt-1 text-body font-semibold tabular-nums text-slate-900">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </CardChrome>
    );
  if (i === 1)
    return (
      <CardChrome bg={bg}>
        <div className="flex h-full flex-col items-center justify-center gap-6 p-9">
          <div className="w-[78%] rounded-2xl border border-white/15 bg-gradient-to-br from-[#26262f] to-[#101014] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="h-7 w-10 rounded-md bg-gradient-to-br from-[#d9d9e8] to-[#8a8aa8]" />
              <p className="text-label font-bold italic tracking-widest text-white/85">MCARD</p>
            </div>
            {/* Wide tracking is the card-number look, so it overrides the
                token; Geist Mono supplies the fixed advance underneath. */}
            <p className="mt-6 whitespace-nowrap font-mono text-body tracking-[0.18em] text-white/80">5312&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;4477</p>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-eyebrow uppercase text-white/60">Sari Wijaya</p>
              <p className="text-eyebrow tabular-nums text-white/60">12/29</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 shadow-sm">
            <Check size={14} className="text-emerald-600" />
            <p className="text-caption font-medium text-slate-600">Online & contactless, langsung aktif</p>
          </div>
        </div>
      </CardChrome>
    );
  if (i === 2)
    return (
      <CardChrome bg={bg}>
        <div className="flex h-full flex-col justify-center gap-4 p-9">
          <div className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-eyebrow uppercase text-slate-500">Limit kartu</p>
              <TrendingUp size={16} className="text-[#5a58e8]" />
            </div>
            <p className="mt-1 text-title font-bold tabular-nums text-slate-900">Rp 3,75 M</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/[0.07]">
              <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-[#5a58e8] to-[#8b89ff]" />
            </div>
            <p className="mt-2 text-caption tabular-nums text-slate-500">38% terpakai · limit menyesuaikan pendapatan</p>
          </div>
          <div className="rounded-2xl border border-black/[0.06] bg-white/80 p-4">
            <p className="text-eyebrow uppercase text-slate-500">Limit tambahan tersedia</p>
            <p className="mt-1 text-body-lg font-semibold tabular-nums text-slate-900">Rp 18 M</p>
          </div>
        </div>
      </CardChrome>
    );
  if (i === 3)
    return (
      <CardChrome bg={bg}>
        <div className="flex h-full flex-col justify-center gap-3 p-9">
          {[
            ["Transfer · Acme Cloud", "-Rp 124 jt", "Hari ini"],
            ["Payout Stripe", "+Rp 482,1 jt", "Hari ini"],
            ["Payroll · Tim Ops", "-Rp 310,2 jt", "Kemarin"],
            ["AWS", "-Rp 89,1 jt", "Kemarin"],
          ].map(([n, a, d]) => (
            <div key={n} className="flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white px-5 py-4 shadow-sm">
              <div>
                <p className="text-label font-medium text-slate-800">{n}</p>
                <p className="text-caption text-slate-500">{d}</p>
              </div>
              {/* Amounts stack in a column and are read against each other, so
                  the digits have to share one advance width. */}
              <p className={`text-label font-semibold tabular-nums ${a.startsWith("+") ? "text-emerald-600" : "text-slate-800"}`}>{a}</p>
            </div>
          ))}
        </div>
      </CardChrome>
    );
  return (
    <CardChrome bg={bg}>
      <div className="flex h-full flex-col justify-center gap-4 p-9">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5a58e8]">
            <Headphones size={18} className="text-white" />
          </div>
          <div>
            <p className="text-body-sm font-semibold text-slate-900">Support Mayar</p>
            <p className="text-caption text-emerald-600">Online · balas dalam hitungan detik</p>
          </div>
        </div>
        <div className="max-w-[80%] self-start text-pretty rounded-2xl rounded-bl-sm border border-black/[0.07] bg-white px-4 py-3 text-label text-slate-700 shadow-sm">
          Bagaimana cara menaikkan limit transfer harian?
        </div>
        <div className="max-w-[85%] self-end text-pretty rounded-2xl rounded-br-sm bg-[#5a58e8] px-4 py-3 text-label text-white">
          Bisa diajukan dari Pengaturan · Limit. Saya bantu prosesnya sekarang?
        </div>
      </div>
    </CardChrome>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export function Everyday() {
  const root = useRef<HTMLElement>(null);
  const mediaWrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  /* Which item is open is decided by a ScrollTrigger, and that trigger only
     exists under MOTION_OK. Left alone, a reduced-motion reader kept item 0
     open forever and the other four descriptions stayed collapsed at 0fr —
     four fifths of the section's copy unreachable. Open them all instead. */
  const [allOpen, setAllOpen] = useState(false);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_REDUCED, () => {
      setAllOpen(true);
      return () => setAllOpen(false);
    });
    mm.add(MOTION_OK, () => {
      // header entrance
      gsap.fromTo(
        ".ev-reveal",
        { autoAlpha: 0, y: 46 },
        {
          autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".ev-head", start: "top 78%" },
        }
      );

      // per-item activation — scroll-driven active state
      gsap.utils.toArray<HTMLElement>(".ev-item").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 58%",
          end: "bottom 42%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });

      // gentle parallax drift on the sticky media column
      gsap.fromTo(
        mediaWrap.current,
        { y: 60 },
        {
          y: -60, ease: "none",
          scrollTrigger: { trigger: ".ev-body", start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="fitur" className="relative bg-[#fafafc] py-[14vh]">
      {/* header */}
      <div className="ev-head mx-auto max-w-[820px] px-6 text-center">
        <h2 className="ev-reveal text-balance text-display-lg font-extrabold text-slate-900">
          Satu tempat buat semua pengeluaran bisnis
        </h2>
        <p className="ev-reveal mx-auto mt-5 max-w-[560px] text-pretty text-body-lg text-slate-500">
          Kartu, anggaran, dan laporan dalam satu dashboard — plus tim support yang balas cepat.
        </p>
      </div>

      {/* body */}
      <div className="ev-body mx-auto mt-[9vh] grid max-w-[1200px] grid-cols-1 gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        {/* sticky media stack */}
        <div className="relative order-2 hidden lg:order-1 lg:block">
          <div className="sticky top-[16vh] h-[68vh]">
            <div ref={mediaWrap} className="relative h-full w-full">
              {ITEMS.map((it, i) => (
                <div
                  key={it.title}
                  /* transition-all also tried to interpolate the z-index flip
                     below, which is a discrete property. Name the two that
                     actually move. */
                  className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: active === i ? 1 : 0,
                    transform: `scale(${active === i ? 1 : 0.94}) translateY(${active === i ? 0 : 26}px)`,
                    zIndex: active === i ? 2 : 1,
                    pointerEvents: "none",
                  }}
                >
                  <MediaCard i={i} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* text list */}
        <div className="order-1 lg:order-2">
          {ITEMS.map((it, i) => (
            <div key={it.title} className="ev-item flex min-h-[46vh] flex-col justify-center border-b border-black/[0.07] py-10 last:border-0">
              {/* mobile media */}
              <div className="relative mb-8 aspect-[4/3] lg:hidden">
                <MediaCard i={i} />
              </div>
              {/* Inactive headings were slate-300 on #fafafc — about 1.4:1,
                  unreadable rather than de-emphasised. slate-500 clears 4.5:1
                  and still reads a clear step back from the active one. */}
              <h3
                className={`text-balance text-title-lg font-bold transition-colors duration-500 ${
                  allOpen || active === i ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {it.title}
              </h3>
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ gridTemplateRows: allOpen || active === i ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="max-w-[440px] text-pretty pt-4 text-body text-slate-500">{it.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
