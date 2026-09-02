import { describe, expect, it } from "vitest";

import { rankMembers } from "@/lib/social/ranking";

describe("rankMembers", () => {
  it("ordena por XP desc y nunca comparte rank (userId asc como último desempate)", () => {
    const ranked = rankMembers([
      { userId: "b", xp: 100, lastAwardAt: null },
      { userId: "a", xp: 100, lastAwardAt: null },
      { userId: "c", xp: 200, lastAwardAt: null },
    ]);
    expect(ranked.map((r) => r.member.userId)).toEqual(["c", "a", "b"]);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it("con XP empatado, gana quien llegó primero (lastAwardAt asc)", () => {
    const early = new Date("2026-01-01T00:00:00Z");
    const late = new Date("2026-01-02T00:00:00Z");
    const ranked = rankMembers([
      { userId: "late", xp: 50, lastAwardAt: late },
      { userId: "early", xp: 50, lastAwardAt: early },
    ]);
    expect(ranked.map((r) => r.member.userId)).toEqual(["early", "late"]);
  });

  it("incluye miembros con 0 XP y sin lastAwardAt (nunca ganaron XP)", () => {
    const ranked = rankMembers([
      { userId: "z", xp: 0, lastAwardAt: null },
      { userId: "a", xp: 0, lastAwardAt: null },
    ]);
    expect(ranked).toHaveLength(2);
    // Empate total de XP y actividad → desempata por userId.
    expect(ranked.map((r) => r.member.userId)).toEqual(["a", "z"]);
  });
});
