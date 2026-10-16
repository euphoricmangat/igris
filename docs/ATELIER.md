# Atelier

Offline plates. They are not live engines. Visitors scrub frames. The baker does not run in the browser.

## Commands

From `igris/`:

```bash
python -m pip install -r tools/atelier/requirements.txt
python tools/atelier/generate_plates.py
```

npm alias: `npm run atelier` (same script). Dependencies in `tools/atelier/requirements.txt`: Pillow, NumPy.

## Baker

`tools/atelier/generate_plates.py`

- Output root: `public/archive/`
- Frame size: 960×720
- Writes `public/archive/<set>/frame-*.png`, a per-set `manifest.json`, and `public/archive/manifest.json`
- Seeded RNG. Film grain via `film_grain`. Comic cells via `comic_panel` moods `day`, `night`, `ember`.

Sets written:

| Folder | Kind |
|--------|------|
| `reel-sprocket-01` | filmstrip |
| `reel-nocturne` | filmstrip |
| `reel-ember` | filmstrip |
| `overlay-mill` | layers |
| `overlay-halide` | layers |
| `overlay-cinder` | layers |

## Runtime

| Piece | Path |
|-------|------|
| Set list | `ANNEX_SETS` in `lib/museum/archive.ts` |
| URL helpers | `archiveFolderUrl`, `archiveFrameUrl` |
| Types | `ArchiveSetManifest`, `ArchiveRootManifest` |
| Stage | `ArchivePlateStage` in `components/museum/ArchivePlateViewer.tsx` |
| Index grid | `components/museum/ArchiveAnnex.tsx` (`id="atelier"`) |
| Catalog rows | `archive-*` in `lib/museum/exhibits.ts` (`engine: "archive-plates"`, `archive: "<folder>"`) |

Wing pages and corridor doors exclude these rows. Index includes them only inside the annex, not in the flat live catalog (`exhibits.filter(engine !== "archive-plates")` on `app/index/page.tsx`).

## When to re-bake

Re-run the script only if you change the baker (palette, frame count, size, set id). Then commit the new PNGs and manifests together with the script.

Do not re-bake to “fix” the Index card color. That is CSS on `ArchiveAnnex.tsx`: `bg-[rgba(232,228,220,0.2)]`. Align that panel to the nocturne vault; leave the pixels unless the plate art itself is wrong.

If you add a set: create it in the Python script, add the folder to `ANNEX_SETS`, add an exhibit with `engine: "archive-plates"` and `archive` set to the folder, and re-bake.
