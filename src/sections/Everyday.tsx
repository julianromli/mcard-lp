import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/motion";
import { FeatureMedia } from "@/components/FeatureMedia";

/* ------------------------------------------------------------------ */
/*  Data — one entry per Figma graphic (feature-1 … feature-6).        */
/*                                                                     */
/*  Ordered as a customer lives it rather than as the frames are       */
/*  numbered: issue the card, put a ceiling on it, watch what it       */
/*  spends, hold that against a budget, pull the report, ask for help. */
/* ------------------------------------------------------------------ */
const ITEMS = [
  {
    title: "Kartu baru siap dalam satu menit",
    desc: "Beri nama, tentukan pemegang dan kategorinya, pasang limitnya. Kartunya langsung aktif untuk belanja online maupun contactless.",
  },
  {
    title: "Batas pengeluaran yang kamu tentukan",
    desc: "Setiap kartu punya limit bulanannya sendiri. Kamu tahu sisanya kapan saja — bukan pas tagihan sudah datang.",
  },
  {
    title: "Seluruh transaksi tercatat lengkap dan rapi",
    desc: "Lengkap dengan nama kartu, merchant, dan tanggalnya. Tidak perlu menunggu tutup buku untuk tahu uang pergi ke mana.",
  },
  {
    title: "Atur seluruh anggaran sesukamu",
    desc: "Transport, software, operasional — masing-masing punya pagunya. Statusnya berubah sebelum pengeluaran lewat batas, bukan sesudah.",
  },
  {
    title: "Seluruh laporan detail dan transparan",
    desc: "Rekap bulanan, kuartalan, per tim, sampai ringkasan pajak — semuanya sudah jadi dalam PDF atau XLSX.",
  },
  {
    title: "Tim support siap bantu 24 Jam",
    desc: "Chat dari dalam aplikasi dan dijawab tim yang paham produknya, bukan balasan otomatis.",
  },
];

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export function Everyday() {
  const root = useRef<HTMLElement>(null);
  const mediaWrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);

    /* Deciding which item is open is state, not motion, so it runs outside
       matchMedia. It used to live under MOTION_OK, which left a reduced-motion
       reader pinned to item 0: five of the six graphics unreachable and their
       descriptions collapsed at 0fr. The transitions this drives are already
       neutralised by the global reduce block in index.css. */
    const triggers = gsap.utils.toArray<HTMLElement>(".ev-item").map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 58%",
        end: "bottom 42%",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      })
    );

    /* The mobile graphics are stacked inline, so the item trigger above fires
       long after they are on screen. They get their own, and it writes the
       attribute straight onto the node — a re-render per card would buy
       nothing, and the same CSS drives both columns. */
    for (const el of gsap.utils.toArray<HTMLElement>(".ev-media-m")) {
      const show = () => el.firstElementChild?.setAttribute("data-reveal", "in");
      /* A card already past the trigger line on load — a deep link, or a
         restored scroll position — would otherwise sit at opacity 0 with no
         entry left to make. */
      if (el.getBoundingClientRect().top < window.innerHeight * 0.82) show();
      else triggers.push(ScrollTrigger.create({ trigger: el, start: "top 82%", once: true, onEnter: show }));
    }

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

    return () => {
      for (const t of triggers) t.kill();
      mm.revert();
    };
  }, []);

  return (
    <section ref={root} id="fitur" className="relative bg-[#fafafc] py-[14vh]">
      {/* header */}
      <div className="ev-head mx-auto max-w-[820px] px-6 text-center">
        <h2 className="ev-reveal text-balance text-display-lg font-extrabold text-slate-900">
          Satu dashboard untuk seluruh urusan keuangan
        </h2>
        <p className="ev-reveal mx-auto mt-5 max-w-[560px] text-pretty text-body-lg text-slate-500">
          Buat kartu, pasang limit pengeluaran, dapatkan report lengkap. Semua dalam satu aplikasi.
        </p>
      </div>

      {/* body */}
      <div className="ev-body mx-auto mt-[9vh] grid max-w-[1200px] grid-cols-1 gap-14 px-6 lg:grid-cols-2 lg:gap-20">
        {/* sticky media stack */}
        <div className="relative order-2 hidden lg:order-1 lg:block">
          <div className="sticky top-[16vh]">
            {/* The graphics are drawn at 536x675 and every dimension inside
                them is a share of that width, so the frame keeps the ratio
                rather than a fixed height.

                The cap is on width, not height: a max-height would leave the
                width alone and squash the ratio, and the create-card modal —
                the tallest of the six — then runs off the bottom edge.
                55.5vh is 70vh x 536/675, so the card is never taller than
                70vh whatever the column can offer. */}
            <div ref={mediaWrap} className="relative mx-auto aspect-[536/675] w-full max-w-[55.5vh]">
              {ITEMS.map((it, i) => (
                <div
                  key={it.title}
                  /* transition-all also tried to interpolate the z-index flip
                     below, which is a discrete property. Name the two that
                     actually move. */
                  className="absolute inset-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    opacity: active === i ? 1 : 0,
                    transform: `scale(${active === i ? 1 : 0.94}) translateY(${active === i ? 0 : 26}px)`,
                    zIndex: active === i ? 2 : 1,
                    pointerEvents: "none",
                  }}
                >
                  <FeatureMedia i={i} reveal={active === i} />
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
              <div className="ev-media-m relative mb-8 aspect-[536/675] lg:hidden">
                <FeatureMedia i={i} />
              </div>
              {/* Inactive headings were slate-300 on #fafafc — about 1.4:1,
                  unreadable rather than de-emphasised. slate-500 clears 4.5:1
                  and still reads a clear step back from the active one. */}
              <h3
                className={`text-balance text-title-lg font-bold transition-colors duration-500 ${
                  active === i ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {it.title}
              </h3>
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ gridTemplateRows: active === i ? "1fr" : "0fr" }}
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
