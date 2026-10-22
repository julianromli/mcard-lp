import type { RefObject } from "react";

/* Everything the scrub fades out on the first pixel of scroll: the headline and
   its form, and the regulatory line. The `hero-copy-el` class is the intro
   timeline's handle on the individual elements — the ref is the scrub's handle
   on the block as a whole. */

export function HeroCopy({ copyRef }: { copyRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={copyRef} className="relative z-20 flex h-full flex-col items-center px-6 pt-[12.5vh]">
      <h1 className="hero-copy-el text-balance text-center text-display-lg font-extrabold text-slate-900 opacity-0">
        Kendali penuh atas pengeluaran bisnismu
      </h1>
      {/* slate-800, not slate-600: this line crosses the volcano silhouette on
          desktop and the dark valley on a phone, where slate-600 measured
          1.77:1 and 2.27:1. Reaching AA by scrim alone would have taken a 58%
          white wash — the photograph would have been gone. Two shades darker
          brings that down to the ~.18 the scrim actually carries. The step down
          from the headline is now size and weight rather than colour. */}
      <p className="hero-copy-el mt-5 max-w-[580px] text-pretty text-center text-body-lg text-slate-800 opacity-0">
        Terbitkan kartu virtual tanpa batas, atur anggaran per tim, dan pantau tiap transaksi real-time.
        Semua dari satu dashboard.
      </p>
      <form
        className="hero-copy-el mt-9 flex flex-wrap items-center justify-center gap-3 opacity-0"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* The input keeps outline-none because the ring belongs on the pill
            that reads as the control, not on the bare text box inside it. */}
        <div className="flex h-[56px] w-[min(400px,82vw)] items-center rounded-full border border-black/10 bg-white/75 pl-6 pr-1 shadow-sm backdrop-blur-md transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand">
          <label htmlFor="hero-email" className="sr-only">
            Alamat email kerja
          </label>
          <input
            id="hero-email"
            type="email"
            autoComplete="email"
            placeholder="nama@perusahaan.com"
            className="w-full bg-transparent text-body text-slate-900 outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="h-[48px] shrink-0 whitespace-nowrap rounded-full bg-brand px-5 text-body-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Daftar Gratis
          </button>
        </div>
        {/* type="button", or it inherits the default and signs the visitor up
            for the newsletter when they ask for a demo. */}
        <button
          type="button"
          className="h-[56px] whitespace-nowrap rounded-full border border-black/15 bg-white/60 px-6 text-body-sm font-semibold text-slate-800 backdrop-blur-md transition-colors hover:bg-black/5"
        >
          Lihat Demo
        </button>
      </form>
    </div>
  );
}

export function HeroDisclosure({ discRef }: { discRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={discRef}
      className="absolute bottom-5 left-1/2 z-20 w-[max-content] max-w-[92vw] -translate-x-1/2 text-pretty rounded-full bg-black/70 px-3.5 py-1 text-center text-caption text-white/90 opacity-0 backdrop-blur"
    >
      MCard adalah platform spend management dari Mayar, bukan bank. Kartu diterbitkan lewat partner
      berlisensi yang terdaftar dan diawasi.
    </div>
  );
}
