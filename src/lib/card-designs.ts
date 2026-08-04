/* The nine faces the card designer offers, sampled from the Figma card-design
   swatches. Kept out of VirtualCard so the "Buat Kartu Virtual" graphic in
   Everyday can render the same list — two copies of a gradient set drift the
   moment one of them is edited. */
export const DESIGNS = {
  midnight: "linear-gradient(140deg,#1f2235 0%,#0E0F1A 55%,#15162a 100%)",
  royal: "linear-gradient(140deg,#3A4BF0 0%,#1E2DB0 60%,#16208a 100%)",
  magenta: "linear-gradient(140deg,#F0568F 0%,#C9156A 58%,#9E1457 100%)",
  emerald: "linear-gradient(140deg,#16B57A 0%,#0E8F5E 55%,#0A6E49 100%)",
  graphite: "linear-gradient(140deg,#4A4F63 0%,#2A2D3C 60%,#1D1F2B 100%)",
  silver: "linear-gradient(140deg,#AEB4C2 0%,#7A8092 52%,#565C6E 100%)",
  chroma: "linear-gradient(140deg,#6A5CF0 0%,#C13BE0 36%,#F0568F 66%,#22B5C9 100%)",
  gold: "linear-gradient(140deg,#E8C66B 0%,#B8923E 55%,#7E601F 100%)",
  matrix: "linear-gradient(140deg,#0F3322 0%,#06160E 52%,#0A2E1E 100%)",
} as const;

export type CardDesign = keyof typeof DESIGNS;
