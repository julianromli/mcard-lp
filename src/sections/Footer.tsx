import { useLayoutEffect, useRef } from "react";
import { gsap, MOTION_OK, MOTION_REDUCED } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

/* lucide-react v1 removed its brand logos, so the four social marks are
   inlined here. Each takes a className so it stays drop-in compatible with the
   lucide components they replaced. */
type IconProps = { className?: string };

function XMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
    </svg>
  );
}

function YouTubeMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814M9.545 15.568V8.432L15.818 12z" />
    </svg>
  );
}

function InstagramMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0m0 2.163c3.204 0 3.584.012 4.85.07 1.17.053 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.053 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.42.419-.82.679-1.382.896-.422.164-1.057.36-2.227.413-1.266.058-1.646.07-4.85.07s-3.585-.012-4.85-.07c-1.17-.053-1.805-.249-2.227-.413a3.7 3.7 0 0 1-1.382-.896 3.7 3.7 0 0 1-.896-1.382c-.164-.422-.36-1.057-.413-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.053-1.17.249-1.805.413-2.227.217-.562.477-.96.896-1.381A3.7 3.7 0 0 1 4.923 2.648c.422-.166 1.057-.362 2.227-.415 1.266-.058 1.646-.07 4.85-.07m0 3.678a6.162 6.162 0 1 0 0 12.323 6.162 6.162 0 0 0 0-12.323M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.846-10.405a1.441 1.441 0 0 1-2.88 0 1.44 1.44 0 0 1 2.88 0" />
    </svg>
  );
}

const COLUMNS: { heading: string; links: string[] }[] = [
  {
    heading: "Produk",
    links: [
      "Kartu Virtual",
      "Spend Management",
      "Batas & Anggaran",
      "Laporan Otomatis",
      "Integrasi",
    ],
  },
  {
    heading: "Platform",
    links: ["Harga", "Keamanan", "API", "Status", "Changelog"],
  },
  {
    heading: "Sumber Daya",
    links: ["Pusat Bantuan", "Blog", "Panduan", "Komunitas", "Partner"],
  },
  {
    heading: "Perusahaan",
    links: ["Tentang Kami", "Karier", "Pers", "Legal", "Kontak"],
  },
];

const SOCIALS = [
  { i: XMark, label: "X" },
  { i: LinkedInMark, label: "LinkedIn" },
  { i: YouTubeMark, label: "YouTube" },
  { i: InstagramMark, label: "Instagram" },
];

const WORDMARK = "MCARD".split("");

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);

    /* The columns, the social row and the legal bar all ship with opacity-0 so
       they can stagger in. Without this branch a reduced-motion reader got an
       empty footer: no navigation, no socials, and no legal notice. */
    mm.add(MOTION_REDUCED, () => {
      gsap.set(".ft-col, .ft-social, .ft-legal", { autoAlpha: 1, y: 0, scale: 1 });
    });

    mm.add(MOTION_OK, () => {
      /* link columns stagger in */
      gsap.fromTo(
        ".ft-col",
        { y: 34, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.09,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ft-grid", start: "top 82%" },
        }
      );

      /* social buttons pop */
      gsap.fromTo(
        ".ft-social",
        { scale: 0.6, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "back.out(2.2)",
          scrollTrigger: { trigger: ".ft-grid", start: "top 82%" },
        }
      );

      /* giant wordmark: letters rise out of the clip + gentle parallax */
      gsap.fromTo(
        ".ft-letter",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.055,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ft-wordmark", start: "top 92%" },
        }
      );
      gsap.fromTo(
        ".ft-wordmark-parallax",
        { y: 70 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: ".ft-wordmark", start: "top bottom", end: "bottom bottom", scrub: 1 },
        }
      );

      /* legal bar */
      gsap.fromTo(
        ".ft-legal",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ft-legal", start: "top 96%" },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-black/[0.07] bg-[#fafafc] px-6 pt-[9vh] lg:px-10">
      <div className="mx-auto max-w-[1240px]">
        {/* link grid */}
        <div className="ft-grid grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          {/* market */}
          <div className="ft-col opacity-0">
            <h4 className="mb-5 text-body font-semibold text-slate-900">Wilayah</h4>
            <button className="group flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-black/10 bg-white px-4 py-3 text-body-sm text-slate-700 shadow-sm transition-colors hover:border-black/25 hover:bg-black/[0.03]">
              <span className="text-body leading-none">🇮🇩</span>
              Indonesia
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* link columns */}
          {COLUMNS.map((col) => (
            <div key={col.heading} className="ft-col opacity-0">
              <h4 className="mb-5 text-body font-semibold text-slate-900">{col.heading}</h4>
              {/* The padding is the tap target: at 14px these links were ~22px
                  tall on a 36px pitch, well under the 44px floor and easy to
                  miss between two neighbours. */}
              <ul className="-my-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="inline-block py-3 text-body-sm text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* follow */}
          <div className="ft-col opacity-0">
            <h4 className="mb-5 text-body font-semibold text-slate-900">Ikuti Kami</h4>
            <div className="flex gap-2.5">
              {SOCIALS.map(({ i: I, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="ft-social flex h-11 w-11 items-center justify-center rounded-lg border border-black/10 bg-white text-slate-500 opacity-0 shadow-sm transition-colors hover:border-black/25 hover:bg-black/[0.03] hover:text-slate-900"
                >
                  <I className="h-[17px] w-[17px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* giant wordmark */}
        <div className="ft-wordmark-parallax mt-[10vh]">
          <div
            aria-hidden
            className="ft-wordmark flex select-none items-end justify-between overflow-hidden pb-[0.5vw] leading-[0.82]"
          >
            {WORDMARK.map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <span className="ft-letter inline-block text-mega font-extrabold text-slate-900">
                  {ch}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* legal bar */}
        <div className="ft-legal mt-4 flex flex-col gap-4 border-t border-black/10 py-6 opacity-0 lg:flex-row lg:items-start lg:justify-between">
          <p className="max-w-[640px] text-pretty text-caption text-slate-500">
            MCard adalah platform spend management dan kartu virtual untuk bisnis di Indonesia, bagian dari
            ekosistem Mayar. Kartu diterbitkan lewat partner berlisensi yang terdaftar dan diawasi.
            © 2026 PT Mayar Kernel Supernova · MCard
          </p>
          <div className="-my-3 flex shrink-0 gap-7 text-caption text-slate-500">
            {["Ketentuan", "Privasi", "Cookies", "Keamanan"].map((l) => (
              <a key={l} href="#" className="inline-block py-3 transition-colors hover:text-slate-900">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
