# Fidelity law

Expand densifies the same sculpture. It does not restage it.

Visitor copy already says this on `/` and `/about`. Code comments in `components/museum/GalleryRig.tsx` and `components/wings/AlcoveRibbon.tsx` repeat it. Treat those as binding.

## Rules

1. **One lighting recipe.** `GalleryRig` uses the same background (`#0e0e10`), ambient, key directional, crimson point, warehouse environment, contact shadows, and bloom for `"thumb"` and `"full"`.
2. **Bloom stays on.** Full may raise bloom intensity slightly (currently `0.3` thumb, `0.36` full). Never toggle the composer off on thumbs.
3. **Materials stay in one family.** Do not change metalness, transmission color, emissive color, or environment preset because `expanded` flipped. Tube radius, emissive intensity, and chromatic amount should match closed and open.
4. **Density is the Expand delta.** Allowed: DPR cap, segment counts, particle caps, transmission `samples` / `resolution`, shadow blur softness. Use `qualityScale(expanded, thumb, full)` in `lib/museum/qualityScale.ts` for numbers.
5. **Presence is motion, not look.** `GalleryPresenceCam` eases the camera on full enter. It must not change lights.
6. **Same component.** Thumb and Expand both render `ExhibitStage` for that engine. Do not mount a different scene when `expanded` is true.

## Hydration

- `useSeededParams` always starts from the defaults argument. Visitor seeds load inside `useEffect`. Do not read `localStorage` in `useState` initializers.
- R3F `Canvas` renders only inside `ClientMount`. A server render of `<Canvas>` mismatches the client.
- Spektral: paint the Canvas fallback first, then upgrade to WebGPU after mount if available. Do not leave a blank stage while the GPU path is pending.

## Checklist before changing a WebGL stage or Expand

- [ ] Thumb and full share `GalleryRig` (or, for canvas works, the same clear/vignette recipe).
- [ ] No `quality === "full"` branch that changes color, emissive base, or environment.
- [ ] `expanded` only changes counts, DPR, samples, or resolution.
- [ ] Slider defaults match between thumb and full (do not bake `expanded` into the initial seed object).
- [ ] Closed Crystal and expanded Crystal still read as the same glass. Use Shadow Crystal (`alcove-crystal`) as the parity check.
- [ ] Reduced motion still settles springs (`preferReducedMotion` in `lib/museum/spring.ts`).

## What went wrong before

Earlier thumbs used a different environment and bloom-off path than Expand. The sculpture changed identity when the visitor pressed Expand. That split was removed. Do not reintroduce a “studio look” that only exists at one quality.
