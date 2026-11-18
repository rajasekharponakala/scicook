# Masala Lab Atlas: Interactive Science of Indian Cooking

An unofficial, fan-made visual study companion to the food science in Krish Ashok's *Masala Lab*.
It is a static site with no build step needed to view it. Open `index.html` or visit the GitHub Pages URL.

## What's inside

| Chapter | Interactive science graphics |
|---|---|
| 1 · Heat & Pressure | Draggable 0–480 °C thermal band, animated H₂O kinetic simulation (v<sub>rms</sub> = √(3RT/M), ice/liquid/steam phases), boiling point vs altitude & pressure-cooker chart (Antoine + barometric equations), smoke-point chart, pressure timer |
| 2 · Spices | 23-spice molecular pairing network coloured by chemical class, **real skeletal structures** of 45 flavour molecules (SmilesDrawer), capsaicin structure, Scoville log chart, blend clouds |
| 3 · Maillard | Onion cross-section that browns outside-in with moisture/browning meters, Maillard reaction-pathway diagram, structures for each flavour family |
| 4 · Acid | Draggable pH scale with live [H₃O⁺] and "× more acidic than water" readout |
| 5 · Umami | Yamaguchi synergy model `y = u + γuv` with sliders and synergy curve |
| 6 · Modernist | Animated microwave standing wave with E² heat map on the papad |
| 7 · Generators | Gravy, bread hydration, brine, chutney, salad and rice engines |
| 8 · Biryani | SVG swim-lane Gantt (click bars, saved locally), ring countdown timer with alarm, A/B log with CSV export |

Also: command palette (`/` or `Ctrl K`) that searches every tool, deep links (`#ch4`, `#sec-umami`),
4 themes (saved, and following the OS dark mode setting), keyboard access for SVG graphics, and reduced-motion support.

## Develop

```bash
npm install
npm run build   # recompiles assets/css/tailwind.css from classes used in index.html + assets/js
npm run serve   # http://localhost:8080
```

`assets/css/tailwind.css` is committed so the site also works straight from disk.
Pushes are deployed by `.github/workflows/pages.yml`.

## Fixes over the original single-file version

- 1.9 MB HTML with base64 images duplicated beside the asset files → split HTML/CSS/JS, WebP images (1.3 MB → 92 KB), lazy loading
- Tailwind Play CDN (not meant for production) → precompiled CSS; Chart.js vendored locally, with a fallback message if a chart fails to load
- Stored XSS: A/B log entries and search text were written into `innerHTML` unescaped → escaped
- Deleting every log entry brought the sample data back on reload → an empty log now stays empty
- Timer drifted in background tabs (decrementing `setInterval`) → wall-clock based, with alarm sound and tab-title countdown
- Thermal readout used the *nearest* milestone (e.g. 240 °C showed "Ghee smoke point") → shows the regime you have actually reached
- Home search claimed to find tools ("garlic", "brine") but only searched chapter blurbs → full tool index with jump-to links
- No URL routing, theme not remembered, biryani progress lost on reload, microwave diagram invisible in dark mode, charts ignored non-dark themes, tabs/SVG nodes not keyboard accessible, no focus styles → all fixed

## Disclaimer

Not affiliated with or endorsed by Krish Ashok or the publisher. Page references point to the book. Please buy it.
