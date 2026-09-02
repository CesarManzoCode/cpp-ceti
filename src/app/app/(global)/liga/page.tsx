import { Crown, Trophy, TrendingDown, TrendingUp } from "lucide-react";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Badge } from "@/components/ui/badge";
import { SectionRule } from "@/components/ui/section-rule";
import { FriendAvatar } from "@/features/friends/components/friend-avatar";
import { getLeagueStanding } from "@/features/league/queries";
import { db } from "@/lib/db";
import { requireConfirmedUsername } from "@/lib/get-session";
import { recordProductEventSafely } from "@/lib/analytics/record";
import { leagueViewPropsSchema } from "@/lib/analytics/social-props";
import { LEAGUE_TIER_LABEL } from "@/lib/social/league-labels";
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

  return (
    <div data-page-enter className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <header>
        <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.034em] sm:text-[38px]">
          Liga
        </h1>
        <p className="mt-3 max-w-[56ch] text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
          Compite en XP de la semana contra tu división. Sube de liga si
          terminas arriba; baja si te quedas atrás — todo se reinicia cada
          lunes.
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
          <section className="mt-8 flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-xs)]">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-soft-foreground">
              <Trophy className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[18px] font-extrabold">Liga {LEAGUE_TIER_LABEL[standing.tier]}</p>
              <p className="text-[14px] text-muted-foreground">
                {standing.rows.length} {standing.rows.length === 1 ? "alumno" : "alumnos"} en tu división
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[24px] font-extrabold tabular-nums leading-none">
                #{standing.rows.find((r) => r.isSelf)?.rank ?? "—"}
              </p>
              <p className="text-[12px] font-semibold text-muted-foreground">tu lugar</p>
            </div>
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

          <details className="mt-8 group">
            <summary className="cursor-pointer text-[14px] font-bold text-primary hover:underline">
              Ver clasificación completa
            </summary>
            <ol className="mt-4 flex flex-col gap-2">
              {standing.rows.map((row) => (
                <StandingRow key={row.userId} row={row} standing={standing} />
              ))}
            </ol>
          </details>
        </>
      )}
    </div>
  );
}

function NearbySection({
  standing,
}: {
  standing: NonNullable<Awaited<ReturnType<typeof getLeagueStanding>>>;
}) {
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
  row: { userId: string; username: string; name: string; image: string | null; xp: number; rank: number; isSelf: boolean };
  standing: { promoteCount: number; relegateCount: number; rows: { rank: number }[] };
}) {
  const n = standing.rows.length;
  const inPromotionZone = row.rank <= standing.promoteCount;
  const inRelegationZone = row.rank > n - standing.relegateCount;

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
      {inPromotionZone ? <TrendingUp className="size-4 shrink-0 text-success" aria-label="Zona de ascenso" /> : null}
      {inRelegationZone ? <TrendingDown className="size-4 shrink-0 text-destructive" aria-label="Zona de descenso" /> : null}
      {row.rank === 1 ? <Crown className="size-4 shrink-0 text-warning" aria-hidden /> : null}
      <span className="shrink-0 text-[14px] font-extrabold tabular-nums">
        <AnimatedNumber value={row.xp} /> XP
      </span>
    </li>
  );
}
