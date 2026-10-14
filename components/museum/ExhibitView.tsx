"use client";

import type { Exhibit } from "@/lib/museum/types";
import { ExhibitFullscreen } from "./ExhibitFullscreen";
import { InteractHint } from "./InteractHint";

export function ExhibitView({ exhibit }: { exhibit: Exhibit }) {
  return <ExhibitFullscreen exhibit={exhibit} />;
}

/** Hint shown below the stage frame on exhibit pages. */
export function ExhibitInteractChrome({ exhibit }: { exhibit: Exhibit }) {
  return <InteractHint engine={exhibit.engine} />;
}
