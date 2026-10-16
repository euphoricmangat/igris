# Handoff

You are the next owner of Igris. The shell is a nocturne museum. Most engines are still generative sketches inside that museum. Your job is to raise the sketches until they match the room.

Read [VISION.md](VISION.md) and [FIDELITY.md](FIDELITY.md) before editing a stage. Catalog and file paths: [CATALOG.md](CATALOG.md). Per-engine instructions: [EXHIBIT_QUALITY.md](EXHIBIT_QUALITY.md).

## Mission

Make Paradox, then Locus, readable as museum pieces beside Alcove — without a new site, a new wing, or an Expand that changes the sculpture.

## Do not touch first

- `app/page.tsx`, `components/museum/LobbyCurtain.tsx`, corridor layout, header, tokens in `app/globals.css`. The UI is not the complaint.
- `components/museum/GalleryRig.tsx` lighting recipe, unless a change violates [FIDELITY.md](FIDELITY.md) and you are reverting it.
- `components/wings/AlcoveRibbon.tsx`, `AlcoveCrystal.tsx`, `AlcoveOrb.tsx`, `HarmonicSheetStage.tsx`, except a regression fix.
- Atelier PNGs, unless you change `tools/atelier/generate_plates.py` on purpose.

## Backlog

| # | Task | Done when |
|---|------|-----------|
| 1 | Endless Cascade | Wet trail, channeled volume, idle flow. Expand only adds drops. See EXHIBIT_QUALITY. |
| 2 | Closed Tread | Belt has thickness and load compression. Thumb still reads as turning. |
| 3 | Fountain Knot | Ribbon path plus beads. Coil twists the path. |
| 4 | Clifford Vein | Offscreen accumulation. Pointer moves the head; history stays. |
| 5 | Invisible Current | Fading trails; hold bends the field and springs back. |
| 6 | Iron Lattice and Ashfall | Settled layer that is not cleared every frame. |
| 7 | Archive annex chrome | `ArchiveAnnex.tsx` loses `bg-[rgba(232,228,220,0.2)]` and uses the vault frame language. |
| 8 | Orphans | Delete `BrixelLifeStage.tsx`, `FlipFieldStage.tsx`, `NeedleChorusStage.tsx` if still unwired. |

One engine at a time. Run the [RUNBOOK.md](RUNBOOK.md) tour after each Paradox piece, including Crystal Expand parity so a shared edit did not restage the glass.

## Definition of done — one refined exhibit

- Wing thumb and exhibit page show the same machine, already moving with the pointer outside the canvas.
- A gesture changes a physical parameter and leaves residue for more than one frame.
- `StageControlStrip` is present and does not block the pointer on the drawing.
- `expanded` changes only counts or DPR (`qualityScale` or an equivalent numeric branch).
- Palette stays void `#0e0e10`, paper `#e8e4dc`, accent `#b91c1c`.
- `npm run build` passes.
- You can screenshot thumb and Expand and still name the work without reading the placard.

## How to add a control without breaking seeds

`useSeededParams(exhibitId, defaults)` must receive a stable default object shape. Do not put `expanded ? a : b` inside the default literal — that hydrates different HTML for the same exhibit. Density belongs in the draw loop, not in the seed.

## Reporting back

When a backlog row is finished, say which file changed, what residue or mass was added, and confirm Crystal closed vs Expand still match if you touched shared museum code.
