"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Check, Flame, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FriendAvatar } from "@/features/friends/components/friend-avatar";
import {
  acceptFriendStreak,
  declineFriendStreak,
  markStreakReminderRead,
  sendFriendStreakReminder,
} from "@/features/streaks/actions";
import type { FriendStreakCard, StreakReminderCard } from "@/features/streaks/queries";
import { relativeFromNow } from "@/lib/relative-time";

export function StreakCards({
  streaks,
  reminders,
}: {
  streaks: FriendStreakCard[];
  reminders: StreakReminderCard[];
}) {
  const unreadReminders = reminders.filter((r) => !r.readAt);

  return (
    <div className="space-y-6">
      {unreadReminders.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {unreadReminders.map((r) => (
            <ReminderBanner key={r.id} reminder={r} />
          ))}
        </ul>
      ) : null}

      {streaks.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card px-5 py-7 text-center">
          <Flame className="mx-auto size-6 text-subtle-foreground" aria-hidden />
          <p className="mt-2 text-[15px] font-bold">Sin rachas con amigos todavía</p>
          <p className="mx-auto mt-1.5 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
            Invita a un amigo desde su perfil a mantener una racha juntos —
            los dos tienen que estudiar el mismo día para que cuente.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {streaks.slice(0, 3).map((s) => (
            <StreakRow key={s.id} streak={s} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ReminderBanner({ reminder }: { reminder: StreakReminderCard }) {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;

  return (
    <li className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-primary/25 bg-primary-tint p-3.5">
      <FriendAvatar name={reminder.sender.name} image={reminder.sender.image} className="size-8 shrink-0" />
      <p className="min-w-0 flex-1 text-[14px] leading-snug">
        <span className="font-bold">{reminder.sender.name}</span>{" "}
        <span className="text-muted-foreground">te recordó mantener su racha.</span>
      </p>
      <button
        type="button"
        aria-label="Descartar"
        className="shrink-0 rounded-full p-1 text-subtle-foreground hover:bg-accent"
        onClick={() => {
          setDismissed(true);
          void markStreakReminderRead({ reminderId: reminder.id });
        }}
      >
        <X className="size-4" />
      </button>
    </li>
  );
}

function StreakRow({ streak }: { streak: FriendStreakCard }) {
  const [pending, startTransition] = React.useTransition();
  const [local, setLocal] = React.useState(streak);

  function respond(accept: boolean) {
    startTransition(async () => {
      try {
        if (accept) {
          await acceptFriendStreak({ streakId: local.id });
          setLocal((s) => ({ ...s, status: "active" }));
          toast.success(`Racha activa con ${local.other.name}`);
        } else {
          await declineFriendStreak({ streakId: local.id });
          toast.success("Solicitud rechazada");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Algo salió mal");
      }
    });
  }

  function remind() {
    startTransition(async () => {
      try {
        await sendFriendStreakReminder({ streakId: local.id });
        setLocal((s) => ({ ...s, canRemindToday: false }));
        toast.success(`Le avisamos a ${local.other.name}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Algo salió mal");
      }
    });
  }

  return (
    <li className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3.5 shadow-[var(--shadow-xs)]">
      <Link href={`/app/perfil/${local.other.username}`} className="flex min-w-0 flex-1 items-center gap-3">
        <FriendAvatar name={local.other.name} image={local.other.image} className="size-10 shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-foreground">{local.other.name}</p>
          <p className="mt-0.5 text-[13px] font-medium text-muted-foreground">
            {local.status === "pending"
              ? local.isCreator
                ? "Esperando que acepte"
                : "Te invitó a una racha"
              : `${local.currentStreak} ${local.currentStreak === 1 ? "día" : "días"} · mejor ${local.longestStreak}`}
          </p>
        </div>
      </Link>

      {local.status === "pending" && !local.isCreator ? (
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" disabled={pending} onClick={() => respond(true)}>
            <Check className="size-4" />
          </Button>
          <Button size="sm" variant="outline" disabled={pending} onClick={() => respond(false)}>
            <X className="size-4" />
          </Button>
        </div>
      ) : local.status === "pending" ? (
        <span className="shrink-0 text-[12px] font-semibold text-subtle-foreground">
          {local.pendingExpiresAt ? `Vence ${relativeFromNow(local.pendingExpiresAt)}` : null}
        </span>
      ) : (
        <Button
          size="sm"
          variant="outline"
          disabled={pending || !local.canRemindToday}
          onClick={remind}
        >
          <Bell className="size-4" />
        </Button>
      )}
    </li>
  );
}
