# Runbook

## Install and dev

From `igris/`:

```bash
npm install
python -m pip install -r tools/atelier/requirements.txt
python tools/atelier/generate_plates.py
npm run dev
```

`next dev` binds port 3000. If that port is already this app, the new process exits and tells you the existing PID. Use `http://localhost:3000`. Do not start a second server on 3001 unless you killed the first.

```bash
npm run lint
npm run build
```

`npm run build` is the check before handing the branch off. Plate baking is not part of `build`; missing `public/archive/` makes annex pages empty, not a compile failure.

## Open these first

| Question | File |
|----------|------|
| Where does an engine mount? | `components/museum/ExhibitStage.tsx` |
| What is on the wall? | `lib/museum/exhibits.ts` |
| Lighting / Expand look | `components/museum/GalleryRig.tsx` |
| Thumb vs full numbers | `lib/museum/qualityScale.ts` |
| Why hydration broke | `hooks/useSeededParams.ts`, `components/museum/ClientMount.tsx` |
| What to refine | `docs/EXHIBIT_QUALITY.md` |
| What not to break | `docs/FIDELITY.md` |

## Verification tour

Dev server up. Walk this in order. Screenshot if a step fails.

1. **`/`** — Syne wordmark, wavy curtain (not a flat black hero), crimson “Enter the corridor”. Move the pointer: the veil should warp toward it (`LobbyCurtain` uniform `uPointer`).
2. **`/corridor`** — Six doors. Paradox, Locus, and Alcove show a living vignette behind the type. Doors link to `/wing/<id>`.
3. **`/wing/paradox`** — Three stages, each with a `StageControlStrip`. Pointer on the canvas changes the machine. Thumbs are not `pointer-events: none`.
4. **`/exhibit/alcove-crystal`** — Glass, Spin, Cast. Expand. The octahedron, crimson bar, and paper bar stay. Esc closes. Full window is denser refraction, not a different studio.
5. **`/exhibit/paradox-cascade`** — Flow and Join visible closed and expanded. This is the baseline the refinement pass must beat; do not treat today’s stroke loop as finished.
6. **`/index#atelier`** — Six plate cards scrub or link. Live catalog above them excludes annex rows.
7. **`/wing/relief`** — Redirects to `/wing/paradox`.

## Reduced motion

OS “reduce motion” disables sprocket drift, page rise, and grain, and springs should snap (`preferReducedMotion`). Do not remove those branches when adding trails.

## Secrets

None. Visitor seeds are `localStorage` only (`igris.visitor-seeds.v1`). Do not add a backend in a refinement pass.
