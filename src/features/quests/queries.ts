import { db } from "@/lib/db";
import { refreshFriendQuestProgress } from "@/lib/social/friend-quest";
import { mxWeekStartDateOnly } from "@/lib/social/time";

export interface MyFriendQuest {
  id: string;
  status: "active" | "completed" | "expired" | "cancelled";
  target: number;
  progress: number;
  endsAt: Date;
  partner: { id: string; username: string; name: string; image: string | null };
}

/** Quest de la semana del viewer, con progreso refrescado en vivo. `null` si no hay. */
export async function getMyFriendQuest(viewerId: string): Promise<MyFriendQuest | null> {
  const weekStart = mxWeekStartDateOnly(new Date());
  const participation = await db.friendQuestParticipant.findUnique({
    where: { userId_weekStart: { userId: viewerId, weekStart } },
    select: {
      quest: {
        select: {
          id: true,
          status: true,
          target: true,
          endsAt: true,
          participants: {
            select: { userId: true, user: { select: { id: true, username: true, name: true, image: true } } },
          },
        },
      },
    },
  });
  if (!participation) return null;

  const quest = participation.quest;
  let progress = 0;
  if (quest.status === "active") {
    const refreshed = await refreshFriendQuestProgress(quest.id);
    progress = refreshed.progress;
  } else if (quest.status === "completed") {
    progress = quest.target;
  }

  const partner = quest.participants.find((p) => p.userId !== viewerId)?.user;
  if (!partner) return null;

  return {
    id: quest.id,
    status: quest.status,
    target: quest.target,
    progress,
    endsAt: quest.endsAt,
    partner,
  };
}
