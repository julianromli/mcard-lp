import { useLayoutEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/motion";

export default function Cta() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        ".cta-reveal",
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative border-t border-black/[0.07] bg-white px-6 pb-[12vh] pt-[15vh]">
      <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
        <h2 className="cta-reveal text-[clamp(32px,3.6vw,48px)] font-medium leading-[1.1] tracking-[-0.02em] text-slate-900">
          Kendalikan pengeluaran bisnismu hari ini
        </h2>
        <p className="cta-reveal mt-4 max-w-[480px] text-[16px] leading-relaxed text-slate-500">
          Gabung bareng 149.969+ bisnis yang sudah pakai Mayar. Tanpa kartu kredit, tanpa kontrak.
        </p>
        <form
          className="cta-reveal mt-9 flex flex-wrap items-center justify-center gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex h-[52px] w-[min(400px,82vw)] items-center rounded-full border border-black/10 bg-black/[0.03] pl-6 pr-1.5">
            <input
              type="email"
              placeholder="Masukkan email kamu"
              className="w-full bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button className="h-[40px] shrink-0 rounded-full bg-[#5a58e8] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#6c6af4]">
              Daftar Gratis
            </button>
          </div>
          <button className="h-[52px] rounded-full border border-black/15 px-6 text-[15px] font-medium text-slate-800 transition-colors hover:bg-black/5">
            Hubungi Sales
          </button>
        </form>
      </div>

    </section>
  );
}
