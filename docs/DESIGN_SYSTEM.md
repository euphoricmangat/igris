# Design system

Tokens live in `app/globals.css`. Fonts load in `app/layout.tsx`. Do not invent a second palette for a single exhibit.

## Color

| Token | Value | Use |
|-------|--------|-----|
| `--void` | `#0a0a0c` | Page ground |
| `--void-lift` | `#121218` | Gradient lift |
| `--plaster` | `#16161c` | Secondary dark |
| `--concrete` | `#2a2a30` | Rare mid tone |
| `--beam`, `--ink`, `--paper` | `#e8e4dc` | Type and highlights |
| `--ink-soft` | `rgba(232, 228, 220, 0.62)` | Secondary copy |
| `--steel` | `#a8a49c` | Eyebrows on the veil |
| `--line` | `rgba(232, 228, 220, 0.14)` | Hairlines |
| `--line-strong` | `rgba(232, 228, 220, 0.28)` | Frames |
| `--accent` | `#b91c1c` | CTA, door beam, slider accent |
| `--accent-soft` | `#dc2626` | CTA hover |

Stage void inside WebGL is `#0e0e10` (`GalleryRig` and canvas stages). Keep it. It is the aperture, not the page.

Body background is a fixed red wash plus a paper wash over a void gradient, plus a fixed grain overlay (`body::before`, `mix-blend-mode: overlay`, opacity `0.045`). Reduced motion removes the grain.

## Type

| Role | Family | CSS |
|------|--------|-----|
| Display | Syne 500–800 | `font-[family-name:var(--font-syne)]`, headings in `globals.css` |
| Body | DM Sans | `--font-dm` on `body` |
| Meta | Geist Mono | `.eyebrow`, `.accession` |

`.eyebrow`: uppercase, `letter-spacing: 0.28em`, `0.68rem`.

`.accession`: `0.72rem`, `letter-spacing: 0.08em`.

Do not set Inter, Roboto, Arial, or a system stack on new UI.

## Chrome classes

| Class | Role |
|-------|------|
| `.door` | Corridor and landing thresholds. Hover lifts, crimson edge, breathing dot via `::after`. |
| `.stage-frame` | 16:10 vault aperture, inset shadow. Wing grid and exhibit page. |
| `.stage-host` | Fills the frame; canvas must be `width/height: 100%`. |
| `.placard` | Top rule under exhibit copy. |
| `.sprocket-rail` | Drifting tick row. Reduced motion stops it. |
| `.door-beam` | Opacity pulse on corridor status dots. |
| `.animate-rise`, `.animate-page-in` | Short entrance. Disabled under `prefers-reduced-motion`. |

Controls: `StageControlStrip` is `pointer-events-none` so the stage stays playable; each slider and toggle opts back in with `pointer-events-auto`. Slider accent is `accent-[var(--accent)]`.

## Banned looks

- Purple-on-white or purple-to-indigo gradients.
- Warm cream page (`#F4F1EA`) with terracotta and a high-contrast serif.
- Broadsheet: hairline newspaper columns as the page idea.
- Dark-mode clichés used as decoration: glow stacks, pill clusters, multi-layer shadows, emoji.
- Cards in the hero. `.door` and `.stage-frame` exist because they are the interaction container, not because every block needs a box.
- A second accent. Crimson is the only signal color.

## Shell files

| UI | Path |
|----|------|
| Header | `components/ui/Header.tsx` |
| Footer | `components/ui/Footer.tsx` |
| Landing | `app/page.tsx` |
| Curtain shader | `components/museum/LobbyCurtain.tsx` |
| About | `app/about/page.tsx` |
