import type { EngineKind } from "./types";

export const interactionHints: Record<EngineKind, string> = {
  "endless-cascade": "steer join · hold raises flow · Expand denser",
  "closed-tread": "hold to load · Drive / Load · Expand",
  "fountain-knot": "move to coil · Beads · Expand denser",
  "pts-locus": "drag well · click seed · Expand denser lattice",
  "flow-field": "steer · hold pull · Viscosity on Expand",
  "joy-division": "drag / scroll peaks · Sense on Expand",
  "circle-pack": "hold grow · Auto toggle on Expand",
  "tiled-lines": "click / drag flip · Expand finer grid",
  "strange-attractor": "move reshape · hold deepen · Reset on Expand",
  "alcove-ribbon": "drag to orbit · move to coil · hold to tighten · Expand",
  "alcove-crystal": "drag to orbit · glass catches light · Expand",
  "alcove-orb": "drag to orbit · light follows pointer · Expand",
  "ember-wake": "trail ember · Linger / Spawn · Expand denser",
  "iron-lattice": "move pole · hold strengthen · Spring / Pole",
  "harmonic-sheet": "dip sheet · Spring / Ripple · Expand",
  "particle-life": "burst · magnet · Friction / Magnet · Expand denser",
  "reaction-diffusion": "paint · F / K · Expand",
  "spektral-pulse": "rings · kick · Speed / Rings · Expand",
  meteor: "shower · Ambient / Size · Expand",
  "plotter-arm": "steer · hold ink · Ink / Ambient · double-click clear",
  "cam-press": "hold rush · move steers stamp · Speed / Ink",
  "sand-pendulum": "pluck · click clear · idle drive",
  "archive-plates": "scrub frames · Prev / Next · Expand for full window",
};

export function getInteractionHint(engine: EngineKind): string {
  return interactionHints[engine];
}
