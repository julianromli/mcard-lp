/* The wide hero is one camera move over a photograph, and every number that
   aims that camera lives here. None of it touches React: it is arithmetic on a
   measured image, and keeping it separable is what makes it checkable — you can
   read what the camera will do without reading how it is animated.

   Wide only. Below 1024px there is no camera: the phone gets the photograph as
   a plain cover image and the dashboard as a static frame beneath it, so none
   of these measurements are consulted there. */

/* the dashboard document's own layout size, which ScreenFit scales into
   whatever box it is given */
export const DW = 1600;
export const DH = 904;

/* ---- measured geometry of the hero image (3840x2000) ---- */
const IMG_W = 3840;
const IMG_H = 2000;

/* laptop screen rect as fractions of the image (measured, not guessed) */
export const SCREEN = {
  left: 0.4777,
  top: 0.699,
  width: 0.0401,
  height: 0.0435,
};

/* a point on the dashboard, expressed where the camera needs it: as a fraction
   of the photo */
const dashPoint = (x: number, y: number) => ({
  x: SCREEN.left + (x / DW) * SCREEN.width,
  y: SCREEN.top + (y / DH) * SCREEN.height,
});

/* The camera aims at the middle of the laptop screen. */
export const FOCAL = dashPoint(DW / 2, DH / 2);

export function coverRect(vw: number, vh: number) {
  const s = Math.max(vw / IMG_W, vh / IMG_H);
  const w = IMG_W * s;
  const h = IMG_H * s;
  return { width: w, height: h, left: (vw - w) / 2, top: (vh - h) / 2 };
}

export type StageRect = ReturnType<typeof coverRect>;

/* zoom factor that brings the laptop screen up to the viewport, whatever the
   cover-fit rect currently is.

   Contain, not cover. The screen and the viewport have different aspect ratios,
   so covering overshot by ~6% of the width and the push-in ended on a dashboard
   whose right column was sliced through the middle of its numbers. Fitting it
   inside — with a margin so it reads as a screen sitting on the white stage
   rather than a full-bleed crop — lands the whole dashboard. */
export function zoomFor(vw: number, vh: number) {
  const r = coverRect(vw, vh);
  return 0.94 * Math.min(vw / (r.width * SCREEN.width), vh / (r.height * SCREEN.height));
}

/* How far the pin holds. Long and cinematic, which is affordable on a mouse and
   was not on a thumb — the phone is why this number no longer has a narrow
   counterpart. */
export const SCRUB_DISTANCE = 2700;
