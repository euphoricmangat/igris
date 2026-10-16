# Igris

A nocturne vault of living sculpture — six wings in the browser, plus an offline atelier of baked plates.

The shell is ahead of the engines. Another AI should start at [docs/README.md](docs/README.md), then [docs/HANDOFF.md](docs/HANDOFF.md).

## Develop

```bash
npm install
python -m pip install -r tools/atelier/requirements.txt
python tools/atelier/generate_plates.py
npm run dev
```

`npm run atelier` bakes the same plates into `public/archive/`. Details: [docs/ATELIER.md](docs/ATELIER.md). Dev and verification: [docs/RUNBOOK.md](docs/RUNBOOK.md).
