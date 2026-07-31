import { useLayoutEffect, useRef, useState } from "react";
import { gsap, MOTION_OK } from "@/lib/motion";
import {
  Bell, CreditCard, FileText, Headphones, Infinity as InfinityIcon, KeyRound,
  Landmark, Palette, PieChart, Rocket, ShieldCheck, Snowflake, ToggleRight,
  UserCog, Users, Zap,
} from "lucide-react";

type Feat = { icon: React.ElementType; strong?: string; text: string };
type Plan = {
  name: string;
  tagline: string;
  monthly: number | null; // null = custom
  yearly: number; // per month, billed yearly (rb)
  includes: string;
  feats: Feat[];
  cta: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Starter",
    tagline: "Buat usaha kecil yang baru mulai.",
    monthly: 0,
    yearly: 0,
    includes: "Paket Starter termasuk:",
    cta: "Daftar Gratis",
    feats: [
      { icon: CreditCard, strong: "3", text: "kartu virtual" },
      { icon: Users, strong: "1", text: "anggota tim" },
      { icon: Bell, text: "Notifikasi transaksi real-time" },
      { icon: FileText, text: "Laporan dasar" },
      { icon: Zap, text: "Top-up instan, tanpa minimum" },
      { icon: Headphones, text: "Support via email" },
    ],
  },
  {
    name: "Bisnis",
    tagline: "Buat tim yang lagi bertumbuh.",
    monthly: 299,
    yearly: 239,
    includes: "Semua yang di Starter, plus:",
    cta: "Coba 14 Hari Gratis",
    featured: true,
    feats: [
      { icon: InfinityIcon, strong: "Tanpa batas", text: "kartu virtual" },
      { icon: Users, strong: "25", text: "anggota tim" },
      { icon: PieChart, text: "Anggaran per kategori" },
      { icon: Palette, text: "Pilihan desain kartu" },
      { icon: FileText, text: "Laporan & ekspor pajak" },
      { icon: Snowflake, text: "Bekukan kartu instan" },
      { icon: ToggleRight, text: "Kontrol online & contactless" },
      { icon: Headphones, text: "Support prioritas" },
    ],
  },
  {
    name: "Enterprise",
    tagline: "Buat perusahaan dengan kebutuhan khusus.",
    monthly: null,
    yearly: 0,
    includes: "Semua yang di Bisnis, plus:",
    cta: "Hubungi Sales",
    feats: [
      { icon: InfinityIcon, strong: "Tanpa batas", text: "anggota tim" },
      { icon: KeyRound, text: "SSO & kontrol akses" },
      { icon: UserCog, text: "Manajer akun khusus" },
      { icon: ShieldCheck, text: "SLA & dukungan prioritas" },
      { icon: Landmark, text: "Limit API khusus" },
      { icon: Rocket, text: "Onboarding privat" },
    ],
  },
];

const TESTI_STATS = [
  { value: "−38%", label: "pengeluaran tak terduga" },
  { value: "5 → 1", label: "alat jadi satu" },
  { value: "12 jam", label: "hemat per minggu" },
  { value: "100%", label: "transaksi tercatat" },
];

function Price({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const label =
    plan.monthly === null
      ? "Custom"
      : plan.monthly === 0
        ? "Gratis"
        : `Rp ${(yearly ? plan.yearly : plan.monthly).toLocaleString("id-ID")}rb`;
  return (
    <div className="flex items-baseline gap-2 whitespace-nowrap">
      <span
        key={label}
        className="price-anim inline-block text-[clamp(38px,3.6vw,52px)] font-semibold leading-none tracking-[-0.03em] text-slate-900"
      >
        {label}
      </span>
      {plan.monthly !== null && plan.monthly > 0 && (
        <span className="text-[15px] text-slate-400">/bulan</span>
      )}
    </div>
  );
}

export function Pricing() {
  const root = useRef<HTMLElement>(null);
  const [yearly, setYearly] = useState(true);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        ".pr-reveal",
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: ".pr-head", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".pr-card",
        { autoAlpha: 0, y: 70 },
        {
          autoAlpha: 1, y: 0, duration: 1, stagger: 0.14, ease: "power3.out",
          scrollTrigger: { trigger: ".pr-grid", start: "top 82%" },
        }
      );
      gsap.fromTo(
        ".pr-ent",
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".pr-ent", start: "top 88%" },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-white py-[13vh]">
      <style>{`
        @keyframes price-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .price-anim { animation: price-in 0.35s cubic-bezier(0.22,1,0.36,1); }
      `}</style>

      {/* header */}
      <div className="pr-head mx-auto max-w-[820px] px-6 text-center">
        <h2 className="pr-reveal text-[clamp(38px,5vw,64px)] font-semibold leading-[1.08] tracking-[-0.03em] text-slate-900">
          Harga transparan,
          <br />
          tanpa biaya tersembunyi
        </h2>
        <p className="pr-reveal mt-5 text-[17px] text-slate-500">
          Mulai gratis. Naik paket saat tim kamu bertambah. Semua paket berbayar bisa{" "}
          <span className="font-semibold text-slate-800">dicoba 14 hari gratis</span>.
        </p>

        {/* billing toggle */}
        <div className="pr-reveal mt-9 inline-flex rounded-full border border-black/10 bg-black/[0.04] p-1">
          {(["Bulanan", "Tahunan"] as const).map((label) => {
            const active = (label === "Tahunan") === yearly;
            return (
              <button
                key={label}
                onClick={() => setYearly(label === "Tahunan")}
                className={`relative rounded-full px-5 py-2 text-[13px] font-medium transition-colors duration-300 ${
                  active ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 rounded-full bg-white shadow-sm transition-all" style={{ zIndex: 0 }} />
                )}
                <span className="relative z-10">
                  {label}
                  {label === "Tahunan" && (
                    <span className="ml-2 font-semibold text-[#5a58e8]">-20%</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* plan grid */}
      <div className="pr-grid mx-auto mt-[7vh] grid max-w-[1180px] grid-cols-1 gap-6 px-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`pr-card relative flex flex-col rounded-[26px] border p-8 transition-colors duration-500 ${
              p.featured
                ? "border-[#5a58e8]/40 bg-white shadow-[0_24px_80px_-24px_rgba(90,88,232,0.35)]"
                : "border-black/10 bg-white shadow-sm hover:border-black/20"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#5a58e8] px-4 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-white">
                Populer
              </span>
            )}
            <h3 className="text-[22px] font-semibold text-slate-900">{p.name}</h3>
            <p className="mt-2 min-h-[44px] text-[14px] leading-[1.5] text-slate-500">{p.tagline}</p>

            {/* fixed height so the yearly billing note on one card can't push
                its CTA below the others' */}
            <div className="mt-6 min-h-[76px]">
              <Price plan={p} yearly={yearly} />
              {yearly && p.monthly !== null && p.monthly > 0 && (
                <p className="mt-2 text-[12px] text-slate-400">
                  Ditagih Rp {(p.yearly * 12 * 1000).toLocaleString("id-ID")} per tahun
                </p>
              )}
            </div>

            <button
              className={`mt-6 w-full rounded-full py-3.5 text-[14px] font-semibold transition-colors duration-300 ${
                p.featured
                  ? "bg-[#5a58e8] text-white hover:bg-[#6a68f2]"
                  : "border border-black/15 text-slate-800 hover:border-black/35"
              }`}
            >
              {p.cta}
            </button>

            <div className="my-7 border-t border-dashed border-black/10" />

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{p.includes}</p>
            <ul className="mt-5 space-y-4">
              {p.feats.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-[14px] text-slate-600">
                  <f.icon size={17} className={`shrink-0 ${p.featured ? "text-[#5a58e8]" : "text-slate-400"}`} />
                  <span>
                    {f.strong && <span className="font-semibold text-slate-900">{f.strong} </span>}
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* testimonial strip */}
      <div className="pr-ent mx-auto mt-16 max-w-[1180px] px-6">
        <div className="flex flex-col gap-10 rounded-[26px] border border-black/10 bg-black/[0.02] p-8 lg:flex-row lg:items-center lg:p-12">
          <div className="max-w-[560px] shrink-0">
            <p className="text-[20px] font-medium leading-[1.55] tracking-[-0.01em] text-slate-900">
              &ldquo;Sejak pakai MCard, kami berhenti ngejar struk. Tiap tim punya kartunya sendiri,
              batasnya jelas, dan laporan pengeluaran beres otomatis.&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5a58e8] text-[13px] font-bold text-white">
                RA
              </span>
              <div>
                <p className="text-[14px] font-semibold text-slate-900">Rizki Adiwilaga</p>
                <p className="text-[12.5px] text-slate-500">Finance Lead, TugasAI Team</p>
              </div>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-8 lg:pl-10">
            {TESTI_STATS.map((s) => (
              <div key={s.label}>
                <p className="text-[clamp(26px,2.6vw,38px)] font-semibold tracking-[-0.02em] text-slate-900">{s.value}</p>
                <p className="mt-1 text-[13px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
