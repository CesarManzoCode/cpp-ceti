import { Target } from "lucide-react";

import { BrickRow } from "@/components/ui/bricks";
import { FriendAvatar } from "@/features/friends/components/friend-avatar";
import type { MyFriendQuest } from "@/features/quests/queries";

/** Contexto compacto — nunca un dashboard. Sólo se muestra si hay quest activa/completada esta semana. */
export function QuestCard({ quest }: { quest: MyFriendQuest }) {
  if (quest.status !== "active" && quest.status !== "completed") return null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--shadow-xs)]">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-md)] bg-primary-soft text-primary-soft-foreground">
          <Target className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold leading-tight">
            Misión con <FriendAvatar name={quest.partner.name} image={quest.partner.image} className="mx-1 inline-block size-4 align-text-bottom" />
            {quest.partner.name}
          </p>
          <p className="text-[13px] text-muted-foreground">
            {quest.status === "completed"
              ? "¡Completada!"
              : `${quest.progress}/${quest.target} lecciones entre los dos`}
          </p>
        </div>
      </div>
      <BrickRow
        className="mt-3"
        size="sm"
        total={quest.target}
        done={Math.min(quest.progress, quest.target)}
        tone={quest.status === "completed" ? "success" : "primary"}
        srLabel={`${quest.progress} de ${quest.target} lecciones`}
      />
    </div>
  );
}
