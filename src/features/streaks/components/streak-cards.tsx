"use client";

import * as React from "react";
import { Bell, Check, Flame, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FriendAvatar } from "@/features/friends/components/friend-avatar";
import { PersonIdentity } from "@/features/friends/components/person-identity";
import {
  acceptFriendStreak,
  declineFriendStreak,
  markStreakReminderRead,
  sendFriendStreakReminder,
} from "@/features/streaks/actions";
import type { FriendStreakCard, StreakReminderCard } from "@/features/streaks/queries";
import { relativeFromNow } from "@/lib/relative-time";
import { pluralize } from "@/lib/utils";

/** Primero lo que pide respuesta, luego las activas, al final lo enviado. */
function sortOrder(s: FriendStreakCard): number {
  if (s.status === "pending" && !s.isCreator) return 0;
  if (s.status === "active") return 1;
  return 2;
}

export function StreakCards({
  streaks,
  reminders,
}: {
  streaks: FriendStreakCard[];
  reminders: StreakReminderCard[];
}) {
  const unreadReminders = reminders.filter((r) => !r.readAt);
  const ordered = React.useMemo(
    () =>
      [...streaks].sort(
        (a, b) => sortOrder(a) - sortOrder(b) || b.currentStreak - a.currentStreak,
      ),
    [streaks],
  );

  return (
    <div className="space-y-6">
      {unreadReminders.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {unreadReminders.map((r) => (
            <ReminderBanner key={r.id} reminder={r} />
          ))}
        </ul>
      ) : null}

      {ordered.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-card px-5 py-7 text-center">
          <Flame className="mx-auto size-6 text-subtle-foreground" aria-hidden />
          <p className="mt-2 text-[15px] font-bold">Sin rachas con amigos todavía</p>
          <p className="mx-auto mt-1.5 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
            Entra al perfil de un amigo y proponle una racha: cuenta sólo si
            los dos estudian el mismo día.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {ordered.map((s) => (
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
        <span className="text-muted-foreground">
          te recordó que hoy les falta estudiar para mantener su racha.
        </span>
      </p>
      <button
        type="button"
        aria-label={`Descartar el recordatorio de ${reminder.sender.name}`}
        className="-m-1 grid size-11 shrink-0 place-items-center rounded-full text-subtle-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
  const [gone, setGone] = React.useState(false);

  if (gone) return null;

  function respond(accept: boolean) {
    startTransition(async () => {
      try {
        if (accept) {
          await acceptFriendStreak({ streakId: local.id });
          setLocal((s) => ({ ...s, status: "active" }));
          toast.success(`Racha activa con ${local.other.name}`);
        } else {
          await declineFriendStreak({ streakId: local.id });
          setGone(true);
          toast.success(
            local.isCreator ? "Cancelaste la propuesta" : "Propuesta rechazada",
          );
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

  const meta =
    local.status === "pending" ? (
      local.isCreator ? (
        <>
          Esperando a que acepte
          {local.pendingExpiresAt ? ` · vence ${relativeFromNow(local.pendingExpiresAt)}` : null}
        </>
      ) : (
        "Te propuso una racha"
      )
    ) : (
      <>
        {local.qualifiedToday ? (
          <span className="font-bold text-success">Hoy ya cuenta</span>
        ) : (
          <span className="font-bold text-warning">Hoy les falta</span>
        )}
        {" · "}
        {local.currentStreak} {pluralize(local.currentStreak, "día", "días")} · mejor{" "}
        {local.longestStreak}
      </>
    );

  return (
    <li className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-3.5 shadow-[var(--shadow-xs)]">
      <PersonIdentity
        name={local.other.name}
        username={local.other.username}
        image={local.other.image}
        href={`/app/perfil/${local.other.username}`}
        meta={meta}
      />

      {local.status === "pending" && !local.isCreator ? (
        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            disabled={pending}
            onClick={() => respond(false)}
            aria-label={`Rechazar la racha con ${local.other.name}`}
          >
            <X />
          </Button>
          <Button size="default" loading={pending} onClick={() => respond(true)}>
            <Check />
            Aceptar
          </Button>
        </div>
      ) : local.status === "pending" ? (
        <Button
          size="default"
          variant="ghost"
          loading={pending}
          onClick={() => respond(false)}
          className="shrink-0"
        >
          <X />
          Cancelar
        </Button>
      ) : local.qualifiedToday ? null : (
        <Button
          size="default"
          variant="outline"
          disabled={pending || !local.canRemindToday}
          onClick={remind}
          className="shrink-0"
        >
          <Bell />
          {local.canRemindToday ? "Recordar" : "Recordado"}
        </Button>
      )}
    </li>
  );
}
