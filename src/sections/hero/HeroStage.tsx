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
    setS(el.clientWidth / DW);
    /* contentBoxSize, not clientWidth: the overlay is sized as a percentage of
       the stage, so its layout width is fractional and clientWidth rounds it to
       a whole pixel. On a ~66px overlay that rounding is a 1.5% error in the
       scale, and 1.5% of a dashboard the camera has magnified 16-29x is a jump
       you can see whenever the rounding flips. ResizeObserver reports the
       untransformed box in fractions; getBoundingClientRect would not, because
       it comes back already multiplied by the camera's zoom. */
    const ro = new ResizeObserver(([entry]) => {
      setS((entry.contentBoxSize?.[0]?.inlineSize ?? el.clientWidth) / DW);
    });
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
              from navigating the top frame, opening popups, or downloading.

              pointer-events-none because decoration is all it is. The document
              inside carries a 3D tilt card that rewrites its transform and
              repaints a radial-gradient glare on every mousemove — harmless at
              its own size, but here it is a 1600x904 surface blown up 16-29x,
              so a mouse crossing the hero was repainting the largest layer on
              the page. It also stops the card's cursor:grab from claiming the
              photograph.

              No loading="lazy": the mount below is already deferred to idle on
              purpose, and a second deferral inside the browser only pushes the
              564KB unpack closer to the crossfade that has to look at it.

              The bundle itself carries one edit worth knowing about if it is
              ever regenerated: its sticky header shipped with a
              backdrop-filter:blur(12px), which the camera's zoom turns into a
              per-frame backdrop readback of the largest surface on the page.
              It is an opaque background now. */}
          {mountScreen && (
            <iframe
              src="/mcard-dash.html"
              title="MCard Dashboard"
              scrolling="no"
              sandbox="allow-scripts"
              className="pointer-events-none block h-full w-full border-0"
            />
          )}
        </ScreenFit>
        {/* subtle screen sheen so it blends into the photo */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      </div>
    </div>
  );
}
