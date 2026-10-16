import type { Exhibit, WingId } from "./types";
import { wings } from "./wings";

export const exhibits: Exhibit[] = [
  // ── Paradox ───────────────────────────────────────
  {
    id: "paradox-cascade",
    wing: "paradox",
    title: "Endless Cascade",
    medium: "Closed water loop",
    year: "2026",
    accession: "IGR.PDX.001",
    blurb:
      "Water climbs an impossible channel and falls forever — steer the join; hold to raise the flow.",
    engine: "endless-cascade",
  },
  {
    id: "paradox-tread",
    wing: "paradox",
    title: "Closed Tread",
    medium: "Self-driving belt",
    year: "2026",
    accession: "IGR.PDX.002",
    blurb:
      "A wheel that drives itself — always turning; hold to load the belt, release and it recovers.",
    engine: "closed-tread",
  },
  {
    id: "paradox-fountain",
    wing: "paradox",
    title: "Fountain Knot",
    medium: "Returning stream",
    year: "2026",
    accession: "IGR.PDX.003",
    blurb:
      "A stream that returns to its own source along a knot — move to coil the path; Expand densifies beads.",
    engine: "fountain-knot",
  },
  // ── Locus ─────────────────────────────────────────
  {
    id: "locus-constellation",
    wing: "locus",
    title: "Night Lattice",
    medium: "Pts.js point field",
    year: "2026",
    accession: "IGR.LOC.001",
    blurb: "Points find each other across a dark paper plane; the lattice breathes with the pointer.",
    engine: "pts-locus",
  },
  {
    id: "locus-current",
    wing: "locus",
    title: "Invisible Current",
    medium: "Perlin flow field",
    year: "2026",
    accession: "IGR.LOC.002",
    blurb: "Thousands of filaments obey a hidden vector field — a drawing that never stops arriving.",
    engine: "flow-field",
  },
  {
    id: "locus-horizon",
    wing: "locus",
    title: "Unknown Pleasures",
    medium: "Horizon stack",
    year: "2026",
    accession: "IGR.LOC.003",
    blurb: "Stacked noise horizons — a quiet mountain range that never finishes rising.",
    engine: "joy-division",
  },
  {
    id: "locus-pack",
    wing: "locus",
    title: "Colony",
    medium: "Circle packing",
    year: "2026",
    accession: "IGR.LOC.004",
    blurb: "Circles grow until they kiss — a living diagram of adjacency and restraint.",
    engine: "circle-pack",
  },
  {
    id: "locus-tiles",
    wing: "locus",
    title: "Ten Thousand Cuts",
    medium: "Tiled diagonals",
    year: "2026",
    accession: "IGR.LOC.005",
    blurb: "A grid of slash and backslash — flip tiles by hand until the field becomes a drawing.",
    engine: "tiled-lines",
  },
  {
    id: "locus-attractor",
    wing: "locus",
    title: "Clifford Vein",
    medium: "Strange attractor",
    year: "2026",
    accession: "IGR.LOC.006",
    blurb: "A Clifford attractor etching itself in ash and crimson — reshape it with your hand.",
    engine: "strange-attractor",
  },
  // ── Alcove ────────────────────────────────────────
  {
    id: "alcove-ribbon",
    wing: "alcove",
    title: "Blood Ribbon",
    medium: "WebGL sculpture",
    year: "2026",
    accession: "IGR.ALC.001",
    blurb:
      "A living crimson helix — move to coil the ribbon, hold to tighten it toward the silver core.",
    engine: "alcove-ribbon",
  },
  {
    id: "alcove-crystal",
    wing: "alcove",
    title: "Shadow Crystal",
    medium: "WebGL refraction study",
    year: "2026",
    accession: "IGR.ALC.002",
    blurb:
      "Faceted transmission glass with crimson attenuation — the same crystal in the grid and in Expand; Expand only deepens the refraction.",
    engine: "alcove-crystal",
  },
  {
    id: "alcove-orb",
    wing: "alcove",
    title: "Monarch Knot",
    medium: "Torus knot + wire shell",
    year: "2026",
    accession: "IGR.ALC.003",
    blurb: "A crimson knot inside a silver cage — orbit freely; the light follows you.",
    engine: "alcove-orb",
  },
  // ── Field ─────────────────────────────────────────
  {
    id: "field-ember",
    wing: "field",
    title: "Ember Wake",
    medium: "Additive particle wake",
    year: "2026",
    accession: "IGR.FLD.001",
    blurb:
      "A crimson fluid wake trails your hand — particles bloom, cool, and settle into the dark.",
    engine: "ember-wake",
  },
  {
    id: "field-iron",
    wing: "field",
    title: "Iron Lattice",
    medium: "Magnetic filings",
    year: "2026",
    accession: "IGR.FLD.002",
    blurb:
      "Filings align to the pointer as a moving pole — hold to strengthen the field, release to watch them settle.",
    engine: "iron-lattice",
  },
  {
    id: "field-sheet",
    wing: "field",
    title: "Harmonic Sheet",
    medium: "Spring-mass membrane",
    year: "2026",
    accession: "IGR.FLD.003",
    blurb:
      "A spring sheet dips under your cursor like a gravitational lens, then rings back into equilibrium.",
    engine: "harmonic-sheet",
  },
  // ── Signal ────────────────────────────────────────
  {
    id: "signal-swarm",
    wing: "signal",
    title: "Shadow Swarm",
    medium: "Particle life",
    year: "2026",
    accession: "IGR.SIG.001",
    blurb: "Species of particles attract and repel until a living calligraphy forms.",
    engine: "particle-life",
  },
  {
    id: "signal-pulse",
    wing: "signal",
    title: "Monarch Pulse",
    medium: "Spektral / Canvas pulse",
    year: "2026",
    accession: "IGR.SIG.002",
    blurb:
      "Crimson rings bloom from the pointer — WebGPU Spektral when available, Canvas pulse otherwise.",
    engine: "spektral-pulse",
  },
  {
    id: "signal-tissue",
    wing: "signal",
    title: "Living Tissue",
    medium: "Reaction–diffusion",
    year: "2026",
    accession: "IGR.SIG.003",
    blurb: "Gray–Scott chemistry painting itself — spots and labyrinths on the wall.",
    engine: "reaction-diffusion",
  },
  {
    id: "signal-meteor",
    wing: "signal",
    title: "Ashfall",
    medium: "Meteor trails",
    year: "2026",
    accession: "IGR.SIG.004",
    blurb: "Streaks of ash and ember — click to call a shower across the dark.",
    engine: "meteor",
  },
  // ── Forge ─────────────────────────────────────────
  {
    id: "forge-plotter",
    wing: "forge",
    title: "Plotter Arm",
    medium: "Kinetic ink arm",
    year: "2026",
    accession: "IGR.FRG.001",
    blurb:
      "A two-joint arm that never stops writing — drag to steer the nib; hold to press heavier ink.",
    engine: "plotter-arm",
  },
  {
    id: "forge-cam",
    wing: "forge",
    title: "Cam Press",
    medium: "Eccentric stamp machine",
    year: "2026",
    accession: "IGR.FRG.002",
    blurb:
      "Eccentric cams drive a spring-loaded stamp — impacts leave ink with a brief glow; hold to rush the press.",
    engine: "cam-press",
  },
  {
    id: "forge-pendulum",
    wing: "forge",
    title: "Sand Pendulum",
    medium: "Harmonic sand trail",
    year: "2026",
    accession: "IGR.FRG.003",
    blurb:
      "A double pendulum sheds ember sand into an accumulating drawing — pluck it; watch the floor remember.",
    engine: "sand-pendulum",
  },
  // ── Atelier annex (Index only — not corridor wing doors) ──
  {
    id: "archive-ember",
    wing: "forge",
    title: "Ember Register",
    medium: "Atelier filmstrip plate",
    year: "2026",
    accession: "IGR.ANN.001",
    blurb:
      "Sixteen ember comic plates baked offline by the Python atelier — scrub the register; nothing scraped.",
    engine: "archive-plates",
    archive: "reel-ember",
  },
  {
    id: "archive-nocturne",
    wing: "forge",
    title: "Nocturne Cut",
    medium: "Atelier filmstrip plate",
    year: "2026",
    accession: "IGR.ANN.002",
    blurb:
      "A night-mood filmstrip from the atelier — dense ink panels for study, not a live wing.",
    engine: "archive-plates",
    archive: "reel-nocturne",
  },
  {
    id: "archive-mill",
    wing: "forge",
    title: "Mill Room",
    medium: "Atelier overlay plate",
    year: "2026",
    accession: "IGR.ANN.003",
    blurb:
      "Layered color fields and halftone — overlay mill plates for the research annex.",
    engine: "archive-plates",
    archive: "overlay-mill",
  },
  {
    id: "archive-sprocket",
    wing: "forge",
    title: "Sprocket Opera",
    medium: "Atelier filmstrip plate",
    year: "2026",
    accession: "IGR.ANN.004",
    blurb:
      "Day-mood comic cells on a sprocket reel — baked offline, scrubbed like a register.",
    engine: "archive-plates",
    archive: "reel-sprocket-01",
  },
  {
    id: "archive-halide",
    wing: "forge",
    title: "Halide Chamber",
    medium: "Atelier overlay plate",
    year: "2026",
    accession: "IGR.ANN.005",
    blurb:
      "Steel, crimson, and ash overlays with grain — halide study plates for the annex.",
    engine: "archive-plates",
    archive: "overlay-halide",
  },
  {
    id: "archive-cinder",
    wing: "forge",
    title: "Cinder Press",
    medium: "Atelier overlay plate",
    year: "2026",
    accession: "IGR.ANN.006",
    blurb:
      "Heavy grain and halftone stacked as a press-room memory — not a live engine.",
    engine: "archive-plates",
    archive: "overlay-cinder",
  },
];

export function getExhibit(id: string): Exhibit | undefined {
  return exhibits.find((e) => e.id === id);
}

/** Wing grids exclude atelier annex plates (they live on Index). */
export function exhibitsByWing(wing: WingId): Exhibit[] {
  return exhibits.filter((e) => e.wing === wing && e.engine !== "archive-plates");
}

export function annexExhibits(): Exhibit[] {
  return exhibits.filter((e) => e.engine === "archive-plates");
}

export { wings };
