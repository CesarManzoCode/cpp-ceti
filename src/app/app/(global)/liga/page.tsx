import { Crown, Trophy, TrendingDown, TrendingUp } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Badge } from "@/components/ui/badge";
import { SectionRule } from "@/components/ui/section-rule";
import { FriendAvatar } from "@/features/friends/components/friend-avatar";
import { getLeagueStanding, type LeagueStanding } from "@/features/league/queries";
import { db } from "@/lib/db";
import { requireConfirmedUsername } from "@/lib/get-session";
import { recordProductEventSafely } from "@/lib/analytics/record";
import { leagueViewPropsSchema } from "@/lib/analytics/social-props";
import { relativeFromNow } from "@/lib/relative-time";
import { LEAGUE_TIER_LABEL } from "@/lib/social/league-labels";
import { tierAbove, tierBelow } from "@/lib/social/league";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Liga",
};

export default async function LigaPage() {
  const session = await requireConfirmedUsername();
  const standing = await getLeagueStanding(session.user.id);

  if (standing) {
    await recordProductEventSafely(db, {
      userId: session.user.id,
      name: "league_view",
      surface: "social",
      props: leagueViewPropsSchema.parse({ tier: standing.tier }),
    });
  }

  const self = standing?.rows.find((r) => r.isSelf) ?? null;
  // Con el top 3 y "cerca de ti" ya visibles, la lista completa sólo
  // aporta cuando hay más gente que ésa.
  const showFullList = standing ? standing.rows.length > 3 : false;

  return (
    <div data-page-enter className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <header>
        <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.034em] sm:text-[38px]">
          Liga
        </h1>
        <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
          Compites con el XP que ganas esta semana contra tu división. Todo
          se reinicia el lunes.
        </p>
      </header>

      {!standing ? (
        <div className="mt-8 rounded-[var(--radius-lg)] border border-primary/25 bg-primary-tint p-5 sm:p-6">
          <h2 className="text-[19px] font-bold leading-snug">Aún no estás en una liga</h2>
          <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
            Gana XP completando lecciones o retos esta semana y entrarás
            automáticamente a Bronce.
          </p>
        </div>
      ) : (
        <>
          <section className="mt-8 rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-xs)]">
            <div className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-soft-foreground">
                <Trophy className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[18px] font-extrabold">
                  Liga {LEAGUE_TIER_LABEL[standing.tier]}
                </p>
                <p className="text-[14px] text-muted-foreground">
                  {standing.rows.length}{" "}
                  {standing.rows.length === 1 ? "alumno" : "alumnos"} · termina{" "}
                  {relativeFromNow(standing.season.endsAt)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[24px] font-extrabold tabular-nums leading-none">
                  #{self?.rank ?? "—"}
                </p>
                <p className="text-[12px] font-semibold text-muted-foreground">
                  {self ? (
                    <>
                      <AnimatedNumber value={self.xp} /> XP
                    </>
                  ) : (
                    "tu lugar"
                  )}
                </p>
              </div>
            </div>

            <ZoneLegend standing={standing} />
          </section>

          <section className="mt-8">
            <SectionRule>Top 3</SectionRule>
            <ol className="mt-4 flex flex-col gap-2">
              {standing.rows.slice(0, 3).map((row) => (
                <StandingRow key={row.userId} row={row} standing={standing} />
              ))}
            </ol>
          </section>

          <NearbySection standing={standing} />

          {showFullList ? (
            <details className="mt-8 group">
              <summary className="inline-flex min-h-11 cursor-pointer items-center text-[14px] font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                Ver la división completa ({standing.rows.length})
              </summary>
              <ol className="mt-4 flex flex-col gap-2">
                {standing.rows.map((row) => (
                  <StandingRow key={row.userId} row={row} standing={standing} />
                ))}
              </ol>
            </details>
          ) : null}
        </>
      )}
    </div>
  );
}

/**
 * Traduce las reglas de ascenso/descenso a una frase. En Bronce nadie
 * baja y en Diamante nadie sube: la leyenda tiene que decirlo, porque los
 * indicadores de las filas tampoco se pintan ahí.
 */
function ZoneLegend({ standing }: { standing: LeagueStanding }) {
  const up = tierAbove(standing.tier);
  const down = tierBelow(standing.tier);
  const promotes = standing.promoteCount > 0 && up !== null;
  const relegates = standing.relegateCount > 0 && down !== null;

  const parts: string[] = [];
  if (promotes) {
    parts.push(
      `Los primeros ${standing.promoteCount} suben a ${LEAGUE_TIER_LABEL[up]}`,
    );
  } else if (!up) {
    parts.push("Diamante es la liga más alta: aquí sólo se defiende el lugar");
  }
  if (relegates) {
    parts.push(`los últimos ${standing.relegateCount} bajan a ${LEAGUE_TIER_LABEL[down]}`);
  } else if (!down) {
    parts.push("de Bronce no baja nadie");
  }
  if (parts.length === 0) return null;

  return (
    <p className="mt-4 border-t border-border pt-3 text-[13px] leading-relaxed text-muted-foreground">
      {parts.join(" · ")}.
    </p>
  );
}

function NearbySection({ standing }: { standing: LeagueStanding }) {
  const selfIdx = standing.rows.findIndex((r) => r.isSelf);
  if (selfIdx < 0 || selfIdx < 3) return null; // ya está en el top3 mostrado arriba

  const start = Math.max(0, selfIdx - 2);
  const end = Math.min(standing.rows.length, selfIdx + 3);
  const nearby = standing.rows.slice(start, end);

  return (
    <section className="mt-8">
      <SectionRule>Cerca de ti</SectionRule>
      <ol className="mt-4 flex flex-col gap-2">
        {nearby.map((row) => (
          <StandingRow key={row.userId} row={row} standing={standing} />
        ))}
      </ol>
    </section>
  );
}

function StandingRow({
  row,
  standing,
}: {
  row: LeagueStanding["rows"][number];
  standing: LeagueStanding;
}) {
  const n = standing.rows.length;
  // Sólo se marca la zona que de verdad puede pasar: en Diamante no hay
  // ascenso y en Bronce no hay descenso.
  const inPromotionZone =
    tierAbove(standing.tier) !== null &&
    standing.promoteCount > 0 &&
    row.rank <= standing.promoteCount;
  const inRelegationZone =
    tierBelow(standing.tier) !== null &&
    standing.relegateCount > 0 &&
    row.rank > n - standing.relegateCount;

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-lg)] border p-3.5",
        row.isSelf ? "border-primary/40 bg-primary-tint" : "border-border bg-card",
      )}
    >
      <span className="w-6 shrink-0 text-center text-[14px] font-bold tabular-nums text-subtle-foreground">
        {row.rank}
      </span>
      <FriendAvatar name={row.name} image={row.image} className="size-8 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold">
          {row.name}
          {row.isSelf ? (
            <Badge variant="secondary" size="sm" className="ml-2">
              Tú
            </Badge>
          ) : null}
        </p>
      </div>
      {row.rank === 1 ? (
        <Crown className="size-4 shrink-0 text-warning" aria-hidden />
      ) : null}
      {inPromotionZone ? (
        <span className="shrink-0 text-success" title="Zona de ascenso">
          <TrendingUp className="size-4" aria-hidden />
          <span className="sr-only">En zona de ascenso</span>
        </span>
      ) : null}
      {inRelegationZone ? (
        <span className="shrink-0 text-destructive" title="Zona de descenso">
          <TrendingDown className="size-4" aria-hidden />
          <span className="sr-only">En zona de descenso</span>
        </span>
      ) : null}
      <span className="shrink-0 text-[14px] font-extrabold tabular-nums">
        <AnimatedNumber value={row.xp} /> XP
      </span>
    </li>
  );
}
