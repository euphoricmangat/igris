# Catalog

Source of truth: `lib/museum/exhibits.ts` and `lib/museum/wings.ts`. The router is `components/museum/ExhibitStage.tsx`. Interaction one-liners live in `lib/museum/interactionHints.ts`.

Year on every accession is `2026`. Annex plates are tagged `wing: "forge"` so they have a type, but wing grids and corridor doors drop `engine === "archive-plates"`. They appear on `/index` only.

## Wings

| Id | Title | Medium | Hero exhibit (first non-annex) |
|----|-------|--------|--------------------------------|
| `paradox` | Paradox | Closed loops · Canvas | `paradox-cascade` |
| `locus` | Locus | Pts.js · Generative drawing | `locus-constellation` |
| `alcove` | Alcove | WebGL · Three.js | `alcove-ribbon` |
| `field` | Field | Continuous media · Springs | `field-ember` |
| `signal` | Signal | Kinetic · Spektral / Canvas | `signal-swarm` |
| `forge` | Forge | Kinetic sculpture · Canvas | `forge-plotter` |

`/wing/relief` is a static param that redirects to `/wing/paradox`.

## Paradox

| Id | Accession | Title | Engine | Component | Hint |
|----|-----------|-------|--------|-----------|------|
| `paradox-cascade` | IGR.PDX.001 | Endless Cascade | `endless-cascade` | `components/wings/EndlessCascadeStage.tsx` | steer join · hold raises flow · Expand denser |
| `paradox-tread` | IGR.PDX.002 | Closed Tread | `closed-tread` | `components/wings/ClosedTreadStage.tsx` | hold to load · Drive / Load · Expand |
| `paradox-fountain` | IGR.PDX.003 | Fountain Knot | `fountain-knot` | `components/wings/FountainKnotStage.tsx` | move to coil · Beads · Expand denser |

Mediums: closed water loop, self-driving belt, returning stream.

## Locus

| Id | Accession | Title | Engine | Component | Hint |
|----|-----------|-------|--------|-----------|------|
| `locus-constellation` | IGR.LOC.001 | Night Lattice | `pts-locus` | `components/wings/PtsLocusStage.tsx` | drag well · click seed · Expand denser lattice |
| `locus-current` | IGR.LOC.002 | Invisible Current | `flow-field` | `components/wings/FlowFieldStage.tsx` | steer · hold pull · Viscosity on Expand |
| `locus-horizon` | IGR.LOC.003 | Unknown Pleasures | `joy-division` | `components/wings/JoyDivisionStage.tsx` | drag / scroll peaks · Sense on Expand |
| `locus-pack` | IGR.LOC.004 | Colony | `circle-pack` | `components/wings/CirclePackStage.tsx` | hold grow · Auto toggle on Expand |
| `locus-tiles` | IGR.LOC.005 | Ten Thousand Cuts | `tiled-lines` | `components/wings/TiledLinesStage.tsx` | click / drag flip · Expand finer grid |
| `locus-attractor` | IGR.LOC.006 | Clifford Vein | `strange-attractor` | `components/wings/StrangeAttractorStage.tsx` | move reshape · hold deepen · Reset on Expand |

## Alcove

| Id | Accession | Title | Engine | Component | Hint |
|----|-----------|-------|--------|-----------|------|
| `alcove-ribbon` | IGR.ALC.001 | Blood Ribbon | `alcove-ribbon` | `components/wings/AlcoveRibbon.tsx` | drag to orbit · move to coil · hold to tighten · Expand |
| `alcove-crystal` | IGR.ALC.002 | Shadow Crystal | `alcove-crystal` | `components/wings/AlcoveCrystal.tsx` | drag to orbit · glass catches light · Expand |
| `alcove-orb` | IGR.ALC.003 | Monarch Knot | `alcove-orb` | `components/wings/AlcoveOrb.tsx` | drag to orbit · light follows pointer · Expand |

All three sit inside `GalleryRig`. Expand changes DPR and mesh density (ribbon segments, crystal transmission samples), not the material family.

## Field

| Id | Accession | Title | Engine | Component | Hint |
|----|-----------|-------|--------|-----------|------|
| `field-ember` | IGR.FLD.001 | Ember Wake | `ember-wake` | `components/wings/EmberWakeStage.tsx` | trail ember · Linger / Spawn · Expand denser |
| `field-iron` | IGR.FLD.002 | Iron Lattice | `iron-lattice` | `components/wings/IronLatticeStage.tsx` | move pole · hold strengthen · Spring / Pole |
| `field-sheet` | IGR.FLD.003 | Harmonic Sheet | `harmonic-sheet` | `components/wings/HarmonicSheetStage.tsx` | dip sheet · Spring / Ripple · Expand |

Harmonic Sheet is R3F. Ember and Iron are canvas.

## Signal

| Id | Accession | Title | Engine | Component | Hint |
|----|-----------|-------|--------|-----------|------|
| `signal-swarm` | IGR.SIG.001 | Shadow Swarm | `particle-life` | `components/wings/ParticleLifeStage.tsx` | burst · magnet · Friction / Magnet · Expand denser |
| `signal-pulse` | IGR.SIG.002 | Monarch Pulse | `spektral-pulse` | `components/wings/SpektralPulse.tsx` | rings · kick · Speed / Rings · Expand |
| `signal-tissue` | IGR.SIG.003 | Living Tissue | `reaction-diffusion` | `components/wings/ReactionDiffusionStage.tsx` | paint · F / K · Expand |
| `signal-meteor` | IGR.SIG.004 | Ashfall | `meteor` | `components/wings/MeteorStage.tsx` | shower · Ambient / Size · Expand |

## Forge

| Id | Accession | Title | Engine | Component | Hint |
|----|-----------|-------|--------|-----------|------|
| `forge-plotter` | IGR.FRG.001 | Plotter Arm | `plotter-arm` | `components/wings/PlotterArmStage.tsx` | steer · hold ink · Ink / Ambient · double-click clear |
| `forge-cam` | IGR.FRG.002 | Cam Press | `cam-press` | `components/wings/CamPressStage.tsx` | hold rush · move steers stamp · Speed / Ink |
| `forge-pendulum` | IGR.FRG.003 | Sand Pendulum | `sand-pendulum` | `components/wings/SandPendulumStage.tsx` | pluck · click clear · idle drive |

## Atelier annex (Index only)

Viewer: `components/museum/ArchivePlateViewer.tsx` via engine `archive-plates`. Folders under `public/archive/`. Hint for all: scrub frames · Prev / Next · Expand for full window.

| Id | Accession | Title | Folder | Kind |
|----|-----------|-------|--------|------|
| `archive-ember` | IGR.ANN.001 | Ember Register | `reel-ember` | filmstrip |
| `archive-nocturne` | IGR.ANN.002 | Nocturne Cut | `reel-nocturne` | filmstrip |
| `archive-mill` | IGR.ANN.003 | Mill Room | `overlay-mill` | overlay |
| `archive-sprocket` | IGR.ANN.004 | Sprocket Opera | `reel-sprocket-01` | filmstrip |
| `archive-halide` | IGR.ANN.005 | Halide Chamber | `overlay-halide` | overlay |
| `archive-cinder` | IGR.ANN.006 | Cinder Press | `overlay-cinder` | overlay |

Set list constant: `ANNEX_SETS` in `lib/museum/archive.ts`.

## Unwired stage files

Not referenced by `ExhibitStage.tsx`. Not in `exhibits.ts`. Not visitable.

| File | Notes |
|------|--------|
| `components/wings/BrixelLifeStage.tsx` | Grid life; has its own `GalleryRig` usage |
| `components/wings/FlipFieldStage.tsx` | Pointer field; was easy to ship with `pointer-events: none` on thumbs |
| `components/wings/NeedleChorusStage.tsx` | Instanced needles under `GalleryRig` |

Decision recorded for the next AI: do not add a seventh wing to house them. Either delete them or replace a basic canvas engine only after that engine’s refinement plan in [EXHIBIT_QUALITY.md](EXHIBIT_QUALITY.md) is rejected.
