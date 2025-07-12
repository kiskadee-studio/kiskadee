/**
 * Converts a zero-based index to a token string.
 * For example, 0 -> "a", 1 -> "b", ..., 25 -> "z", 26 -> "aa", 27 -> "ab", etc.
 *
 * @param index - The zero-based index.
 * @returns The token string.
 */
export function getToken(index: number): string {
  let token = '';
  let currentIndex = index + 1; // convert to 1-indexed for easier calculation
  while (currentIndex > 0) {
    const rem = (currentIndex - 1) % 26;
    token = String.fromCharCode(97 + rem) + token;
    currentIndex = Math.floor((currentIndex - 1) / 26);
  }
  return token;
}
