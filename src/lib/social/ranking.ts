/**
 * Comparador ÚNICO de ranking competitivo (XP semanal de amigos y
 * standings de liga): XP desc → última vez que ganó XP asc (llegó primero
 * gana el empate) → userId asc (determinista, nunca hay rank compartido).
 */
export interface RankableMember {
  userId: string;
  xp: number;
  lastAwardAt: Date | null;
}

export function compareRankable(a: RankableMember, b: RankableMember): number {
  if (b.xp !== a.xp) return b.xp - a.xp;
  const at = a.lastAwardAt ? a.lastAwardAt.getTime() : Number.POSITIVE_INFINITY;
  const bt = b.lastAwardAt ? b.lastAwardAt.getTime() : Number.POSITIVE_INFINITY;
  if (at !== bt) return at - bt;
  if (a.userId < b.userId) return -1;
  if (a.userId > b.userId) return 1;
  return 0;
}

export interface Ranked<T> {
  member: T;
  rank: number;
}

/** Ordena y asigna rank 1..n — determinista, nunca hay empates compartidos. */
export function rankMembers<T extends RankableMember>(members: T[]): Ranked<T>[] {
  return [...members].sort(compareRankable).map((member, i) => ({ member, rank: i + 1 }));
}
