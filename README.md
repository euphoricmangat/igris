# Igris

A nocturne vault of living sculpture — six wings in the browser, plus an offline atelier of baked plates.

The shell is ahead of the engines. Give the next AI [docs/IGRIS.md](docs/IGRIS.md) — the whole brief in one file.

## Develop

```bash
npm install
python -m pip install -r tools/atelier/requirements.txt
python tools/atelier/generate_plates.py
npm run dev
```

`npm run atelier` bakes the same plates into `public/archive/`. Details: [docs/ATELIER.md](docs/ATELIER.md). Dev and verification: [docs/RUNBOOK.md](docs/RUNBOOK.md).
