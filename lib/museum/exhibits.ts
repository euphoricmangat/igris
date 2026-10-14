import type { Exhibit, WingId } from "./types";
import { wings } from "./wings";

export const exhibits: Exhibit[] = [
  // ── Relief ────────────────────────────────────────
  {
    id: "relief-brixel",
    wing: "relief",
    title: "Brixel Life",
    medium: "Conway pin relief",
    year: "2026",
    accession: "IGR.RLF.001",
    blurb:
      "A brushed-metal pin board obeying Conway’s rules — births rise, deaths sink, and your hand disturbs the field before it settles.",
    engine: "brixel-life",
  },
  {
    id: "relief-flip",
    wing: "relief",
    title: "Flip Field",
    medium: "Motorized flip discs",
    year: "2026",
    accession: "IGR.RLF.002",
    blurb:
      "Discs rotate with travel time and overshoot — drag a wake of flips across the board and watch them settle.",
    engine: "flip-field",
  },
  {
    id: "relief-needles",
    wing: "relief",
    title: "Needle Chorus",
    medium: "Spring needle bed",
    year: "2026",
    accession: "IGR.RLF.003",
    blurb:
      "A traveling wave drives a bed of spring needles; the pointer pulls them like a magnet before they return to rhythm.",
    engine: "needle-chorus",
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
    blurb: "A slow helical ribbon of light — steel and crimson orbiting a silent core.",
    engine: "alcove-ribbon",
  },
  {
    id: "alcove-crystal",
    wing: "alcove",
    title: "Shadow Crystal",
    medium: "WebGL refraction study",
    year: "2026",
    accession: "IGR.ALC.002",
    blurb: "Faceted glass catching gallery light; the crystal turns as if remembering a fight.",
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
    medium: "WebGPU fragment pulse",
    year: "2026",
    accession: "IGR.SIG.002",
    blurb: "A full-frame WGSL heartbeat — crimson rings bloom and collapse on the GPU.",
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
];

export function getExhibit(id: string): Exhibit | undefined {
  return exhibits.find((e) => e.id === id);
}

export function exhibitsByWing(wing: WingId): Exhibit[] {
  return exhibits.filter((e) => e.wing === wing);
}

export { wings };
