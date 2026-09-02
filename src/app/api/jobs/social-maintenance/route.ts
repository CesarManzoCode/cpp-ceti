import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/env";
import { logger } from "@/lib/logger";
import { runWeeklyFriendQuestMatching, expireStaleFriendQuests } from "@/lib/social/friend-quest";
import { assignMidweekEntrants, runLeagueRolloverIfDue } from "@/lib/social/league-rollover";
import { evaluateAllActiveStreaksForYesterday, expirePendingFriendStreaks } from "@/lib/social/friend-streak";

/**
 * UNA sola superficie de mantenimiento social — no un cron por feature.
 * Ejecución horaria (`vercel.json`); cada sub-tarea es idempotente, así
 * que correr esto de más nunca duplica nada — sólo cuesta unas queries de
 * más. Protegida por `CRON_SECRET`: sin uno configurado, o sin que la
 * request lo traiga, 401 — nunca corre "abierto".
 *
 * No devuelve datos privados: sólo conteos agregados para observabilidad.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  if (!env.CRON_SECRET) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${env.CRON_SECRET}`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const results: Record<string, number | boolean | string> = {};
  const errors: string[] = [];

  async function run(name: string, fn: () => Promise<number | boolean>) {
    try {
      results[name] = await fn();
    } catch (err) {
      errors.push(name);
      logger.error({ err, job: name }, "social-maintenance sub-task failed");
    }
  }

  // Liga: rollover (idempotente, claim atómico) y entrantes midweek.
  await run("leagueRolled", async () => (await runLeagueRolloverIfDue(now)).rolled);
  await run("leagueMidweekEntrants", () => assignMidweekEntrants(now));

  // Friend Streak: expira pendientes vencidas, evalúa ayer para las activas.
  await run("streaksExpiredPending", () => expirePendingFriendStreaks());
  await run("streaksEvaluatedYesterday", () => evaluateAllActiveStreaksForYesterday(now));

  // Friend Quest: matching semanal (incremental — sólo empareja a quien
  // sigue suelto) y expira las que no llegaron al target.
  await run("questsMatched", () => runWeeklyFriendQuestMatching(now));
  await run("questsExpired", () => expireStaleFriendQuests(now));

  results.ok = errors.length === 0;
  if (errors.length > 0) results.failedTasks = errors.join(",");

  return NextResponse.json(results, { status: errors.length === 0 ? 200 : 207 });
}
