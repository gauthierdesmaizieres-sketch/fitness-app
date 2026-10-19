import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { MUSCLE_MAP, bodyData, filterExercises, progression, lastSets, muscleFromSlug } from './lib.js'

const exercises = JSON.parse(readFileSync(new URL('./data/exercises.json', import.meta.url)))

test('every muscle in the dataset is mapped', () => {
  const used = new Set(exercises.flatMap(e => [...e.primaryMuscles, ...e.secondaryMuscles]))
  for (const m of used) assert.ok(MUSCLE_MAP[m], m)
})

test('filter by muscle, equipment and text', () => {
  const r = filterExercises(exercises, { q: 'bench', muscle: 'chest', equipment: 'barbell' })
  assert.ok(r.length > 0)
  assert.ok(r.every(e => e.primaryMuscles.includes('chest') && e.equipment === 'barbell' && /bench/i.test(e.name)))
})

test('body data keeps secondary out of primary', () => {
  const [p, s] = bodyData(['lats', 'middle back'], ['middle back', 'biceps'])
  assert.deepEqual(p.muscles, ['upper-back'])
  assert.deepEqual(s.muscles, ['biceps'])
  assert.equal(muscleFromSlug('upper-back'), 'lats')
})

test('progression and last sets', () => {
  const sessions = [
    { date: '2026-02-01', entries: [{ exId: 'a', sets: [{ reps: 5, weight: 60 }, { reps: 5, weight: 65 }] }] },
    { date: '2026-01-01', entries: [{ exId: 'a', sets: [{ reps: 5, weight: 50 }] }] },
    { date: '2026-03-01', entries: [{ exId: 'b', sets: [{ reps: 5, weight: 10 }] }] },
  ]
  assert.deepEqual(progression(sessions, 'a'), [{ date: '2026-01-01', weight: 50 }, { date: '2026-02-01', weight: 65 }])
  assert.equal(lastSets(sessions, 'a')[1].weight, 65)
  assert.equal(lastSets(sessions, 'z'), undefined)
})
