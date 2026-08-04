import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Single registration point. Previously every section called
   gsap.registerPlugin(ScrollTrigger) at module scope, so the side effect ran
   nine times and each section carried its own copy of the import graph. */
gsap.registerPlugin(ScrollTrigger);

/* Mobile browsers fire resize every time the URL bar collapses or expands, and
   a refresh in the middle of a pinned scrub recomputes the pin against a
   viewport the reader is still scrolling through — the section visibly jumps.
   The hero measures in svh precisely so it does not care about that resize. */
ScrollTrigger.config({ ignoreMobileResize: true });

/* Sections wrap their timelines in gsap.matchMedia() keyed on these queries.
   MOTION_OK guards everything decorative; anything whose absence would leave
   content invisible gets a MOTION_REDUCED branch that snaps to the end state. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";

/* The width below which the hero frames its push-in for a phone: it lands on a
   crop of the dashboard rather than the whole of it, and it asks for a much
   shorter pin. Everything else about the move is shared. */
export const NARROW_MAX = 1023;

export { gsap, ScrollTrigger };
