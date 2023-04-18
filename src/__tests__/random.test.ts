import { describe, expect, it } from 'vitest'
import { getRandomInt } from '@/stores/random'

describe('random', () => {
  it('stays inside bounds', () => {
    expect(getRandomInt(1, 2)).toBeGreaterThanOrEqual(1)
    expect(getRandomInt(1, 2)).toBeGreaterThanOrEqual(1)
    expect(getRandomInt(1, 2)).toBeGreaterThanOrEqual(1)
    expect(getRandomInt(1, 3)).toBeLessThan(3)
    expect(getRandomInt(1, 3)).toBeLessThan(3)
    expect(getRandomInt(1, 3)).toBeLessThan(3)
  })
})
