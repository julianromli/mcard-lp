import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, MOTION_OK, MOTION_REDUCED, NARROW_MAX } from "@/lib/motion";
import { HeroCopy, HeroDisclosure } from "./hero/HeroCopy";
import HeroStage from "./hero/HeroStage";
import { landedHeight, pushShare, scrubDistance } from "./hero/geometry";
import { useStageGeometry } from "./hero/useStageGeometry";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);

  const { rect, zoomRef, driftRef, fitRef, dockYRef } = useStageGeometry();

  /* The dashboard is a 564KB self-contained document for a surface nobody sees
     until the push-in is a fifth of the way through — and one that never runs
     under reduced motion. It stays unmounted until then. */
  const [mountScreen, setMountScreen] = useState(false);
  const mountedRef = useRef(false);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);

    /* Both the idle scheduler and the scrub want to be the one that mounts the
       dashboard, and whichever gets there first is the right answer. */
    const mountScreenOnce = () => {
      if (mountedRef.current) return;
      mountedRef.current = true;
      setMountScreen(true);
    };

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

      /* Mount the dashboard on the first idle rather than on the scrub reaching
         it. The document unpacks itself — base64 to blobs, 38 @font-face, then
         an icon pass that swaps every <i> for an <svg> — and doing all of that
         at progress 0.08 meant the reflow landed inside the crossfade that is
         busy fading the thing in. Idle mounting moves it into the seconds the
         reader spends on the headline. The scrub's own trigger below stays as
         the fallback for a reader who scrolls before idle ever arrives.

         Cheap for this document either way: with allow-scripts and no
         allow-same-origin the frame is opaque-origin, so the unpack runs in its
         own process, and the hero photo holds fetchPriority high above it.

         requestIdleCallback only reached Safari in 16.4, and the fallback is a
         plain delay rather than an immediate mount: the point is to stay out of
         the intro's way, not merely to be asynchronous. */
      const idle = typeof window.requestIdleCallback === "function";
      const id = idle
        ? window.requestIdleCallback(mountScreenOnce, { timeout: 3000 })
        : window.setTimeout(mountScreenOnce, 1200);
      return () => (idle ? window.cancelIdleCallback(id) : window.clearTimeout(id));
    });

    /* ---------- scroll-driven cinematic push-in ----------

       Two contexts rather than one, because the two framings do not just differ
       in geometry — they differ in when the photo stops being worth looking at.
       A wide viewport lands at ~16x, where the laptop and the desk around it are
       still legible most of the way in. A phone lands at ~29x, and past about a
       third of the move there is nothing left of the photo but bezel: holding it
       on screen after that shows a grey smear, not a room. So the narrow
       crossfade happens sooner and finishes sooner. Splitting the contexts also
       means a tablet rotated across the breakpoint rebuilds the timeline instead
       of keeping the other one's timings. */
    const buildScrub = (narrow: boolean) => {
      /* Blur lives inside the stage, so the transform multiplies it: 6px at 29x
         renders as a 174px wash that reads as a broken frame rather than a lens
         finding focus. Dividing by the zoom asks for the blur we actually want
         to see on screen. */
      const startBlur = () => `blur(${(8 / zoomRef.current).toFixed(4)}px)`;

      const t = narrow
        ? { veil: 0.06, veilDur: 0.2, dash: 0.22, dashDur: 0.28, photo: 0.28, photoDur: 0.26 }
        : { veil: 0.1, veilDur: 0.24, dash: 0.34, dashDur: 0.34, photo: 0.4, photoDur: 0.34 };

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const push = narrow ? pushShare(vw, vh) : 1;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          /* Read at refresh time, not build time: the distance depends on the
             viewport and invalidateOnRefresh re-evaluates it after a rotate. */
          end: () => `+=${scrubDistance(window.innerWidth, window.innerHeight)}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          /* The stage is promoted for the length of the scrub and no longer:
             it holds a 3840px photo blown up ~20x, which is a texture worth
             releasing the moment the section is behind us.

             Only the stage. The screen overlay used to be promoted alongside
             it, which was both pointless and harmful: the overlay has no
             transform of its own — the camera move lives entirely on the stage
             — so the hint reserved nothing, it just split the overlay into its
             own layer that the stage's scale then bitmap-upscaled. That is the
             blur a 0.5px width nudge on scroll-settle used to chase away, and
             the nudge is what made the dashboard shiver: half a pixel of
             layout, multiplied by a 16-29x camera. Unpromoted, the overlay
             rasters with the stage at whatever scale the frame is actually at,
             and there is nothing left to correct. */
          onToggle: (self) => {
            if (stageRef.current) {
              stageRef.current.style.willChange = self.isActive ? "transform" : "auto";
            }
          },
          onUpdate: (self) => {
            if (self.progress >= 0.08) mountScreenOnce();
          },
        },
      });

      tl
        // hero copy exits early
        .to(copyRef.current, { autoAlpha: 0, y: -70, duration: 0.15, ease: "power1.in" }, 0)
        /* The scrim serves the copy, so it leaves with it. Holding it would
           park a white haze across the top of the landed dashboard for the rest
           of the pin — the scrim sits above the stage, and once the photo has
           dissolved the dashboard is the only thing left under it. */
        .to(scrimRef.current, { autoAlpha: 0, duration: 0.15, ease: "power1.in" }, 0)
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
            duration: push,
            ease: "power2.inOut",
          },
          0
        )
        /* Crossfade, not a wash: the photo used to whiten through a dim overlay
           before dissolving, which read as a white flash between two images.
           The dashboard and the photo now swap over one overlapping window.

           ease: "none" on both halves is load-bearing. Two overlapping opacity
           fades on an ease-in-out curve both sit near 50% at the midpoint, and
           the composite goes pale — the same flash, just softer. Linear keeps
           the pair summing to a constant.

           The dashboard also leads the photo by 0.06: at full zoom the photo
           covers nearly the whole viewport, so starting them together leaves a
           thin white gap on the first frames of the handoff. */
        .fromTo(
          screenRef.current,
          { autoAlpha: 0, filter: startBlur },
          { autoAlpha: 1, filter: "blur(0px)", duration: t.dashDur, ease: "none" },
          t.dash
        )
        /* blur(0px) is not the same as no blur: a filter of any value keeps the
           element on the filter render path, so every frame of the pull-back
           after the handoff was still round-tripping the dashboard through a
           blur that does nothing. Dropping it the moment the lens has finished
           focusing hands the rest of the move back to a plain layer. It is a
           timeline .set rather than an onComplete because the scrub runs
           backwards too, and GSAP restores the recorded value on the way up. */
        .set(screenRef.current, { filter: "none" }, t.dash + t.dashDur)
        // white stage settles before the crossfade starts — it is the floor the
        // photo dissolves onto, never a layer on top of it
        .fromTo(
          veilRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: t.veilDur, ease: "power1.inOut" },
          t.veil
        )
        .to(imgRef.current, { autoAlpha: 0, duration: t.photoDur, ease: "none" }, t.photo);

      if (!narrow) return;

      /* The settle: the camera pulls back until the whole dashboard is in frame,
         parked under the nav. It starts on the frame the section below begins
         entering — see pushShare — so the reader sees one continuous movement
         rather than a zoom and then, separately, a panel. */
      tl.to(
        stageRef.current,
        {
          scale: () => fitRef.current,
          y: () => dockYRef.current,
          duration: 1 - push,
          ease: "power2.inOut",
        },
        push
      );

      /* Landed, the frame is 281px tall and the hero is a whole viewport, so
         two thirds of the screen would be white until the reader scrolled it
         away. Pulling the following section up by exactly that difference makes
         it arrive flush under the frame at the moment the pin releases.

         Nothing is animated here on purpose. The section is in normal flow, so
         it is already travelling up at scroll speed; the negative margin only
         changes where it stops. Tweening it as well would move it twice, at two
         different rates, which is what makes stitched sections feel glued rather
         than continuous. It needs the stacking context because the pinned hero
         is position:fixed, and a positioned ancestor paints over a static
         sibling however the document is ordered. */
      const next = root.current?.parentElement?.nextElementSibling;
      if (!(next instanceof HTMLElement)) return;

      const prev = {
        marginTop: next.style.marginTop,
        position: next.style.position,
        zIndex: next.style.zIndex,
      };
      next.style.marginTop = `${Math.round(landedHeight(vw, vh) - vh)}px`;
      next.style.position = "relative";
      next.style.zIndex = "1";

      return () => {
        next.style.marginTop = prev.marginTop;
        next.style.position = prev.position;
        next.style.zIndex = prev.zIndex;
      };
    };

    mm.add(`${MOTION_OK} and (min-width: ${NARROW_MAX + 1}px)`, () => buildScrub(false));
    mm.add(`${MOTION_OK} and (max-width: ${NARROW_MAX}px)`, () => buildScrub(true));

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, [zoomRef, driftRef, fitRef, dockYRef]);

  /* svh, not vh: on mobile Safari the collapsing URL bar makes 100vh taller
     than the visible viewport, which pushed the regulatory pill off-screen on
     load. svh is also the stable number ScrollTrigger wants for the pin. */
  return (
    <section ref={root} id="hero" className="relative h-[100svh] overflow-hidden bg-white">
      {/* light stage (behind the world so the dashboard stays crisp on top) */}
      <div ref={veilRef} className="absolute inset-0 bg-white opacity-0" />

      {/* world */}
      <div ref={introRef} className="absolute inset-0">
        <HeroStage
          rect={rect}
          mountScreen={mountScreen}
          stageRef={stageRef}
          imgRef={imgRef}
          screenRef={screenRef}
        />
      </div>

      {/* Contrast scrim. Deliberately a sibling of the world rather than a child
          of it: inside introRef it would ride the intro's 1.12 scale, and inside
          the stage it would be blown up 16-29x by the push-in. Out here it is a
          fixed pane over a moving photograph. z-10 puts it above the world and
          below the copy — the text it protects must never be behind it.

          No reduced-motion branch on purpose. The fade above lives inside
          buildScrub, which only runs under MOTION_OK; a reader who asks for less
          motion gets no scrub, and the scrim they need simply stays. */}
      <div ref={scrimRef} className="hero-scrim pointer-events-none absolute inset-0 z-10" />

      <HeroCopy copyRef={copyRef} />
      <HeroDisclosure discRef={discRef} />
    </section>
  );
}
