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

// Exercises with no equipment (or bodyweight) are always doable; an empty gym means "show everything".
export const inGym = (e, gym = []) => !gym.length || !e.equipment || e.equipment === 'body only' || gym.includes(e.equipment)

export function filterExercises(list, { q = '', muscle = '', equipment = '' }, gym = []) {
  const s = q.trim().toLowerCase()
  return list.filter(e =>
    (!s || e.name.toLowerCase().includes(s)) &&
    (!muscle || e.primaryMuscles.includes(muscle)) &&
    (!equipment || e.equipment === equipment) &&
    inGym(e, gym))
}

// Best set per session for one exercise, oldest first: heaviest weight, or most reps when done bodyweight.
export function progression(sessions, exId) {
  const done = sessions
    .map(s => ({ date: s.date, sets: s.entries.find(e => e.exId === exId)?.sets ?? [] }))
    .filter(p => p.sets.length)
    .sort((a, b) => a.date.localeCompare(b.date))
  const unit = done.some(p => p.sets.some(x => x.weight > 0)) ? 'kg' : 'reps'
  const points = done.map(({ date, sets }) => ({ date, value: Math.max(...sets.map(x => (unit === 'kg' ? x.weight : x.reps) || 0)) }))
  return { unit, points }
}

export const WEIGHT_STEP = 2.5 // kg, the smallest jump most gyms allow (two 1.25 kg plates)

// Double progression: once every set reached the target reps, add weight (or one rep when bodyweight);
// otherwise keep the weight and aim for the target again.
export function suggest(last, targetReps) {
  if (!last?.length) return null
  const weight = Math.max(...last.map(s => s.weight || 0))
  const reps = Math.max(...last.map(s => s.reps || 0))
  if (!last.every(s => s.reps >= targetReps)) return { weight, reps: targetReps, up: null }
  return weight > 0 ? { weight: weight + WEIGHT_STEP, reps: targetReps, up: 'weight' } : { weight: 0, reps: reps + 1, up: 'reps' }
}

// Sets from the most recent session containing this exercise, to prefill a new workout.
export function lastSets(sessions, exId) {
  const s = [...sessions].sort((a, b) => b.date.localeCompare(a.date)).find(s => s.entries.some(e => e.exId === exId))
  return s?.entries.find(e => e.exId === exId).sets
}
