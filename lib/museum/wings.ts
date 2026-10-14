import type { WingMeta } from "./types";

export const wings: WingMeta[] = [
  {
    id: "relief",
    title: "Relief",
    subtitle: "Pin boards and flip machinery",
    medium: "Kinetic · Instanced metal",
  },
  {
    id: "locus",
    title: "Locus",
    subtitle: "Curves that draw themselves",
    medium: "Pts.js · Generative drawing",
  },
  {
    id: "alcove",
    title: "Alcove",
    subtitle: "Shader sculptures in the round",
    medium: "WebGL · Three.js",
  },
  {
    id: "field",
    title: "Field",
    subtitle: "Living fields with mass and wake",
    medium: "Continuous media · Springs",
  },
  {
    id: "signal",
    title: "Signal",
    subtitle: "Living systems on the wall",
    medium: "Kinetic · WebGPU pulse",
  },
  {
    id: "forge",
    title: "Forge",
    subtitle: "Evergoing machines that leave a mark",
    medium: "Kinetic sculpture · Canvas",
  },
];

export function getWing(id: string): WingMeta | undefined {
  return wings.find((w) => w.id === id);
}
