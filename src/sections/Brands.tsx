import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data — adapted to Mercury's integration ecosystem                  */
/* ------------------------------------------------------------------ */
/* `img` is a photograph of the work the integration does, not of the product —
   a card reader for payments, a patch panel for connections. Third-party marks
   are nobody's to put on this page, and a screenshot of someone else's UI ages
   the moment they ship a redesign. Stock imagery under the Unsplash licence,
   self-hosted; see tools note in README. */
type Brand = { name: string; cat: string; badge: string; hue: string; mono: string; img: string };

const ROW_A: Brand[] = [
  { name: "Stripe", cat: "Pembayaran", badge: "Payout instan", hue: "#635bff", mono: "S", img: "/brands/stripe.avif" },
  { name: "Shopify", cat: "Belanja", badge: "Sinkron otomatis", hue: "#95bf47", mono: "S", img: "/brands/shopify.avif" },
  { name: "Gusto", cat: "Payroll", badge: "Sekali klik", hue: "#f45d48", mono: "G", img: "/brands/gusto.avif" },
  { name: "QuickBooks", cat: "Akuntansi", badge: "Rekonsiliasi otomatis", hue: "#2ca01c", mono: "Q", img: "/brands/quickbooks.avif" },
  { name: "Slack", cat: "Notifikasi", badge: "Real-time", hue: "#e01e5a", mono: "S", img: "/brands/slack.avif" },
  { name: "Linear", cat: "Tiket", badge: "Sinkron dua arah", hue: "#5e6ad2", mono: "L", img: "/brands/linear.avif" },
  { name: "Vercel", cat: "Deploy", badge: "Sinkron instan", hue: "#9c9cff", mono: "V", img: "/brands/vercel.avif" },
];

const ROW_B: Brand[] = [
  { name: "Notion", cat: "Dokumen", badge: "Ekspor otomatis", hue: "#cfcfd6", mono: "N", img: "/brands/notion.avif" },
  { name: "Figma", cat: "Desain", badge: "Tagihan mulus", hue: "#a259ff", mono: "F", img: "/brands/figma.avif" },
  { name: "AWS", cat: "Cloud", badge: "Bayar tagihan", hue: "#ff9900", mono: "A", img: "/brands/aws.avif" },
  { name: "Plaid", cat: "Koneksi", badge: "Koneksi aman", hue: "#12b5a5", mono: "P", img: "/brands/plaid.avif" },
  /* Xero and QuickBooks share a category and are on screen together, so they
     must not share a subject or the row reads as a rendering bug. */
  { name: "Xero", cat: "Akuntansi", badge: "Rekonsiliasi otomatis", hue: "#13b5ea", mono: "X", img: "/brands/xero.avif" },
  { name: "Wise", cat: "Valas", badge: "Kurs tengah", hue: "#9fe870", mono: "W", img: "/brands/wise.avif" },
  { name: "GitHub", cat: "Kode", badge: "Sinkron instan", hue: "#8b949e", mono: "G", img: "/brands/github.avif" },
];

/* The monogram chip is filled with the brand's own hue, which runs from
   #cfcfd6 to #2ca01c. A single hardcoded ink colour cannot clear 4.5:1 across
   that range, so each chip picks the end of the scale that does. */
function inkOn(hex: string) {
  const c = hex.replace("#", "");
  const chan = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(chan[0]) + 0.7152 * lin(chan[1]) + 0.0722 * lin(chan[2]);
  const onDark = (L + 0.05) / 0.05;
  const onWhite = 1.05 / (L + 0.05);
  return onDark >= onWhite ? "#0d0d13" : "#ffffff";
}

/* Sibling to inkOn, solving the same problem one layer up. The badge used to be
   a 17%-alpha wash of the brand hue, which was legible only because the surface
   underneath was a near-white gradient we controlled. With a photograph there,
   an alpha fill composites against whatever the crop happens to contain. Mixing
   the hue into white up front makes the result independent of the picture: any
   hue at 16% still lands above L≈0.70, so slate-900 clears 11:1 even for the
   darkest brand in the set. */
function tint(hex: string, amount: number) {
  const c = hex.replace("#", "");
  const mix = [0, 2, 4].map((i) =>
    Math.round(255 + (parseInt(c.slice(i, i + 2), 16) - 255) * amount)
  );
  return `rgb(${mix[0]} ${mix[1]} ${mix[2]})`;
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */
function BrandCard({ b, armed }: { b: Brand; armed: boolean }) {
  return (
    /* An anchor, not a div: it carried cursor-pointer and a full hover
       treatment while being unfocusable and unclickable. The right-margin is
       the row gap — see MarqueeRow for why it can't live on the container. */
    <a
      href="#"
      className="group relative mr-5 block h-[220px] w-[330px] shrink-0 overflow-hidden rounded-[24px] border border-black/[0.08] transition-colors duration-500 hover:border-brand/50"
    >
      {/* Photo and its fallback tint as one layer, not two: this card exists
          twenty-eight times in a track that translates forever, so a separate
          backdrop element and image element would each want compositing.

          The radius is repeated here — 24px parent minus its 1px border — even
          though the parent already clips. A transformed child can escape a
          rounded overflow clip in Safari, which nobody noticed while this was a
          near-white gradient and which is a hard square corner under a photo. */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[23px] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        style={{ backgroundColor: tint(b.hue, 0.16) }}
      >
        {armed && (
          <img
            src={b.img}
            /* Decorative: the info bar below already names the brand and its
               category, and this sits inside an anchor whose accessible name is
               its text content — a described photo would prepend itself to all
               twenty-eight link names. */
            alt=""
            width={672}
            height={448}
            decoding="async"
            draggable={false}
            /* A missing file falls back to the tint that is already painted
               behind it, rather than a broken-image glyph. No state, no
               re-render, twenty-eight times over. */
            onError={(e) => {
              e.currentTarget.hidden = true;
            }}
            className="h-full w-full select-none object-cover"
          />
        )}
      </div>

      {/* Badge top-left. Opaque, not a wash: an alpha fill over a photograph
          inherits whatever the crop puts behind it, and slate-800 on a mid-tone
          photo is unreadable. The shadow, not the fill, is what separates it
          from a pale picture. */}
      <span
        className="absolute left-4 top-4 whitespace-nowrap rounded-full px-3 py-1.5 text-caption font-semibold text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.22)] ring-1 ring-black/10"
        style={{ backgroundColor: tint(b.hue, 0.16) }}
      >
        {b.badge}
      </span>

      {/* Info bar. Opaque white, not bg-white/90: at 90% over a dark crop the
          composite bottoms out near #e5e5e5, where the old slate-500 category
          line measured 3.8:1. Dropping the translucency also takes twenty-eight
          backdrop-filters out of a layer that never stops moving. */}
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl border border-black/[0.07] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.14)] transition-transform duration-500 group-hover:-translate-y-1">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-body font-bold"
          style={{ background: b.hue, color: inkOn(b.hue) }}
        >
          {b.mono}
        </span>
        <div className="min-w-0">
          <p className="truncate text-body-sm font-semibold text-slate-900" title={b.name}>{b.name}</p>
          <p className="truncate text-caption text-slate-600" title={b.cat}>{b.cat}</p>
        </div>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Marquee row                                                        */
/* ------------------------------------------------------------------ */
function MarqueeRow({
  items,
  reverse = false,
  dur = 46,
  running,
  armed,
}: {
  items: Brand[];
  reverse?: boolean;
  dur?: number;
  running: boolean;
  armed: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="group/row relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      {/* The loop translates by -50%, which is only seamless if the two halves
          are exactly equal. A `gap` on this container puts one fewer gap in
          the first half than the second, so -50% landed 10px short and the row
          snapped once per cycle. The spacing is a margin on the card instead.

          animationPlayState is left undefined while running so the hover and
          focus-within rules below still govern; an inline "running" would
          outrank them. */}
      <div
        className="flex w-max group-hover/row:[animation-play-state:paused] group-focus-within/row:[animation-play-state:paused]"
        style={{
          animation: `brand-marquee ${dur}s linear infinite ${reverse ? "reverse" : "normal"}`,
          animationPlayState: running ? undefined : "paused",
        }}
      >
        {doubled.map((b, i) => (
          <BrandCard key={`${b.name}-${i}`} b={b} armed={armed} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export function Brands() {
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        ".br-reveal",
        { autoAlpha: 0, y: 44 },
        {
          autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: ".br-head", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".br-row",
        { autoAlpha: 0, y: 60 },
        {
          autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.18, ease: "power3.out",
          scrollTrigger: { trigger: ".br-rows", start: "top 85%" },
        }
      );
    });
    return () => mm.revert();
  }, []);

  /* Two rows of twenty-eight photographs translating forever is not something
     to keep compositing while the section is three screens away. */
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => setInView(self.isActive),
    });
    return () => st.kill();
  }, []);

  /* Bytes, not frames — deliberately a second trigger rather than reusing
     inView, which starts true and would fetch on first paint.

     The alternative was loading="lazy", and it is the wrong tool here: the
     cards sit inside overflow-hidden and are moved by translateX, so whether an
     engine counts a card at x≈+4000px as "near the viewport" is implementation
     detail rather than spec, and it differs across Chrome, Firefox and Safari.
     A gate is something we can reason about. It also keeps fourteen image
     requests away from the 1.4MB hero AVIF that is this page's LCP.

     One viewport of lead time, and it never un-arms: the duplicated half of
     each row shares the first half's fourteen URLs, so a card coming back
     around is a memory-cache hit, not a refetch. */
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom+=100%",
      end: "bottom top-=100%",
      onToggle: (self) => self.isActive && setArmed(true),
    });
    return () => st.kill();
  }, []);

  /* Off-screen is the only thing that stops the rows outright now. Holding a
     card still to read it is left to hover and to focus-within, both of which
     MarqueeRow handles in CSS. */
  const running = inView;

  return (
    <section ref={root} id="integrasi" className="relative overflow-hidden bg-[#fafafc] py-[13vh]">
      <style>{`@keyframes brand-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* header */}
      <div className="br-head mx-auto max-w-[820px] px-6 text-center">
        <h2 className="br-reveal text-balance text-display-lg font-extrabold text-slate-900">
          Terhubung dengan tools yang kamu pakai tiap hari
        </h2>
        <div className="br-reveal mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-brand px-6 py-3 text-body-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            Lihat semua integrasi
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* marquee rows */}
      <div className="br-rows mt-[8vh] space-y-5">
        <div className="br-row">
          <MarqueeRow items={ROW_A} dur={48} running={running} armed={armed} />
        </div>
        <div className="br-row">
          <MarqueeRow items={ROW_B} reverse dur={54} running={running} armed={armed} />
        </div>
      </div>
    </section>
  );
}
