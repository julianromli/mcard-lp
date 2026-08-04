/* Extracts the fourteen integration marks from @thesvg/react into standalone
   SVG files under public/brands/logos/.
 *
 * The library is the source of the artwork, not a runtime dependency. Importing
 * the components instead cost 23KB gzip in the entry bundle, roughly half of it
 * variants that never render: each module keeps every variant's path data in one
 * object, so tree-shaking cannot reach inside it. The variant choice here is
 * fixed per brand anyway, so there is nothing to decide at runtime.
 *
 * Two things get baked in, because an SVG loaded through <img> is an isolated
 * document that CSS cannot reach:
 *   - `currentColor` is replaced with the brand's ink. A stylesheet `color`
 *     would never arrive.
 *   - `xmlns` is added. The stored data omits it, which is fine inline and
 *     fatal standalone.
 *
 * Run with @thesvg/react installed:
 *   npm install --no-save --legacy-peer-deps @thesvg/react@3.2.15
 *   node tools/brand-logos/extract.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

/* Which variant each brand takes, and what colour to bake into the marks the
   library draws in currentColor.

   `default` is the full-colour logo for most brands and is what the chip wants.
   Three exceptions, each verified against the variant data rather than assumed:

   - Stripe's `default` is a 2.39:1 wordmark that would vanish in a square chip.
   - Vercel's and Notion's `default` paint a child path in #fff, so they render
     white on a white chip regardless of what the root fill says. Their `mono`
     variants carry no child fills at all, which is what makes them colourable.

   Plaid keeps `default` because it has no `mono`; it is a 2.63:1 wordmark and
   letterboxes in the chip, the way the reference treats eBay.

   `ink` is set only where the root fill actually paints something. Shopify,
   GitHub, Linear, Gusto, QuickBooks, Xero, Wise and Figma give every drawn node
   its own fill, so an ink there would be dead configuration. */
const BLACK = "#0f172a";
const BRANDS = [
  { slug: "stripe", variant: "mono", ink: "#635bff" },
  { slug: "shopify", variant: "default" },
  { slug: "gusto", variant: "default" },
  { slug: "quickbooks", variant: "default" },
  { slug: "slack", variant: "default", ink: "#e01e5a" },
  { slug: "linear", variant: "default" },
  { slug: "vercel", variant: "mono", ink: BLACK },
  { slug: "notion", variant: "mono", ink: BLACK },
  { slug: "figma", variant: "default" },
  { slug: "aws", variant: "default", ink: "#ff9900" },
  { slug: "plaid", variant: "default", ink: BLACK },
  { slug: "xero", variant: "default" },
  { slug: "wise", variant: "default" },
  { slug: "github", variant: "default" },
];

/* SVG has camelCase attributes of its own, so a blanket camelCase-to-kebab pass
   would corrupt them. Everything not listed is hyphenated. */
const KEEP_CAMEL = new Set([
  "viewBox", "preserveAspectRatio", "gradientUnits", "gradientTransform",
  "patternUnits", "patternContentUnits", "patternTransform", "spreadMethod",
  "clipPathUnits", "maskUnits", "maskContentUnits", "markerWidth",
  "markerHeight", "markerUnits", "refX", "refY", "baseFrequency", "numOctaves",
  "stdDeviation", "textLength", "lengthAdjust", "startOffset", "systemLanguage",
]);

const attrName = (k) =>
  KEEP_CAMEL.has(k) ? k : k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

const escape = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render(node) {
  if (typeof node === "string") return escape(node);
  const attrs = Object.entries(node.props ?? {})
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => ` ${attrName(k)}="${escape(v)}"`)
    .join("");
  const kids = (node.children ?? []).map(render).join("");
  return kids ? `<${node.type}${attrs}>${kids}</${node.type}>` : `<${node.type}${attrs}/>`;
}

mkdirSync("public/brands/logos", { recursive: true });

let total = 0;
for (const { slug, variant, ink } of BRANDS) {
  const src = readFileSync(`node_modules/@thesvg/react/dist/${slug}.js`, "utf8");
  const match = src.match(/const _variants = (\{.*?\});\n/s);
  if (!match) throw new Error(`${slug}: no _variants block`);

  const v = JSON.parse(match[1])[variant];
  if (!v) throw new Error(`${slug}: no "${variant}" variant`);

  /* A root currentColor with no ink is inert by definition — every drawn node
     carries its own fill, or the brand would be listed with one. Dropping it
     keeps the attribute from resolving to black in some future context. */
  const rootFill = v.fill === "currentColor" && !ink ? null : v.fill;

  const root = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${v.viewBox}"`,
    rootFill ? ` fill="${rootFill}"` : "",
    ">",
    (v.childNodes ?? []).map(render).join(""),
    "</svg>",
  ].join("");

  const out = ink ? root.replaceAll("currentColor", ink) : root;

  /* Nothing may reach the file still asking the document for a colour: these
     load through <img>, where no stylesheet can answer. */
  if (out.includes("currentColor")) throw new Error(`${slug}: currentColor survived`);
  writeFileSync(`public/brands/logos/${slug}.svg`, out + "\n");
  total += out.length + 1;
  console.log(`${slug.padEnd(11)} ${variant.padEnd(8)} ${String(out.length).padStart(6)} bytes`);
}
console.log(`\n${BRANDS.length} files, ${(total / 1024).toFixed(1)} KB total`);
