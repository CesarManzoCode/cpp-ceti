import { AnimatedNumber } from "@/components/ui/animated-number";
import { FriendAvatar } from "@/features/friends/components/friend-avatar";
import type { FriendRankingRow } from "@/features/league/queries";
import { cn } from "@/lib/utils";

export function FriendRankingList({ rows }: { rows: FriendRankingRow[] }) {
  if (rows.length <= 1) return null;

  return (
    <ol className="flex flex-col gap-2">
      {rows.slice(0, 10).map((row) => (
        <li
          key={row.userId}
          className={cn(
            "flex items-center gap-3 rounded-[var(--radius-lg)] border p-3",
            row.isSelf ? "border-primary/40 bg-primary-tint" : "border-border bg-card",
          )}
        >
          <span className="w-5 shrink-0 text-center text-[13px] font-bold tabular-nums text-subtle-foreground">
            {row.rank}
          </span>
          <FriendAvatar name={row.name} image={row.image} className="size-8 shrink-0" />
          <p className="min-w-0 flex-1 truncate text-[14px] font-bold">
            {row.isSelf ? "Tú" : row.name}
          </p>
          <span className="shrink-0 text-[13px] font-extrabold tabular-nums text-muted-foreground">
            <AnimatedNumber value={row.xp} /> XP
          </span>
        </li>
      ))}
    </ol>
  );
}
