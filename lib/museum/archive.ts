export interface ArchiveSetManifest {
  accession: string;
  title: string;
  kind: "filmstrip" | "layers" | string;
  frames: string[];
  width: number;
  height: number;
}

export interface ArchiveRootManifest {
  generated_by: string;
  sets: string[];
}

/** Annex plate sets shown on Index and as archive accessions. */
export const ANNEX_SETS = [
  "reel-ember",
  "reel-nocturne",
  "overlay-mill",
  "reel-sprocket-01",
  "overlay-halide",
  "overlay-cinder",
] as const;

export function archiveFolderUrl(folder: string) {
  return `/archive/${folder}`;
}

export function archiveFrameUrl(folder: string, frame: string) {
  return `/archive/${folder}/${frame}`;
}
