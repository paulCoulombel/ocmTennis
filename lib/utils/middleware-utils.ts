export const isPathMatchingWithPrefixes = ({
  path,
  prefixes,
}: {
  path: string
  prefixes: string[]
}) => {
  for (const prefix of prefixes) {
    if (path.startsWith(prefix)) {
      return true
    }
  }
  return false
}
