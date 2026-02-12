# 3D Golf Simulator Configurator

A lightweight browser-based configurator for sales demos. It allows your team to tune room dimensions, package tier, handedness, and add-ons while showing a live 3D room layout and instant pricing recommendations.

## Run locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## What it includes

- Live 3D room model (Three.js) with orbit controls.
- Room size and handedness controls that reposition hitting area hardware.
- Package and add-on pricing calculator with quote-ready total.
- Automated recommendations for fit, projector type, and enclosure size.
