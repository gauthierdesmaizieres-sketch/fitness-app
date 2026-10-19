# Fitness

Installable web app (PWA) to browse exercises by muscle, build programs, log workouts and track progress.
Everything is stored in the browser (localStorage); no account, no server.

**On your phone**: open https://gauthierdesmaizieres-sketch.github.io/fitness-app/ and use "Add to Home screen". Every push to `main` redeploys it.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # helper tests (node:test)
npm run build    # production build in dist/, with offline service worker
```

- **Exercises**: search and filter by muscle (dropdown or tap the body map) and equipment.
- **My gym**: tick the equipment your gym has; the list and the program builder only show exercises you can do there.
- **Exercise page**: photos, instructions, primary/secondary muscles on a body map, progress chart.
- **Programs**: add exercises with sets × reps, reorder, see the muscles the program works.
- **Workout**: log reps/kg per set; the draft survives a page reload. Each exercise is prefilled with a progression suggestion: +2.5 kg once every set reached the target reps (one more rep for bodyweight exercises), otherwise the same weight again.
- **Progress**: one chart per exercise with the best set of each session (kg, or reps for bodyweight).
- **History**: past workouts.
- **Themes** (picker in the header): Default, Saiyan and Hunter, manga-style looks (paper, ink panels, halftone, speed lines, Bangers font, exercise photos redrawn as inked manga panels by an SVG filter). Inspired by the series, no artwork from them.

## Credits
- Exercise data and photos: [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (Unlicense). `src/data/exercises.json` is a copy of `dist/exercises.json`; photos load from GitHub and are cached offline once seen.
- Body map: [react-body-highlighter](https://github.com/GV79/react-body-highlighter) (MIT).
