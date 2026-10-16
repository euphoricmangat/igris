/** Live stage params keyed by exhibit id — snapshotted into visitor seeds. */

const live = new Map<string, Record<string, number>>();

export function setLiveParams(exhibitId: string, params: Record<string, number>) {
  live.set(exhibitId, { ...params });
}

export function getLiveParams(exhibitId: string): Record<string, number> | undefined {
  const p = live.get(exhibitId);
  return p ? { ...p } : undefined;
}
