import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { DH, DW, FOCAL, SCREEN, type StageRect } from "./geometry";

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

/* Chromium bitmap-upscales transformed layers while they move and only
   re-rasters them sharply when their geometry changes, so once scrolling
   settles we nudge the overlay size by half a pixel to force a crisp
   re-raster at the current zoom level */
function useCrispRaster(screenRef: RefObject<HTMLDivElement | null>) {
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
  }, [screenRef]);
}

type Props = {
  rect: StageRect;
  mountScreen: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
  imgRef: RefObject<HTMLImageElement | null>;
  screenRef: RefObject<HTMLDivElement | null>;
};

/* The photograph and the dashboard as one rigid body. Both are positioned in
   fractions of the image, so whatever transform the scrub puts on this element
   moves them together and the dashboard can never slide off the laptop. */
export default function HeroStage({ rect, mountScreen, stageRef, imgRef, screenRef }: Props) {
  useCrispRaster(screenRef);

  return (
    <div
      ref={stageRef}
      className="absolute"
      style={{
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
        transformOrigin: `${FOCAL.x * 100}% ${FOCAL.y * 100}%`,
      }}
    >
      <img
        ref={imgRef}
        src="/mcard-hero.avif"
        alt=""
        draggable={false}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full select-none"
      />

      {/* the laptop screen: the real MCard dashboard page (self-contained
          HTML) iframed onto the exact screen coordinates of the photo, so it
          rides the same transform and can never drift away mid-scroll */}
      <div
        ref={screenRef}
        /* Shadow values are in photo-space and get multiplied by the ~20x
           zoom, so they are written small on purpose: 0.6px/2px renders as
           a ~12px/40px elevation once the screen fills the stage. The old
           60px blur only looked right because its edges sat off-screen. */
        className="absolute overflow-hidden rounded-[0px] opacity-0 shadow-[0_0.6px_2px_rgba(15,23,42,0.18)]"
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
  );
}
