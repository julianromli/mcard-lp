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

export { gsap, ScrollTrigger };
