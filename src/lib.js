// free-exercise-db muscle -> react-body-highlighter muscle slugs
export const MUSCLE_MAP = {
  abdominals: ['abs', 'obliques'],
  abductors: ['abductors'],
  adductors: ['adductor'],
  biceps: ['biceps'],
  calves: ['calves', 'left-soleus', 'right-soleus'],
  chest: ['chest'],
  forearms: ['forearm'],
  glutes: ['gluteal'],
  hamstrings: ['hamstring'],
  lats: ['upper-back'],
  'lower back': ['lower-back'],
  'middle back': ['upper-back'],
  neck: ['neck'],
  quadriceps: ['quadriceps'],
  shoulders: ['front-deltoids', 'back-deltoids'],
  traps: ['trapezius'],
  triceps: ['triceps'],
}
export const MUSCLES = Object.keys(MUSCLE_MAP)

export const IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

const slugs = muscles => [...new Set(muscles.flatMap(m => MUSCLE_MAP[m] ?? []))]

// Body-map data: primary muscles weigh 2 (strong colour), secondary 1 (light colour).
export function bodyData(primary, secondary = []) {
  return [
    { name: 'primary', muscles: slugs(primary), frequency: 2 },
    { name: 'secondary', muscles: slugs(secondary).filter(s => !slugs(primary).includes(s)), frequency: 1 },
  ]
}

export const muscleFromSlug = slug => MUSCLES.find(m => MUSCLE_MAP[m].includes(slug)) ?? ''

export function filterExercises(list, { q = '', muscle = '', equipment = '' }) {
  const s = q.trim().toLowerCase()
  return list.filter(e =>
    (!s || e.name.toLowerCase().includes(s)) &&
    (!muscle || e.primaryMuscles.includes(muscle)) &&
    (!equipment || e.equipment === equipment))
}

// Heaviest weight lifted per session for one exercise, oldest first.
export function progression(sessions, exId) {
  return sessions
    .map(s => ({ date: s.date, sets: s.entries.find(e => e.exId === exId)?.sets ?? [] }))
    .map(({ date, sets }) => ({ date, weight: Math.max(0, ...sets.map(x => Number(x.weight) || 0)) }))
    .filter(p => p.weight > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Sets from the most recent session containing this exercise, to prefill a new workout.
export function lastSets(sessions, exId) {
  const s = [...sessions].sort((a, b) => b.date.localeCompare(a.date)).find(s => s.entries.some(e => e.exId === exId))
  return s?.entries.find(e => e.exId === exId).sets
}
