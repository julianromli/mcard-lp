import { useLayoutEffect, useRef, useState } from "react";
import { gsap, MOTION_OK } from "@/lib/motion";
import { Search, Plus, CreditCard, ArrowUpRight, CheckCircle2, BellRing, Users } from "lucide-react";

/* ---------- panel mock data (original demo content) ---------- */

type Row = { name: string; sub?: string; amt: string; dim?: boolean };

const PANELS: Record<string, { title: string; rows: Row[] }> = {
  banking: {
    title: "Akun",
    rows: [
      { name: "Operasional", sub: "Rekening utama", amt: "Rp 187,6 jt" },
      { name: "Deposito", amt: "Rp 3 M" },
      { name: "Ops / Payroll", sub: "Giro ••8799", amt: "Rp 1,2 M" },
      { name: "Hutang Usaha", sub: "Giro ••1987", amt: "Rp 226,8 jt" },
      { name: "Piutang Usaha", sub: "Giro ••4521", amt: "Rp 0", dim: true },
    ],
  },
  cards: {
    title: "Kartu",
    rows: [
      { name: "Marketing · Virtual", sub: "••4419", amt: "Rp 82,1 jt" },
      { name: "Engineering · Virtual", sub: "••9021", amt: "Rp 38,4 jt" },
      { name: "Ops · Fisik", sub: "••1173", amt: "Rp 12 jt" },
      { name: "Travel · Virtual", sub: "••6680", amt: "Rp 7,4 jt" },
    ],
  },
  payments: {
    title: "Pembayaran",
    rows: [
      { name: "Transfer · Acme Corp", sub: "Terkirim hari ini", amt: "-Rp 480 jt" },
      { name: "VA · Lambda Studio", sub: "Diproses", amt: "-Rp 123 jt" },
      { name: "Invoice #1042", sub: "Lunas", amt: "+Rp 98,5 jt" },
      { name: "Transfer · Pemilik Gedung", sub: "Terkirim", amt: "-Rp 64 jt" },
    ],
  },
  accounting: {
    title: "Akuntansi",
    rows: [
      { name: "Payout Stripe", sub: "Pendapatan · kategori otomatis", amt: "+Rp 224,2 jt" },
      { name: "AWS", sub: "Software · kategori otomatis", amt: "-Rp 41 jt" },
      { name: "Figma", sub: "Software · kategori otomatis", amt: "-Rp 4,5 jt" },
      { name: "Sewa Kantor", sub: "Sewa · kategori otomatis", amt: "-Rp 29 jt" },
    ],
  },
};

const FEATURES = [
  {
    id: "kartu",
    panel: "cards",
    title: "Kartu virtual tanpa batas",
    body: "Terbitkan kartu buat tiap tim, vendor, atau langganan dalam hitungan detik. Masing-masing punya identitas dan batasnya sendiri.",
  },
  {
    id: "anggaran",
    panel: "banking",
    title: "Batas & anggaran",
    body: "Tetapkan batas harian atau bulanan per kartu dan per kategori pengeluaran. Begitu lewat batas, transaksi otomatis ketahan.",
  },
  {
    id: "bekukan",
    panel: "cards",
    title: "Bekukan instan",
    body: "Bekukan atau buka blokir kartu kapan aja. Transaksi yang mencurigakan langsung ditolak sebelum sempat kepotong.",
  },
  {
    id: "notif",
    panel: "payments",
    title: "Notifikasi real-time",
    body: "Tiap transaksi langsung muncul notifnya. Kamu selalu tahu siapa belanja apa, kapan, dan di mana, tanpa nunggu rekap akhir bulan.",
  },
  {
    id: "tim",
    panel: "banking",
    title: "Kelola tim",
    body: "Undang anggota tim, atur peran masing-masing, dan tentukan siapa yang bisa terbitkan kartu atau menyetujui pengeluaran.",
  },
  {
    id: "laporan",
    panel: "accounting",
    title: "Laporan otomatis",
    body: "Ekspor laporan pengeluaran, rekap pajak, dan anggaran per tim dalam sekali klik. Nggak ada lagi ngejar struk.",
  },
];

function DotMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-slate-400">
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2.5 2" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function Panel({ panel }: { panel: string }) {
  const p = PANELS[panel];
  return (
    <div
      key={panel}
      className="feat-panel-swap w-full rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_30px_80px_-30px_rgba(15,15,20,0.18)]"
    >
      <div className="mb-4 flex h-9 items-center gap-2 rounded-lg border border-black/[0.07] bg-black/[0.03] px-3 text-[13px] text-slate-400">
        <Search className="h-3.5 w-3.5" /> Cari apa aja
      </div>
      <div className="mb-1 flex items-center gap-2.5">
        <h3 className="text-[22px] font-medium tracking-tight text-slate-900">{p.title}</h3>
      </div>
      <div className="mb-4 flex gap-5 border-b border-black/[0.07] pb-2.5 text-[13px] text-slate-400">
        <span className="border-b border-slate-900 pb-2.5 -mb-[11px] text-slate-900">Ringkasan</span>
        <span>Akun tertaut</span>
        <span>Aturan transfer otomatis</span>
      </div>
      <div className="mb-4 flex items-end gap-8">
        <div>
          <p className="text-[12px] text-slate-400">Saldo tersedia</p>
          <p className="text-[26px] font-medium tracking-tight text-slate-900">
            Rp 77,2<span className="text-slate-400"> M</span>
          </p>
        </div>
        <div>
          <p className="text-[12px] text-slate-400">Deposit tertunda</p>
          <p className="text-[15px] text-slate-700">Rp 15 jt</p>
        </div>
        <div>
          <p className="text-[12px] text-slate-400">Transfer tertunda</p>
          <p className="text-[15px] text-slate-700">Rp 1,1 M</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-b border-black/[0.07] pb-2 text-[11.5px] uppercase tracking-wide text-slate-400">
        <span>Akun</span>
        <span>Saldo</span>
      </div>
      <div>
        {p.rows.map((r) => (
          <div
            key={r.name}
            className={`flex items-center gap-3 border-b border-black/[0.05] py-3.5 ${r.dim ? "opacity-45" : ""}`}
          >
            <DotMark />
            <div className="min-w-0">
              <p className="truncate text-[14.5px] text-slate-800">{r.name}</p>
              {r.sub && <p className="text-[12px] text-slate-400">{r.sub}</p>}
            </div>
            <p className="ml-auto text-[14.5px] text-slate-800">{r.amt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Features() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState("kartu");
  const panel = FEATURES.find((f) => f.id === active)?.panel ?? "banking";

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        ".feat-reveal",
        { y: 44, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.09,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 68%" },
        }
      );
      // gentle parallax on the product panel as the section scrolls
      gsap.fromTo(
        ".feat-panel",
        { y: 110 },
        {
          y: -20,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-white px-6 py-[14vh] lg:px-10">
      <div className="mx-auto grid max-w-[1240px] items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* left */}
        <div className="lg:sticky lg:top-32">
          <h2 className="feat-reveal text-[clamp(32px,3.4vw,46px)] font-medium leading-[1.12] tracking-[-0.02em] text-slate-900">
            Semua yang dibutuhkan tim keuangan.
            <br />
            Satu tempat, tanpa ribet.
          </h2>

          <div className="mt-12">
            {FEATURES.map((f) => {
              const open = active === f.id;
              return (
                <div key={f.id} className="feat-reveal border-t border-black/[0.08] last:border-b">
                  <button
                    onClick={() => setActive(f.id)}
                    className="flex w-full items-center gap-3 py-5 text-left"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        open ? "bg-[#5a58e8]" : "bg-transparent"
                      }`}
                    />
                    <span
                      className={`text-[17px] font-medium transition-colors ${
                        open ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {f.title}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[420px] pb-6 pl-[18px] text-[15px] leading-[1.65] text-slate-500">
                        {f.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <a
            href="#"
            className="feat-reveal mt-9 inline-block text-[16px] font-medium text-slate-900 underline underline-offset-8 decoration-black/30 transition-colors hover:decoration-slate-900"
          >
            Lihat demo
          </a>
        </div>

        {/* right */}
        <div className="feat-panel feat-reveal">
          <Panel panel={panel} />
          <div className="mt-4 flex items-center gap-2 px-1 text-[12.5px] text-slate-400">
            {panel === "payments" && <ArrowUpRight className="h-3.5 w-3.5" />}
            {panel === "accounting" && <CheckCircle2 className="h-3.5 w-3.5" />}
            {panel === "cards" && <CreditCard className="h-3.5 w-3.5" />}
            {panel === "banking" && (active === "tim" ? <Users className="h-3.5 w-3.5" /> : active === "anggaran" ? <BellRing className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />)}
            Mock produk live · rekreasi
          </div>
        </div>
      </div>
    </section>
  );
}
