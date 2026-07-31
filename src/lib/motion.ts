import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Single registration point. Previously every section called
   gsap.registerPlugin(ScrollTrigger) at module scope, so the side effect ran
   nine times and each section carried its own copy of the import graph. */
gsap.registerPlugin(ScrollTrigger);

/* Sections wrap their timelines in gsap.matchMedia() keyed on these queries.
   MOTION_OK guards everything decorative; anything whose absence would leave
   content invisible gets a MOTION_REDUCED branch that snaps to the end state. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";

/* The hero's pinned scrub is a 2700px camera push over a 3840px photo and a
   live iframe. That is a desktop effect: on a phone it reads as a long stretch
   of dead scroll and costs a zoom no mobile GPU should be asked for, so the
   pin is gated on width as well as motion preference. */
export const MOTION_OK_DESKTOP =
  "(prefers-reduced-motion: no-preference) and (min-width: 1024px)";

export { gsap, ScrollTrigger };
