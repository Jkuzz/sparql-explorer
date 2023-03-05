/**
 * Guesses the prefix of the namespace based on the iri.
 * Hopes that the iri directly includes the prefix as a substring.
 * @param iri whose prefix to guess
 * @returns array of possible prefixes
 */
export function tryGuessPrefix(iri: string) {
  const prefixes = /\/[A-Za-z]{3,4}[^A-Za-z.]/.exec(iri)
  const shortPrefixes = prefixes
    ?.map((p) => p.substring(1, p.length - 1))
    .filter((p) => p !== 'www')
  if (shortPrefixes && shortPrefixes?.length > 0) return shortPrefixes

  const longPrefixes = /\/[A-Za-z]+[^A-Za-z.]/
    .exec(iri)
    ?.map((p) => p.substring(1, p.length - 1))
    .filter((p) => p !== 'www')
  return longPrefixes
}

/**
 * Cut the provided namespace prefix from the iri.
 * Leaves the iri unchanged if the namespace does not match the iri's prefix
 * @param nameSpace that is being removed
 * @param iri from which to cut the namespace
 * @returns the iri with the namespace iri prefix removed
 */
export function removeNamespace(nameSpace: string, iri: string) {
  if (nameSpace === iri.substring(0, nameSpace.length)) {
    return iri.substring(nameSpace.length)
  }
  return iri
}

/**
 * This loop goes through all the possible prefixes and tests if they are available
 * If none are, adds a number at the end and tests again
 * @param possiblePrefixes candidate prefixes
 * @param knownNamespaces existing namespace definitions
 * @returns an available namespace prefix
 */
export function getAvailablePrefix(
  possiblePrefixes: string[],
  knownNamespaces: { [key: string]: string }
) {
  // This loop is limited because in testing, a whie(true) sometimes ran infinitely
  for (let iterations = 0; iterations < 10000; iterations += 1) {
    for (const prefix of possiblePrefixes) {
      const numberedPrefix = iterations > 0 ? prefix + iterations : prefix
      if (!Object.values(knownNamespaces).includes(numberedPrefix)) {
        return numberedPrefix
      }
    }
  }
  return 'unknown'
}
