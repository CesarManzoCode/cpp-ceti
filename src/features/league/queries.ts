import { db } from "@/lib/db";
import { promotionSlotsFor } from "@/lib/social/league";
import { ensureCurrentSeason } from "@/lib/social/league-season";
import { rankMembers } from "@/lib/social/ranking";

export interface FriendRankingRow {
  userId: string;
  username: string;
  name: string;
  image: string | null;
  xp: number;
  rank: number;
  isSelf: boolean;
}

/**
 * Ranking semanal de amigos: self + amigos accepted ACTUALES, TODOS
 * incluidos aunque tengan 0 XP esta semana. `legacy_balance` nunca cuenta
 * (no es XP competitivo).
 */
export async function getFriendWeeklyRanking(viewerId: string): Promise<FriendRankingRow[]> {
  const season = await ensureCurrentSeason();

  const friendRows = await db.friendship.findMany({
    where: { status: "accepted", OR: [{ requesterId: viewerId }, { addresseeId: viewerId }] },
    select: { requesterId: true, addresseeId: true },
  });
  const memberIds = [
    viewerId,
    ...friendRows.map((r) => (r.requesterId === viewerId ? r.addresseeId : r.requesterId)),
  ];

  const [users, sums] = await Promise.all([
    db.user.findMany({
      where: { id: { in: memberIds } },
      select: { id: true, username: true, name: true, image: true },
    }),
    db.xpAward.groupBy({
      by: ["userId"],
      where: {
        userId: { in: memberIds },
        earnedAt: { gte: season.startsAt, lt: season.endsAt },
        reason: { not: "legacy_balance" },
      },
      _sum: { amount: true },
      _max: { earnedAt: true },
    }),
  ]);

  const sumByUser = new Map(sums.map((s) => [s.userId, { xp: s._sum.amount ?? 0, lastAwardAt: s._max.earnedAt }]));

  const ranked = rankMembers(
    users.map((u) => ({
      userId: u.id,
      xp: sumByUser.get(u.id)?.xp ?? 0,
      lastAwardAt: sumByUser.get(u.id)?.lastAwardAt ?? null,
    })),
  );

  const userById = new Map(users.map((u) => [u.id, u]));
  return ranked.map(({ member, rank }) => {
    const u = userById.get(member.userId)!;
    return { userId: u.id, username: u.username, name: u.name, image: u.image, xp: member.xp, rank, isSelf: u.id === viewerId };
  });
}

export interface LeagueStanding {
  season: { key: string; startsAt: Date; endsAt: Date };
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  divisionId: string;
  rows: {
    userId: string;
    username: string;
    name: string;
    image: string | null;
    xp: number;
    rank: number;
    isSelf: boolean;
  }[];
  promoteCount: number;
  relegateCount: number;
}

/**
 * Standings de la división del usuario en la season vigente. `null` si el
 * usuario no tiene membership todavía (nunca ganó XP competitivo).
 */
export async function getLeagueStanding(userId: string): Promise<LeagueStanding | null> {
  const season = await ensureCurrentSeason();

  const membership = await db.leagueMembership.findUnique({
    where: { seasonId_userId: { seasonId: season.id, userId } },
    select: { divisionId: true, division: { select: { tier: true } } },
  });
  if (!membership) return null;

  const members = await db.leagueMembership.findMany({
    where: { divisionId: membership.divisionId },
    select: { userId: true, user: { select: { username: true, name: true, image: true } } },
  });

  const sums = await db.xpAward.groupBy({
    by: ["userId"],
    where: {
      userId: { in: members.map((m) => m.userId) },
      earnedAt: { gte: season.startsAt, lt: season.endsAt },
      reason: { not: "legacy_balance" },
    },
    _sum: { amount: true },
    _max: { earnedAt: true },
  });
  const sumByUser = new Map(sums.map((s) => [s.userId, { xp: s._sum.amount ?? 0, lastAwardAt: s._max.earnedAt }]));

  const ranked = rankMembers(
    members.map((m) => ({
      userId: m.userId,
      xp: sumByUser.get(m.userId)?.xp ?? 0,
      lastAwardAt: sumByUser.get(m.userId)?.lastAwardAt ?? null,
    })),
  );

  const userById = new Map(members.map((m) => [m.userId, m.user]));
  const rows = ranked.map(({ member, rank }) => {
    const u = userById.get(member.userId)!;
    return { userId: member.userId, username: u.username, name: u.name, image: u.image, xp: member.xp, rank, isSelf: member.userId === userId };
  });

  // Las plazas salen de la MISMA función que decide el rollover: si el
  // panel y el cierre de temporada no cuentan igual, la leyenda miente.
  const { promoteCount, relegateCount } = promotionSlotsFor(rows.length);

  return {
    season: { key: season.key, startsAt: season.startsAt, endsAt: season.endsAt },
    tier: membership.division.tier,
    divisionId: membership.divisionId,
    rows,
    promoteCount,
    relegateCount,
  };
}
