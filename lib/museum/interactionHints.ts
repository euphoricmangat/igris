import type { EngineKind } from "./types";

export const interactionHints: Record<EngineKind, string> = {
  "brixel-life": "move to disturb pins · Expand for full window",
  "flip-field": "drag to flip discs · Expand",
  "needle-chorus": "move to pull needles · Expand",
  "pts-locus": "drag to pull · click to seed · Expand for full window",
  "flow-field": "move to steer · hold to pull · Expand",
  "joy-division": "drag vertically · scroll horizons · Expand",
  "circle-pack": "click to plant · hold to grow · Expand",
  "tiled-lines": "click / drag to flip tiles · Expand",
  "strange-attractor": "move to reshape · hold to deepen · Expand",
  "alcove-ribbon": "drag to orbit · Expand for full window",
  "alcove-crystal": "drag to orbit · Expand for full window",
  "alcove-orb": "drag to orbit · light follows pointer · Expand",
  "ember-wake": "move to trail ember · Expand",
  "iron-lattice": "move pole · hold to strengthen · Expand",
  "harmonic-sheet": "move to dip the sheet · Expand",
  "particle-life": "click burst · hold-drag magnet · Expand",
  "reaction-diffusion": "paint · tune F / K · Expand",
  "spektral-pulse": "move rings · click kick · Expand",
  meteor: "click / drag to shower · Expand",
  "plotter-arm": "drag to steer · hold for heavier ink · Expand",
  "cam-press": "hold to rush · click re-inks · Expand",
  "sand-pendulum": "drag to pluck · click to clear floor · Expand",
};

export function getInteractionHint(engine: EngineKind): string {
  return interactionHints[engine];
}
