# MCard Landing Page

Marketing site for **MCard** — virtual cards and spend management from Mayar.

Single-route landing page built with React 19, Vite 8 (Rolldown), Tailwind v4, and
GSAP ScrollTrigger. The hero runs a scroll-scrubbed camera push-in that flies into
the laptop screen and hands off to a live dashboard rendered in an iframe.

## Requirements

- [Bun](https://bun.sh) 1.3+

## Getting started

```bash
bun install
bun run dev
```

The dev server runs on [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Vite dev server |
| `bun run build` | Type-check with `tsc -b`, then build to `dist/` |
| `bun run preview` | Serve the production build locally |
| `bun run lint` | Run ESLint |

## Structure

```
public/
  mcard-hero.avif     Hero photograph (3840×2000, AVIF)
  brands/*.avif       Integration card photography (672×448, one per brand)
  mcard-dash.html     Self-contained dashboard shown inside the laptop screen
src/
  main.tsx            Entry point — renders <Home /> directly
  index.css           Tailwind v4 entry, theme tokens, reduced-motion reset
  lib/motion.ts       Single GSAP/ScrollTrigger registration + motion queries
  pages/Home.tsx      Composes the section stack
  sections/           Nav, Hero, Features, Everyday, Protection, Brands,
                      Pricing, Cta, Footer
```

## Animation

Every section drives its timelines through `gsap.matchMedia()`, keyed on the
`MOTION_OK` / `MOTION_REDUCED` queries exported from [`src/lib/motion.ts`](src/lib/motion.ts).

Under `prefers-reduced-motion: reduce` the hero drops its pin and 2700px scrub
entirely and snaps the copy to its end state, so nothing that would otherwise be
faded in stays invisible. Decorative reveals in the other sections simply don't
run — their markup is visible by default.

When adding a section, register nothing yourself: import `gsap` from
`@/lib/motion` so the plugin registration stays in one place, and wrap anything
decorative in `mm.add(MOTION_OK, ...)`.

## Notes

- The hero geometry in [`src/sections/Hero.tsx`](src/sections/Hero.tsx) is measured
  against the 3840×2000 source image. `SCREEN`, `FOCAL_X`, and `FOCAL_Y` are
  fractions of that image — replacing the photo means re-measuring them.
- The hero image is AVIF only (no JPEG fallback), which needs Safari 16+,
  Chrome 85+, or Firefox 93+.
