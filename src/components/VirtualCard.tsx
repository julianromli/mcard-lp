import { Wifi } from "lucide-react";
import { DESIGNS, type CardDesign } from "@/lib/card-designs";

/* ------------------------------------------------------------------ */
/*  Virtual card — ported from the MCard dashboard prototype           */
/*  (public/mcard-dash.html). Same face: Mayar mark, contactless glyph, */
/*  gold chip, mono number, holder/expiry row, network mark.           */
/* ------------------------------------------------------------------ */

/* The dashboard draws the card at a fixed 420×264. Everything here is
   expressed in cqw against that width so one component fits both the
   sticky desktop column and the smaller mobile slot. */
/* The Mayar mark, reused at two sizes: the wordless logo top-left and the
   oversized watermark bleeding off the bottom-right corner. */
export function MayarMark({ fill, accent }: { fill: string; accent: string }) {
  return (
    <svg viewBox="0 0 133.95 108" className="h-auto w-full" aria-hidden="true">
      <path
        d="m93.1 98.8l4.7-30.6c1.4-9.2 3.3-20.7 6-34.8h-0.4c-5 12.7-10.3 25-14.4 33.7l-13.6 29.9h-16.5l-1.4-29.8c-0.4-8.3-1-20.9-1.2-33.8h-0.3c-2.7 13.2-5.2 25.7-7.3 34.8l-7.1 30.6h-19.4l22.2-88.7h27.4l1 29.9c0.3 7.9 1 18.7 0.9 28.4h0.4c3.2-9.7 7.9-20.8 11.3-28.6l12.6-29.7h27.5l-12.1 88.7z"
        fill={fill}
      />
      <path d="m71.8 9.9h-64.1c0 0 53.8 15.7 65.3 35.8z" fill={accent} />
    </svg>
  );
}

export function VirtualCard({
  holder = "SARI WIJAYA",
  last4 = "4477",
  exp = "12/29",
  design = "midnight",
  className = "",
}: {
  holder?: string;
  last4?: string;
  exp?: string;
  design?: CardDesign;
  className?: string;
}) {
  return (
    /* The container element itself can't read its own cq units, so the face
       is a child: the wrapper only sizes and names the container. */
    <div className={`@container relative aspect-[420/264] w-full ${className}`}>
      <div
        className="absolute inset-0 overflow-hidden rounded-[4.8cqw] shadow-[0_30px_60px_-22px_rgba(14,15,26,0.6),0_14px_28px_-16px_rgba(12,82,239,0.35)]"
        style={{ background: DESIGNS[design] }}
      >
        {/* watermark — oversized mark bleeding past the bottom-right corner */}
        <div className="pointer-events-none absolute -bottom-[35cqw] -right-[17cqw] w-[105cqw]">
          <MayarMark fill="rgba(255,255,255,0.11)" accent="rgba(255,255,255,0.14)" />
        </div>

        {/* gloss */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_26%,rgba(255,255,255,0)_68%,rgba(255,255,255,0.07)_100%)]" />

        <div className="relative flex h-full flex-col justify-between p-[5.7cqw_6.2cqw]">
          <div className="flex items-start justify-between">
            <div className="w-[5.7cqw]">
              <MayarMark fill="#fff" accent="#E91E78" />
            </div>
            {/* contactless glyph — the dashboard rotates the wifi icon 90° */}
            <Wifi className="h-[5.2cqw] w-[5.2cqw] rotate-90 text-white/70" strokeWidth={2} />
          </div>

          {/* EMV chip */}
          <div className="relative h-[8.1cqw] w-[11cqw] shrink-0 overflow-hidden rounded-[1.4cqw] bg-[linear-gradient(135deg,#F6DC9A_0%,#D8B65E_48%,#B8923E_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)]">
            <div className="absolute inset-y-0 left-1/2 w-px bg-[rgba(120,90,30,0.5)]" />
            <div className="absolute inset-x-0 top-1/3 h-px bg-[rgba(120,90,30,0.5)]" />
            <div className="absolute inset-x-0 top-2/3 h-px bg-[rgba(120,90,30,0.5)]" />
          </div>

          <div>
            {/* Wide tracking is the card-number look, so it overrides the token;
                Geist Mono supplies the fixed advance underneath. */}
            <p className="whitespace-nowrap font-mono text-[5cqw] font-medium tracking-[0.10em] text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">
              ••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;{last4}
            </p>
            <div className="mt-[3.3cqw] flex items-end justify-between gap-[3cqw]">
              <div>
                <p className="text-[1.9cqw] font-semibold tracking-[0.12em] text-white/50">PEMEGANG KARTU</p>
                <p className="mt-[0.5cqw] text-[3.1cqw] font-semibold tracking-[0.04em] text-white">{holder}</p>
              </div>
              <div>
                <p className="text-[1.9cqw] font-semibold tracking-[0.12em] text-white/50">BERLAKU</p>
                <p className="mt-[0.5cqw] font-mono text-[3.1cqw] font-semibold tracking-[0.04em] text-white">{exp}</p>
              </div>
              <svg viewBox="0 0 640 396" className="h-auto w-[14.8cqw] shrink-0" aria-hidden="true">
                <path fill="#ff5f00" d="M224.833 42.298h190.416v311.005H224.833z" />
                <path
                  fill="#eb001b"
                  d="M244.446 197.828a197.448 197.448 0 0175.54-155.475 197.777 197.777 0 100 311.004 197.448 197.448 0 01-75.54-155.53z"
                />
                <path
                  fill="#f79e1b"
                  d="M640 197.828a197.777 197.777 0 01-320.015 155.474 197.777 197.777 0 000-311.004A197.777 197.777 0 01640 197.773z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
