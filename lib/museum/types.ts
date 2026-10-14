export type WingId = "relief" | "locus" | "alcove" | "field" | "signal" | "forge";

export type EngineKind =
  | "brixel-life"
  | "flip-field"
  | "needle-chorus"
  | "pts-locus"
  | "flow-field"
  | "joy-division"
  | "circle-pack"
  | "tiled-lines"
  | "strange-attractor"
  | "alcove-ribbon"
  | "alcove-crystal"
  | "alcove-orb"
  | "ember-wake"
  | "iron-lattice"
  | "harmonic-sheet"
  | "particle-life"
  | "reaction-diffusion"
  | "spektral-pulse"
  | "meteor"
  | "plotter-arm"
  | "cam-press"
  | "sand-pendulum";

export interface Exhibit {
  id: string;
  wing: WingId;
  title: string;
  medium: string;
  year: string;
  accession: string;
  blurb: string;
  engine: EngineKind;
  /** Optional atelier plate folder under /archive */
  archive?: string;
}

export interface WingMeta {
  id: WingId;
  title: string;
  subtitle: string;
  medium: string;
}
