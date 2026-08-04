import type { CSSProperties, ReactNode } from "react";
import {
  ArrowDownLeft,
  Briefcase,
  Car,
  CheckCheck,
  ChevronDown,
  Code2,
  Download,
  FileText,
  Headphones,
  PenTool,
  Server,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import { MayarMark, VirtualCard } from "@/components/VirtualCard";
import { DESIGNS, type CardDesign } from "@/lib/card-designs";

/* ------------------------------------------------------------------ */
/*  The six feature graphics from Figma (feature-1 … feature-6,        */
/*  node 31:431). Ported, not screenshotted, so they stay crisp and    */
/*  restyle with the tokens.                                           */
/*                                                                     */
/*  Every frame is 536 × 675, and everything inside is expressed in    */
/*  cqw against that width — 1px = 0.1866cqw. That is what lets the    */
/*  densest card (the create-card modal, 9pt labels at design size)    */
/*  survive a 340px phone column without a second layout: the whole    */
/*  mock scales as one piece. VirtualCard already works this way.      */
/*                                                                     */
/*  The frame's aspect is locked to 536/675 by the call site, so cqw   */
/*  is a valid unit vertically too and the absolute offsets below are  */
/*  the Figma y-coordinates straight across.                           */
/* ------------------------------------------------------------------ */

/* Figma's five-stop panel shadow, minus the two stops that render as
   nothing at this size. */
const PANEL_SHADOW =
  "shadow-[0_3px_7px_rgba(0,0,0,0.1),0_12px_12px_rgba(0,0,0,0.09),0_28px_17px_rgba(0,0,0,0.05)]";

/* The reveal stagger index. Inline custom properties are untyped in React's
   CSSProperties, so the cast lives here once instead of at 40 call sites. */
const fx = (i: number) => ({ "--i": i }) as CSSProperties;

/* Icon-chip tints, straight from Figma. The tint carries no text, so these
   are the only three raw hexes in the file. */
const TINT = {
  brand: "bg-[#eef1ff] text-brand",
  emerald: "bg-[#e5f7ee] text-emerald-700",
  amber: "bg-[#fff6e5] text-amber-700",
} as const;

function Chrome({ reveal, children }: { reveal?: boolean; children: ReactNode }) {
  return (
    /* aria-hidden because the mock data is illustration: the heading and
       description beside it already say what the product does, and the
       sub-9px labels in here would be announced as noise.

       reveal is left undefined by the mobile column, which drives data-reveal
       from a ScrollTrigger instead. React must not render the attribute at
       all in that case, or the next re-render would stomp the trigger's
       value back to "out". */
    <div
      aria-hidden="true"
      data-reveal={reveal === undefined ? undefined : reveal ? "in" : "out"}
      className="@container absolute inset-0 overflow-hidden rounded-[28px] border border-black/[0.07] shadow-[0_40px_90px_-20px_rgba(15,15,20,0.18)]"
    >
      <img
        src="/features/mesh.avif"
        alt=""
        className="absolute inset-0 size-full object-cover"
      />
      <div className="pointer-events-none absolute -top-[18cqw] left-1/2 h-[48cqw] w-[130%] -translate-x-1/2 rounded-full bg-brand/10 blur-[90px]" />
      {/* The mesh and the bloom above are positioned, so they paint over any
          static content no matter how late it appears in the DOM — which hid
          the support card entirely. This wrapper is positioned too and comes
          after them, so a card can lay itself out in normal flow. It is
          exactly Chrome's box, so the absolute offsets in the other five
          still resolve against the same 536 x 675 frame. */}
      <div className="relative size-full">{children}</div>
    </div>
  );
}

function Panel({
  i = 0,
  className = "",
  children,
}: {
  i?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`ev-fx absolute border border-[rgba(14,15,26,0.08)] bg-white ${PANEL_SHADOW} ${className}`}
      style={fx(i)}
    >
      {children}
    </div>
  );
}

/* The fill sits inside a percentage-width mask and wipes in from the left
   (see .ev-meter in index.css), so the bar's right cap stays a half-circle
   for the whole 800ms instead of stretching. */
function Meter({ pct, fill, i = 0 }: { pct: number; fill: string; i?: number }) {
  return (
    <div
      className="ev-meter h-[1.7cqw] overflow-hidden rounded-full bg-black/[0.06]"
      style={fx(i)}
    >
      <div className="h-full overflow-hidden rounded-full" style={{ width: `${pct}%` }}>
        <div className={`h-full w-full rounded-full ${fill}`} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1 · Buat kartu virtual  (Figma feature-3, 40:66)                   */
/* ------------------------------------------------------------------ */

/* The modal's card preview is 315 × 110 — a different shape from the real
   VirtualCard's 420 × 264, with no EMV chip and a VIRTUAL label where the
   contactless glyph sits. It borrows the gradients and the mark rather
   than growing a variant onto a component with different geometry. */
function CardPreview() {
  return (
    <div className="@container relative h-[20.5cqw] w-full overflow-hidden rounded-[1.9cqw]" style={{ background: DESIGNS.midnight }}>
      <div className="pointer-events-none absolute -bottom-[10cqw] right-[6cqw] w-[38cqw] opacity-90">
        <MayarMark fill="rgba(255,255,255,0.10)" accent="rgba(255,255,255,0.13)" />
      </div>
      <div className="relative flex h-full flex-col justify-between p-[3.7cqw]">
        <div className="flex items-start justify-between">
          <div className="w-[4.8cqw]">
            <MayarMark fill="#fff" accent="#E91E78" />
          </div>
          <p className="text-[2cqw] font-bold tracking-[0.14em] text-white/55">VIRTUAL</p>
        </div>
        <div>
          <p className="text-[3cqw] font-semibold text-white">Meta Ads</p>
          <p className="mt-[0.9cqw] whitespace-nowrap font-mono text-[3.2cqw] tracking-[0.10em] text-white/90">
            •••• •••• •••• ••••
          </p>
          <div className="mt-[1.8cqw]">
            <p className="text-[1.8cqw] font-semibold tracking-[0.12em] text-white/50">PEMEGANG KARTU</p>
            <p className="text-[2.8cqw] font-semibold tracking-[0.03em] text-white">SARI DEWI</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const FIELD =
  "flex h-[5.2cqw] items-center rounded-[1.35cqw] border border-[rgba(14,15,26,0.14)] bg-white px-[1.6cqw]";
const FIELD_LABEL = "text-[1.62cqw] font-semibold text-slate-500";

/* Nine faces, laid out 5 + 4 exactly as the designer grouped them. */
const SWATCHES: CardDesign[] = [
  "midnight",
  "royal",
  "magenta",
  "emerald",
  "graphite",
  "silver",
  "chroma",
  "gold",
  "matrix",
];

function Toggle({ label, i }: { label: string; i: number }) {
  return (
    <div className="flex items-center justify-between rounded-[1.35cqw] border border-[rgba(14,15,26,0.1)] px-[1.76cqw] py-[1.49cqw]">
      <p className="text-[1.76cqw] font-semibold text-slate-700">{label}</p>
      <div className="ev-fx ev-fx-pop relative h-[3.24cqw] w-[5.67cqw] rounded-full bg-[#1fb36b]" style={fx(i)}>
        <div className="absolute right-[0.4cqw] top-1/2 size-[2.43cqw] -translate-y-1/2 rounded-full bg-white shadow-[0_0.15cqw_0.3cqw_rgba(0,0,0,0.25)]" />
      </div>
    </div>
  );
}

function CreateCard() {
  return (
    <div
      className={`ev-fx absolute left-[17.4cqw] top-[10.3cqw] flex w-[64.8cqw] flex-col overflow-hidden rounded-[4.1cqw] bg-white ${PANEL_SHADOW}`}
      style={fx(0)}
    >
      <div className="flex items-center justify-between border-b border-[rgba(14,15,26,0.06)] px-[2.97cqw] py-[2.43cqw]">
        <p className="text-[2.16cqw] font-bold text-slate-900">Buat Kartu Virtual</p>
        <X className="h-[2.7cqw] w-[2.7cqw] text-slate-500" strokeWidth={2} />
      </div>

      <div className="flex flex-col gap-[2.16cqw] p-[2.97cqw]">
        <div className="ev-fx ev-fx-row" style={fx(1)}>
          <CardPreview />
        </div>

        <div className="ev-fx ev-fx-row flex flex-col gap-[0.8cqw]" style={fx(2)}>
          <p className={FIELD_LABEL}>Nama Kartu</p>
          <div className={FIELD}>
            <p className="text-[1.89cqw] text-slate-900">Meta Ads</p>
          </div>
        </div>

        <div className="ev-fx ev-fx-row grid grid-cols-2 gap-[1.89cqw]" style={fx(3)}>
          {["Pemegang Kartu", "Kategori"].map((label) => (
            <div key={label} className="flex flex-col gap-[0.8cqw]">
              <p className={FIELD_LABEL}>{label}</p>
              <div className={`${FIELD} justify-end`}>
                <ChevronDown className="h-[1.7cqw] w-[1.7cqw] text-slate-500" strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>

        <div className="ev-fx ev-fx-row flex flex-col gap-[0.8cqw]" style={fx(4)}>
          <p className={FIELD_LABEL}>Batas Pengeluaran Bulanan</p>
          <div className={`${FIELD} justify-end`}>
            <ChevronDown className="h-[1.7cqw] w-[1.7cqw] text-slate-500" strokeWidth={2.5} />
          </div>
        </div>

        <div className="ev-fx ev-fx-row flex flex-col gap-[1.1cqw]" style={fx(5)}>
          <p className={FIELD_LABEL}>Desain Kartu</p>
          <div className="grid grid-cols-5 gap-[1.35cqw]">
            {SWATCHES.map((name) => (
              <div key={name} className="flex flex-col items-center gap-[0.7cqw]">
                <div
                  className="h-[5.4cqw] w-full rounded-[1.21cqw] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
                  style={{ background: DESIGNS[name] }}
                />
                <p className="text-[1.35cqw] capitalize text-slate-500">{name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ev-fx ev-fx-row grid grid-cols-2 gap-[1.89cqw]" style={fx(6)}>
          {/* Indices continue past the rows above so the switches read as the
              last thing to settle, after the row that holds them lands. */}
          <Toggle label="Online" i={9} />
          <Toggle label="Contactless" i={10} />
        </div>
      </div>

      <div className="ev-fx ev-fx-row flex gap-[1.62cqw] border-t border-[rgba(14,15,26,0.06)] px-[2.97cqw] py-[2.16cqw]" style={fx(7)}>
        <p className="flex-1 rounded-[1.35cqw] border border-[rgba(14,15,26,0.14)] py-[1.5cqw] text-center text-[1.89cqw] font-semibold text-slate-700">
          Batal
        </p>
        <p className="flex-1 rounded-[1.35cqw] bg-brand py-[1.5cqw] text-center text-[1.89cqw] font-bold text-white">
          Buat Kartu
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2 · Batas pengeluaran  (Figma feature-2, 40:2)                     */
/* ------------------------------------------------------------------ */
function SpendLimit() {
  return (
    <>
      <div className="ev-fx absolute left-[6cqw] top-[21.9cqw] w-[87.5cqw]" style={fx(0)}>
        <VirtualCard holder="SARI WIJAYA" last4="4477" exp="12/29" />
      </div>

      <Panel
        i={1}
        className="left-[6cqw] top-[82.5cqw] w-[87.5cqw] rounded-[4.1cqw] px-[3.7cqw] py-[3.4cqw]"
      >
        <div className="flex items-center justify-between">
          <p className="text-[2.43cqw] font-semibold text-slate-700">Batas Pengeluaran Bulanan</p>
          <p className="text-[2.24cqw] font-bold tabular-nums text-brand">68% terpakai</p>
        </div>
        <div className="pt-[2.6cqw]">
          <Meter pct={68} fill="bg-brand" i={1} />
        </div>
        <div className="flex items-end justify-between pt-[2.24cqw]">
          <p className="text-[3.7cqw] font-bold tabular-nums tracking-[-0.01em] text-slate-900">
            Rp 6.840.000
            <span className="text-[2.43cqw] font-normal text-slate-500"> / Rp 10.000.000</span>
          </p>
          <p className="text-[2.24cqw] tabular-nums text-slate-500">Sisa Rp 3.160.000</p>
        </div>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  3 · Transaksi terakhir  (Figma feature-1, 40:122)                  */
/* ------------------------------------------------------------------ */
const TRANSACTIONS = [
  { icon: Server, tint: TINT.brand, name: "Amazon Web Services", meta: "Kartu Operasional · 29 Jun 2026", amount: "– Rp 1.240.000", credit: false },
  { icon: ShoppingBag, tint: TINT.amber, name: "Tokopedia", meta: "Kartu Operasional · 28 Jun 2026", amount: "– Rp 450.000", credit: false },
  { icon: PenTool, tint: TINT.brand, name: "Figma", meta: "Kartu Langganan · 27 Jun 2026", amount: "– Rp 225.000", credit: false },
  { icon: ArrowDownLeft, tint: TINT.emerald, name: "Top-up Saldo Kartu", meta: "Kartu Operasional · 27 Jun 2026", amount: "+ Rp 5.000.000", credit: true },
  { icon: Car, tint: TINT.emerald, name: "Gojek", meta: "Kartu Operasional · 26 Jun 2026", amount: "– Rp 38.000", credit: false },
];

function Transactions() {
  return (
    <Panel
      i={0}
      className="left-[6cqw] top-[33.5cqw] w-[88cqw] overflow-hidden rounded-[2.6cqw]"
    >
      <div className="flex items-center justify-between border-b border-[rgba(14,15,26,0.06)] px-[3.27cqw] py-[2.62cqw]">
        <p className="text-[2.46cqw] font-bold text-slate-900">Transaksi Terakhir</p>
        <p className="text-[1.96cqw] font-semibold text-brand">Lihat semua →</p>
      </div>
      {TRANSACTIONS.map((t, n) => (
        <div
          key={t.name}
          className="ev-fx ev-fx-row flex items-center gap-[2.13cqw] border-b border-[rgba(14,15,26,0.05)] px-[3.27cqw] py-[1.96cqw] last:border-0"
          style={fx(n)}
        >
          <div className={`flex size-[5.9cqw] shrink-0 items-center justify-center rounded-[1.64cqw] ${t.tint}`}>
            <t.icon className="h-[2.78cqw] w-[2.78cqw]" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[2.29cqw] font-semibold text-slate-900">{t.name}</p>
            <p className="truncate text-[1.96cqw] text-slate-500">{t.meta}</p>
          </div>
          {/* Amounts stack in a column and are read against each other, so the
              digits have to share one advance width. */}
          <p
            className={`shrink-0 text-[2.29cqw] font-bold tabular-nums ${
              t.credit ? "text-emerald-700" : "text-slate-900"
            }`}
          >
            {t.amount}
          </p>
        </div>
      ))}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  4 · Anggaran per kategori  (Figma feature-4, 40:100)               */
/* ------------------------------------------------------------------ */

/* Figma paints the percentage and the "Sesuai rencana" label in the same
   colour as the bar. At #1fb36b that is 2.5:1 on white and 2.4:1 on its own
   #e5f7ee pill; #f4a52a is 2.0:1. The fills keep the designed hue — they
   carry no text — and the type steps down to emerald-700 (5.9:1) and
   amber-700 (4.9:1), which is the nearest reading that clears AA. */
const BUDGETS = [
  {
    icon: Truck, tint: TINT.emerald, name: "Transport & Logistik",
    spent: "Rp 760.000", cap: " / Rp 1.500.000", pct: 51,
    fill: "bg-[#1fb36b]", text: "text-emerald-700",
    pos: "left-[6.2cqw] top-[20cqw]",
  },
  {
    icon: Code2, tint: TINT.brand, name: "Software & Langganan",
    spent: "Rp 3.200.000", cap: " / Rp 4.000.000", pct: 80,
    fill: "bg-brand", text: "text-brand",
    pos: "left-[26.8cqw] top-[50.6cqw]",
  },
  {
    icon: Briefcase, tint: TINT.amber, name: "Operasional",
    spent: "Rp 1.850.000", cap: " / Rp 3.000.000", pct: 62,
    fill: "bg-[#f4a52a]", text: "text-amber-700",
    pos: "left-[6.2cqw] top-[81.2cqw]",
  },
];

function Budgets() {
  return (
    <>
      {BUDGETS.map((b, n) => (
        <Panel
          key={b.name}
          i={n}
          className={`${b.pos} w-[66.9cqw] rounded-[3cqw] px-[3.7cqw] py-[3.4cqw]`}
        >
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-[2.05cqw]">
              <div className={`flex size-[7.1cqw] shrink-0 items-center justify-center rounded-[1.87cqw] ${b.tint}`}>
                <b.icon className="h-[3.54cqw] w-[3.54cqw]" strokeWidth={2} />
              </div>
              <p className="truncate text-[2.61cqw] font-semibold text-slate-900">{b.name}</p>
            </div>
            <p
              className="ev-fx ev-fx-pop shrink-0 rounded-full bg-[#e5f7ee] px-[1.68cqw] py-[0.56cqw] text-[2.05cqw] font-semibold text-emerald-700"
              style={fx(n)}
            >
              Sesuai rencana
            </p>
          </div>
          <div className="pt-[2.6cqw]">
            <Meter pct={b.pct} fill={b.fill} i={n} />
          </div>
          <div className="flex items-end justify-between pt-[2.24cqw]">
            <p className="text-[3.36cqw] font-bold tabular-nums tracking-[-0.01em] text-slate-900">
              {b.spent}
              <span className="text-[2.24cqw] font-normal text-slate-500">{b.cap}</span>
            </p>
            <p className={`text-[2.24cqw] font-bold tabular-nums ${b.text}`}>{b.pct}%</p>
          </div>
        </Panel>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  5 · Laporan tersedia  (Figma feature-5, 41:1178)                   */
/* ------------------------------------------------------------------ */
const REPORTS = [
  { name: "Laporan Pengeluaran Juni 2026", meta: "PDF · 240 KB · dibuat 29 Jun 2026" },
  { name: "Rekap Transaksi Kuartal 2", meta: "XLSX · 1.2 MB · dibuat 1 Jul 2026" },
  { name: "Laporan Anggaran per Tim", meta: "PDF · 180 KB · dibuat 28 Jun 2026" },
  { name: "Ringkasan Pajak (PPN)", meta: "PDF · 320 KB · dibuat 25 Jun 2026" },
];

function Reports() {
  return (
    /* The panel is wider than the frame and runs off the right edge — that
       overhang is the designed composition, not a bug, and the frame's
       overflow-hidden is what crops it. */
    <Panel
      i={0}
      className="left-[13.3cqw] top-[29cqw] w-[89.8cqw] overflow-hidden rounded-[3.3cqw]"
    >
      <div className="border-b border-[rgba(14,15,26,0.06)] px-[4.15cqw] py-[3.3cqw]">
        <p className="text-[3.1cqw] font-bold text-slate-900">Laporan Tersedia</p>
      </div>
      {REPORTS.map((r, n) => (
        <div
          key={r.name}
          className="ev-fx ev-fx-row flex items-center gap-[2.9cqw] border-b border-[rgba(14,15,26,0.05)] px-[4.15cqw] py-[2.9cqw] last:border-0"
          style={fx(n)}
        >
          <div className={`flex size-[8.3cqw] shrink-0 items-center justify-center rounded-[2.07cqw] ${TINT.brand}`}>
            <FileText className="h-[3.94cqw] w-[3.94cqw]" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[2.9cqw] font-semibold text-slate-900">{r.name}</p>
            <p className="truncate text-[2.49cqw] text-slate-500">{r.meta}</p>
          </div>
          <div className="flex shrink-0 items-center gap-[1.24cqw] rounded-[1.66cqw] bg-[#eef1ff] px-[2.69cqw] py-[1.66cqw]">
            <Download className="h-[2.9cqw] w-[2.9cqw] text-brand" strokeWidth={2} />
            <p className="text-[2.49cqw] font-semibold text-brand">Unduh</p>
          </div>
        </div>
      ))}
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/*  6 · Support  (Figma feature-6, 42:1905)                            */
/* ------------------------------------------------------------------ */
function Support() {
  return (
    <div className="flex h-full flex-col justify-center gap-[2.6cqw] p-[6.7cqw]">
      <div className="ev-fx flex items-center gap-[2.24cqw]" style={fx(0)}>
        <div className="relative shrink-0">
          <div className="flex size-[8.2cqw] items-center justify-center rounded-full bg-brand">
            <Headphones className="h-[3.36cqw] w-[3.36cqw] text-white" strokeWidth={2} />
          </div>
          {/* The green word below says "online"; this says it at a glance,
              which is how every support widget carries that state. */}
          <span className="absolute bottom-0 right-0 size-[2.8cqw] rounded-full border-[0.6cqw] border-white bg-emerald-500" />
        </div>
        <div>
          <p className="text-[2.61cqw] font-semibold text-slate-900">Support Mayar</p>
          {/* Both status lines share one grid cell so the wider of the two
              fixes the width, and the swap to "sedang mengetik…" cannot
              nudge the header while it plays. */}
          <div className="grid text-[2.24cqw]">
            {/* Figma's #096 is 3.0:1 on this mesh; emerald-700 clears AA and
                still reads as the "online" green. */}
            <p className="ev-chat-status col-start-1 row-start-1 text-emerald-700">
              Online · rata-rata balas 2 menit
            </p>
            <p className="ev-chat-status-typing col-start-1 row-start-1 text-brand">
              sedang mengetik…
            </p>
          </div>
        </div>
      </div>

      {/* The customer speaks first and speaks from the right: the filled
          bubble is always the reader's own voice, and the tail corner has to
          agree with it. This pair used to run the other way round, which read
          as the brand asking the question and the customer answering it. */}
      <div className="flex flex-col items-end gap-[1cqw]">
        <div className="ev-chat-sent max-w-[76cqw] text-pretty rounded-[3cqw] rounded-br-[1.1cqw] bg-brand px-[3cqw] py-[2.24cqw] text-[2.43cqw] text-white">
          Kartu tim saya ditolak waktu bayar software tadi pagi. Bisa dibantu cek?
        </div>
        <p className="ev-chat-receipt flex items-center gap-[0.9cqw] pr-[1.5cqw] text-[2.05cqw] tabular-nums text-slate-500">
          09.41
          <CheckCheck className="ev-chat-check size-[2.4cqw]" strokeWidth={2.5} />
        </p>
      </div>

      {/* The dots and the reply they become share one grid cell, so the
          frame keeps its height for the whole sequence. This column is
          vertically centred: a bubble that grew into place would recentre
          the entire card underneath the animation. */}
      <div className="flex flex-col gap-[1cqw]">
        <div className="flex items-end gap-[1.7cqw]">
          <div className="ev-chat-agent flex size-[5.4cqw] shrink-0 items-center justify-center rounded-full bg-brand">
            <Headphones className="h-[2.6cqw] w-[2.6cqw] text-white" strokeWidth={2} />
          </div>
          <div className="grid min-w-0">
            <div className="ev-chat-typing col-start-1 row-start-1 flex items-center gap-[1.1cqw] self-end justify-self-start rounded-[3cqw] rounded-bl-[1.1cqw] border border-black/[0.07] bg-white px-[2.8cqw] py-[2.4cqw] shadow-[0_1px_1.5px_rgba(0,0,0,0.1)]">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="ev-chat-dot size-[1.5cqw] rounded-full bg-slate-400"
                  style={fx(d)}
                />
              ))}
            </div>
            {/* justify-self, or the grid's default stretch would blow the
                bubble out to the full column instead of letting it hug the
                text the way the other one does. */}
            <div className="ev-chat-msg col-start-1 row-start-1 max-w-[70cqw] justify-self-start text-pretty rounded-[3cqw] rounded-bl-[1.1cqw] border border-black/[0.07] bg-white px-[3cqw] py-[2.24cqw] text-[2.43cqw] text-slate-700 shadow-[0_1px_1.5px_rgba(0,0,0,0.1)]">
              Sudah saya cek, limit bulanan kartunya habis. Saya naikkan sekarang ya, kartunya langsung bisa dipakai lagi.
            </div>
          </div>
        </div>
        {/* Indented past the avatar and its gap so it hangs under the
            bubble, not under the agent. */}
        <p className="ev-chat-stamp pl-[8.6cqw] text-[2.05cqw] tabular-nums text-slate-500">
          09.42
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const CARDS = [CreateCard, SpendLimit, Transactions, Budgets, Reports, Support];

export function FeatureMedia({ i, reveal }: { i: number; reveal?: boolean }) {
  const Card = CARDS[i];
  return (
    <Chrome reveal={reveal}>
      <Card />
    </Chrome>
  );
}
