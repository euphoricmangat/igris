import type { WingMeta } from "./types";

export const wings: WingMeta[] = [
  {
    id: "paradox",
    title: "Paradox",
    subtitle: "Machines that shouldn’t keep going",
    medium: "Closed loops · Canvas",
    blurb: "Perpetual cascades and self-driving wheels — play the impossible join on the wall.",
  },
  {
    id: "locus",
    title: "Locus",
    subtitle: "Curves that draw themselves",
    medium: "Pts.js · Generative drawing",
    blurb: "Flow fields and horizon stacks that etch while you steer.",
  },
  {
    id: "alcove",
    title: "Alcove",
    subtitle: "Shader sculptures in the round",
    medium: "WebGL · Three.js",
    blurb: "Glass, ribbon, and knot — orbit with the pointer; Expand for denser light.",
  },
  {
    id: "field",
    title: "Field",
    subtitle: "Living fields with mass and wake",
    medium: "Continuous media · Springs",
    blurb: "Ember wakes and iron filings that spring toward your hand.",
  },
  {
    id: "signal",
    title: "Signal",
    subtitle: "Living systems on the wall",
    medium: "Kinetic · Spektral / Canvas",
    blurb: "Swarms, pulses, and tissue that keep breathing without you — then answer when you touch.",
  },
  {
    id: "forge",
    title: "Forge",
    subtitle: "Evergoing machines that leave a mark",
    medium: "Kinetic sculpture · Canvas",
    blurb: "Plotter, press, and pendulum — machines that write while you watch.",
  },
];

export function getWing(id: string): WingMeta | undefined {
  return wings.find((w) => w.id === id);
}
