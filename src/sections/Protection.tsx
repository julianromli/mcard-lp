import { useLayoutEffect, useRef } from "react";
import { gsap, MOTION_OK, MOTION_REDUCED } from "@/lib/motion";
import { Lock } from "lucide-react";

/* ---------------- card visual 1: coverage bars ---------------- */
function CoverageBars() {
  return (
    <div className="relative h-full w-full">
      {/* mcard bar */}
      <div className="absolute bottom-0 left-[13%] flex h-full w-[74px] flex-col items-center justify-end">
        <p className="prot-fade mb-3 text-center text-caption tabular-nums text-slate-500">
          Rp 2 M
          <br />
          MCard
        </p>
        <div
          className="prot-bar-m w-full origin-bottom rounded-[14px] bg-brand shadow-[0_0_70px_6px_rgba(12,82,239,0.30)]"
          style={{ height: "68%" }}
        />
      </div>
      {/* industry bar */}
      <div className="absolute bottom-0 right-[13%] flex h-full w-[74px] flex-col items-center justify-end">
        <p className="prot-fade mb-3 text-center text-caption tabular-nums text-slate-500">
          Rp 100 jt
          <br />
          Standar e-money
        </p>
        <div
          className="prot-bar-i w-full origin-bottom rounded-[14px] border border-black/15 bg-black/[0.04]"
          style={{ height: "9%" }}
        />
      </div>
    </div>
  );
}

/* ---------------- card visual 2: security rings ---------------- */
function SecurityRings() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(12,82,239,0.07),transparent_65%)]" />
      <svg viewBox="0 0 320 320" className="prot-rings h-[86%] w-[86%]">
        <defs>
          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(12,82,239,0.06)" />
            <stop offset="100%" stopColor="rgba(12,82,239,0)" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r="150" fill="none" stroke="rgba(12,82,239,0.14)" strokeWidth="1.5" />
        <circle cx="160" cy="160" r="118" fill="none" stroke="rgba(12,82,239,0.18)" strokeWidth="1.5" />
        <circle cx="160" cy="160" r="88" fill="url(#ringGlow)" stroke="rgba(12,82,239,0.24)" strokeWidth="1.5" />
        <circle cx="160" cy="160" r="60" fill="rgba(12,82,239,0.06)" stroke="rgba(12,82,239,0.32)" strokeWidth="1.5" />
      </svg>
      <div className="prot-lock absolute flex h-11 w-11 items-center justify-center rounded-full bg-brand shadow-[0_8px_24px_rgba(12,82,239,0.4)]">
        <Lock className="h-5 w-5 text-white" strokeWidth={2.2} />
      </div>
    </div>
  );
}

/* ---------------- card visual 3: control toggles ---------------- */
function Toggle({ on, delay }: { on?: boolean; delay: string }) {
  return (
    <div
      className={`prot-toggle relative rounded-full transition-colors ${
        on
          ? "h-[58px] w-[86%] bg-brand shadow-[0_0_50px_4px_rgba(12,82,239,0.30)]"
          : "h-[42px] w-[64%] border border-black/12 bg-black/[0.03] shadow-[inset_0_2px_8px_rgba(15,15,20,0.06)]"
      }`}
      style={{ transitionDelay: delay }}
    >
      <div
        className={`prot-knob absolute rounded-full ${
          on
            ? "right-[7px] top-[7px] h-[44px] w-[44px] bg-white shadow-md"
            : "left-[6px] top-[6px] h-[30px] w-[30px] border border-black/15 bg-white shadow-sm"
        }`}
      />
    </div>
  );
}

function ControlToggles() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[13%] px-8">
      <Toggle delay="0ms" />
      <Toggle delay="120ms" />
      <Toggle on delay="240ms" />
    </div>
  );
}

/* ---------------- section ---------------- */

/* The suffix travels with the value so the markup can render the real figure
   up front. It used to ship a hardcoded "0K+" that only the count-up ever
   corrected, which meant anyone on reduced motion read "0K+ bisnis pakai
   Mayar" — a wrong claim, not just a missing animation.

   Values are width-budgeted. The binding case is a 360px viewport, where the
   two-column grid leaves each cell ~124px and display-lg is at its 38px floor —
   roughly six extrabold characters. Desktop is looser: 204px at 1024, 278px at
   1240. This row used to read "Real-time" here, which measures 301px against a
   278px cell and wrapped to two lines, dropping its label 80px below the other
   three and breaking the baseline the row is built on. Anything longer than
   "150K+" needs measuring before it lands. */
const STATS: { value: number | null; suffix?: string; text?: string; label: string }[] = [
  { value: 150, suffix: "K+", label: "bisnis pakai Mayar" },
  /* A schedule, not a quantity — so it stays value: null and sits out the
     count-up its three neighbours run. The slash is what keeps that from
     reading as an omission. */
  { value: null, text: "24/7", label: "notifikasi tiap transaksi" },
  { value: 100, suffix: "%", label: "transaksi tercatat" },
  { value: 38, suffix: "%", label: "pengeluaran tak terduga berkurang" },
];

const CARDS = [
  {
    visual: <CoverageBars />,
    title: "Saldo terjamin LPS",
    body: "Saldo kamu ditampung di bank partner berlisensi dan dijamin LPS sampai Rp 2 miliar per nasabah. Jauh di atas limit perlindungan kebanyakan dompet digital.",
  },
  {
    visual: <SecurityRings />,
    title: "Keamanan berlapis",
    body: "Proteksi fraud real-time, verifikasi MFA, dan nomor kartu plus CVV yang hanya terlihat setelah verifikasi PIN 6 digit.",
  },
  {
    visual: <ControlToggles />,
    title: "Kontrol di tangan kamu",
    body: "Tentukan siapa yang bisa melihat, memindahkan, atau menarik dana. Lengkap dengan alur persetujuan, kunci kartu, dan izin per anggota tim.",
  },
];

export default function Protection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);

    /* Everything below ships with opacity-0 in the markup so it can rise in.
       Without this branch the whole section — stats, heading, all three cards
       — stayed invisible for anyone who asked for reduced motion. */
    mm.add(MOTION_REDUCED, () => {
      gsap.set(".prot-stat, .prot-subhead, .prot-card", { autoAlpha: 1, y: 0 });
    });

    mm.add(MOTION_OK, () => {
      /* stats: staggered reveal + count-up */
      gsap.fromTo(
        ".prot-stat",
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".prot-stats", start: "top 78%" },
        }
      );
      gsap.fromTo(
        ".prot-divider",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power2.out",
          transformOrigin: "center",
          scrollTrigger: { trigger: ".prot-stats", start: "top 78%" },
        }
      );
      /* Scoped to the section rather than the document: a global query would
         reach into any other instance mounted on the page. */
      root.current?.querySelectorAll<HTMLElement>(".prot-count").forEach((el) => {
        const target = parseFloat(el.dataset.value || "0");
        const suffix = el.dataset.suffix || "";
        const proxy = { v: 0 };
        el.textContent = `0${suffix}`;
        gsap.to(proxy, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: ".prot-stats", start: "top 78%" },
          onUpdate: () => {
            el.textContent = `${Math.round(proxy.v)}${suffix}`;
          },
        });
      });

      /* rule line draws itself */
      gsap.fromTo(
        ".prot-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ".prot-rule", start: "top 85%" },
        }
      );

      /* protection heading */
      gsap.fromTo(
        ".prot-subhead",
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".prot-subhead", start: "top 82%" },
        }
      );

      /* cards rise in, staggered */
      gsap.fromTo(
        ".prot-card",
        { y: 64, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.14,
          ease: "power2.out",
          scrollTrigger: { trigger: ".prot-cards", start: "top 75%" },
        }
      );

      /* inner visuals */
      gsap.fromTo(
        ".prot-bar-m, .prot-bar-i",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: ".prot-cards", start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".prot-rings",
        { scale: 0.72, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: ".prot-cards", start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".prot-lock",
        { autoAlpha: 0, scale: 0.6 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.6,
          delay: 0.5,
          ease: "back.out(2)",
          scrollTrigger: { trigger: ".prot-cards", start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".prot-toggle",
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.14,
          ease: "power2.out",
          scrollTrigger: { trigger: ".prot-cards", start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".prot-fade",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.8,
          delay: 0.4,
          scrollTrigger: { trigger: ".prot-cards", start: "top 70%" },
        }
      );

      /* Gentle continuous drift on the rings for a living feel. It repeats
         forever, so it is tied to the section being on screen — otherwise it
         keeps a layer compositing for the whole life of the page, several
         screens away from anyone who could see it. */
      gsap.to(".prot-rings", {
        rotate: 360,
        duration: 90,
        repeat: -1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause",
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="keamanan" className="relative bg-white px-6 py-[13vh] lg:px-10">
      <div className="mx-auto max-w-[1240px]">
        {/* stats */}
        <div className="prot-stats grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className="relative flex flex-col items-center gap-3 px-4 py-2 text-center">
              {i > 0 && (
                <span className="prot-divider absolute left-0 top-1/2 hidden h-[86px] w-px -translate-y-1/2 bg-black/10 lg:block" />
              )}
              {/* GSAP rewrites these digits every frame of the count-up, so
                  proportional figures would make the number twitch sideways as
                  it climbs. Fixed advance holds it still. */}
              <p className="prot-stat text-display-lg font-extrabold tabular-nums text-slate-900 opacity-0">
                {s.value == null ? (
                  s.text
                ) : (
                  <span className="prot-count" data-value={s.value} data-suffix={s.suffix}>
                    {s.value}
                    {s.suffix}
                  </span>
                )}
              </p>
              <p className="text-pretty text-label text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* rule */}
        <div className="prot-rule mt-[9vh] h-px w-full origin-left bg-black/10" />

        {/* protection */}
        {/* h2, not h3: dropping the old section headline left this as the
            section's own heading, so it can't sit a level below nothing. */}
        <h2 className="prot-subhead mt-[7vh] max-w-[560px] text-balance text-title font-bold text-slate-900 opacity-0">
          Perlindungan yang tidak berhenti di standar minimum.
        </h2>

        <div className="prot-cards mt-10 grid gap-6 md:grid-cols-3">
          {CARDS.map((c) => (
            <div key={c.title} className="prot-card opacity-0">
              <div className="relative aspect-[1/1.02] overflow-hidden rounded-2xl border border-black/[0.07] bg-[linear-gradient(160deg,#f6f6fb_0%,#eef0f7_100%)]">
                {c.visual}
              </div>
              <h3 className="mt-5 text-balance text-body font-semibold text-slate-900">{c.title}</h3>
              <p className="mt-1.5 text-pretty text-body-sm text-slate-500">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
