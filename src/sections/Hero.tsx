import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, MOTION_OK, MOTION_OK_DESKTOP, MOTION_REDUCED } from "@/lib/motion";

const DW = 1600;
const DH = 904;

/* ---- measured geometry of the hero image (3840x2000) ---- */
const IMG_W = 3840;
const IMG_H = 2000;

/* laptop screen rect as fractions of the image (measured, not guessed) */
const SCREEN = {
  left: 0.47760,
  top: 0.69850,
  width: 0.04010,
  height: 0.04350,
};
/* screen center = zoom focal point */
const FOCAL_X = 0.49766;
const FOCAL_Y = 0.72025;

function coverRect(vw: number, vh: number) {
  const s = Math.max(vw / IMG_W, vh / IMG_H);
  const w = IMG_W * s;
  const h = IMG_H * s;
  return { width: w, height: h, left: (vw - w) / 2, top: (vh - h) / 2 };
}

/* zoom factor that brings the laptop screen up to the viewport, whatever the
   cover-fit rect currently is.

   Contain, not cover: the screen and the viewport have different aspect
   ratios, so covering overshot by ~6% of the width and the push-in ended on a
   dashboard whose right column was sliced through the middle of its numbers.
   Fitting it inside — with a margin so it reads as a screen sitting on the
   white stage rather than a full-bleed crop — lands the whole dashboard. */
function zoomFor(vw: number, vh: number) {
  const r = coverRect(vw, vh);
  const screenW = r.width * SCREEN.width;
  const screenH = r.height * SCREEN.height;
  return 0.94 * Math.min(vw / screenW, vh / screenH);
}

/* Scales the fixed dashboard canvas to fill the screen overlay,
   whatever size that overlay currently renders at. */
function ScreenFit({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.05);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setS(el.clientWidth / DW);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="h-full w-full overflow-hidden">
      <div style={{ width: DW, height: DH, transform: `scale(${s})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);

  const zoomRef = useRef(
    typeof window === "undefined" ? 20 : zoomFor(window.innerWidth, window.innerHeight)
  );
  /* end-state translation so the screen lands exactly on the viewport center
     (the focal point itself sits below center in the unzoomed photo) */
  const driftRef = useRef({ x: 0, y: 0 });

  const [stage, setStage] = useState(() =>
    typeof window === "undefined"
      ? { width: 0, height: 0, left: 0, top: 0 }
      : coverRect(window.innerWidth, window.innerHeight)
  );

  /* The dashboard is a 564KB self-contained document for a surface nobody sees
     until the push-in is a fifth of the way through — and one that never runs
     at all below 1024px or under reduced motion. It stays unmounted until the
     scrub actually approaches it. */
  const [mountScreen, setMountScreen] = useState(false);
  const mountedRef = useRef(false);

  useLayoutEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const r = coverRect(vw, vh);
      setStage(r);
      zoomRef.current = zoomFor(vw, vh);
      driftRef.current = {
        x: vw / 2 - (r.left + FOCAL_X * r.width),
        y: vh / 2 - (r.top + FOCAL_Y * r.height),
      };
    };
    measure();

    /* Raw resize events fire far faster than we can usefully re-render, and
       every one of them used to run a full setStage(). Coalesce to one
       measurement per frame, then let ScrollTrigger recompute the pin against
       the new viewport — without the refresh the pin keeps the stale end
       distance and the scrub desyncs after a resize. */
    let frame = 0;
    const onResize = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
        ScrollTrigger.refresh();
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* Chromium bitmap-upscales transformed layers while they move and only
     re-rasters them sharply when their geometry changes, so once scrolling
     settles we nudge the overlay size by half a pixel to force a crisp
     re-raster at the current zoom level */
  useLayoutEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const bump = () => {
      el.style.width = `calc(${SCREEN.width * 100}% + 0.5px)`;
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.width = `${SCREEN.width * 100}%`;
        }, 60);
      });
    };
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(bump, 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);

    /* The screen overlay ships with opacity-0 in the markup, and only the
       desktop scrub below ever reveals it. opacity alone still leaves the
       iframe in the tab order, so on every path that does not run that scrub
       the overlay is taken out of it — autoAlpha writes visibility:hidden. */
    gsap.set(screenRef.current, { autoAlpha: 0 });

    /* The hero copy ships with opacity-0 in the markup so the intro can fade
       it in, which means skipping the animation would leave the headline
       invisible. Readers who ask for reduced motion get the end state applied
       directly: static photo, copy visible, no pin and no 2700px scrub. */
    mm.add(MOTION_REDUCED, () => {
      gsap.set([".hero-copy-el", discRef.current], { autoAlpha: 1, y: 0 });
    });

    mm.add(MOTION_OK, () => {
      /* ---------- intro (plays once on load) ---------- */
      const intro = gsap.timeline({ defaults: { ease: "power2.out" } });
      intro
        .fromTo(introRef.current, { scale: 1.12 }, { scale: 1, duration: 1.7 })
        .fromTo(
          ".hero-copy-el",
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.95, stagger: 0.09 },
          0.3
        )
        .fromTo(discRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 1.0);
    });

    /* ---------- scroll-driven cinematic push-in (desktop only) ---------- */
    mm.add(MOTION_OK_DESKTOP, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=2700",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          /* Both layers are promoted for the length of the scrub and no
             longer: the stage holds a 3840px photo blown up ~20x, which is a
             texture worth releasing the moment the section is behind us. */
          onToggle: (self) => {
            const v = self.isActive ? "transform" : "auto";
            if (stageRef.current) stageRef.current.style.willChange = v;
            if (screenRef.current) screenRef.current.style.willChange = v;
          },
          onUpdate: (self) => {
            if (mountedRef.current || self.progress < 0.08) return;
            mountedRef.current = true;
            setMountScreen(true);
          },
        },
      });

      tl
        // hero copy exits early
        .to(copyRef.current, { autoAlpha: 0, y: -70, duration: 0.15, ease: "power1.in" }, 0)
        /* fromTo, not to: the pill ships with opacity-0 in the markup so the
           intro can fade it in, and a plain .to() records its start value when
           the scrub timeline is built — which is before the intro has run. The
           pill then snapped to invisible on the first pixel of scroll and never
           came back on the way up, because progress 0 rendered the recorded
           zero. immediateRender keeps this from overwriting the intro's fade. */
        .fromTo(
          discRef.current,
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.08, immediateRender: false },
          0
        )
        // camera push toward the laptop screen — the stage carries BOTH the
        // photo and the React dashboard glued onto the screen coordinates
        .fromTo(
          stageRef.current,
          { scale: 1, x: 0, y: 0 },
          {
            scale: () => zoomRef.current,
            x: () => driftRef.current.x,
            y: () => driftRef.current.y,
            duration: 1,
            ease: "power2.inOut",
          },
          0
        )
        // the crisp React dashboard fades in and resolves from a slight blur,
        // reading as the screen "sharpening" while we approach
        .fromTo(
          screenRef.current,
          { autoAlpha: 0, filter: "blur(8px)" },
          { autoAlpha: 1, filter: "blur(0px)", duration: 0.3, ease: "power1.inOut" },
          0.18
        )
        // dark stage fades in behind everything, fully in before the photo leaves
        .fromTo(veilRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power1.inOut" }, 0.32)
        // the photo dims through a cheap overlay (no filter: a blurred layer at
        // this zoom scale exceeds GPU texture limits and renders black), then
        // dissolves slowly so the handoff never reads as a hard cut
        .to(dimRef.current, { autoAlpha: 0.55, duration: 0.35, ease: "power1.inOut" }, 0.3)
        .to(imgRef.current, { autoAlpha: 0, duration: 0.45, ease: "power1.inOut" }, 0.45);
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, []);

  /* svh, not vh: on mobile Safari the collapsing URL bar makes 100vh taller
     than the visible viewport, which pushed the regulatory pill off-screen on
     load. svh is also the stable number ScrollTrigger wants for the pin. */
  return (
    <section ref={root} id="hero" className="relative h-[100svh] overflow-hidden bg-white">
      {/* light stage (behind the world so the dashboard stays crisp on top) */}
      <div ref={veilRef} className="absolute inset-0 bg-white opacity-0" />

      {/* world */}
      <div ref={introRef} className="absolute inset-0">
        {/* photo stage: exactly the cover-fit rect of the image,
            so fractional coordinates map 1:1 onto the photo */}
        <div
          ref={stageRef}
          className="absolute"
          style={{
            width: stage.width,
            height: stage.height,
            left: stage.left,
            top: stage.top,
            transformOrigin: `${FOCAL_X * 100}% ${FOCAL_Y * 100}%`,
          }}
        >
          <img
            ref={imgRef}
            src="/hero-v3.avif"
            alt=""
            draggable={false}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full select-none"
          />

          {/* dimming overlay for the photo dissolve (opacity-only, GPU-cheap) */}
          <div ref={dimRef} className="pointer-events-none absolute inset-0 bg-white opacity-0" />

          {/* the laptop screen: the real MCard dashboard page (self-contained
              HTML) iframed onto the exact screen coordinates of the photo, so it
              rides the same transform and can never drift away mid-scroll */}
          <div
            ref={screenRef}
            /* Shadow values are in photo-space and get multiplied by the ~20x
               zoom, so they are written small on purpose: 0.6px/2px renders as
               a ~12px/40px elevation once the screen fills the stage. The old
               60px blur only looked right because its edges sat off-screen. */
            className="absolute overflow-hidden rounded-[1px] opacity-0 shadow-[0_0.6px_2px_rgba(15,23,42,0.18)]"
            style={{
              left: `${SCREEN.left * 100}%`,
              top: `${SCREEN.top * 100}%`,
              width: `${SCREEN.width * 100}%`,
              height: `${SCREEN.height * 100}%`,
            }}
          >
            <ScreenFit>
              {/* The dashboard is decoration: it needs scripts and nothing else.
                  Omitting allow-same-origin puts it in an opaque origin, so it
                  cannot reach into this document, and the unlisted flags keep it
                  from navigating the top frame, opening popups, or downloading. */}
              {mountScreen && (
                <iframe
                  src="/mcard-dash.html"
                  title="MCard Dashboard"
                  loading="lazy"
                  scrolling="no"
                  sandbox="allow-scripts"
                  className="block h-full w-full border-0"
                />
              )}
            </ScreenFit>
            {/* subtle screen sheen so it blends into the photo */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* hero copy */}
      <div ref={copyRef} className="relative z-20 flex h-full flex-col items-center px-6 pt-[12.5vh]">
        <h1 className="hero-copy-el text-balance text-center text-display-lg font-extrabold text-slate-900 opacity-0">
          Kendali penuh atas pengeluaran bisnismu
        </h1>
        <p className="hero-copy-el mt-5 max-w-[580px] text-pretty text-center text-body-lg text-slate-600 opacity-0">
          Terbitkan kartu virtual tanpa batas, atur anggaran per tim, dan pantau tiap transaksi real-time.
          Semua dari satu dashboard.
        </p>
        <form
          className="hero-copy-el mt-9 flex flex-wrap items-center justify-center gap-3 opacity-0"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* The input keeps outline-none because the ring belongs on the pill
              that reads as the control, not on the bare text box inside it. */}
          <div className="flex h-[56px] w-[min(400px,82vw)] items-center rounded-full border border-black/10 bg-white/75 pl-6 pr-1 shadow-sm backdrop-blur-md transition-colors focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/30">
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

      {/* regulatory pill */}
      <div
        ref={discRef}
        className="absolute bottom-5 left-1/2 z-20 w-[max-content] max-w-[92vw] -translate-x-1/2 text-pretty rounded-xl bg-white/75 px-5 py-2.5 text-center text-caption text-slate-600 opacity-0 shadow-sm backdrop-blur"
      >
        MCard adalah platform spend management dari Mayar, bukan bank. Kartu diterbitkan lewat partner
        berlisensi yang terdaftar dan diawasi.
      </div>
    </section>
  );
}
