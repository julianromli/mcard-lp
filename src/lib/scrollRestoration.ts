import { useLayoutEffect } from "react";
import { ScrollTrigger } from "./motion";

const KEY = "mcard:scroll-y";

/* The hero pin adds 2700px of scroll distance that only exists once GSAP has
   built its spacer, and the browser restores the previous scroll position
   before that happens. The restore therefore gets clamped against the shorter
   pre-pin document and the reader lands hundreds — sometimes thousands — of
   pixels above where they reloaded: a reload at 4800 used to come back at 0.

   So we take the restore over. The position is remembered per tab, and we
   re-apply it after ScrollTrigger has measured the real document height,
   again on window load (the hero photo and the dashboard iframe both move the
   pin), and once more when the layout has settled. Any real input from the
   reader — wheel, touch, key, pointer — cancels the remaining attempts, so we
   can never yank the page out from under someone who started scrolling. */
export function useScrollRestoration() {
  useLayoutEffect(() => {
    if (typeof history === "undefined" || !("scrollRestoration" in history)) return;

    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";

    /* Only a reload (or a history traversal that had to re-render the page)
       should land anywhere but the top. A fresh navigation into the landing
       page is a fresh visit, even when the tab still remembers a position from
       earlier in the session. */
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const resumable = nav?.type === "reload" || nav?.type === "back_forward";

    const target = resumable ? Number(sessionStorage.getItem(KEY) ?? 0) : 0;
    let armed = target > 0;

    const disarm = () => {
      armed = false;
    };

    const restore = () => {
      if (!armed) return;
      ScrollTrigger.refresh();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.min(target, Math.max(max, 0)));
    };

    let frame = 0;
    if (armed) {
      restore();
      frame = requestAnimationFrame(restore);
    }

    /* Late attempt: fonts, the AVIF hero and the lazy dashboard iframe all land
       after first paint and each one can shift the pin distance. */
    const settle = setTimeout(() => {
      restore();
      disarm();
    }, 1200);

    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    inputs.forEach((type) => window.addEventListener(type, disarm, { passive: true }));
    window.addEventListener("load", restore);

    /* Writing on every scroll event would hit sessionStorage a hundred times a
       second, so the write is coalesced to one per frame. */
    let saveFrame = 0;
    const save = () => {
      if (saveFrame) return;
      saveFrame = requestAnimationFrame(() => {
        saveFrame = 0;
        sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
      });
    };
    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("pagehide", save);

    return () => {
      history.scrollRestoration = previous;
      clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
      if (saveFrame) cancelAnimationFrame(saveFrame);
      inputs.forEach((type) => window.removeEventListener(type, disarm));
      window.removeEventListener("load", restore);
      window.removeEventListener("scroll", save);
      window.removeEventListener("pagehide", save);
    };
  }, []);
}
