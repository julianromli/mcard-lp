import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, MOTION_OK, MOTION_REDUCED, NARROW_MAX } from "@/lib/motion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { HeroCopy, HeroDisclosure } from "./hero/HeroCopy";
import HeroStage from "./hero/HeroStage";
import { SCRUB_DISTANCE } from "./hero/geometry";
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

  /* The fork: below 1024px the hero is a photograph and nothing else — the
     reader scrolls past it straight into the next section. Above, it is a
     camera move into the laptop in that photograph, with the real dashboard
     glued to its screen. The two mount different DOM, so the decision has to be
     made in React rather than in CSS — see useMediaQuery. */
  const narrow = useMediaQuery(`(max-width: ${NARROW_MAX}px)`);

  const { rect, zoomRef, driftRef } = useStageGeometry(!narrow);

  /* The dashboard is a 564KB self-contained document, and it belongs to the
     wide hero alone: nothing below 1024px ever renders it, so nothing below
     1024px ever fetches it either. */
  const [mountScreen, setMountScreen] = useState(false);
  const mountedRef = useRef(false);
  const mountScreenOnce = useCallback(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    setMountScreen(true);
  }, []);

  /* The intro is deliberately its own effect with no dependencies. Folding it
     into the scrub effect below would key it on `narrow`, and then dragging a
     desktop window across 1024px would revert the context and replay a 1.7s
     fade-in on a headline the reader has been looking at for a minute. */
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);

    /* The hero copy ships with opacity-0 in the markup so the intro can fade
       it in, which means skipping the animation would leave the headline
       invisible. Readers who ask for reduced motion get the end state applied
       directly: static photo, copy visible, no pin and no scrub. */
    mm.add(MOTION_REDUCED, () => {
      gsap.set([".hero-copy-el", discRef.current], { autoAlpha: 1, y: 0 });
    });

    mm.add(MOTION_OK, () => {
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
    });

    /* The AVIF and the dashboard iframe both land after first paint, and both
       move what sits below them — every section's trigger wants remeasuring
       once they have, whether or not the hero itself pins. */
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, []);

  /* ---------- scroll-driven cinematic push-in (wide only) ---------- */
  useLayoutEffect(() => {
    if (narrow) return;

    const mm = gsap.matchMedia(root);

    /* The screen overlay ships with opacity-0 in the markup, and only the scrub
       below ever reveals it. opacity alone still leaves the iframe in the tab
       order, so on the path that does not run that scrub — a desktop reader who
       asks for reduced motion — the overlay is taken out of it as well:
       autoAlpha writes visibility:hidden. */
    if (screenRef.current) gsap.set(screenRef.current, { autoAlpha: 0 });

    mm.add(`${MOTION_OK} and (min-width: ${NARROW_MAX + 1}px)`, () => {
      /* Mount the dashboard on the first idle rather than on the scrub
         reaching it. The document unpacks itself — base64 to blobs, 38
         @font-face, then an icon pass that swaps every <i> for an <svg> — and
         doing all of that at progress 0.08 meant the reflow landed inside the
         crossfade that is busy fading the thing in. Idle mounting moves it
         into the seconds the reader spends on the headline. The scrub's own
         trigger below stays as the fallback for a reader who scrolls before
         idle ever arrives.

         Cheap for this document either way: with allow-scripts and no
         allow-same-origin the frame is opaque-origin, so the unpack runs in
         its own process, and the hero photo holds fetchPriority high above it.

         requestIdleCallback only reached Safari in 16.4, and the fallback is a
         plain delay rather than an immediate mount: the point is to stay out
         of the intro's way, not merely to be asynchronous. */
      const idle = typeof window.requestIdleCallback === "function";
      const id = idle
        ? window.requestIdleCallback(mountScreenOnce, { timeout: 3000 })
        : window.setTimeout(mountScreenOnce, 1200);

      /* Blur lives inside the stage, so the transform multiplies it: 8px at
         16x renders as a wash that reads as a broken frame rather than a lens
         finding focus. Dividing by the zoom asks for the blur we actually want
         to see on screen. */
      const startBlur = () => `blur(${(8 / zoomRef.current).toFixed(4)}px)`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${SCRUB_DISTANCE}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          /* The stage is promoted for the length of the scrub and no longer:
             it holds a 3840px photo blown up ~16x, which is a texture worth
             releasing the moment the section is behind us.

             Only the stage. The screen overlay used to be promoted alongside
             it, which was both pointless and harmful: the overlay has no
             transform of its own — the camera move lives entirely on the
             stage — so the hint reserved nothing, it just split the overlay
             into its own layer that the stage's scale then bitmap-upscaled.
             That is the blur a 0.5px width nudge on scroll-settle used to
             chase away, and the nudge is what made the dashboard shiver: half
             a pixel of layout, multiplied by a 16x camera. Unpromoted, the
             overlay rasters with the stage at whatever scale the frame is
             actually at, and there is nothing left to correct. */
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
           park a white haze across the top of the landed dashboard for the
           rest of the pin — the scrim sits above the stage, and once the photo
           has dissolved the dashboard is the only thing left under it. */
        .to(scrimRef.current, { autoAlpha: 0, duration: 0.15, ease: "power1.in" }, 0)
        /* fromTo, not to: the pill ships with opacity-0 in the markup so the
           intro can fade it in, and a plain .to() records its start value when
           the scrub timeline is built — which is before the intro has run. The
           pill then snapped to invisible on the first pixel of scroll and
           never came back on the way up, because progress 0 rendered the
           recorded zero. immediateRender keeps this from overwriting the
           intro's fade. */
        .fromTo(
          discRef.current,
          { autoAlpha: 1 },
          { autoAlpha: 0, duration: 0.08, immediateRender: false },
          0
        )
        // camera push toward the laptop screen — the stage carries BOTH the
        // photo and the dashboard glued onto the screen coordinates
        .fromTo(
          stageRef.current,
          { scale: 1, x: 0, y: 0 },
          {
            scale: () => zoomRef.current,
            x: () => driftRef.current.x,
            y: () => driftRef.current.y,
            duration: 1,
            ease: "power2.inOut",
          },
          0
        )
        /* Crossfade, not a wash: the photo used to whiten through a dim
           overlay before dissolving, which read as a white flash between two
           images. The dashboard and the photo now swap over one overlapping
           window.

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
          { autoAlpha: 1, filter: "blur(0px)", duration: 0.34, ease: "none" },
          0.34
        )
        /* blur(0px) is not the same as no blur: a filter of any value keeps
           the element on the filter render path, so every frame after the
           handoff was still round-tripping the dashboard through a blur that
           does nothing. Dropping it the moment the lens has finished focusing
           hands the rest of the move back to a plain layer. It is a timeline
           .set rather than an onComplete because the scrub runs backwards too,
           and GSAP restores the recorded value on the way up. */
        .set(screenRef.current, { filter: "none" }, 0.68)
        // white stage settles before the crossfade starts — it is the floor
        // the photo dissolves onto, never a layer on top of it
        .fromTo(
          veilRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.24, ease: "power1.inOut" },
          0.1
        )
        .to(imgRef.current, { autoAlpha: 0, duration: 0.34, ease: "none" }, 0.4);

      return () => (idle ? window.cancelIdleCallback(id) : window.clearTimeout(id));
    });

    return () => mm.revert();
  }, [narrow, zoomRef, driftRef, mountScreenOnce]);

  /* svh, not vh: on mobile Safari the collapsing URL bar makes 100vh taller
     than the visible viewport, which pushed the regulatory pill off-screen on
     load. svh is also the stable number ScrollTrigger wants for the pin. */
  return (
    <section ref={root} id="hero" className="relative h-[100svh] overflow-hidden bg-white">
      {/* light stage (behind the world so the dashboard stays crisp on top).
          Wide only: it exists to be the floor the photograph dissolves onto,
          and on a phone the photograph never dissolves. */}
      {!narrow && <div ref={veilRef} className="absolute inset-0 bg-white opacity-0" />}

      {/* world */}
      <div ref={introRef} className="absolute inset-0">
        {narrow ? (
          /* object-cover rather than the measured cover rect the camera uses:
             with no transform to apply there is nothing the arithmetic buys,
             and it is the more correct of the two here — coverRect measures
             window.innerHeight while this section is 100svh, and on mobile
             Safari those two disagree by the height of the URL bar. */
          <img
            src="/mcard-hero.avif"
            alt=""
            draggable={false}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full select-none object-cover"
          />
        ) : (
          <HeroStage
            rect={rect}
            mountScreen={mountScreen}
            stageRef={stageRef}
            imgRef={imgRef}
            screenRef={screenRef}
          />
        )}
      </div>

      {/* Contrast scrim. Deliberately a sibling of the world rather than a
          child of it: inside introRef it would ride the intro's 1.12 scale,
          and inside the stage it would be blown up 16x by the push-in. Out
          here it is a fixed pane over a moving photograph. z-10 puts it above
          the world and below the copy — the text it protects must never be
          behind it.

          No reduced-motion branch on purpose, and no narrow branch either.
          The fade above lives inside the wide scrub; a reader who asks for
          less motion, or who is on a phone, gets no scrub, and the scrim they
          need simply stays. */}
      <div ref={scrimRef} className="hero-scrim pointer-events-none absolute inset-0 z-10" />

      <HeroCopy copyRef={copyRef} />
      <HeroDisclosure discRef={discRef} />
    </section>
  );
}
