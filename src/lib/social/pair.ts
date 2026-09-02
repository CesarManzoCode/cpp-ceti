/**
 * Par canónico de dos ids de usuario — orden lexicográfico estable.
 * Toda tabla que representa una relación simétrica entre dos usuarios
 * (Friendship.pairKey, FriendshipPeriod, FriendStreak) usa esto para que
 * A↔B tenga SIEMPRE una sola fila, sin importar quién la originó.
 */
export function canonicalPair(a: string, b: string): { lowId: string; highId: string } {
  return a <= b ? { lowId: a, highId: b } : { lowId: b, highId: a };
}

/** Clave de texto del par canónico, para columnas `pairKey`. */
export function pairKeyOf(a: string, b: string): string {
  const { lowId, highId } = canonicalPair(a, b);
  return `${lowId}:${highId}`;
}
