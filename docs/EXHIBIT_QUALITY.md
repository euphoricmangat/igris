# Exhibit quality

Tiers describe the code as it is, not the placard copy. “Strong” means the piece can sit in the vault without looking like a tutorial. Critique belongs here; laws belong in [FIDELITY.md](FIDELITY.md).

## Tiers

| Tier | Meaning |
|------|---------|
| Strong | Material or residue, idle motion, Expand is density, controls change a physical parameter |
| Mid | Real system (springs, chemistry, arm, trail) but still a flat field or thin drawing at thumb size |
| Basic | Clear-and-stroke or textbook diagram; Expand mostly raises counts |

## By engine

| Engine | Tier | Why |
|--------|------|-----|
| `alcove-ribbon` | Strong | Tube, filament, beads, springs, shared rig. Expand = segments. |
| `alcove-crystal` | Strong | Transmission glass, same attenuation family. Expand = samples/resolution. Parity reference. |
| `alcove-orb` | Strong | Knot + shell under the same rig. Spin/Shell do not restage it. |
| `harmonic-sheet` | Strong | Spring mesh, gallery light. Already at the control-bar standard. |
| `sand-pendulum` | Mid | Double pendulum, ember floor, idle drive, Damp/Sand. Still a 2D drawing of a machine. |
| `plotter-arm` | Mid | Two-joint writer with ink memory. Body is schematic. |
| `cam-press` | Mid | Cam, stamp, bloom stamp. Reads as a diagram of a press. |
| `ember-wake` | Mid | Additive wake + idle Lissajous. Atmosphere without a body. |
| `particle-life` | Mid | Species dynamics and controls. Calligraphy, not sculpture. |
| `reaction-diffusion` | Mid | Gray–Scott with F/K. Chemically real, visually a texture. |
| `spektral-pulse` | Mid | Rings; WebGPU path with canvas fallback. Easy to look empty while pending. |
| `endless-cascade` | Basic | Loop positions and drops on a hard clear. |
| `closed-tread` | Basic | Belt ticks and a hub. Little mass. |
| `fountain-knot` | Basic | Bead path. The “knot” is a polyline. |
| `pts-locus` | Basic | Point constellation. |
| `flow-field` | Basic | Filament field. Soft trails help; still a demo. |
| `joy-division` | Basic | Stacked horizons. |
| `circle-pack` | Basic | Growing circles. |
| `tiled-lines` | Basic | Slash grid. |
| `strange-attractor` | Basic | Attractor etch. Best Locus candidate to raise first. |
| `iron-lattice` | Basic | Filings as strokes. Metaphor is good; drawing is thin. |
| `meteor` | Basic | Streaks on a clear. |
| `archive-plates` | Mid | Baked frames are fine. Index cards use a light panel fill that breaks the vault. |

## Priority

Work in this order. Finish one engine to the definition of done in [HANDOFF.md](HANDOFF.md) before starting the next.

1. **Paradox trio** — `EndlessCascadeStage.tsx`, `ClosedTreadStage.tsx`, `FountainKnotStage.tsx`.
2. **Two Locus works** — `StrangeAttractorStage.tsx`, then `FlowFieldStage.tsx`.
3. **Iron and Ashfall** — `IronLatticeStage.tsx`, `MeteorStage.tsx`.
4. **Annex chrome** — `components/museum/ArchiveAnnex.tsx` aligned to `.stage-frame` / nocturne tokens. Do not re-bake plates unless the baker output itself changes.
5. **Orphans** — delete `BrixelLifeStage.tsx`, `FlipFieldStage.tsx`, `NeedleChorusStage.tsx` if they are still unwired after the pass. Do not spend the pass porting them.

Leave Alcove and Harmonic Sheet alone except to fix a fidelity regression.

## Refinement directions

These are constraints on the next edit, not new products. Stay inside the existing component. Do not add a second scene for Expand.

### Paradox — Endless Cascade

File: `components/wings/EndlessCascadeStage.tsx`.

- Replace the full-frame opaque clear with a dark fade (low alpha rect) so droplets leave a wet trail.
- Draw the channel as a volume: outer wall, inner wall, and a highlight along the impossible climb, not a single stroke.
- Drops should vary size with `params.flow` and cluster at the join biased by `params.join`.
- Idle: keep water moving when the pointer is outside. Hold already raises flow — keep that.
- Expand: raise drop cap via `qualityScale` only. Same palette (`#0e0e10` void, `#b91c1c` accent, `#e8e4dc` paper).

### Paradox — Closed Tread

File: `components/wings/ClosedTreadStage.tsx`.

- Give the belt thickness, a shadow under the wheel, and tick marks that compress when Load is high.
- Motion blur or a short history of the tread so a thumb-sized canvas still reads as turning.
- Expand: more ticks / higher DPR, same metal and crimson.

### Paradox — Fountain Knot

File: `components/wings/FountainKnotStage.tsx`.

- Draw the knot as a ribbon with width, not a hairline. Beads are the stream; the path should stay visible when beads are sparse.
- Coil should twist the path, not only offset it.
- Expand: more beads through `qualityScale`.

### Locus — Clifford Vein

File: `components/wings/StrangeAttractorStage.tsx`.

- Accumulate into an offscreen buffer (same pattern as Sand Pendulum’s floor) so the vein builds instead of redrawing a fresh plot.
- Pointer reshape should disturb the live head; the buffer keeps the past.
- Expand: more iterations per frame, same ash and crimson.

### Locus — Invisible Current

File: `components/wings/FlowFieldStage.tsx`.

- Longer, fading trails. A few dozen bright heads and a dim history.
- Hold-pull should bend vectors locally and spring back (`springStep`), not teleport the field.
- Expand: more filaments, same ink.

### Iron Lattice and Ashfall

- Iron: short segments aligned to the pole with a spring, plus a faint settled dust layer that does not clear every frame.
- Meteor: persistent ash on a buffer; new streaks are the event. Click still calls a shower.

### What not to do while refining

- Do not introduce a new accent (no cyan UI, no purple bloom).
- Do not wrap canvas stages in `GalleryRig` unless you are porting the whole sculpture to meshes. A 2D piece should share the void color and vignette, not fake a 3D studio.
- Do not hide controls on thumbs. The Knot bar (`StageControlStrip`) is the visit standard.
- Do not gate interaction behind Expand. Thumbs on the wing wall must receive pointer events (`ExhibitThumb` does; corridor vignettes intentionally do not).
