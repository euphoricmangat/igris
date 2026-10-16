"use client";

import { useEffect, useState } from "react";
import { setLiveParams } from "@/lib/museum/exhibitParams";
import { loadVisitorSeeds } from "@/lib/museum/visitorSeeds";

/**
 * Restore params from the latest visitor seed for this exhibit; keep live map updated.
 * Always start from defaults so SSR HTML matches the first client paint (seeds load in effect).
 */
export function useSeededParams<T extends Record<string, number>>(
  exhibitId: string | undefined,
  defaults: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [params, setParams] = useState<T>(defaults);

  useEffect(() => {
    if (!exhibitId) return;
    const seed = loadVisitorSeeds().find((s) => s.exhibitId === exhibitId);
    if (!seed?.params) return;
    setParams((prev) => ({ ...prev, ...seed.params }) as T);
  }, [exhibitId]);

  useEffect(() => {
    if (!exhibitId) return;
    setLiveParams(exhibitId, params);
  }, [exhibitId, params]);

  return [params, setParams];
}
