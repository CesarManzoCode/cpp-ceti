/**
 * Backfill del ledger de XP — Fase 4.
 *
 * Crea, para cada `UserStreak` con `totalXp > 0`, UNA fila `XpAward` con
 * `reason=legacy_balance` que iguala el `totalXp` pre-ledger. Esa fila NO
 * cuenta para ranking/ligas (filtrada explícitamente en las consultas de
 * XP competitivo — ver `src/lib/social/competitive-xp.ts`), así que no
 * "resucita" XP de semanas que ya pasaron.
 *
 * Idempotente: `dedupeKey = legacy:<CUTOVER_KEY>` es única por usuario
 * (UNIQUE (userId, dedupeKey)); volver a correrlo no duplica nada.
 *
 * Auditoría: al final imprime `totalXp (UserStreak) vs SUM(XpAward)` por
 * usuario y falla si no cuadran — el rollout de ranking/ligas NO debe
 * activarse hasta que esto pase limpio (ver <migrations> del contrato).
 *
 * Uso:
 *   npx dotenv -e .env.local -- tsx scripts/social/backfill-xp-legacy.ts
 *   npx dotenv -e .env.local -- tsx scripts/social/backfill-xp-legacy.ts --dry-run
 */
import { db } from "../../src/lib/db";
import { xpDedupeKey } from "../../src/lib/xp";

export const LEGACY_CUTOVER_KEY = "v1";

export async function backfillLegacyXp(
  dryRun: boolean,
): Promise<{ candidates: number; inserted: number; skippedZero: number }> {
  const streaks = await db.userStreak.findMany({
    select: { userId: true, totalXp: true },
  });

  let inserted = 0;
  let skippedZero = 0;

  for (const s of streaks) {
    if (s.totalXp <= 0) {
      skippedZero++;
      continue;
    }
    if (dryRun) {
      inserted++;
      continue;
    }
    const res = await db.xpAward.createMany({
      data: [
        {
          userId: s.userId,
          amount: s.totalXp,
          reason: "legacy_balance",
          dedupeKey: xpDedupeKey.legacy(LEGACY_CUTOVER_KEY),
        },
      ],
      skipDuplicates: true,
    });
    inserted += res.count;
  }

  return { candidates: streaks.length, inserted, skippedZero };
}

/** Compara `UserStreak.totalXp` contra `SUM(XpAward.amount)` por usuario. */
export async function auditXpLedger(): Promise<
  { userId: string; totalXp: number; ledgerSum: number }[]
> {
  const streaks = await db.userStreak.findMany({ select: { userId: true, totalXp: true } });
  const sums = await db.xpAward.groupBy({
    by: ["userId"],
    _sum: { amount: true },
  });
  const sumByUser = new Map(sums.map((s) => [s.userId, s._sum.amount ?? 0]));

  return streaks
    .map((s) => ({
      userId: s.userId,
      totalXp: s.totalXp,
      ledgerSum: sumByUser.get(s.userId) ?? 0,
    }))
    .filter((row) => row.totalXp !== row.ledgerSum);
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(`🌱 Backfill de XP legacy${dryRun ? " (dry-run)" : ""}...`);

  const result = await backfillLegacyXp(dryRun);
  console.log(
    `  ↳ ${result.candidates} UserStreak revisados, ${result.inserted} XpAward ` +
      `${dryRun ? "por insertar" : "insertados"}, ${result.skippedZero} con totalXp=0 (sin fila)`,
  );

  if (dryRun) {
    console.log("✅ Dry-run completado — no se escribió nada.");
    return;
  }

  const mismatches = await auditXpLedger();
  if (mismatches.length > 0) {
    console.error(`❌ ${mismatches.length} usuario(s) con totalXp ≠ SUM(XpAward.amount):`);
    for (const m of mismatches.slice(0, 20)) {
      console.error(`   — ${m.userId}: totalXp=${m.totalXp} ledgerSum=${m.ledgerSum}`);
    }
    process.exit(1);
  }
  console.log("✅ Auditoría OK: totalXp == SUM(XpAward.amount) para todos los usuarios.");
}

if (process.env.VITEST !== "true") {
  main()
    .catch((err) => {
      console.error("❌ Backfill de XP legacy falló:", err);
      process.exit(1);
    })
    .finally(async () => {
      await db.$disconnect();
    });
}
