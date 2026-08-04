import { NARROW_MAX } from "@/lib/motion";

/* The whole hero is one camera move over a photograph, and every number that
   aims that camera lives here. None of it touches React: it is arithmetic on a
   measured image, and keeping it separable is what makes it checkable — you can
   read what the camera will do without reading how it is animated. */

/* the dashboard document's own layout size, which ScreenFit scales into the
   laptop's screen rect */
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

/* The camera aims at the middle of the laptop screen at every width. */
export const FOCAL = dashPoint(DW / 2, DH / 2);

/* How far past a full-height fit the narrow push travels before it settles.
   Being briefly inside the dashboard — larger than the phone, cropped on every
   edge — is the point of the move. It is a beat, not a destination. */
const NARROW_OVERSCAN = 1.25;

/* Where the frame lands once the camera pulls back: full width less a hairline
   gutter, docked under the nav. 0.94 is the margin the wide fit already uses. */
export const NAV_H = 72;
const FIT_INSET = 0.94;

export const isNarrow = (vw: number) => vw <= NARROW_MAX;

export function coverRect(vw: number, vh: number) {
  const s = Math.max(vw / IMG_W, vh / IMG_H);
  const w = IMG_W * s;
  const h = IMG_H * s;
  return { width: w, height: h, left: (vw - w) / 2, top: (vh - h) / 2 };
}

export type StageRect = ReturnType<typeof coverRect>;

/* zoom factor that brings the laptop screen up to the viewport, whatever the
   cover-fit rect currently is.

   Wide: contain, not cover. The screen and the viewport have different aspect
   ratios, so covering overshot by ~6% of the width and the push-in ended on a
   dashboard whose right column was sliced through the middle of its numbers.
   Fitting it inside — with a margin so it reads as a screen sitting on the
   white stage rather than a full-bleed crop — lands the whole dashboard.

   Narrow: cover and then some, because this is the deepest point of the move
   rather than where it ends. Containing the 1.77 screen in a phone viewport
   renders the dashboard at 0.23 — 14px type at 3.2px — so arriving there
   directly would cut from a distant laptop to an unreadable thumbnail with
   nothing in between. The push goes past it instead. */
export function zoomFor(vw: number, vh: number) {
  const r = coverRect(vw, vh);
  const screenW = r.width * SCREEN.width;
  const screenH = r.height * SCREEN.height;
  return isNarrow(vw)
    ? NARROW_OVERSCAN * Math.max(vw / screenW, vh / screenH)
    : 0.94 * Math.min(vw / screenW, vh / screenH);
}

/* Where the narrow push settles: the screen exactly as wide as the phone, less
   the gutter. This is the "fit" the crop pulls back to. */
export function fitZoomFor(vw: number, vh: number) {
  const r = coverRect(vw, vh);
  return (FIT_INSET * vw) / (r.width * SCREEN.width);
}

/* height of the docked frame, nav included — the band the following section
   has to sit directly beneath */
export function landedHeight(vw: number, vh: number) {
  return NAV_H + fitZoomFor(vw, vh) * coverRect(vw, vh).height * SCREEN.height;
}

/* Wide viewports get a long, cinematic 2700px push. On a phone that is three
   and a half screens of thumb work with no content underneath it, which reads
   as the page having stalled — Mercury asks for a shade over one and a half. */
export const scrubDistance = (vw: number, vh: number) =>
  isNarrow(vw) ? Math.round(vh * 1.5) : 2700;

/* Share of the narrow scrub spent pushing in, with the rest pulling back to the
   dock. It is derived rather than picked, because the section below is not
   waiting for the camera: it is in normal flow, so it starts entering the
   viewport the moment the pin has less travel left than the height it has to
   climb. Starting the pull-back on that same frame locks the two together and
   they land as one movement. Choosing the split by eye instead had the section
   sliding a hard edge across a dashboard that was still at full crop. */
export const pushShare = (vw: number, vh: number) =>
  1 - (vh - landedHeight(vw, vh)) / scrubDistance(vw, vh);
