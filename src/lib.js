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

// Flexibility module: body zones -> dataset muscles. 'full' mixes every zone.
export const STRETCH_ZONES = {
  hips: ['glutes', 'adductors', 'abductors'],
  hamstrings: ['hamstrings'],
  legs: ['quadriceps', 'calves'],
  back: ['lower back', 'middle back', 'lats', 'abdominals'],
  shoulders: ['shoulders', 'chest', 'biceps', 'triceps', 'forearms'],
  neck: ['neck', 'traps'],
}
export const HOLD = 30, REST = 10 // seconds
const LEVELS = { beginner: 1, intermediate: 2, expert: 3 }

// Stretches for a zone at difficulty 1-3: the chosen level first, then easier ones, filling ~5 min (10 for full body).
// 'roller' is the foam-roller massage session: all of them, whatever the level (only 3 are beginner).
export function stretchSession(list, zone, level) {
  if (zone === 'roller') return list.filter(e => e.category === 'stretching' && e.equipment === 'foam roll')
  const isStretch = e => e.category === 'stretching' && e.equipment !== 'foam roll' && LEVELS[e.level] <= level
  const pick = muscles => list.filter(e => isStretch(e) && e.primaryMuscles.some(m => muscles.includes(m)))
    .sort((a, b) => LEVELS[b.level] - LEVELS[a.level])
  const count = Math.round((zone === 'full' ? 600 : 300) / (HOLD + REST))
  if (zone !== 'full') return pick(STRETCH_ZONES[zone] ?? []).slice(0, count)
  // Round-robin over zones so full body is not all hamstrings.
  const pools = Object.values(STRETCH_ZONES).map(pick), out = []
  for (let i = 0; out.length < count && pools.some(p => p[i]); i++)
    for (const p of pools) if (p[i] && !out.includes(p[i]) && out.length < count) out.push(p[i])
  return out
}
