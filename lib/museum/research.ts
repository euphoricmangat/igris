import type { EngineKind } from "./types";

/** Curatorial research note — citation + interaction grammar (+ optional physics plaque). */
export interface ResearchNote {
  citation: string;
  grammar: string;
  /** Short spring / field physics line for ModePlaque */
  physics?: string;
}

export const researchByEngine: Record<EngineKind, ResearchNote> = {
  "endless-cascade": {
    citation: "Perpetual motion cascade · closed hydraulic loop (impossible climb)",
    grammar: "Steer the join; hold raises flow — water climbs and falls forever.",
    physics: "Parametric loop path · join bias · flow rate on hold",
  },
  "closed-tread": {
    citation: "Overbalanced wheel / self-driving belt metaphor",
    grammar: "Always turns; hold loads the belt then it recovers.",
    physics: "Spring toward drive speed · hold multiplies load damping",
  },
  "fountain-knot": {
    citation: "Trefoil knot stream · returns to source",
    grammar: "Move to coil radius; beads flow the closed path back to the mark.",
    physics: "Spring coil · denser beads on Expand",
  },
  "pts-locus": {
    citation: "Pts.js space · proximity lattice",
    grammar: "Hold well pulls; click seeds; Expand densifies points and links.",
  },
  "flow-field": {
    citation: "Perlin / simplex flow · particle advection",
    grammar: "Steer and hold-pull; Viscosity on Expand; noise drifts over time.",
  },
  "joy-division": {
    citation: "Unknown Pleasures horizon stack · 1D noise ridges",
    grammar: "Drag/scroll peaks; idle peak wanders; Sense on Expand.",
  },
  "circle-pack": {
    citation: "Circle packing · growth until contact",
    grammar: "Hold to inflate with spring stop; Auto seed toggle on Expand.",
    physics: "springStep radius growth · contact halt",
  },
  "tiled-lines": {
    citation: "10 PRINT / tiled diagonals · binary slash field",
    grammar: "Click/drag flip with soft lerp; Expand finer grid + guidelines.",
  },
  "strange-attractor": {
    citation: "Clifford attractor · iterative map etching",
    grammar: "Pointer springs parameters; hold deepens; Reset on Expand.",
    physics: "Spring-lerped a,b,c,d · more iters on Expand",
  },
  "alcove-ribbon": {
    citation: "Living helical tube · pointer-sprung coil params",
    grammar: "Drag to orbit · move to coil · hold to tighten toward the core.",
    physics: "Spring turns / radius / lift toward pointer · hold compresses radius",
  },
  "alcove-crystal": {
    citation: "MeshTransmissionMaterial · octahedron refraction study",
    grammar: "Drag to orbit; the same glass reads in thumb and Expand — Expand adds samples and bloom.",
  },
  "alcove-orb": {
    citation: "Torus knot + wire cage · orbital study",
    grammar: "Drag to orbit; the crimson key light follows the pointer.",
  },
  "ember-wake": {
    citation: "Additive particle wake · fluid trail metaphor",
    grammar: "Trail ember; adaptive particle cap; denser spawn on Expand.",
    physics: "Life decay + velocity damping · canvas-area particle budget",
  },
  "iron-lattice": {
    citation: "Iron filings · magnetic field lines",
    grammar: "Move the pole; idle Lissajous keeps filings alive; soft fade redraw.",
    physics: "Angle spring toward atan2(pole) · strength falls with distance",
  },
  "harmonic-sheet": {
    citation: "Spring-mass membrane · discrete Laplacian",
    grammar: "Dip the sheet; idle orbit keeps thumbs alive; Spring / Ripple knobs.",
    physics: "Seeded stiffness + ripple amp · idle Lissajous pointer",
  },
  "particle-life": {
    citation: "Particle Life · multi-species force matrix",
    grammar: "Burst / magnet; idle weak pull; denser swarm on Expand.",
    physics: "Spatial-hash neighbors · friction · idle magnet when alone",
  },
  "reaction-diffusion": {
    citation: "Gray–Scott reaction–diffusion (Pearson 1993)",
    grammar: "Paint with the pointer; tune feed F and kill K.",
    physics: "dA∇²A − AB² + F(1−A) · dB∇²B + AB² − (K+F)B",
  },
  "spektral-pulse": {
    citation: "Radial pulse field · Spektral WGSL with Canvas fallback",
    grammar: "Move the ring center; click to kick amplitude; tune Speed / Rings.",
    physics: "Sinusoidal ring expansion · kick envelope decays ~0.92/frame",
  },
  meteor: {
    citation: "Meteor / ashfall streaks · ballistic trails",
    grammar: "Click/drag shower; Ambient / Size knobs; denser on Expand.",
  },
  "plotter-arm": {
    citation: "Two-link IK arm · continuous ink trail",
    grammar: "Steer nib; hold ink; Ink / Ambient knobs; double-click clears plate.",
    physics: "IK follow · press × inkWeight · ambient Lissajous rate",
  },
  "cam-press": {
    citation: "Eccentric cam stamp · impact ink glow",
    grammar: "Hold rushes; move steers stamp bed; Speed / Ink knobs.",
    physics: "Cam phase + pointer X steer · spring stamp head",
  },
  "sand-pendulum": {
    citation: "Double pendulum · harmonic sand deposit",
    grammar: "Pluck; click clears; idle Lissajous drive when alone.",
    physics: "Coupled ODEs · seeded angles · gentle idle torque",
  },
  "archive-plates": {
    citation: "Python atelier · Pillow / NumPy baked plates",
    grammar: "Scrub the frame register; plates are offline, not a live engine.",
  },
};

export function getResearch(engine: EngineKind): ResearchNote {
  return researchByEngine[engine];
}
