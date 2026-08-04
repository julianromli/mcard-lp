import { useLayoutEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/motion";
import {
  FOCAL,
  NAV_H,
  SCREEN,
  coverRect,
  fitZoomFor,
  zoomFor,
  type StageRect,
} from "./geometry";

/* Measures the camera against the current viewport and keeps it measured.

   The rect is state because the stage element is sized from it; everything else
   is a ref because the scrub timeline reads those lazily, on ScrollTrigger's
   refresh, and re-rendering React for them would be work nobody sees. */
export function useStageGeometry() {
  const zoomRef = useRef(
    typeof window === "undefined" ? 20 : zoomFor(window.innerWidth, window.innerHeight)
  );
  /* end-state translation so the screen lands exactly on the viewport center
     (the focal point itself sits below center in the unzoomed photo) */
  const driftRef = useRef({ x: 0, y: 0 });

  /* the narrow settle: how far to zoom back out, and the extra vertical shift
     that parks the frame under the nav instead of in the middle */
  const fitRef = useRef(6);
  const dockYRef = useRef(0);

  const [rect, setRect] = useState<StageRect>(() =>
    typeof window === "undefined"
      ? { width: 0, height: 0, left: 0, top: 0 }
      : coverRect(window.innerWidth, window.innerHeight)
  );

  useLayoutEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const r = coverRect(vw, vh);
      setRect(r);
      zoomRef.current = zoomFor(vw, vh);

      /* The focal point is fixed in the stage by transform-origin, so scaling
         never moves it — only these translations do. Both are measured from
         where the focal point sits unzoomed. */
      const focalX = r.left + FOCAL.x * r.width;
      const focalY = r.top + FOCAL.y * r.height;
      driftRef.current = { x: vw / 2 - focalX, y: vh / 2 - focalY };

      /* Docked, the screen is a band of known height sitting directly under the
         nav, and the focal point is its centre. */
      const fit = fitZoomFor(vw, vh);
      const fitH = fit * r.height * SCREEN.height;
      fitRef.current = fit;
      dockYRef.current = NAV_H + fitH / 2 - focalY;
    };
    measure();

    /* Raw resize events fire far faster than we can usefully re-render, and
       every one of them used to run a full setRect(). Coalesce to one
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

  return { rect, zoomRef, driftRef, fitRef, dockYRef };
}
