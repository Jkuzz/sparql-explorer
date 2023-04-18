/**
 * Get a random value within bounds
 * @param min inclusive minimum
 * @param max exclusive maximum
 * @returns random value
 */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}
