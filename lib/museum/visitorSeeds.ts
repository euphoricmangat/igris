export interface VisitorSeed {
  id: string;
  exhibitId: string;
  accession: string;
  title: string;
  at: number;
  hue: number;
  /** Optional stage control snapshot */
  params?: Record<string, number>;
}

const KEY = "igris.visitor-seeds.v1";
const MAX = 48;

function safeParse(raw: string | null): VisitorSeed[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as VisitorSeed[];
    return Array.isArray(data) ? data.filter((s) => s?.id && s?.exhibitId) : [];
  } catch {
    return [];
  }
}

export function loadVisitorSeeds(): VisitorSeed[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(KEY));
}

export function saveVisitorSeed(input: {
  exhibitId: string;
  accession: string;
  title: string;
  params?: Record<string, number>;
}): VisitorSeed {
  const seed: VisitorSeed = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    exhibitId: input.exhibitId,
    accession: input.accession,
    title: input.title,
    at: Date.now(),
    hue: Math.floor(Math.random() * 28),
    params: input.params && Object.keys(input.params).length ? { ...input.params } : undefined,
  };
  const next = [seed, ...loadVisitorSeeds().filter((s) => s.exhibitId !== input.exhibitId)].slice(
    0,
    MAX
  );
  localStorage.setItem(KEY, JSON.stringify(next));
  return seed;
}

export function clearVisitorSeeds() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
