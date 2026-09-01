/**
 * Backfill de `Friendship.pairKey` — Fase 2.
 *
 * Antes de este backfill, `Friendship` es direccional: nada impedía que
 * existieran A→B y B→A a la vez (dos filas para el mismo par). Este script:
 *
 *   1. PREFLIGHT — agrupa las filas existentes por par canónico
 *      (min(id), max(id)) y detecta grupos con más de una fila.
 *   2. CONSOLIDA duplicados con una precedencia FIJA:
 *        blocked > accepted > pending
 *      Dentro del mismo estado, gana la fila más antigua (`createdAt` menor).
 *      Si un grupo trae un `status` fuera de {pending, accepted, blocked}
 *      (imposible según el enum actual, pero el script no adivina), ABORTA
 *      todo el backfill sin escribir nada.
 *   3. BACKUP lógico — imprime (y, en modo `--apply`, escribe a un JSON) las
 *      filas perdedoras ANTES de tocar nada.
 *   4. BACKFILL — escribe `pairKey` en la fila ganadora de cada grupo (y en
 *      cada fila sin duplicado) y borra las perdedoras.
 *   5. Abre `FriendshipPeriod` para toda amistad `accepted` resultante, con
 *      `startedAt = acceptedAt ?? createdAt` — nunca inventa historia
 *      anterior a lo que ya existía. Idempotente: la unique parcial
 *      (`friendship_period_open_pair_key`) hace que un re-run no duplique
 *      periodos vía `skipDuplicates`.
 *
 * Uso:
 *   npx dotenv -e .env.local -- tsx scripts/social/backfill-friendship-pairkey.ts --dry-run
 *   npx dotenv -e .env.local -- tsx scripts/social/backfill-friendship-pairkey.ts --apply
 *
 * NUNCA correr `--apply` contra producción sin haber revisado el reporte de
 * `--dry-run` primero.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { FriendStatus, type Prisma } from "@prisma/client";

import { db } from "../../src/lib/db";
import { canonicalPair, pairKeyOf } from "../../src/lib/social/pair";

const STATUS_PRECEDENCE: Record<FriendStatus, number> = {
  [FriendStatus.blocked]: 3,
  [FriendStatus.accepted]: 2,
  [FriendStatus.pending]: 1,
};

interface FriendshipRow {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendStatus;
  createdAt: Date;
  acceptedAt: Date | null;
}

interface PairGroup {
  lowId: string;
  highId: string;
  pairKey: string;
  rows: FriendshipRow[];
}

function groupByPair(rows: FriendshipRow[]): Map<string, PairGroup> {
  const groups = new Map<string, PairGroup>();
  for (const row of rows) {
    const { lowId, highId } = canonicalPair(row.requesterId, row.addresseeId);
    const key = pairKeyOf(row.requesterId, row.addresseeId);
    let group = groups.get(key);
    if (!group) {
      group = { lowId, highId, pairKey: key, rows: [] };
      groups.set(key, group);
    }
    group.rows.push(row);
  }
  return groups;
}

/** Gana: mayor precedencia de estado; empate → `createdAt` más antiguo. */
function pickWinner(rows: FriendshipRow[]): { winner: FriendshipRow; losers: FriendshipRow[] } {
  const sorted = [...rows].sort((a, b) => {
    const precedenceDiff = STATUS_PRECEDENCE[b.status] - STATUS_PRECEDENCE[a.status];
    if (precedenceDiff !== 0) return precedenceDiff;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
  const [winner, ...losers] = sorted;
  return { winner: winner!, losers };
}

export interface BackfillPlan {
  totalRows: number;
  singleRowGroups: number;
  duplicateGroups: PairGroup[];
  winners: Map<string, FriendshipRow>;
  losers: FriendshipRow[];
}

export async function planBackfill(): Promise<BackfillPlan> {
  const rows = (await db.friendship.findMany({
    select: {
      id: true,
      requesterId: true,
      addresseeId: true,
      status: true,
      createdAt: true,
      acceptedAt: true,
    },
    orderBy: { createdAt: "asc" },
  })) as FriendshipRow[];

  const groups = groupByPair(rows);
  const duplicateGroups: PairGroup[] = [];
  const winners = new Map<string, FriendshipRow>();
  const losers: FriendshipRow[] = [];
  let singleRowGroups = 0;

  for (const group of groups.values()) {
    if (group.rows.length === 1) {
      singleRowGroups++;
      winners.set(group.pairKey, group.rows[0]!);
      continue;
    }

    for (const row of group.rows) {
      if (!(row.status in STATUS_PRECEDENCE)) {
        throw new Error(
          `Estado desconocido "${row.status}" en friendship ${row.id} (par ${group.pairKey}) — ` +
            "abortando backfill sin escribir nada. Revisa manualmente antes de reintentar.",
        );
      }
    }

    duplicateGroups.push(group);
    const { winner, losers: groupLosers } = pickWinner(group.rows);
    winners.set(group.pairKey, winner);
    losers.push(...groupLosers);
  }

  return { totalRows: rows.length, singleRowGroups, duplicateGroups, winners, losers };
}

async function backupLosers(losers: FriendshipRow[]): Promise<string | null> {
  if (losers.length === 0) return null;
  const dir = join(process.cwd(), "scripts", "social", "_backfill-backups");
  await mkdir(dir, { recursive: true });
  const path = join(dir, `friendship-pairkey-losers-${Date.now()}.json`);
  await writeFile(path, JSON.stringify(losers, null, 2), "utf-8");
  return path;
}

export async function applyBackfill(plan: BackfillPlan): Promise<void> {
  if (plan.losers.length > 0) {
    const backupPath = await backupLosers(plan.losers);
    console.log(`  ↳ backup lógico de ${plan.losers.length} fila(s) perdedora(s): ${backupPath}`);
  }

  await db.$transaction(async (tx) => {
    if (plan.losers.length > 0) {
      await tx.friendship.deleteMany({ where: { id: { in: plan.losers.map((l) => l.id) } } });
    }
    for (const winner of plan.winners.values()) {
      await tx.friendship.update({
        where: { id: winner.id },
        data: { pairKey: pairKeyOf(winner.requesterId, winner.addresseeId) },
      });
    }
  });

  // Abre FriendshipPeriod para todo accepted resultante. Fuera de la
  // transacción anterior (independiente, e idempotente por la unique
  // parcial): un re-run del script no duplica periodos.
  let periodsOpened = 0;
  for (const winner of plan.winners.values()) {
    if (winner.status !== FriendStatus.accepted) continue;
    const { lowId, highId } = canonicalPair(winner.requesterId, winner.addresseeId);
    const res = await db.friendshipPeriod.createMany({
      data: [
        {
          userLowId: lowId,
          userHighId: highId,
          source: null,
          sourceContextKey: null,
          startedAt: winner.acceptedAt ?? winner.createdAt,
          endedAt: null,
        },
      ] satisfies Prisma.FriendshipPeriodCreateManyInput[],
      skipDuplicates: true,
    });
    periodsOpened += res.count;
  }
  console.log(`  ↳ ${periodsOpened} FriendshipPeriod abierto(s) para amistades accepted`);
}

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`🔍 Preflight de consolidación de Friendship (${apply ? "APLICANDO" : "dry-run"})...`);

  const plan = await planBackfill();
  console.log(`  ↳ ${plan.totalRows} filas totales`);
  console.log(`  ↳ ${plan.singleRowGroups} pares sin duplicado (backfill directo de pairKey)`);
  console.log(`  ↳ ${plan.duplicateGroups.length} par(es) con duplicados a consolidar`);
  for (const g of plan.duplicateGroups) {
    const winner = plan.winners.get(g.pairKey)!;
    console.log(
      `     — par ${g.pairKey}: ${g.rows.length} filas [${g.rows
        .map((r) => `${r.status}:${r.id}`)
        .join(", ")}] → gana ${winner.id} (${winner.status})`,
    );
  }

  if (!apply) {
    console.log("\n✅ Dry-run completado — no se escribió nada. Corre con --apply para aplicar.");
    return;
  }

  await applyBackfill(plan);
  console.log("✅ Backfill aplicado.");
}

if (process.env.VITEST !== "true") {
  main()
    .catch((err) => {
      console.error("❌ Backfill de Friendship.pairKey falló:", err);
      process.exit(1);
    })
    .finally(async () => {
      await db.$disconnect();
    });
}
