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
- **Exercise page**: photos, instructions, primary/secondary muscles on a body map, progress chart.
- **Programs**: add exercises with sets × reps, reorder, see the muscles the program works.
- **Workout**: log reps/kg per set (prefilled from last time); the draft survives a page reload.
- **History**: past workouts.

## Credits
- Exercise data and photos: [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (Unlicense). `src/data/exercises.json` is a copy of `dist/exercises.json`; photos load from GitHub and are cached offline once seen.
- Body map: [react-body-highlighter](https://github.com/GV79/react-body-highlighter) (MIT).
