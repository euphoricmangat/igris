# Igris

A digital museum of living media — filmstrip, loci, WebGL alcoves, overlay mills, and kinetic signal.

## Develop

```bash
npm install
python tools/atelier/generate_plates.py
npm run dev
```

## Atelier

Offline Python pipeline bakes plates into `public/archive/` for Reel and Overlay wings.

```bash
python -m pip install -r tools/atelier/requirements.txt
python tools/atelier/generate_plates.py
```
