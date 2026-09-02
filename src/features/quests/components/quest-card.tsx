import { Target } from "lucide-react";

import { BrickRow } from "@/components/ui/bricks";
import { FriendAvatar } from "@/features/friends/components/friend-avatar";
import type { MyFriendQuest } from "@/features/quests/queries";
import { relativeFromNow } from "@/lib/relative-time";

/** Contexto compacto — nunca un dashboard. Sólo se muestra si hay quest activa/completada esta semana. */
export function QuestCard({ quest }: { quest: MyFriendQuest }) {
  if (quest.status !== "active" && quest.status !== "completed") return null;

  const done = quest.status === "completed";

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-xs)]">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)] bg-primary-soft text-primary-soft-foreground">
          <Target className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[14px] font-bold leading-tight">
            <span className="shrink-0 text-muted-foreground">Misión con</span>
            <FriendAvatar
              name={quest.partner.name}
              image={quest.partner.image}
              className="size-4 shrink-0"
            />
            <span className="truncate">{quest.partner.name}</span>
          </p>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {done
              ? `¡Completada! ${quest.target}/${quest.target} lecciones`
              : `${quest.progress}/${quest.target} lecciones juntos · termina ${relativeFromNow(quest.endsAt)}`}
          </p>
        </div>
      </div>
      <BrickRow
        className="mt-3"
        size="sm"
        total={quest.target}
        done={Math.min(quest.progress, quest.target)}
        tone={done ? "success" : "primary"}
        srLabel={`${quest.progress} de ${quest.target} lecciones`}
      />
    </div>
  );
}
